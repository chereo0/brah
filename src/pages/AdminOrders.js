import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosWithRefresh';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';

const statusColors = {
  pending: 'warning',
  accepted: 'info',
  rejected: 'error',
  delivered: 'success',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setActionLoading(orderId + status);
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Orders</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.name || 'N/A'}<br />{order.user?.email}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={order.status} color={statusColors[order.status]} />
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="info"
                      disabled={order.status !== 'pending' || actionLoading}
                      onClick={() => handleStatusChange(order._id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      disabled={order.status !== 'pending' || actionLoading}
                      onClick={() => handleStatusChange(order._id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      disabled={order.status !== 'accepted' || order.status === 'delivered' || actionLoading}
                      onClick={() => handleStatusChange(order._id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminOrders; 