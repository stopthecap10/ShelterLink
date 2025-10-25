import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Home } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser, error, clearError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const userType = watch('userType');

  const onSubmit = async (data) => {
    setLoading(true);
    clearError();

    // Prepare profile data based on user type
    let profileData = {};
    
    if (data.userType === 'shelter') {
      profileData = {
        name: data.shelterName,
        description: data.description,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        contact: {
          phone: data.phone,
          email: data.email,
        },
        capacity: {
          totalBeds: parseInt(data.totalBeds) || 0,
          availableBeds: parseInt(data.availableBeds) || 0,
        },
        services: [],
        requirements: [],
        operatingHours: {
          monday: { open: '08:00', close: '20:00', closed: false },
          tuesday: { open: '08:00', close: '20:00', closed: false },
          wednesday: { open: '08:00', close: '20:00', closed: false },
          thursday: { open: '08:00', close: '20:00', closed: false },
          friday: { open: '08:00', close: '20:00', closed: false },
          saturday: { open: '08:00', close: '20:00', closed: false },
          sunday: { open: '08:00', close: '20:00', closed: false },
        },
      };
    } else {
      profileData = {
        personalInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          phone: data.phone,
          emergencyContact: {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
            relationship: data.emergencyContactRelationship,
          },
        },
        currentLocation: {
          address: {
            street: data.street || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
          },
        },
        housingStatus: {
          current: data.housingStatus,
          duration: data.housingDuration || '',
        },
        employment: {
          status: data.employmentStatus,
          skills: [],
          experience: [],
          jobPreferences: {
            type: [],
            location: '',
            schedule: '',
            minWage: 0,
          },
        },
        needs: [],
        preferences: {
          shelterType: [],
          location: {
            preferredCities: [],
            maxDistance: 25,
            avoidAreas: [],
          },
          services: [],
          accessibility: [],
        },
        documents: [],
        caseHistory: [],
      };
    }

    const result = await registerUser({
      email: data.email,
      password: data.password,
      userType: data.userType,
      profileData,
    });

    if (result.success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                mb: 2,
              }}
            >
              <PersonAddIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Join Shelter Match
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account to get started
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* User Type Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>I am a...</InputLabel>
                  <Controller
                    name="userType"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Please select your account type' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label={t('iAmA')}
                        error={!!errors.userType}
                      >
                        <MenuItem value="individual">Individual seeking shelter</MenuItem>
                        <MenuItem value="shelter">Shelter organization</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                {errors.userType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.userType.message}
                  </Typography>
                )}
              </Grid>

              {/* Basic Account Information */}
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="body2" color="text.secondary">
                    Account Information
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('emailAddress')}
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('password')}
                  type="password"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>

              {/* Conditional Fields Based on User Type */}
              {userType && (
                <>
                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="body2" color="text.secondary">
                        {userType === 'shelter' ? 'Shelter Information' : 'Personal Information'}
                      </Typography>
                    </Divider>
                  </Grid>

                  {userType === 'shelter' ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Shelter Name"
                          {...register('shelterName', {
                            required: 'Shelter name is required',
                          })}
                          error={!!errors.shelterName}
                          helperText={errors.shelterName?.message}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={3}
                          {...register('description', {
                            required: 'Description is required',
                          })}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          {...register('phone', {
                            required: 'Phone number is required',
                          })}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Total Beds"
                          type="number"
                          {...register('totalBeds', {
                            required: 'Total beds is required',
                            min: { value: 1, message: 'Must have at least 1 bed' },
                          })}
                          error={!!errors.totalBeds}
                          helperText={errors.totalBeds?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Available Beds"
                          type="number"
                          {...register('availableBeds', {
                            required: 'Available beds is required',
                            min: { value: 0, message: 'Cannot be negative' },
                          })}
                          error={!!errors.availableBeds}
                          helperText={errors.availableBeds?.message}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          {...register('firstName', {
                            required: 'First name is required',
                          })}
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          {...register('lastName', {
                            required: 'Last name is required',
                          })}
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          {...register('dateOfBirth', {
                            required: 'Date of birth is required',
                          })}
                          error={!!errors.dateOfBirth}
                          helperText={errors.dateOfBirth?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Controller
                            name="gender"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Gender is required' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Gender"
                                error={!!errors.gender}
                              >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="non-binary">Non-binary</MenuItem>
                                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                        {errors.gender && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.gender.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          {...register('phone', {
                            required: 'Phone number is required',
                          })}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Housing Status</InputLabel>
                          <Controller
                            name="housingStatus"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Housing status is required' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Housing Status"
                                error={!!errors.housingStatus}
                              >
                                <MenuItem value="homeless">Homeless</MenuItem>
                                <MenuItem value="at-risk">At Risk</MenuItem>
                                <MenuItem value="temporarily-housed">Temporarily Housed</MenuItem>
                                <MenuItem value="seeking-housing">Seeking Housing</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                        {errors.housingStatus && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.housingStatus.message}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Employment Status</InputLabel>
                          <Controller
                            name="employmentStatus"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Employment status is required' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Employment Status"
                                error={!!errors.employmentStatus}
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
                        {errors.employmentStatus && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.employmentStatus.message}
                          </Typography>
                        )}
                      </Grid>
                    </>
                  )}

                  {/* Address Information */}
                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="body2" color="text.secondary">
                        Address Information
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      {...register('street')}
                      error={!!errors.street}
                      helperText={errors.street?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      {...register('city', {
                        required: 'City is required',
                      })}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      {...register('state', {
                        required: 'State is required',
                      })}
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      {...register('zipCode', {
                        required: 'ZIP code is required',
                      })}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                    />
                  </Grid>
                </>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !userType}
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('createAccount')
                  )}
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Already have an account?
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                size="large"
              >
                Sign In
              </Button>
            </Box>
          </Box>

          {/* Back to Home */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <Home sx={{ fontSize: 16, mr: 1 }} />
              Back to Home
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
