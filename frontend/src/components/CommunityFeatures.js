import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Avatar, Chip, Grid, Paper } from '@mui/material';
import { People, Chat, Share, ThumbUp, Comment, Group } from '@mui/icons-material';

const CommunityFeatures = () => {
  const [successStories] = useState([
    {
      id: 1,
      author: 'Maria G.',
      story: 'Shelter Match connected me with Union Rescue Mission. Their job training program helped me secure a position as a kitchen assistant, and now I\'m saving up for my own apartment.',
      likes: 24,
      comments: 8,
      date: '2 days ago'
    },
    {
      id: 2,
      author: 'John D.',
      story: 'After years on the streets, I used Shelter Match to find the LA Mission. Their recovery programs helped me address my challenges and find stability.',
      likes: 18,
      comments: 5,
      date: '1 week ago'
    },
    {
      id: 3,
      author: 'Sarah M.',
      story: 'The community support I found through this app was incredible. People shared resources, job leads, and encouragement when I needed it most.',
      likes: 31,
      comments: 12,
      date: '3 days ago'
    }
  ]);

  const [peerSupport] = useState([
    { name: 'Recovery Support Group', members: 45, description: 'Weekly meetings for those in recovery' },
    { name: 'Job Search Network', members: 78, description: 'Share job leads and interview tips' },
    { name: 'Housing Resources', members: 32, description: 'Information about affordable housing options' }
  ]);

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Community & Peer Support
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Share sx={{ mr: 1, color: 'primary.main' }} />
              Success Stories
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Real stories from community members who found hope and support through Shelter Match.
            </Typography>
            
            {successStories.map((story) => (
              <Card key={story.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {story.author.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {story.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    "{story.story}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button size="small" startIcon={<ThumbUp />}>
                      {story.likes}
                    </Button>
                    <Button size="small" startIcon={<Comment />}>
                      {story.comments}
                    </Button>
                    <Button size="small" startIcon={<Share />}>
                      Share
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Group sx={{ mr: 1, color: 'primary.main' }} />
              Support Groups
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Join peer support groups and connect with others on similar journeys.
            </Typography>
            
            {peerSupport.map((group, index) => (
              <Card key={index} sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {group.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={`${group.members} members`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Button size="small" variant="outlined">
                      Join
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunityFeatures;
