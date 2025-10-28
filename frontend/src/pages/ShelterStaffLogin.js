import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
  Stack,
  Divider,
} from '@mui/material';
import {
  Business,
  Lock,
  Email,
  Person,
  Security,
  Home,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const ShelterStaffLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shelterId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - in real app, this would be API call
      if (formData.email === 'staff@urm.org' && formData.password === 'staff123' && formData.shelterId === '1') {
        // Store staff session
        localStorage.setItem('shelter-staff-session', JSON.stringify({
          shelterId: formData.shelterId,
          email: formData.email,
          role: 'staff',
          shelterName: 'Union Rescue Mission'
        }));
        
        navigate('/shelter-staff-dashboard');
      } else if (formData.email === 'staff@lamission.org' && formData.password === 'staff123' && formData.shelterId === '2') {
        localStorage.setItem('shelter-staff-session', JSON.stringify({
          shelterId: formData.shelterId,
          email: formData.email,
          role: 'staff',
          shelterName: 'Los Angeles Mission'
        }));
        
        navigate('/shelter-staff-dashboard');
      } else {
        setError('Invalid credentials. Please check your email, password, and shelter ID.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4,
    }}>
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Zoom in timeout={1200}>
                <Box sx={{ mb: 3 }}>
                  <Business sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}>
                    Shelter Staff Portal
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Manage your shelter's information and availability
                  </Typography>
                </Box>
              </Zoom>
            </Box>

            {/* Demo Credentials */}
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Demo Credentials:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                <strong>Union Rescue Mission:</strong><br />
                Email: staff@urm.org<br />
                Password: staff123<br />
                Shelter ID: 1
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                <strong>Los Angeles Mission:</strong><br />
                Email: staff@lamission.org<br />
                Password: staff123<br />
                Shelter ID: 2
              </Typography>
            </Alert>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="email"
                  label="Staff Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <Email sx={{ color: '#667eea', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />

                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <Lock sx={{ color: '#667eea', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />

                <TextField
                  name="shelterId"
                  label="Shelter ID"
                  value={formData.shelterId}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <Home sx={{ color: '#667eea', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    '&:disabled': {
                      background: 'rgba(102, 126, 234, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <Security sx={{ mr: 1 }} />
                      Access Staff Portal
                    </>
                  )}
                </Button>
              </Stack>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                onClick={() => navigate('/')}
                sx={{
                  color: '#667eea',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                ← Back to Main Site
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ShelterStaffLogin;
