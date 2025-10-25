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
    description: 'A safe place for individuals and families in need. We provide emergency shelter, meals, and support services to help people get back on their feet.',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    contact: {
      phone: '(555) 123-4567',
      email: 'info@hopeshelter.org',
      website: 'https://hopeshelter.org'
    },
    capacity: {
      totalBeds: 50,
      availableBeds: 12,
      lastUpdated: new Date()
    },
    services: [
      { name: 'Emergency Shelter', available: true, description: 'Safe overnight accommodation' },
      { name: 'Meals', available: true, description: 'Three meals daily' },
      { name: 'Job Training', available: true, description: 'Skills development programs' },
      { name: 'Medical Care', available: true, description: 'Basic health services' },
      { name: 'Counseling', available: true, description: 'Mental health support' }
    ],
    requirements: [
      { type: 'ID Required', description: 'Valid government ID', mandatory: true },
      { type: 'Background Check', description: 'Criminal background screening', mandatory: false },
      { type: 'Drug Test', description: 'Substance abuse screening', mandatory: false }
    ],
    operatingHours: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '08:00', close: '18:00', closed: false },
      sunday: { open: '08:00', close: '18:00', closed: false }
    },
    rating: {
      average: 4.5,
      count: 23
    },
    isActive: true,
    verificationStatus: 'verified',
    images: [
      { url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400', caption: 'Main entrance', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400', caption: 'Dining area', isPrimary: false }
    ]
  },
  {
    _id: '2',
    name: 'Community Care Center',
    description: 'Comprehensive support services for the homeless community. We offer emergency shelter, medical care, counseling, and job placement assistance.',
    address: {
      street: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    contact: {
      phone: '(555) 987-6543',
      email: 'contact@communitycare.org',
      website: 'https://communitycare.org'
    },
    capacity: {
      totalBeds: 30,
      availableBeds: 8,
      lastUpdated: new Date()
    },
    services: [
      { name: 'Emergency Shelter', available: true, description: 'Safe overnight accommodation' },
      { name: 'Medical Care', available: true, description: 'Full medical services' },
      { name: 'Counseling', available: true, description: 'Mental health and addiction counseling' },
      { name: 'Job Placement', available: true, description: 'Employment assistance' },
      { name: 'Legal Aid', available: true, description: 'Legal support services' }
    ],
    requirements: [
      { type: 'ID Required', description: 'Valid government ID', mandatory: true },
      { type: 'Medical Screening', description: 'Basic health assessment', mandatory: true },
      { type: 'Background Check', description: 'Criminal background screening', mandatory: false }
    ],
    operatingHours: {
      monday: { open: '07:00', close: '22:00', closed: false },
      tuesday: { open: '07:00', close: '22:00', closed: false },
      wednesday: { open: '07:00', close: '22:00', closed: false },
      thursday: { open: '07:00', close: '22:00', closed: false },
      friday: { open: '07:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '08:00', close: '20:00', closed: false }
    },
    rating: {
      average: 4.2,
      count: 18
    },
    isActive: true,
    verificationStatus: 'verified',
    images: [
      { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', caption: 'Community center', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400', caption: 'Common area', isPrimary: false }
    ]
  },
  {
    _id: '3',
    name: 'Safe Haven Women\'s Shelter',
    description: 'Dedicated shelter for women and children. We provide a safe, supportive environment with specialized services for women experiencing homelessness.',
    address: {
      street: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      coordinates: { lat: 37.7649, lng: -122.4294 }
    },
    contact: {
      phone: '(555) 456-7890',
      email: 'info@safehaven.org',
      website: 'https://safehaven.org'
    },
    capacity: {
      totalBeds: 25,
      availableBeds: 5,
      lastUpdated: new Date()
    },
    services: [
      { name: 'Women\'s Shelter', available: true, description: 'Safe space for women and children' },
      { name: 'Childcare', available: true, description: 'Childcare services' },
      { name: 'Counseling', available: true, description: 'Trauma-informed counseling' },
      { name: 'Legal Aid', available: true, description: 'Domestic violence legal support' },
      { name: 'Job Training', available: true, description: 'Women-focused job training' }
    ],
    requirements: [
      { type: 'Women Only', description: 'Shelter for women and children only', mandatory: true },
      { type: 'ID Required', description: 'Valid government ID', mandatory: true },
      { type: 'Intake Interview', description: 'Comprehensive intake process', mandatory: true }
    ],
    operatingHours: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false }
    },
    rating: {
      average: 4.8,
      count: 15
    },
    isActive: true,
    verificationStatus: 'verified',
    images: [
      { url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400', caption: 'Women\'s shelter entrance', isPrimary: true }
    ]
  },
  {
    _id: '4',
    name: 'Youth Emergency Shelter',
    description: 'Specialized shelter for youth ages 18-24. We provide emergency shelter, education support, and life skills training for young adults experiencing homelessness.',
    address: {
      street: '321 Mission St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      coordinates: { lat: 37.7549, lng: -122.4394 }
    },
    contact: {
      phone: '(555) 321-9876',
      email: 'youth@youthemergency.org',
      website: 'https://youthemergency.org'
    },
    capacity: {
      totalBeds: 20,
      availableBeds: 3,
      lastUpdated: new Date()
    },
    services: [
      { name: 'Youth Shelter', available: true, description: 'Emergency shelter for ages 18-24' },
      { name: 'Education Support', available: true, description: 'GED and college preparation' },
      { name: 'Life Skills', available: true, description: 'Independent living skills training' },
      { name: 'Job Training', available: true, description: 'Youth employment programs' },
      { name: 'Mentoring', available: true, description: 'One-on-one mentoring' }
    ],
    requirements: [
      { type: 'Age Requirement', description: 'Must be 18-24 years old', mandatory: true },
      { type: 'ID Required', description: 'Valid government ID', mandatory: true },
      { type: 'Intake Assessment', description: 'Comprehensive youth assessment', mandatory: true }
    ],
    operatingHours: {
      monday: { open: '09:00', close: '21:00', closed: false },
      tuesday: { open: '09:00', close: '21:00', closed: false },
      wednesday: { open: '09:00', close: '21:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '21:00', closed: false },
      saturday: { open: '10:00', close: '20:00', closed: false },
      sunday: { open: '10:00', close: '20:00', closed: false }
    },
    rating: {
      average: 4.6,
      count: 12
    },
    isActive: true,
    verificationStatus: 'verified',
    images: [
      { url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', caption: 'Youth center', isPrimary: true }
    ]
  }
];

const mockJobs = [
  {
    _id: '1',
    title: 'Kitchen Assistant',
    description: 'Help prepare and serve meals to shelter residents. Work in a supportive environment helping those in need. No experience required - we provide training.',
    company: {
      name: 'Hope Shelter',
      website: 'https://hopeshelter.org',
      description: 'Non-profit organization providing shelter and support services'
    },
    location: {
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102'
      },
      isRemote: false
    },
    employment: {
      type: 'part-time',
      schedule: 'Monday-Friday, 6:00 AM - 2:00 PM',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 15, max: 18 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 0,
        description: 'No experience required'
      },
      education: {
        level: 'none',
        required: false
      },
      skills: ['Teamwork', 'Reliability', 'Compassion'],
      other: ['Must be able to lift 25 lbs', 'Food safety certification preferred']
    },
    application: {
      process: 'in-person',
      instructions: 'Visit our shelter during business hours to apply',
      contactInfo: {
        name: 'Sarah Johnson',
        email: 'hr@hopeshelter.org',
        phone: '(555) 123-4567'
      },
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
    },
    support: {
      training: {
        provided: true,
        description: 'On-the-job training provided',
        duration: '2 weeks'
      },
      mentorship: true,
      resources: ['Uniforms provided', 'Meal during shift', 'Transportation assistance available']
    },
    status: 'active',
    tags: ['kitchen', 'food-service', 'non-profit', 'entry-level']
  },
  {
    _id: '2',
    title: 'Maintenance Worker',
    description: 'General maintenance and repair work around the facility. Keep our shelter safe and comfortable for residents. Great opportunity for those with handyman skills.',
    company: {
      name: 'Community Care Center',
      website: 'https://communitycare.org',
      description: 'Comprehensive care center for the homeless community'
    },
    location: {
      address: {
        street: '456 Oak Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103'
      },
      isRemote: false
    },
    employment: {
      type: 'full-time',
      schedule: 'Monday-Friday, 8:00 AM - 4:00 PM',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 18, max: 22 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'mid-level',
        years: 2,
        description: '2+ years maintenance experience preferred'
      },
      education: {
        level: 'high-school',
        required: true
      },
      skills: ['Plumbing', 'Electrical', 'Carpentry', 'HVAC basics'],
      other: ['Valid driver\'s license', 'Background check required']
    },
    application: {
      process: 'email',
      instructions: 'Send resume and cover letter to hr@communitycare.org',
      contactInfo: {
        name: 'Mike Rodriguez',
        email: 'hr@communitycare.org',
        phone: '(555) 987-6543'
      },
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
    },
    support: {
      training: {
        provided: true,
        description: 'Specialized training in shelter maintenance',
        duration: '1 week'
      },
      mentorship: true,
      resources: ['Tools provided', 'Safety equipment', 'Health insurance']
    },
    status: 'active',
    tags: ['maintenance', 'facilities', 'full-time', 'skilled-trade']
  },
  {
    _id: '3',
    title: 'Receptionist',
    description: 'Front desk receptionist for women\'s shelter. Answer phones, greet visitors, and provide administrative support. Compassionate, organized individual needed.',
    company: {
      name: 'Safe Haven Women\'s Shelter',
      website: 'https://safehaven.org',
      description: 'Dedicated shelter for women and children'
    },
    location: {
      address: {
        street: '789 Pine St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94104'
      },
      isRemote: false
    },
    employment: {
      type: 'part-time',
      schedule: 'Various shifts available',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 16, max: 20 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 1,
        description: '1+ years customer service experience'
      },
      education: {
        level: 'high-school',
        required: true
      },
      skills: ['Customer Service', 'Phone Skills', 'Computer Skills', 'Empathy'],
      other: ['Bilingual preferred (Spanish/English)', 'Background check required']
    },
    application: {
      process: 'online',
      instructions: 'Apply through our website or call for more information',
      contactInfo: {
        name: 'Lisa Chen',
        email: 'jobs@safehaven.org',
        phone: '(555) 456-7890'
      },
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
    },
    support: {
      training: {
        provided: true,
        description: 'Comprehensive training in shelter operations',
        duration: '2 weeks'
      },
      mentorship: true,
      resources: ['Computer training', 'Crisis intervention training', 'Benefits package']
    },
    status: 'active',
    tags: ['receptionist', 'administrative', 'women-focused', 'part-time']
  },
  {
    _id: '4',
    title: 'Youth Counselor',
    description: 'Work with homeless youth ages 18-24. Provide counseling, life skills training, and support services. Make a real difference in young people\'s lives.',
    company: {
      name: 'Youth Emergency Shelter',
      website: 'https://youthemergency.org',
      description: 'Specialized shelter for youth experiencing homelessness'
    },
    location: {
      address: {
        street: '321 Mission St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105'
      },
      isRemote: false
    },
    employment: {
      type: 'full-time',
      schedule: 'Monday-Friday, 9:00 AM - 5:00 PM',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
    },
    compensation: {
      type: 'salary',
      amount: { min: 35000, max: 42000 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'mid-level',
        years: 3,
        description: '3+ years working with at-risk youth'
      },
      education: {
        level: 'bachelors',
        field: 'Social Work, Psychology, or related field',
        required: true
      },
      skills: ['Counseling', 'Crisis Intervention', 'Youth Development', 'Case Management'],
      other: ['Licensed Social Worker preferred', 'Background check required', 'Valid driver\'s license']
    },
    application: {
      process: 'email',
      instructions: 'Send resume, cover letter, and references to careers@youthemergency.org',
      contactInfo: {
        name: 'David Kim',
        email: 'careers@youthemergency.org',
        phone: '(555) 321-9876'
      },
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month from now
    },
    support: {
      training: {
        provided: true,
        description: 'Specialized training in youth counseling and crisis intervention',
        duration: '4 weeks'
      },
      mentorship: true,
      resources: ['Professional development', 'Supervision', 'Health insurance', 'Retirement plan']
    },
    status: 'active',
    tags: ['counseling', 'youth', 'social-work', 'full-time', 'professional']
  },
  {
    _id: '5',
    title: 'Volunteer Coordinator',
    description: 'Coordinate volunteer programs and community outreach. Great opportunity for someone passionate about helping the homeless community.',
    company: {
      name: 'Hope Shelter',
      website: 'https://hopeshelter.org',
      description: 'Non-profit organization providing shelter and support services'
    },
    location: {
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102'
      },
      isRemote: false
    },
    employment: {
      type: 'part-time',
      schedule: 'Flexible hours, some evenings and weekends',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 14, max: 16 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 1,
        description: '1+ years volunteer or community organizing experience'
      },
      education: {
        level: 'high-school',
        required: true
      },
      skills: ['Organization', 'Communication', 'Event Planning', 'Community Outreach'],
      other: ['Passion for helping others', 'Flexible schedule required']
    },
    application: {
      process: 'phone',
      instructions: 'Call to schedule an interview',
      contactInfo: {
        name: 'Maria Santos',
        email: 'volunteer@hopeshelter.org',
        phone: '(555) 123-4567'
      },
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
    },
    support: {
      training: {
        provided: true,
        description: 'Training in volunteer management and community outreach',
        duration: '1 week'
      },
      mentorship: true,
      resources: ['Networking opportunities', 'Professional development', 'Flexible schedule']
    },
    status: 'active',
    tags: ['volunteer-coordination', 'community-outreach', 'part-time', 'non-profit']
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

