import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Send,
  Message,
  Person,
  Business,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

const MessagesPage = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { socket, isConnected, on, off } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
    
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (socket && isConnected) {
      const handleNewMessage = (data) => {
        if (data.conversationId === conversationId) {
          setMessages(prev => [...prev, data.message]);
        }
        // Update conversation list
        fetchConversations();
      };

      on('receive-message', handleNewMessage);
      
      return () => {
        off('receive-message', handleNewMessage);
      };
    }
  }, [socket, isConnected, conversationId, on, off]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      setLoading(true);
      const [conversationResponse, messagesResponse] = await Promise.all([
        axios.get(`/api/messages/conversations/${convId}`),
        axios.get(`/api/messages/conversations/${convId}/messages`),
      ]);
      
      setCurrentConversation(conversationResponse.data.conversation);
      setMessages(messagesResponse.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    try {
      const response = await axios.post(`/api/messages/conversations/${conversationId}/messages`, {
        content: newMessage.trim(),
      });

      setMessages(prev => [...prev, response.data.messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (loading && !currentConversation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Messages
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Conversations
              </Typography>
              <List>
                {conversations.map((conversation) => (
                  <ListItem
                    key={conversation._id}
                    button
                    selected={conversation._id === conversationId}
                    onClick={() => window.location.href = `/messages/${conversation._id}`}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.50',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {conversation.participants.find(p => p.user._id !== user._id)?.role === 'shelter' ? (
                          <Business />
                        ) : (
                          <Person />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.subject}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {conversation.lastMessage?.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.lastMessage?.sentAt && 
                              new Date(conversation.lastMessage.sentAt).toLocaleDateString()
                            }
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Messages */}
        <Grid item xs={12} md={8}>
          {currentConversation ? (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Conversation Header */}
              <CardContent sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentConversation.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentConversation.participants.length} participants
                </Typography>
              </CardContent>

              {/* Messages List */}
              <CardContent sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                <Box sx={{ p: 2, height: '400px', overflow: 'auto' }}>
                  {messages.map((message, index) => (
                    <Box
                      key={message._id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender._id === user._id ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.sender._id === user._id ? 'primary.main' : 'grey.200',
                          color: message.sender._id === user._id ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 1,
                            opacity: 0.7,
                          }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>

              {/* Message Input */}
              <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            startIcon={<Send />}
                          >
                            Send
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Message sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a conversation from the list to start messaging
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagesPage;
