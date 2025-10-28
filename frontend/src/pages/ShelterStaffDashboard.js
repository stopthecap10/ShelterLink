import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
  Stack,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Business,
  Bed,
  People,
  Update,
  Save,
  Logout,
  Refresh,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Edit,
  Home,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useShelterData } from '../contexts/ShelterDataContext';
import LanguageToggle from '../components/LanguageToggle';

const ShelterStaffDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getShelterById, updateShelterCapacity } = useShelterData();
  
  const [staffSession, setStaffSession] = useState(null);
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    availableBeds: 0,
    totalBeds: 0,
    notes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if staff is logged in
    const session = localStorage.getItem('shelter-staff-session');
    if (!session) {
      navigate('/shelter-staff-login');
      return;
    }

    const parsedSession = JSON.parse(session);
    setStaffSession(parsedSession);
    fetchShelterData(parsedSession.shelterId);
  }, [navigate]);

  const fetchShelterData = async (shelterId) => {
    setLoading(true);
    try {
      // Get shelter data from shared context
      const shelterData = getShelterById(shelterId);
      if (shelterData) {
        setShelter(shelterData);
      } else {
        // Fallback to mock data if not found
        const mockShelters = {
          '1': {
            _id: '1',
            name: 'Union Rescue Mission',
            address: {
              street: '545 S San Pedro St',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90013'
            },
            capacity: {
              totalBeds: 200,
              availableBeds: 45,
              maxCapacity: 250
            },
            contact: {
              phone: '(213) 347-6300',
              email: 'info@urm.org',
              website: 'https://urm.org'
            },
            lastUpdated: new Date().toISOString(),
            status: 'operational'
          },
          '2': {
            _id: '2',
            name: 'Los Angeles Mission',
            address: {
              street: '303 E 5th St',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90013'
            },
            capacity: {
              totalBeds: 150,
              availableBeds: 28,
              maxCapacity: 180
            },
            contact: {
              phone: '(213) 629-1227',
              email: 'info@lamission.org',
              website: 'https://lamission.org'
            },
            lastUpdated: new Date().toISOString(),
            status: 'operational'
          }
        };
        setShelter(mockShelters[shelterId] || mockShelters['1']);
      }
    } catch (error) {
      console.error('Error fetching shelter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shelter-staff-session');
    navigate('/shelter-staff-login');
  };

  const handleUpdateClick = () => {
    setUpdateData({
      availableBeds: shelter.capacity.availableBeds,
      totalBeds: shelter.capacity.totalBeds,
      notes: '',
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async () => {
    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update shared context
      updateShelterCapacity(shelter._id, updateData.availableBeds, updateData.totalBeds);
      
      // Update local state
      setShelter(prev => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          availableBeds: updateData.availableBeds,
          totalBeds: updateData.totalBeds,
        },
        lastUpdated: new Date().toISOString(),
      }));

      setUpdateDialogOpen(false);
      setSuccessMessage(`Successfully updated bed availability! ${updateData.availableBeds} beds now available.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating shelter data:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getCapacityStatus = () => {
    const percentage = (shelter.capacity.availableBeds / shelter.capacity.totalBeds) * 100;
    if (percentage > 50) return { status: 'good', color: '#4CAF50', icon: <TrendingUp /> };
    if (percentage > 20) return { status: 'moderate', color: '#FF9800', icon: <Warning /> };
    return { status: 'low', color: '#F44336', icon: <TrendingDown /> };
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!shelter) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Shelter data not found. Please contact support.
        </Alert>
      </Box>
    );
  }

  const capacityStatus = getCapacityStatus();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={1000}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {shelter.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Staff Portal - {staffSession?.email}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LanguageToggle />
                <Button
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>

            {/* Success Message */}
            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                }}
                action={
                  <IconButton onClick={() => setSuccessMessage('')} size="small">
                    <CheckCircle />
                  </IconButton>
                }
              >
                {successMessage}
              </Alert>
            )}

            {/* Quick Stats */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Zoom in timeout={1200}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: 3,
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Bed sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                        {shelter.capacity.availableBeds}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available Beds
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              <Grid item xs={12} md={4}>
                <Zoom in timeout={1400}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: 3,
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <People sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {shelter.capacity.totalBeds}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Capacity
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              <Grid item xs={12} md={4}>
                <Zoom in timeout={1600}>
                  <Card sx={{ 
                    background: `linear-gradient(135deg, rgba(${capacityStatus.color === '#4CAF50' ? '76, 175, 80' : capacityStatus.color === '#FF9800' ? '255, 152, 0' : '244, 67, 54'}, 0.1) 0%, rgba(${capacityStatus.color === '#4CAF50' ? '76, 175, 80' : capacityStatus.color === '#FF9800' ? '255, 152, 0' : '244, 67, 54'}, 0.05) 100%)`,
                    border: `1px solid rgba(${capacityStatus.color === '#4CAF50' ? '76, 175, 80' : capacityStatus.color === '#FF9800' ? '255, 152, 0' : '244, 67, 54'}, 0.2)`,
                    borderRadius: 3,
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ color: capacityStatus.color, mb: 1 }}>
                        {capacityStatus.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: capacityStatus.color, textTransform: 'capitalize' }}>
                        {capacityStatus.status} Capacity
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((shelter.capacity.availableBeds / shelter.capacity.totalBeds) * 100)}% Available
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Update Section */}
        <Fade in timeout={1800}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Bed Availability Management
              </Typography>
              
              <Button
                onClick={handleUpdateClick}
                startIcon={<Update />}
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Update Availability
              </Button>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Last updated: {new Date(shelter.lastUpdated).toLocaleString()}
            </Typography>

            <Alert severity="info" sx={{ borderRadius: 3 }}>
              <Typography variant="body2">
                <strong>Real-time Updates:</strong> Changes you make here will be immediately reflected on the public shelter listing, 
                helping people in need find available beds faster.
              </Typography>
            </Alert>
          </Paper>
        </Fade>

        {/* Update Dialog */}
        <Dialog 
          open={updateDialogOpen} 
          onClose={() => setUpdateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white',
            fontWeight: 700,
          }}>
            Update Bed Availability
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                label="Available Beds"
                type="number"
                value={updateData.availableBeds}
                onChange={(e) => setUpdateData({...updateData, availableBeds: parseInt(e.target.value) || 0})}
                fullWidth
                inputProps={{ min: 0, max: shelter.capacity.totalBeds }}
                helperText={`Maximum: ${shelter.capacity.totalBeds} beds`}
              />
              
              <TextField
                label="Total Beds"
                type="number"
                value={updateData.totalBeds}
                onChange={(e) => setUpdateData({...updateData, totalBeds: parseInt(e.target.value) || 0})}
                fullWidth
                inputProps={{ min: updateData.availableBeds }}
                helperText="Total capacity of your shelter"
              />
              
              <TextField
                label="Notes (Optional)"
                multiline
                rows={3}
                value={updateData.notes}
                onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                fullWidth
                placeholder="Any additional information about current availability..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setUpdateDialogOpen(false)}
              sx={{ color: '#667eea' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              disabled={updating}
              variant="contained"
              startIcon={updating ? <CircularProgress size={20} /> : <Save />}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 700,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ShelterStaffDashboard;
