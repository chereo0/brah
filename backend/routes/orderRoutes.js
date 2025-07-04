import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new order
router.post('/', protect, createOrder);

// Get logged in user's orders
router.get('/myorders', protect, getUserOrders);

// Get order by ID
router.get('/:id', protect, getOrderById);

// Get all orders (admin)
router.get('/', protect, admin, getAllOrders);

// Update order status (admin)
router.patch('/:id/status', protect, admin, updateOrderStatus);

export default router; 