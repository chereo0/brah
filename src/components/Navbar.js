import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import Badge from '@mui/material/Badge';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/shop' },
  { label: 'Contact', to: '/contact' },
  { label: 'My Orders', to: '/myorders', requireAuth: true },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { cartCount } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      component={motion.header}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      sx={{
        bgcolor: 'background.paper',
        color: 'primary.main',
        boxShadow: '0 2px 16px 0 rgba(232,140,174,0.08)',
        borderRadius: 0,
        borderBottom: '1px solid #f8c6d8',
        py: 0.5,
        zIndex: 1201,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 800,
              color: 'primary.main',
              textDecoration: 'none',
              fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
              letterSpacing: 1,
              fontSize: { xs: '1.2rem', md: '1.7rem' },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box component="span" sx={{ fontSize: 28, mr: 1 }}>🌸</Box> Comet
          </Typography>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {navLinks.map((link) => (
                (!link.requireAuth || user) && (
                  <Button
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      fontSize: 16,
                      borderRadius: 3,
                      px: 2.5,
                      py: 1,
                      mx: 0.5,
                      transition: 'all 0.18s',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        transform: 'scale(1.07)',
                        boxShadow: '0 2px 12px 0 rgba(232,140,174,0.10)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                )
              ))}
            </Box>
          )}

          {/* Cart Icon */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <motion.div whileHover={{ scale: 1.15, rotate: 8 }}>
              <IconButton
                component={RouterLink}
                to="/cart"
                sx={{ color: 'primary.main', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
              >
                <Badge badgeContent={cartCount} color="secondary" overlap="circular">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </motion.div>
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar alt={user.name} sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700 }}>
                      {user.name ? user.name[0].toUpperCase() : 'A'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  {user.isAdmin && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/dashboard'); }}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                sx={{ color: 'primary.main', fontWeight: 600, borderRadius: 3, px: 2, py: 1, ml: 1, bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Nav Menu */}
          {isMobile && (
            <Box sx={{ flexGrow: 0, ml: 1 }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ color: 'primary.main' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {navLinks.map((link) => (
                  (!link.requireAuth || user) && (
                    <MenuItem key={link.to} onClick={() => { handleCloseNavMenu(); navigate(link.to); }}>
                      <Typography textAlign="center">{link.label}</Typography>
                    </MenuItem>
                  )
                ))}
                <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/cart'); }}>
                  <Typography textAlign="center">Cart</Typography>
                </MenuItem>
                {user && (
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/profile'); }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                )}
                {user && user.isAdmin && (
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/dashboard'); }}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                )}
                {!user && (
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/login'); }}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 