import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Footer from './components/Footer';
import AdminOrders from './pages/AdminOrders';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserOrders from './pages/UserOrders';
import Dashboard from './pages/Dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import Contact from './pages/Contact';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e88cae', // Soft pink
    },
    secondary: {
      main: '#f8c6d8', // Lighter pink
    },
    background: {
      default: '#f7faff',
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#888',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700 },
    h2: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700 },
    h3: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700 },
    h4: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700 },
    h5: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700 },
    h6: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700 },
    body1: { fontFamily: 'Roboto, sans-serif' },
    body2: { fontFamily: 'Roboto, sans-serif' },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  return user ? children : null;
};

// Public Route component (for login/register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  return !user ? children : null;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
