import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const MyOrders = () => {
  const [hiddenStatuses, setHiddenStatuses] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleOrderStatus = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box>
      {loading ? (
        <Typography>Loading orders...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Box key={order._id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6">Order #{order._id}</Typography>
            <Typography variant="body2" color="text.secondary">Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
            {order.status === 'delivered' ? (
              <Box onClick={() => toggleOrderStatus(order._id)} sx={{ cursor: 'pointer' }}>
                <CheckCircleIcon color="success" />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">{order.status}</Typography>
            )}
            {/* ... other order details ... */}
          </Box>
        ))
      )}
    </Box>
  );
};

export default MyOrders; 