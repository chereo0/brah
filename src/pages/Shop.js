import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  CardActions,
  Paper,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const productsData = Array.isArray(res.data)
          ? res.data
          : (res.data && Array.isArray(res.data.products) ? res.data.products : []);
        setProducts(productsData);
        // Extract unique brands
        const uniqueBrands = [...new Set(productsData.map(p => p.brand).filter(Boolean))];
        setBrands(uniqueBrands);
      } catch (err) {
        setError('Failed to fetch products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#f7faff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: '#e88cae', mb: 6, fontFamily: 'Montserrat' }}>
          Shop Our Collection
        </Typography>
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#e88cae', fontWeight: 700 }}>Search</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, bgcolor: '#f7faff', borderRadius: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#e88cae', fontWeight: 700 }}>Brands</Typography>
              <FormGroup>
                {brands.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        sx={{ color: '#e88cae', '&.Mui-checked': { color: '#e88cae' } }}
                      />
                    }
                    label={<Typography sx={{ color: '#888' }}>{brand}</Typography>}
                  />
                ))}
              </FormGroup>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#e88cae', fontWeight: 700 }}>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                sx={{ color: '#e88cae' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography sx={{ color: '#888' }}>${priceRange[0]}</Typography>
                <Typography sx={{ color: '#888' }}>${priceRange[1]}</Typography>
              </Box>
            </Paper>
          </Grid>
          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <Grid container spacing={4}>
                {filteredProducts.map((product) => (
                  <Grid item key={product._id || product.id} xs={12} sm={6} md={4}>
                    <Card
                      elevation={4}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        boxShadow: 3,
                        bgcolor: '#fff',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.03)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="220"
                        image={product.image && product.image.startsWith('/uploads/') ? `http://localhost:5000${product.image}` : product.image}
                        alt={product.name}
                        sx={{
                          objectFit: 'contain',
                          bgcolor: '#f7faff',
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                          p: 2,
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, color: '#e88cae' }}>
                          {product.name}
                        </Typography>
                        <Typography color="text.secondary" paragraph sx={{ color: '#888', minHeight: 48 }}>
                          {product.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                          {product.brand} &bull; ${product.price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" variant="contained" fullWidth sx={{ bgcolor: '#e88cae', color: '#fff', borderRadius: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#d16a9e' } }}
                          onClick={() => addToCart(product)}>
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Shop; 