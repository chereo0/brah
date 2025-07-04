import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';

const initialState = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSuccess(true);
      setForm(initialState);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ede7fa] py-8 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Illustration */}
        <div className="md:w-1/2 flex items-center justify-center bg-[#ede7fa] p-6">
          {/* Placeholder SVG illustration (replace with your own if desired) */}
          <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="130" cy="200" rx="110" ry="18" fill="#e0d7f7" />
            <rect x="60" y="60" width="140" height="90" rx="12" fill="#fff" stroke="#b39ddb" strokeWidth="2" />
            <rect x="80" y="80" width="40" height="40" rx="8" fill="#ffe0f0" />
            <rect x="140" y="80" width="40" height="40" rx="8" fill="#e1f5fe" />
            <rect x="110" y="100" width="40" height="30" rx="8" fill="#f3e5f5" />
            <rect x="120" y="70" width="20" height="10" rx="3" fill="#b39ddb" />
            <rect x="70" y="150" width="30" height="18" rx="6" fill="#ffd54f" />
            <rect x="160" y="150" width="30" height="18" rx="6" fill="#ff8a65" />
            <rect x="115" y="160" width="30" height="12" rx="6" fill="#aed581" />
            <circle cx="90" cy="70" r="8" fill="#aed581" />
            <circle cx="170" cy="70" r="8" fill="#ffd54f" />
            <rect x="200" y="120" width="18" height="18" rx="5" fill="#b39ddb" />
            <rect x="42" y="120" width="18" height="18" rx="5" fill="#b39ddb" />
            <rect x="30" y="180" width="30" height="8" rx="4" fill="#b2dfdb" />
            <rect x="200" y="180" width="30" height="8" rx="4" fill="#b2dfdb" />
          </svg>
        </div>
        {/* Contact Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-8">
          <h2 className="text-2xl font-bold text-[#3d246c] mb-6 tracking-wide">CONTACT US</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: '#f3f0fa', borderRadius: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: '#f3f0fa', borderRadius: 2 }}
            />
            <TextField
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              multiline
              minRows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: '#f3f0fa', borderRadius: 2 }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 tracking-wide relative overflow-hidden group"
              disabled={loading}
              style={{ outline: 'none', border: 'none' }}
            >
              <span className="relative z-10">
                {loading ? 'Sending...' : 'SUBMIT'}
              </span>
              {/* Shine effect */}
              <span className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="block w-1/3 h-full bg-white/30 blur-lg animate-shine" style={{ animation: 'shine 1s linear infinite' }}></span>
              </span>
            </motion.button>
            {error && <div className="mt-2 text-center text-red-500">{error}</div>}
            {success && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center text-green-600 font-semibold">Thank you! Your message has been sent.</motion.div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 