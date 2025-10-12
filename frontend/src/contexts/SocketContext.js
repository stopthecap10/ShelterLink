import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Listen for real-time updates
      newSocket.on('availability-updated', (data) => {
        console.log('Shelter availability updated:', data);
        // You can emit a custom event or update state here
      });

      newSocket.on('receive-message', (data) => {
        console.log('New message received:', data);
        // Update unread count or show notification
        setUnreadCount(prev => prev + 1);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // Clean up socket when user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, token]);

  // Join a room for real-time updates
  const joinRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('join-room', roomId);
    }
  };

  // Leave a room
  const leaveRoom = (roomId) => {
    if (socket && isConnected) {
      socket.emit('leave-room', roomId);
    }
  };

  // Send a message
  const sendMessage = (data) => {
    if (socket && isConnected) {
      socket.emit('send-message', data);
    }
  };

  // Update shelter availability
  const updateAvailability = (data) => {
    if (socket && isConnected) {
      socket.emit('update-availability', data);
    }
  };

  // Listen for specific events
  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  // Remove event listener
  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  // Emit custom events
  const emit = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    isConnected,
    unreadCount,
    setUnreadCount,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateAvailability,
    on,
    off,
    emit,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
