import express from 'express';
import { loginUser, registerUser, deleteUser, getUser, updateUser, refreshTokenHandler } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshTokenHandler);

// Protected routes
router.get('/:id', protect, getUser);
router.patch('/:id', protect, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;