import express from 'express';
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(fetchProducts)
  .post(protect, admin, upload.single('image'), addProduct);

router.route('/:id')
  .get(fetchProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router; 