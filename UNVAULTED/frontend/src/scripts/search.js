import { auth } from '../firebase/firebase-client';

export async function search(query, filters) {
    const url = new URL('http://localhost:3000/api/search');
    url.searchParams.set('q', query);
    
    if (filters.page) url.searchParams.set('page', filters.page);
    if (filters.limit) url.searchParams.set('limit', filters.limit);
    
    addFilters(url, filters);
    
    const headers = {};
    if (auth.currentUser) {
        try {
            const token = await auth.currentUser.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
        } catch (e) {
            console.error("Error getting auth token:", e);
        }
    }

    const response = await fetch(url, { headers });
    const data = await response.json();
    return data;
}

function addFilters(url, filters) {
    for (const key in filters) {
        const value = filters[key];
        
        if (value === null || value === undefined || value === '') continue;

        switch (key) {
            case 'categories':
                if (Array.isArray(value) && value.length > 0) {
                    url.searchParams.set('categories', value.join(','));
                }
                break;
            case 'sortBy':
                url.searchParams.set('sortBy', value);
                break;
            case 'priceMin':
            case 'priceMax':
            case 'viewsMin':
            case 'viewsMax':
            case 'minRating':
            case 'maxSellerDistance':
                if (value !== 'null') {
                    url.searchParams.set(key, value);
                }
                break;
            default:
               break;
        }
    }
}