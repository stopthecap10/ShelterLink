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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Work,
  Business,
  LocationOn,
  AttachMoney,
  Schedule,
  Security,
  Send,
  Share,
  Bookmark,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplyDialogOpen(true);
  };

  const submitApplication = async () => {
    try {
      await axios.post(`/api/jobs/${id}/apply`, {
        notes: applicationNotes,
      });
      
      setApplyDialogOpen(false);
      setApplicationNotes('');
      // Show success message or redirect
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const formatSalary = (compensation) => {
    if (compensation.type === 'volunteer') return 'Volunteer Position';
    if (compensation.type === 'contract') return 'Contract Position';
    if (compensation.min && compensation.max) {
      return `$${compensation.min} - $${compensation.max}`;
    }
    if (compensation.min) return `$${compensation.min}+`;
    return 'Salary negotiable';
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

  if (!job) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Job not found
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
          >
            <Work />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {job.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {job.company.name}
            </Typography>
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
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Job Description */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {job.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Requirements
              </Typography>
              
              {job.requirements.experience && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Experience
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.requirements.experience.level} level
                    {job.requirements.experience.years && ` (${job.requirements.experience.years} years)`}
                  </Typography>
                  {job.requirements.experience.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {job.requirements.experience.description}
                    </Typography>
                  )}
                </Box>
              )}

              {job.requirements.education && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Education
                  </Typography>
                  <Typography variant="body2">
                    {job.requirements.education.level} {job.requirements.education.field && `in ${job.requirements.education.field}`}
                    {job.requirements.education.required ? ' (Required)' : ' (Preferred)'}
                  </Typography>
                </Box>
              )}

              {job.requirements.skills && job.requirements.skills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.requirements.skills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {job.requirements.certifications && job.requirements.certifications.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Certifications
                  </Typography>
                  <List dense>
                    {job.requirements.certifications.map((cert, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Security sx={{ fontSize: 20, color: 'text.secondary' }} />
                        </ListItemIcon>
                        <ListItemText primary={cert} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                How to Apply
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {job.application.instructions || 'Please submit your application through our platform.'}
              </Typography>
              
              {job.application.documents && job.application.documents.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Required Documents
                  </Typography>
                  <List dense>
                    {job.application.documents.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={doc} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Job Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Job Details
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2">
                  {formatSalary(job.compensation)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2">
                  {job.employment.type.replace('-', ' ')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2">
                  {job.location.address.city}, {job.location.address.state}
                  {job.location.isRemote && ' (Remote)'}
                </Typography>
              </Box>

              {job.employment.schedule && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2">
                    {job.employment.schedule}
                  </Typography>
                </Box>
              )}

              {job.employment.startDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2">
                    Start Date: {new Date(job.employment.startDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                About {job.company.name}
              </Typography>
              {job.company.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {job.company.description}
                </Typography>
              )}
              {job.company.website && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => window.open(job.company.website, '_blank')}
                >
                  Visit Website
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Apply Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Ready to Apply?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Submit your application for this position.
              </Typography>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Send />}
                onClick={handleApply}
                disabled={job.status !== 'active'}
              >
                {job.status === 'active' ? 'Apply Now' : 'Position Closed'}
              </Button>

              {job.application.deadline && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Application deadline: {new Date(job.application.deadline).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Submit your application for this position at {job.company.name}.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Notes (Optional)"
            placeholder="Tell us why you're interested in this position..."
            value={applicationNotes}
            onChange={(e) => setApplicationNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitApplication}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDetailPage;
