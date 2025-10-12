import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  Person,
  Business,
  LocationOn,
  Phone,
  Email,
  Work,
  People,
  Edit,
  Save,
  Cancel,
  Add,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateProfile(data);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset(profile);
    setEditing(false);
    setError(null);
  };

  const renderShelterProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
              <IconButton onClick={() => setEditing(!editing)}>
                <Edit />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Shelter Name"
                margin="normal"
                {...register('name', { required: 'Shelter name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={!editing}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                margin="normal"
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={!editing}
              />

              <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                {...register('contact.phone', { required: 'Phone number is required' })}
                error={!!errors.contact?.phone}
                helperText={errors.contact?.phone?.message}
                disabled={!editing}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...register('contact.email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.contact?.email}
                helperText={errors.contact?.email?.message}
                disabled={!editing}
              />

              {editing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Address Information
            </Typography>
            
            <TextField
              fullWidth
              label="Street Address"
              margin="normal"
              {...register('address.street')}
              disabled={!editing}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  margin="normal"
                  {...register('address.city', { required: 'City is required' })}
                  error={!!errors.address?.city}
                  helperText={errors.address?.city?.message}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  margin="normal"
                  {...register('address.state', { required: 'State is required' })}
                  error={!!errors.address?.state}
                  helperText={errors.address?.state?.message}
                  disabled={!editing}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="ZIP Code"
              margin="normal"
              {...register('address.zipCode', { required: 'ZIP code is required' })}
              error={!!errors.address?.zipCode}
              helperText={errors.address?.zipCode?.message}
              disabled={!editing}
            />
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Capacity
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Beds"
                  type="number"
                  margin="normal"
                  {...register('capacity.totalBeds', { 
                    required: 'Total beds is required',
                    min: { value: 1, message: 'Must have at least 1 bed' },
                  })}
                  error={!!errors.capacity?.totalBeds}
                  helperText={errors.capacity?.totalBeds?.message}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Available Beds"
                  type="number"
                  margin="normal"
                  {...register('capacity.availableBeds', { 
                    required: 'Available beds is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                  error={!!errors.capacity?.availableBeds}
                  helperText={errors.capacity?.availableBeds?.message}
                  disabled={!editing}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderIndividualProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Personal Information
              </Typography>
              <IconButton onClick={() => setEditing(!editing)}>
                <Edit />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    margin="normal"
                    {...register('personalInfo.firstName', { required: 'First name is required' })}
                    error={!!errors.personalInfo?.firstName}
                    helperText={errors.personalInfo?.firstName?.message}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    margin="normal"
                    {...register('personalInfo.lastName', { required: 'Last name is required' })}
                    error={!!errors.personalInfo?.lastName}
                    helperText={errors.personalInfo?.lastName?.message}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                {...register('personalInfo.phone', { required: 'Phone number is required' })}
                error={!!errors.personalInfo?.phone}
                helperText={errors.personalInfo?.phone?.message}
                disabled={!editing}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Controller
                  name="personalInfo.gender"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Gender"
                      error={!!errors.personalInfo?.gender}
                      disabled={!editing}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="non-binary">Non-binary</MenuItem>
                      <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('personalInfo.dateOfBirth', { required: 'Date of birth is required' })}
                error={!!errors.personalInfo?.dateOfBirth}
                helperText={errors.personalInfo?.dateOfBirth?.message}
                disabled={!editing}
              />

              {editing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Current Status
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Housing Status</InputLabel>
              <Controller
                name="housingStatus.current"
                control={control}
                defaultValue=""
                rules={{ required: 'Housing status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Housing Status"
                    error={!!errors.housingStatus?.current}
                    disabled={!editing}
                  >
                    <MenuItem value="homeless">Homeless</MenuItem>
                    <MenuItem value="at-risk">At Risk</MenuItem>
                    <MenuItem value="temporarily-housed">Temporarily Housed</MenuItem>
                    <MenuItem value="seeking-housing">Seeking Housing</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Employment Status</InputLabel>
              <Controller
                name="employment.status"
                control={control}
                defaultValue=""
                rules={{ required: 'Employment status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Employment Status"
                    error={!!errors.employment?.status}
                    disabled={!editing}
                  >
                    <MenuItem value="employed">Employed</MenuItem>
                    <MenuItem value="unemployed">Unemployed</MenuItem>
                    <MenuItem value="part-time">Part-time</MenuItem>
                    <MenuItem value="seeking-work">Seeking Work</MenuItem>
                    <MenuItem value="unable-to-work">Unable to Work</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <TextField
              fullWidth
              label="Current Location"
              margin="normal"
              {...register('currentLocation.address.city')}
              disabled={!editing}
            />
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Emergency Contact
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Contact Name"
              margin="normal"
              {...register('personalInfo.emergencyContact.name', { required: 'Emergency contact name is required' })}
              error={!!errors.personalInfo?.emergencyContact?.name}
              helperText={errors.personalInfo?.emergencyContact?.name?.message}
              disabled={!editing}
            />

            <TextField
              fullWidth
              label="Contact Phone"
              margin="normal"
              {...register('personalInfo.emergencyContact.phone', { required: 'Emergency contact phone is required' })}
              error={!!errors.personalInfo?.emergencyContact?.phone}
              helperText={errors.personalInfo?.emergencyContact?.phone?.message}
              disabled={!editing}
            />

            <TextField
              fullWidth
              label="Relationship"
              margin="normal"
              {...register('personalInfo.emergencyContact.relationship', { required: 'Relationship is required' })}
              error={!!errors.personalInfo?.emergencyContact?.relationship}
              helperText={errors.personalInfo?.emergencyContact?.relationship?.message}
              disabled={!editing}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
              src={profile?.images?.[0]?.url}
            >
              {user?.userType === 'shelter' ? <Business /> : <Person />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user?.userType === 'shelter' 
                  ? profile?.name 
                  : `${profile?.personalInfo?.firstName} ${profile?.personalInfo?.lastName}`
                }
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {user?.userType === 'shelter' ? 'Shelter Organization' : 'Individual'}
              </Typography>
              <Chip
                label={user?.isVerified ? 'Verified' : 'Pending Verification'}
                color={user?.isVerified ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Profile Content */}
      {user?.userType === 'shelter' ? renderShelterProfile() : renderIndividualProfile()}
    </Box>
  );
};

export default ProfilePage;
