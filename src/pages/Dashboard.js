import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Container, Grid, Paper } from '@mui/material';
import axiosWithRefresh from '../utils/axiosWithRefresh';

const drawerWidth = 220;

const initialProducts = [
  { id: 1, name: 'Lipstick', category: 'Makeup', price: 20, stock: 100 },
  { id: 2, name: 'Face Cream', category: 'Skincare', price: 35, stock: 50 },
];
const initialCategories = ['Makeup', 'Skincare'];
const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@email.com', orders: 3 },
  { id: 2, name: 'Bob', email: 'bob@email.com', orders: 1 },
];
const initialDeliveries = [
  { id: 1, order: 'Order #1', status: 'Pending' },
  { id: 2, order: 'Order #2', status: 'Delivered' },
];

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
  { label: 'Products', icon: <Inventory2Icon />, section: 'products' },
  { label: 'Create Product', icon: <AddBoxIcon />, section: 'createProduct' },
  { label: 'Categories', icon: <CategoryIcon />, section: 'categories' },
  { label: 'Create Category', icon: <AddBoxIcon />, section: 'createCategory' },
  { label: 'Users', icon: <GroupIcon />, section: 'users' },
  { label: 'Delivery', icon: <LocalShippingIcon />, section: 'delivery' },
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    description: '',
    image: null
  });
  const [editId, setEditId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
        setError('');
      } catch (error) {
        setError('Failed to fetch categories. Please try again.');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (section === 'categories' || section === 'createCategory') {
      fetchCategories();
    }
  }, [section]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (section === 'products' || section === 'createProduct') {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/api/products');
          // Ensure products is always an array
          const productsData = Array.isArray(response.data)
            ? response.data
            : (response.data && Array.isArray(response.data.products) ? response.data.products : []);
          setProducts(productsData);
          setError('');
        } catch (error) {
          setError('Failed to fetch products. Please try again.');
          console.error('Error fetching products:', error);
          setProducts([]); // fallback to empty array
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [section]);

  useEffect(() => {
    if (section === 'users') {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const res = await axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setUsers(res.data || []);
          setError('');
        } catch (error) {
          setError('Failed to fetch users. Please try again.');
          setUsers([]);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [section, user]);

  useEffect(() => {
    if (section === 'delivery' || section === 'dashboard') {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const res = await axiosWithRefresh.get('/api/orders');
          setOrders(res.data || []);
          setError('');
        } catch (error) {
          setError('Failed to fetch orders. Please try again.');
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [section]);

  if (!user || !user.isAdmin) return null;

  // Product handlers
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // Validate required fields
    if (!productForm.name || !productForm.brand || !productForm.description || !productForm.category || !productForm.price || !productForm.stock) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (!productForm.image && !editId) {
      setError('Please upload an image for the product.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      Object.keys(productForm).forEach(key => {
        // Ensure category is sent as a string
        if (key === 'category') {
          formData.append('category', String(productForm[key]));
        } else if (key === 'image' && !productForm[key]) {
          // Skip appending image if not present (for edit)
        } else {
          formData.append(key, productForm[key]);
        }
      });

      if (editId) {
        const response = await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (response.data) {
          setProducts((products || []).map(p => p._id === editId ? response.data : p));
          setSuccess('Product updated successfully!');
        }
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/products',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user.token}`
            },
          }
        );
        if (response.data) {
          setProducts([...(products || []), response.data]);
          setSuccess('Product created successfully!');
          navigate('/shop'); // Redirect to Shop page after creation
        }
      }
      setProductForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        brand: '',
        description: '',
        image: null
      });
      setImagePreview(null);
      setEditId(null);
      if (!editId) setSection('products');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save product. Please try again.');
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductEdit = (product) => {
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      brand: product.brand || '',
      description: product.description || '',
      image: null
    });
    setImagePreview(product.image);
    setEditId(product._id);
    setSection('createProduct');
  };

  const handleProductDelete = async (productId) => {
    if (!productId) {
      setError('Invalid product ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        if (response.data) {
          setProducts(products.filter(p => p._id !== productId));
          setSuccess('Product deleted successfully!');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete product. Please try again.');
        console.error('Error deleting product:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Category handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        // Update existing category
        const response = await axios.patch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
          name: categoryName,
        });
        if (response.data) {
          setCategories(categories.map(cat => 
            cat._id === editingCategory._id ? response.data : cat
          ));
          setSuccess('Category updated successfully!');
        }
      } else {
        // Create new category
        const response = await axios.post('http://localhost:5000/api/categories', {
          name: categoryName,
        });
        if (response.data) {
          setCategories([...categories, response.data]);
          setSuccess('Category created successfully!');
        }
      }
      setCategoryName('');
      setEditingCategory(null);
      setSection('categories'); // Navigate back to categories list after successful operation
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save category. Please try again.');
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSection('createCategory');
  };

  const handleCategoryDelete = async (categoryId) => {
    if (!categoryId) {
      setError('Invalid category ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
        if (response.data) {
          setCategories(categories.filter(cat => cat._id !== categoryId));
          setSuccess('Category deleted successfully!');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete category. Please try again.');
        console.error('Error deleting category:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Revenue calculation
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalPrice, 0);

  // Delivery status update
  const handleOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      await axiosWithRefresh.patch(`/api/orders/${orderId}/status`, { status });
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (error) {
      setError('Failed to update order status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f7faff' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, background: '#fff', color: '#e88cae', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2 }}>
            🌸 Comet Admin
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => { logout(); navigate('/'); }}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#fff', borderRight: '1px solid #f8c6d8' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map(item => (
              <ListItem key={item.section} disablePadding>
                <ListItemButton selected={section === item.section} onClick={() => setSection(item.section)}>
                  <ListItemIcon sx={{ color: '#e88cae' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        {section === 'dashboard' && <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total Products
                </Typography>
                <Typography component="p" variant="h4">
                  {products.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography component="p" variant="h4">
                  {orders.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total Users
                </Typography>
                <Typography component="p" variant="h4">
                  {users.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography component="p" variant="h4">
                  ${totalRevenue.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>}
        {section === 'products' && <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Product List</Typography>
          <TableContainer component={Card} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image && (
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleProductEdit(product)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleProductDelete(product._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>}
        {section === 'createProduct' && <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>{editId ? 'Update' : 'Create'} Product</Typography>
          <Box component="form" onSubmit={handleProductSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Name"
                value={productForm.name}
                onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Brand"
                value={productForm.brand}
                onChange={e => setProductForm(f => ({ ...f, brand: e.target.value }))}
                required
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Category"
                value={productForm.category}
                onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                required
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </TextField>
              <TextField
                type="number"
                label="Price"
                value={productForm.price}
                onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                required
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="Stock"
                value={productForm.stock}
                onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))}
                required
                fullWidth
              />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ minWidth: 200 }}
              >
                Upload Image
                <VisuallyHiddenInput type="file" onChange={handleImageChange} accept="image/*" />
              </Button>
            </Box>

            <TextField
              label="Description"
              value={productForm.description}
              onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
              multiline
              rows={4}
              required
              fullWidth
            />

            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Image Preview:</Typography>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{ maxWidth: 200, maxHeight: 200, objectFit: 'contain' }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{ background: '#e88cae', mt: 1 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                {success}
              </Typography>
            )}
          </Box>
        </Box>}
        {section === 'categories' && <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Categories</Typography>
          <TableContainer component={Card} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id || category.id || category.name}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        onClick={() => handleCategoryEdit(category)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleCategoryDelete(category._id || category.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>}
        {section === 'createCategory' && <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleCategorySubmit} 
            sx={{ display: 'flex', gap: 2, maxWidth: 400 }}
          >
            <TextField 
              label="Category Name" 
              value={categoryName} 
              onChange={e => setCategoryName(e.target.value)} 
              required 
              disabled={loading}
              fullWidth
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ background: '#e88cae' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}
        </Box>}
        {section === 'users' && <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>User Tracking</Typography>
          <TableContainer component={Card} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Admin</TableCell><TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u._id || u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.isAdmin ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>}
        {section === 'delivery' && <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Delivery Management</Typography>
          <TableContainer component={Card} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.user?.name || 'N/A'}<br />{order.user?.email}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{order.status}</TableCell>
                   
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{order.shippingAddress?.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleOrderStatus(order._id, 'accepted')} disabled={order.status !== 'pending'}>Accept</Button>
                      <Button size="small" color="error" onClick={() => handleOrderStatus(order._id, 'rejected')} disabled={order.status !== 'pending'}>Reject</Button>
                      <Button size="small" color="success" onClick={() => handleOrderStatus(order._id, 'delivered')} disabled={order.status !== 'accepted'}>Mark Delivered</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>}
      </Box>
    </Box>
  );
}

export default Dashboard; 