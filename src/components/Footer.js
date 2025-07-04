import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { motion } from 'framer-motion';

const iconVariants = {
  initial: { scale: 1, rotate: 0, boxShadow: '0px 2px 8px 0px rgba(232,140,174,0.08)' },
  hover: {
    scale: 1.18,
    rotate: 8,
    boxShadow: '0px 8px 24px 0px rgba(232,140,174,0.18)',
    transition: { type: 'spring', stiffness: 300 }
  }
};

const Footer = () => (
  <Box
    component={motion.footer}
    initial={{ opacity: 0, y: 60, scale: 0.98, rotateX: 10 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
    transition={{ duration: 1, type: 'spring', stiffness: 80 }}
    sx={{
      bgcolor: 'background.paper',
      borderTop: '1px solid #f8c6d8',
      py: 6,
      mt: 8,
      boxShadow: '0 8px 32px 0 rgba(232,140,174,0.08)',
      perspective: 800,
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
            Comet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            &copy; {new Date().getFullYear()} Comet, Inc. All rights reserved.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
            Explore
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link href="/about" color="text.secondary" underline="hover">About</Link>
            <Link href="/shop" color="text.secondary" underline="hover">Products</Link>
            <Link href="/contact" color="text.secondary" underline="hover">Contact</Link>
            <Link href="/faqs" color="text.secondary" underline="hover">FAQs</Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
            Connect
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[InstagramIcon, FacebookIcon, TwitterIcon, YouTubeIcon].map((Icon, idx) => (
              <motion.div
                key={idx}
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                style={{ display: 'inline-block' }}
              >
                <IconButton href="#" sx={{ color: 'primary.main', fontSize: 28 }}>
                  <Icon fontSize="inherit" />
                </IconButton>
              </motion.div>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Footer; 