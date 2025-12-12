import { Router } from 'express';
import { toggleLike } from '../controllers/likes';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/toggle', verifyToken, toggleLike);

export default router;
