import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import admin from 'firebase-admin';

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { itemId } = req.body;

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    if (!itemId) {
      res.status(400).send('Missing itemId');
      return;
    }

    const userRef = db.collection('Users').doc(userId);
    const itemRef = db.collection('Items').doc(itemId);

    await db.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      const itemDoc = await t.get(itemRef);

      if (!userDoc.exists || !itemDoc.exists) {
        throw new Error('User or Item not found');
      }

      const userData = userDoc.data();
      const favorites = userData?.Favorites || [];
      const itemData = itemDoc.data();
      
      // Check if already liked (assuming Favorites is array of references or objects with id)
      // Favorites stored as references in previous code, let's checking logic.
      // Based on previous code: Favorites: arrayUnion(itemRef) -> It stores references.
      
      const isLiked = favorites.some((fav: any) => fav.id === itemRef.id);

      if (isLiked) {
        // Unlike
        t.update(userRef, {
            Favorites: admin.firestore.FieldValue.arrayRemove(itemRef)
        });
        t.update(itemRef, {
            Likes: admin.firestore.FieldValue.increment(-1)
        });
      } else {
        // Like
        t.update(userRef, {
            Favorites: admin.firestore.FieldValue.arrayUnion(itemRef)
        });
        t.update(itemRef, {
            Likes: admin.firestore.FieldValue.increment(1)
        });
      }
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).send('Internal Server Error');
  }
};
