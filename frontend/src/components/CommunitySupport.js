import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  People,
  Message,
  ThumbUp,
  Share,
  Add,
  Group,
  Support,
  Celebration,
  TrendingUp,
  Star,
  Forum,
  VolunteerActivism,
} from '@mui/icons-material';

const CommunitySupport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState('stories');

  const successStories = [
    {
      id: 1,
      author: 'Sarah M.',
      avatar: 'S',
      title: 'Found My Forever Home',
      content: 'After 6 months of using Shelter Match, I finally found a permanent home and a job. The community support was incredible!',
      likes: 24,
      comments: 8,
      time: '2 hours ago',
      verified: true,
    },
    {
      id: 2,
      author: 'Mike R.',
      avatar: 'M',
      title: 'Job Training Success',
      content: 'The job training program connected me with skills that led to a full-time position. Grateful for this platform!',
      likes: 18,
      comments: 5,
      time: '5 hours ago',
      verified: false,
    },
    {
      id: 3,
      author: 'Lisa K.',
      avatar: 'L',
      title: 'Mental Health Support',
      content: 'The mental health resources and peer support groups helped me through my darkest times. Thank you community!',
      likes: 31,
      comments: 12,
      time: '1 day ago',
      verified: true,
    },
  ];

  const peerSupportGroups = [
    {
      name: 'New Beginnings',
      members: 156,
      description: 'Support for those starting fresh',
      category: 'General',
      active: true,
    },
    {
      name: 'Veterans Support',
      members: 89,
      description: 'Dedicated to veteran community',
      category: 'Veterans',
      active: true,
    },
    {
      name: 'Youth Empowerment',
      members: 203,
      description: 'Supporting young adults',
      category: 'Youth',
      active: true,
    },
    {
      name: 'Family Reunification',
      members: 67,
      description: 'Helping families reconnect',
      category: 'Family',
      active: false,
    },
  ];

  const communityStats = [
    { label: 'Active Members', value: '1,247', icon: <People />, color: '#667eea' },
    { label: 'Success Stories', value: '89', icon: <Celebration />, color: '#764ba2' },
    { label: 'Support Groups', value: '12', icon: <Group />, color: '#f093fb' },
    { label: 'Peer Mentors', value: '34', icon: <Support />, color: '#4facfe' },
  ];

  const SuccessStoryCard = ({ story }) => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {story.avatar}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {story.author}
              </Typography>
              {story.verified && (
                <Chip size="small" label="Verified" color="success" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {story.time}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {story.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {story.content}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            size="small"
            startIcon={<ThumbUp />}
            sx={{ color: 'text.secondary' }}
          >
            {story.likes}
          </Button>
          <Button
            size="small"
            startIcon={<Message />}
            sx={{ color: 'text.secondary' }}
          >
            {story.comments}
          </Button>
          <Button
            size="small"
            startIcon={<Share />}
            sx={{ color: 'text.secondary' }}
          >
            Share
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const SupportGroupCard = ({ group }) => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: group.active ? 'success.main' : 'grey.400', mr: 2 }}>
            <Group />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {group.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {group.description}
            </Typography>
          </Box>
          <Chip
            label={group.category}
            size="small"
            color={group.active ? 'primary' : 'default'}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {group.members} members
          </Typography>
          <Chip
            label={group.active ? 'Active' : 'Inactive'}
            size="small"
            color={group.active ? 'success' : 'default'}
          />
        </Box>

        <Button
          variant={group.active ? 'contained' : 'outlined'}
          fullWidth
          startIcon={<Forum />}
          disabled={!group.active}
        >
          {group.active ? 'Join Group' : 'Group Inactive'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Community Support
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Connect with peers, share success stories, and build a supportive community
          </Typography>
        </Box>
      </Fade>

      {/* Community Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {communityStats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Zoom in timeout={1000 + index * 100}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ color: stat.color, mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Zoom in timeout={1200}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Celebration sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Success Stories
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Share your success story..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    disabled={!newPost.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    Share Story
                  </Button>
                </Box>

                <List>
                  {successStories.map((story, index) => (
                    <Slide key={story.id} direction="up" in timeout={1000 + index * 200}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <SuccessStoryCard story={story} />
                      </ListItem>
                    </Slide>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Zoom in timeout={1400}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Group sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Support Groups
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {peerSupportGroups.map((group, index) => (
                    <Slide key={index} direction="left" in timeout={1200 + index * 200}>
                      <SupportGroupCard group={group} />
                    </Slide>
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Add />}
                  sx={{ mt: 3 }}
                >
                  Create Support Group
                </Button>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommunitySupport;
