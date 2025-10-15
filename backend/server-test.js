const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for testing
const mockShelters = [
  {
    _id: '1',
    name: 'Hope Shelter',
    description: 'A safe place for individuals and families in need',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    contact: {
      phone: '(555) 123-4567',
      email: 'info@hopeshelter.org'
    },
    capacity: {
      totalBeds: 50,
      availableBeds: 12
    },
    services: [
      { name: 'Emergency Shelter', available: true },
      { name: 'Meals', available: true },
      { name: 'Job Training', available: true }
    ],
    rating: {
      average: 4.5,
      count: 23
    },
    isActive: true,
    verificationStatus: 'verified'
  },
  {
    _id: '2',
    name: 'Community Care Center',
    description: 'Comprehensive support services for the homeless community',
    address: {
      street: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103'
    },
    contact: {
      phone: '(555) 987-6543',
      email: 'contact@communitycare.org'
    },
    capacity: {
      totalBeds: 30,
      availableBeds: 8
    },
    services: [
      { name: 'Emergency Shelter', available: true },
      { name: 'Medical Care', available: true },
      { name: 'Counseling', available: true }
    ],
    rating: {
      average: 4.2,
      count: 18
    },
    isActive: true,
    verificationStatus: 'verified'
  }
];

const mockJobs = [
  {
    _id: '1',
    title: 'Kitchen Assistant',
    description: 'Help prepare and serve meals to shelter residents',
    company: {
      name: 'Hope Shelter',
      website: 'https://hopeshelter.org'
    },
    location: {
      address: {
        city: 'San Francisco',
        state: 'CA'
      }
    },
    employment: {
      type: 'part-time'
    },
    compensation: {
      type: 'hourly',
      amount: { min: 15, max: 18 }
    },
    status: 'active'
  },
  {
    _id: '2',
    title: 'Maintenance Worker',
    description: 'General maintenance and repair work around the facility',
    company: {
      name: 'Community Care Center',
      website: 'https://communitycare.org'
    },
    location: {
      address: {
        city: 'San Francisco',
        state: 'CA'
      }
    },
    employment: {
      type: 'full-time'
    },
    compensation: {
      type: 'hourly',
      amount: { min: 18, max: 22 }
    },
    status: 'active'
  }
];

// Mock routes for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/shelters', (req, res) => {
  const { page = 1, limit = 10, search, city, availableBeds } = req.query;
  
  let filteredShelters = [...mockShelters];
  
  if (search) {
    filteredShelters = filteredShelters.filter(shelter => 
      shelter.name.toLowerCase().includes(search.toLowerCase()) ||
      shelter.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (city) {
    filteredShelters = filteredShelters.filter(shelter => 
      shelter.address.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  if (availableBeds === 'true') {
    filteredShelters = filteredShelters.filter(shelter => 
      shelter.capacity.availableBeds > 0
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedShelters = filteredShelters.slice(startIndex, endIndex);
  
  res.json({
    shelters: paginatedShelters,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredShelters.length / limit),
      total: filteredShelters.length,
      hasNext: endIndex < filteredShelters.length,
      hasPrev: page > 1
    }
  });
});

app.get('/api/shelters/:id', (req, res) => {
  const shelter = mockShelters.find(s => s._id === req.params.id);
  if (!shelter) {
    return res.status(404).json({ message: 'Shelter not found' });
  }
  res.json(shelter);
});

app.get('/api/jobs', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredJobs = [...mockJobs];
  
  if (search) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  res.json({
    jobs: paginatedJobs,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredJobs.length / limit),
      total: filteredJobs.length,
      hasNext: endIndex < filteredJobs.length,
      hasPrev: page > 1
    }
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = mockJobs.find(j => j._id === req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json(job);
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email && password) {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: 'mock-user-id',
        email,
        userType: email.includes('shelter') ? 'shelter' : 'individual',
        isVerified: true
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, userType } = req.body;
  
  if (email && password && userType) {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      message: 'User registered successfully',
      token,
      user: {
        id: 'mock-user-id',
        email,
        userType,
        isVerified: true
      }
    });
  } else {
    res.status(400).json({ message: 'Missing required fields' });
  }
});

app.get('/api/auth/me', (req, res) => {
  // Mock user profile
  res.json({
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
      userType: 'individual',
      isVerified: true
    },
    profile: {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe'
      },
      housingStatus: {
        current: 'homeless'
      },
      employment: {
        status: 'unemployed'
      }
    }
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('update-availability', (data) => {
    socket.broadcast.emit('availability-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Mock shelters: http://localhost:${PORT}/api/shelters`);
  console.log(`💼 Mock jobs: http://localhost:${PORT}/api/jobs`);
});
