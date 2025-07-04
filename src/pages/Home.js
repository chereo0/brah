import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  position: 'relative',
}));

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  // Scroll animation trigger
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);
        
        if (isVisible) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Discover Your Beauty
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              <TypeAnimation
                sequence={[
                  'Premium Cosmetics',
                  1000,
                  'Skincare Products',
                  1000,
                  'Beauty Essentials',
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Shop Now
            </Button>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Featured Categories Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{ mb: 6 }}
            >
              Featured Categories
            </Typography>
            <Grid container spacing={4}>
              {['Skincare', 'Makeup', 'Fragrance'].map((category, index) => (
                <Grid item xs={12} md={4} key={category}>
                  <AnimatedCard
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <StyledCard>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`https://source.unsplash.com/random/800x600?${category.toLowerCase()}`}
                        alt={category}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h3">
                          {category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Discover our premium {category.toLowerCase()} collection
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{ mb: 6 }}
            >
              Why Choose Us
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  title: 'Premium Quality',
                  description: 'All our products are made with the finest ingredients',
                },
                {
                  title: 'Fast Delivery',
                  description: 'Quick and reliable shipping to your doorstep',
                },
                {
                  title: 'Expert Support',
                  description: '24/7 customer service to assist you',
                },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <AnimatedCard
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: '100%',
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography variant="h5" component="h3" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 