import { Request, Response } from 'express';
import Fuse from "fuse.js";
import { db, admin } from '../config/firebase';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1); 
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

let searchCache: Fuse<any> | null = null;
let itemsCache: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; 
let sellersCache: Map<string, any> = new Map();

async function getSearchIndex() {
  const now = Date.now();
  
  if (!searchCache || (now - lastFetchTime > CACHE_DURATION)) {
    console.log("Fetching fresh data from Firestore...");
    
    const snapshot = await db.collection('Items').where('available', '==', true).get();
    
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    itemsCache = documents;

    const usersSnapshot = await db.collection('Users').get();
    sellersCache.clear();
    usersSnapshot.forEach(doc => {
        sellersCache.set(doc.id, doc.data());
    });

    searchCache = new Fuse(documents, {
      keys: ['Title', 'Description'],
      threshold: 0.3,
      includeScore: true
    });
    
    lastFetchTime = now;
  }
  return { fuse: searchCache, allItems: itemsCache };
}

export const search = async (req: Request, res: Response) => {
  const { 
    q, 
    categories, 
    sortBy, 
    priceMin, 
    priceMax, 
    viewsMin, 
    viewsMax, 
    minRating,
    maxSellerDistance
  } = req.query;
  
  try {
    const { fuse, allItems } = await getSearchIndex();
    
    let results = (q && typeof q === 'string' && q.trim().length > 0) 
      ? fuse!.search(q).map(r => r.item) 
      : [...allItems];

    if (categories && typeof categories === 'string') {
        const catList = categories.split(',').map(c => c.trim().toLowerCase());
        results = results.filter(item => {
            if (!item.category) return false;
            return catList.includes(item.category.toLowerCase());
        });
    }
    if (priceMin) {
        results = results.filter(item => (item.Price || 0) >= Number(priceMin));
    }
    if (priceMax) {
        results = results.filter(item => (item.Price || 0) <= Number(priceMax));
    }

    if (viewsMin) {
        results = results.filter(item => (item.Likes || 0) >= Number(viewsMin));
    }
    if (viewsMax) {
        results = results.filter(item => (item.Likes || 0) <= Number(viewsMax));
    }

    if (minRating) {
        const minR = Number(minRating);
        results = results.filter(item => {
            if (!item.Seller) return false;
            const sellerId = item.Seller.id; 
            const sellerData = sellersCache.get(sellerId);
            
            if (!sellerData || !sellerData.Reviews || sellerData.Reviews.length === 0) return false;

            const total = sellerData.Reviews.reduce((sum: number, r: any) => sum + (r.Rating || 0), 0);
            const avg = total / sellerData.Reviews.length;
            return avg >= minR;
        });
    }
    if (maxSellerDistance) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
             const token = authHeader.split(' ')[1];
             try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                const userDoc = await db.collection('Users').doc(decodedToken.uid).get();
                const userData = userDoc.data();

                if (userData && userData.Location) {
                    const userLat = userData.Location._latitude || userData.Location.latitude;
                    const userLng = userData.Location._longitude || userData.Location.longitude;
                    const maxDist = Number(maxSellerDistance);
                    results = results.filter(item => {
                        if (!item.Seller) return false;
                        const sellerData = sellersCache.get(item.Seller.id);
                        if (!sellerData || !sellerData.Location) return false;

                        const sellerLat = sellerData.Location._latitude || sellerData.Location.latitude;
                        const sellerLng = sellerData.Location._longitude || sellerData.Location.longitude;

                        const dist = getDistanceFromLatLonInKm(userLat, userLng, sellerLat, sellerLng);
                        return dist <= maxDist;
                    });
                }
             } catch (e) {
                 console.error("Auth failed for distance filter, ignoring filter:", e);
             }
        }
    }

    if (sortBy && typeof sortBy === 'string') {
        results.sort((a, b) => {
            switch(sortBy) {
                case 'popular':
                    return (b.Likes || 0) - (a.Likes || 0);
                case 'new':
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                    return dateB.getTime() - dateA.getTime();
                case 'price_asc':
                case 'asc':
                    return (a.Price || 0) - (b.Price || 0);
                case 'price_desc':
                case 'desc':
                    return (b.Price || 0) - (a.Price || 0);
                default:
                    return 0;
            }
        });
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResults = results.slice(startIndex, endIndex).map(item => {
        let sellerData = null;
        if (item.Seller) {
            // item.Seller is a DocumentReference in the raw data, so it has .id
            const sid = item.Seller.id;
            const sData = sellersCache.get(sid);
            if (sData) {
                sellerData = { 
                    id: sid, 
                    FirstName: sData.FirstName, 
                    LastName: sData.LastName, 
                    Image: sData.Image,
                    Location: sData.Location
                    // Add other needed fields if necessary
                };
            }
        }
        return {
            ...item,
            Seller: sellerData
        };
    });

    res.json(paginatedResults);
    
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
};

export function updateLikeCountInCache(itemId: string, delta: number) {
    if (itemsCache) {
        const item = itemsCache.find(i => i.id === itemId);
        if (item) {
            item.Likes = (item.Likes || 0) + delta;
        }
    }
}

