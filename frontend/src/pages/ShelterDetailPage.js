import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  People,
  Star,
  Business,
  Schedule,
  Security,
  Message,
  Directions,
  Share,
  Bookmark,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ShelterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  
  const [shelter, setShelter] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    fetchShelterDetails();
  }, [id]);

  const fetchShelterDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [shelterResponse, ratingsResponse] = await Promise.all([
        axios.get(`/api/shelters/${id}`),
        axios.get(`/api/ratings/shelter/${id}`),
      ]);

      setShelter(shelterResponse.data);
      setRatings(ratingsResponse.data.ratings);
    } catch (error) {
      console.error('Error fetching shelter details:', error);
      setError('Failed to load shelter details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setContactDialogOpen(true);
  };

  const handleSendMessage = async (messageData) => {
    try {
      // Create conversation and send message
      await axios.post('/api/messages/conversations', {
        participants: [{ user: user._id, role: user.userType }],
        subject: `Inquiry about ${shelter.name}`,
        context: { shelter: shelter._id, category: 'housing-inquiry' },
      });
      
      setContactDialogOpen(false);
      navigate('/messages');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 25) return 'warning';
    return 'error';
  };

  const formatOperatingHours = (hours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      const dayHours = hours[day];
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      if (dayHours.closed) {
        return `${dayName}: Closed`;
      }
      return `${dayName}: ${dayHours.open} - ${dayHours.close}`;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!shelter) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Shelter not found
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
            src={shelter.images?.[0]?.url}
          >
            <Business />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {shelter.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Rating
                value={shelter.rating?.average || 0}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({shelter.rating?.count || 0} reviews)
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Share />}>
              Share
            </Button>
            <Button variant="outlined" startIcon={<Bookmark />}>
              Save
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          {shelter.description}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Contact Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
                    <Box>
                      <Typography variant="body2">
                        {shelter.address.street}
                      </Typography>
                      <Typography variant="body2">
                        {shelter.address.city}, {shelter.address.state} {shelter.address.zipCode}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2">
                      {shelter.contact.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2">
                      {shelter.contact.email}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Services */}
          {shelter.services && shelter.services.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Services Provided
                </Typography>
                <Grid container spacing={1}>
                  {shelter.services.map((service, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={service.name}
                        color={service.available ? 'primary' : 'default'}
                        variant={service.available ? 'filled' : 'outlined'}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Operating Hours */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Operating Hours
              </Typography>
              <List dense>
                {formatOperatingHours(shelter.operatingHours).map((hours, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Schedule sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText primary={hours} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Reviews */}
          {ratings.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Reviews
                </Typography>
                {ratings.map((rating, index) => (
                  <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < ratings.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {rating.individual?.personalInfo?.firstName} {rating.individual?.personalInfo?.lastName}
                      </Typography>
                      <Rating value={rating.overallRating} readOnly size="small" />
                    </Box>
                    {rating.review?.content && (
                      <Typography variant="body2" color="text.secondary">
                        {rating.review.content}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Availability */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Availability
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color={`${getAvailabilityColor(shelter.capacity.availableBeds, shelter.capacity.totalBeds)}.main`}>
                  {shelter.capacity.availableBeds}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of {shelter.capacity.totalBeds} beds available
                </Typography>
              </Box>
              <Chip
                label={shelter.capacity.availableBeds > 0 ? 'Accepting new residents' : 'At capacity'}
                color={shelter.capacity.availableBeds > 0 ? 'success' : 'error'}
                fullWidth
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Get Help
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Message />}
                  onClick={handleContact}
                >
                  Contact Shelter
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Directions />}
                  onClick={() => window.open(`https://maps.google.com/?q=${shelter.address.street}, ${shelter.address.city}, ${shelter.address.state}`)}
                >
                  Get Directions
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Phone />}
                  onClick={() => window.open(`tel:${shelter.contact.phone}`)}
                >
                  Call Now
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Requirements */}
          {shelter.requirements && shelter.requirements.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Requirements
                </Typography>
                <List dense>
                  {shelter.requirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Security sx={{ fontSize: 20, color: 'text.secondary' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={requirement.type}
                        secondary={requirement.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact {shelter.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Send a message to this shelter to inquire about availability or ask questions.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your message here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendMessage}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShelterDetailPage;