// Mock ratings endpoint
app.get('/api/ratings/shelter/:shelterId', (req, res) => {
  const mockRatings = [
    {
      _id: '1',
      overallRating: 5,
      review: {
        title: 'Excellent shelter',
        content: 'The staff was very helpful and the facilities were clean. I felt safe and supported during my stay.',
        pros: ['Clean facilities', 'Helpful staff', 'Good meals'],
        cons: ['Limited storage space']
      },
      individual: {
        personalInfo: {
          firstName: 'John',
          lastName: 'D.'
        }
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      categories: {
        cleanliness: { rating: 5, comment: 'Very clean' },
        safety: { rating: 5, comment: 'Felt very safe' },
        staff: { rating: 5, comment: 'Staff was amazing' },
        services: { rating: 4, comment: 'Good services' }
      }
    },
    {
      _id: '2',
      overallRating: 4,
      review: {
        title: 'Good experience',
        content: 'The shelter provided the support I needed. The staff was professional and caring.',
        pros: ['Professional staff', 'Good location', 'Supportive environment'],
        cons: ['Limited privacy']
      },
      individual: {
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'M.'
        }
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      categories: {
        cleanliness: { rating: 4, comment: 'Generally clean' },
        safety: { rating: 4, comment: 'Safe environment' },
        staff: { rating: 5, comment: 'Very caring staff' },
        services: { rating: 4, comment: 'Good support services' }
      }
    }
  ];

  res.json({
    ratings: mockRatings,
    average: {
      averageRating: 4.5,
      totalRatings: 2,
      categoryAverages: {
        cleanliness: 4.5,
        safety: 4.5,
        staff: 5.0,
        services: 4.0
      }
    }
  });
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
