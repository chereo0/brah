import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosWithRefresh';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    address: '',
    city: '',
    phoneNumber: '',
    country: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderItems = cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id,
      }));
      const orderData = {
        orderItems,
        shippingAddress: {
          address: form.address,
          city: form.city,
          phoneNumber: form.phoneNumber,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };
      await axios.post('/api/orders', orderData);
      clearCart();
      navigate('/'); // Optionally, navigate to a success page
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6">Your cart is empty</Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Checkout</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Payment Method"
              name="paymentMethod"
              value={form.paymentMethod}
              select
              fullWidth
              required
              margin="normal"
              disabled
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
            </TextField>
            <Box sx={{ mt: 2 }}>
              <Typography>Order Total: <b>${total.toFixed(2)}</b></Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Checkout; 