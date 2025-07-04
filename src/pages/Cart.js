import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, loading } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6">Loading cart...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Your cart is empty</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Add some products to your cart to see them here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">Cart Items</Typography>
              </Grid>
              {cart.map(item => (
                <Grid item xs={12} key={item._id || item.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={item.image && item.image.startsWith('/uploads/') ? `http://localhost:5000${item.image}` : item.image}
                      alt={item.name}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, bgcolor: '#f7faff', boxShadow: 1 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Brand: {item.brand}</Typography>
                      <Typography variant="body2" color="text.secondary">Price: ${item.price}</Typography>
                      <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                    </Box>
                    <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" color="error" onClick={clearCart} sx={{ mt: 1 }}>
                  Clear Cart
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Order Summary</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Subtotal</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography align="right">${subtotal.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Shipping</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography align="right">${shipping.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" align="right">${total.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
              <Button
  variant="contained"
  color="primary"
  fullWidth
  onClick={() => navigate('/checkout')}
  disabled={cart.length === 0}
>
  Checkout
</Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Cart; 