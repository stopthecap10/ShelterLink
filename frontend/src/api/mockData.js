// Mock data for Congressional App Challenge demo
// This ensures the app looks fully functional in the video

export const mockShelters = [
  {
    _id: '1',
    name: 'Union Rescue Mission',
    description: 'Los Angeles\' oldest and largest private homeless services provider, serving the community since 1891. We offer emergency shelter, three meals daily, medical care, job training, and comprehensive support services to help individuals and families rebuild their lives. Our Hope Gardens Family Center provides specialized services for women and children.',
    address: {
      street: '545 S San Pedro St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90013'
    },
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    },
    contact: {
      phone: '(213) 347-6300',
      email: 'info@urm.org',
      website: 'https://urm.org',
      emergency: '(213) 347-6300 ext. 0'
    },
    capacity: {
      totalBeds: 200,
      availableBeds: 45,
      maxCapacity: 250
    },
    services: [
      { name: 'Emergency Shelter', available: true, description: 'Safe overnight accommodation with clean bedding and storage lockers' },
      { name: 'Meals', available: true, description: 'Three nutritious meals daily, including breakfast (6:30 AM), lunch (12:00 PM), and dinner (6:00 PM)' },
      { name: 'Medical Care', available: true, description: 'On-site medical clinic with registered nurses, basic healthcare, and referrals to partner hospitals' },
      { name: 'Job Training', available: true, description: 'Culinary arts, maintenance, security, and customer service training programs' },
      { name: 'Counseling', available: true, description: 'Individual and group counseling, substance abuse recovery programs, and mental health support' },
      { name: 'Case Management', available: true, description: 'Personalized case management to help with housing, employment, and benefits' },
      { name: 'Childcare', available: true, description: 'Supervised childcare during program participation' },
      { name: 'Transportation', available: true, description: 'Bus tokens and transportation assistance for job interviews and appointments' }
    ],
    requirements: [
      { type: 'ID Required', description: 'Valid government ID or birth certificate', mandatory: true },
      { type: 'Background Check', description: 'Criminal background screening (some restrictions apply)', mandatory: false },
      { type: 'Intake Interview', description: 'Comprehensive intake assessment with case manager', mandatory: true },
      { type: 'Drug Test', description: 'Substance abuse screening for certain programs', mandatory: false }
    ],
    operatingHours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '07:00', close: '20:00', closed: false },
      sunday: { open: '07:00', close: '20:00', closed: false }
    },
    rating: {
      average: 4.2,
      count: 234
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
    specialPrograms: [
      'Hope Gardens Family Center for women and children',
      'URM Academy for job training and education',
      'Recovery programs for substance abuse',
      'Veteran services and support'
    ],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      accessibleBathrooms: true,
      signLanguageInterpreters: 'Available upon request'
    }
  },
  {
    _id: '2',
    name: 'Los Angeles Mission',
    description: 'Providing hope and healing to the homeless community through emergency services, recovery programs, and job training since 1936. We serve over 1,000 meals daily and provide shelter for hundreds. Our comprehensive programs include addiction recovery, job training, and permanent housing placement.',
    address: {
      street: '303 E 5th St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90013'
    },
    coordinates: {
      lat: 34.0505,
      lng: -118.2408
    },
    contact: {
      phone: '(213) 629-1227',
      email: 'info@lamission.org',
      website: 'https://lamission.org',
      emergency: '(213) 629-1227 ext. 1'
    },
    capacity: {
      totalBeds: 150,
      availableBeds: 28,
      maxCapacity: 180
    },
    services: [
      { name: 'Emergency Shelter', available: true, description: 'Safe overnight accommodation with personal storage and clean facilities' },
      { name: 'Meals', available: true, description: 'Three hot meals daily: Breakfast (7:00 AM), Lunch (12:30 PM), Dinner (6:30 PM)' },
      { name: 'Recovery Programs', available: true, description: '12-step recovery programs, individual counseling, and group therapy sessions' },
      { name: 'Job Training', available: true, description: 'Construction, culinary arts, maintenance, and customer service training with job placement assistance' },
      { name: 'Medical Care', available: true, description: 'On-site medical clinic, dental services, and mental health counseling' },
      { name: 'Case Management', available: true, description: 'Personalized case management for housing, employment, and benefits assistance' },
      { name: 'Life Skills', available: true, description: 'Financial literacy, parenting classes, and independent living skills training' },
      { name: 'Transportation', available: true, description: 'Bus passes and transportation assistance for appointments and job interviews' }
    ],
    requirements: [
      { type: 'ID Required', description: 'Valid government ID or birth certificate', mandatory: true },
      { type: 'Drug Test', description: 'Substance abuse screening for recovery programs', mandatory: false },
      { type: 'Intake Assessment', description: 'Comprehensive intake interview with case manager', mandatory: true },
      { type: 'Background Check', description: 'Criminal background screening (restrictions may apply)', mandatory: false }
    ],
    operatingHours: {
      monday: { open: '06:30', close: '22:00', closed: false },
      tuesday: { open: '06:30', close: '22:00', closed: false },
      wednesday: { open: '06:30', close: '22:00', closed: false },
      thursday: { open: '06:30', close: '22:00', closed: false },
      friday: { open: '06:30', close: '22:00', closed: false },
      saturday: { open: '07:00', close: '20:00', closed: false },
      sunday: { open: '07:00', close: '20:00', closed: false }
    },
    rating: {
      average: 4.0,
      count: 187
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
    specialPrograms: [
      'New Life Program - 12-month residential recovery program',
      'Work Experience Program - Job training and placement',
      'Family Services - Support for families with children',
      'Veteran Services - Specialized support for veterans'
    ],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      accessibleBathrooms: true,
      signLanguageInterpreters: 'Available upon request'
    }
  },
  {
    _id: '3',
    name: 'Downtown Women\'s Center',
    description: 'The only organization in Los Angeles focused exclusively on serving and empowering women experiencing homelessness. We provide safe housing, job training, and comprehensive support services.',
    address: {
      street: '442 S San Pedro St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90013'
    },
    coordinates: {
      lat: 34.0489,
      lng: -118.2421
    },
    contact: {
      phone: '(213) 680-0600',
      email: 'info@dwcweb.org',
      website: 'https://dwcweb.org'
    },
    capacity: {
      totalBeds: 80,
      availableBeds: 12
    },
    services: [
      { name: 'Women\'s Shelter', available: true, description: 'Safe space for women and children' },
      { name: 'Permanent Housing', available: true, description: 'Long-term housing solutions' },
      { name: 'Job Training', available: true, description: 'Skills development programs' },
      { name: 'Mental Health', available: true, description: 'Counseling and therapy' },
      { name: 'Childcare', available: true, description: 'Childcare services' }
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
      average: 4.5,
      count: 312
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
  },
  {
    _id: '4',
    name: 'Covenant House California',
    description: 'Serving homeless and trafficked youth ages 18-24. We provide emergency shelter, education support, job training, and comprehensive services to help young people build stable, independent lives.',
    address: {
      street: '1325 N Mission Rd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90033'
    },
    coordinates: {
      lat: 34.0736,
      lng: -118.2406
    },
    contact: {
      phone: '(323) 461-3131',
      email: 'info@covenanthouse.org',
      website: 'https://covenanthouse.org'
    },
    capacity: {
      totalBeds: 60,
      availableBeds: 8
    },
    services: [
      { name: 'Youth Shelter', available: true, description: 'Emergency shelter for ages 18-24' },
      { name: 'Education Support', available: true, description: 'GED and college preparation' },
      { name: 'Job Training', available: true, description: 'Youth employment programs' },
      { name: 'Mental Health', available: true, description: 'Counseling and therapy' },
      { name: 'Life Skills', available: true, description: 'Independent living skills' }
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
      average: 4.3,
      count: 156
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
  },
  {
    _id: '5',
    name: 'Skid Row Housing Trust',
    description: 'Providing permanent supportive housing and services to individuals experiencing homelessness in Skid Row. We offer housing, case management, and comprehensive support services.',
    address: {
      street: '2500 Wilshire Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90057'
    },
    coordinates: {
      lat: 34.0625,
      lng: -118.2756
    },
    contact: {
      phone: '(213) 683-0522',
      email: 'info@skidrow.org',
      website: 'https://skidrow.org'
    },
    capacity: {
      totalBeds: 120,
      availableBeds: 15
    },
    services: [
      { name: 'Permanent Housing', available: true, description: 'Long-term housing solutions' },
      { name: 'Case Management', available: true, description: 'Individual support services' },
      { name: 'Mental Health', available: true, description: 'Counseling and therapy' },
      { name: 'Substance Abuse', available: true, description: 'Recovery programs' },
      { name: 'Job Training', available: true, description: 'Employment services' }
    ],
    requirements: [
      { type: 'Housing First', description: 'No barriers to entry', mandatory: false },
      { type: 'ID Required', description: 'Valid government ID', mandatory: true },
      { type: 'Case Management', description: 'Ongoing support services', mandatory: true }
    ],
    operatingHours: {
      monday: { open: '08:00', close: '17:00', closed: false },
      tuesday: { open: '08:00', close: '17:00', closed: false },
      wednesday: { open: '08:00', close: '17:00', closed: false },
      thursday: { open: '08:00', close: '17:00', closed: false },
      friday: { open: '08:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '15:00', closed: false },
      sunday: { open: '09:00', close: '15:00', closed: false }
    },
    rating: {
      average: 4.1,
      count: 278
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
  },
  {
    _id: '6',
    name: 'Midnight Mission',
    description: 'Serving the homeless community in Skid Row for over 100 years. We provide emergency services, recovery programs, job training, and comprehensive support to help individuals rebuild their lives.',
    address: {
      street: '601 S San Pedro St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90013'
    },
    coordinates: {
      lat: 34.0444,
      lng: -118.2408
    },
    contact: {
      phone: '(213) 624-9258',
      email: 'info@midnightmission.org',
      website: 'https://midnightmission.org'
    },
    capacity: {
      totalBeds: 100,
      availableBeds: 18
    },
    services: [
      { name: 'Emergency Shelter', available: true, description: 'Safe overnight accommodation' },
      { name: 'Meals', available: true, description: 'Three meals daily' },
      { name: 'Recovery Programs', available: true, description: 'Substance abuse treatment' },
      { name: 'Job Training', available: true, description: 'Skills development programs' },
      { name: 'Medical Care', available: true, description: 'Health services' }
    ],
    requirements: [
      { type: 'ID Required', description: 'Valid government ID', mandatory: true },
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
      average: 4.4,
      count: 198
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
  },
  {
    _id: '7',
    name: 'Haven House',
    description: 'Providing emergency shelter and comprehensive services to families experiencing homelessness. We offer safe housing, case management, job training, and support services to help families achieve stability.',
    address: {
      street: '1234 W 3rd St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90017'
    },
    coordinates: {
      lat: 34.0522,
      lng: -118.2437
    },
    contact: {
      phone: '(213) 555-0123',
      email: 'info@havenhouse.org',
      website: 'https://havenhouse.org'
    },
    capacity: {
      totalBeds: 50,
      availableBeds: 7
    },
    services: [
      { name: 'Family Shelter', available: true, description: 'Safe space for families' },
      { name: 'Case Management', available: true, description: 'Individual support services' },
      { name: 'Job Training', available: true, description: 'Skills development programs' },
      { name: 'Childcare', available: true, description: 'Childcare services' },
      { name: 'Housing Assistance', available: true, description: 'Housing placement services' }
    ],
    requirements: [
      { type: 'Family Only', description: 'Shelter for families with children', mandatory: true },
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
      average: 4.6,
      count: 124
    },
    isActive: true,
    verificationStatus: 'verified',
    // Using professional icons instead of fake images
  }
];

export const mockJobs = [
  {
    _id: '1',
    title: 'Kitchen Assistant - Union Rescue Mission',
    description: 'Join our culinary team and help prepare and serve over 1,000 nutritious meals daily to shelter residents. Work in a supportive, mission-driven environment where your efforts directly impact the lives of those in need. This position offers excellent opportunities for growth and skill development in food service and hospitality.',
    company: {
      name: 'Union Rescue Mission',
      website: 'https://urm.org',
      description: 'Los Angeles\' oldest and largest private homeless services provider, serving the community since 1891',
      size: '50-200 employees',
      industry: 'Non-profit Social Services'
    },
    location: {
      address: {
        street: '545 S San Pedro St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90013'
      },
      isRemote: false,
      publicTransport: 'Metro Blue Line (Pico Station), Bus routes 40, 45, 60'
    },
    employment: {
      type: 'part-time',
      schedule: 'Monday-Friday, 6:00 AM - 2:00 PM (30 hours/week)',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      benefits: ['Health insurance after 90 days', 'Paid time off', 'Retirement plan', 'Employee meals']
    },
    compensation: {
      type: 'hourly',
      amount: { min: 16, max: 19 },
      currency: 'USD',
      payFrequency: 'Bi-weekly',
      overtime: 'Time and a half after 40 hours'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 0,
        description: 'No prior experience required - we provide comprehensive training'
      },
      education: {
        level: 'high-school',
        required: true,
        description: 'High school diploma or GED preferred'
      },
      skills: ['Teamwork', 'Reliability', 'Compassion', 'Physical stamina', 'Time management'],
      other: ['Must be able to lift 25 lbs', 'Food safety certification preferred (we provide training)', 'Must pass background check', 'Bilingual (Spanish/English) a plus']
    },
    application: {
      process: 'in-person',
      instructions: 'Visit our shelter during business hours (8 AM - 5 PM) to complete application and interview',
      contactInfo: {
        name: 'Maria Rodriguez, HR Coordinator',
        email: 'hr@urm.org',
        phone: '(213) 347-6300 ext. 123'
      },
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      documents: ['Resume', 'Two references', 'Valid ID', 'Social Security card']
    },
    support: {
      training: {
        provided: true,
        description: 'Comprehensive 2-week training program including food safety, kitchen operations, and customer service',
        duration: '2 weeks',
        certification: 'ServSafe Food Handler certification provided'
      },
      mentorship: true,
      resources: ['Uniforms and safety equipment provided', 'Free meal during shift', 'Transportation assistance available', 'Career advancement opportunities', 'Professional development workshops']
    },
    status: 'active',
    tags: ['kitchen', 'food-service', 'non-profit', 'entry-level', 'training-provided'],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    applicationCount: 12
  },
  {
    _id: '2',
    title: 'Maintenance Worker - LA Mission',
    description: 'General maintenance and repair work around our downtown facility. Keep our shelter safe and comfortable for hundreds of residents. Great opportunity for those with handyman skills.',
    company: {
      name: 'Los Angeles Mission',
      website: 'https://lamission.org',
      description: 'Providing hope and healing to the homeless community'
    },
    location: {
      address: {
        street: '303 E 5th St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90013'
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
      amount: { min: 19, max: 23 },
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
      instructions: 'Send resume and cover letter to hr@lamission.org',
      contactInfo: {
        name: 'James Wilson',
        email: 'hr@lamission.org',
        phone: '(213) 629-1227'
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
    title: 'Receptionist - Downtown Women\'s Center',
    description: 'Front desk receptionist for women\'s shelter. Answer phones, greet visitors, and provide administrative support. Compassionate, organized individual needed to support women experiencing homelessness.',
    company: {
      name: 'Downtown Women\'s Center',
      website: 'https://dwcweb.org',
      description: 'The only organization in LA focused exclusively on serving women experiencing homelessness'
    },
    location: {
      address: {
        street: '442 S San Pedro St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90013'
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
      amount: { min: 17, max: 21 },
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
        name: 'Sarah Chen',
        email: 'jobs@dwcweb.org',
        phone: '(213) 680-0600'
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
    title: 'Youth Counselor - Covenant House',
    description: 'Work with homeless youth ages 18-24. Provide counseling, life skills training, and support services. Make a real difference in young people\'s lives as they transition to independence.',
    company: {
      name: 'Covenant House California',
      website: 'https://covenanthouse.org',
      description: 'Serving homeless and trafficked youth in Los Angeles'
    },
    location: {
      address: {
        street: '1325 N Mission Rd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90033'
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
      amount: { min: 38000, max: 45000 },
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
      instructions: 'Send resume, cover letter, and references to careers@covenanthouse.org',
      contactInfo: {
        name: 'David Kim',
        email: 'careers@covenanthouse.org',
        phone: '(323) 461-3131'
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
    title: 'Case Manager - Skid Row Housing Trust',
    description: 'Provide case management services to individuals in permanent supportive housing. Help clients access resources, maintain housing, and achieve their goals. Make a lasting impact in people\'s lives.',
    company: {
      name: 'Skid Row Housing Trust',
      website: 'https://skidrow.org',
      description: 'Providing permanent supportive housing in Skid Row'
    },
    location: {
      address: {
        street: '2500 Wilshire Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90057'
      },
      isRemote: false
    },
    employment: {
      type: 'full-time',
      schedule: 'Monday-Friday, 8:00 AM - 5:00 PM',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    },
    compensation: {
      type: 'salary',
      amount: { min: 42000, max: 50000 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'mid-level',
        years: 2,
        description: '2+ years case management experience'
      },
      education: {
        level: 'bachelors',
        field: 'Social Work, Psychology, or related field',
        required: true
      },
      skills: ['Case Management', 'Crisis Intervention', 'Housing Services', 'Community Resources'],
      other: ['Licensed Social Worker preferred', 'Background check required', 'Valid driver\'s license']
    },
    application: {
      process: 'email',
      instructions: 'Send resume and cover letter to jobs@skidrow.org',
      contactInfo: {
        name: 'Lisa Martinez',
        email: 'jobs@skidrow.org',
        phone: '(213) 683-0522'
      },
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
    },
    support: {
      training: {
        provided: true,
        description: 'Comprehensive training in housing services and case management',
        duration: '3 weeks'
      },
      mentorship: true,
      resources: ['Professional development', 'Supervision', 'Health insurance', 'Retirement plan']
    },
    status: 'active',
    tags: ['case-management', 'housing', 'social-work', 'full-time', 'professional']
  },
  {
    _id: '4',
    title: 'Security Guard - Midnight Mission',
    description: 'Provide security services for our downtown shelter facility. Help maintain a safe environment for residents and staff. Great opportunity for those with security experience or military background.',
    company: {
      name: 'Midnight Mission',
      website: 'https://midnightmission.org',
      description: 'Serving the homeless community in Skid Row for over 100 years'
    },
    location: {
      address: {
        street: '601 S San Pedro St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90013'
      },
      isRemote: false
    },
    employment: {
      type: 'full-time',
      schedule: 'Various shifts available (Day, Evening, Night)',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 18, max: 22 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 0,
        description: 'Security experience preferred but not required'
      },
      education: {
        level: 'high-school',
        required: true
      },
      skills: ['Security', 'Communication', 'Conflict Resolution', 'First Aid'],
      other: ['Security guard license preferred', 'Background check required', 'Valid driver\'s license']
    },
    application: {
      process: 'in-person',
      instructions: 'Visit our shelter during business hours to apply',
      contactInfo: {
        name: 'James Wilson',
        email: 'security@midnightmission.org',
        phone: '(213) 624-9258'
      },
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
    },
    support: {
      training: {
        provided: true,
        description: 'Security training and certification provided',
        duration: '1 week'
      },
      mentorship: true,
      resources: ['Uniforms provided', 'Meal during shift', 'Health insurance', 'Paid time off']
    },
    status: 'active',
    tags: ['security', 'safety', 'non-profit', 'full-time', 'entry-level']
  },
  {
    _id: '5',
    title: 'Childcare Worker - Haven House',
    description: 'Provide childcare services for families staying at our shelter. Help children with homework, activities, and emotional support during their family\'s transition to stability.',
    company: {
      name: 'Haven House',
      website: 'https://havenhouse.org',
      description: 'Providing emergency shelter and comprehensive services to families'
    },
    location: {
      address: {
        street: '1234 W 3rd St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90017'
      },
      isRemote: false
    },
    employment: {
      type: 'part-time',
      schedule: 'Monday-Friday, 2:00 PM - 6:00 PM',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 17, max: 20 },
      currency: 'USD'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 0,
        description: 'Childcare experience preferred but not required'
      },
      education: {
        level: 'high-school',
        required: true
      },
      skills: ['Childcare', 'Patience', 'Communication', 'Creativity'],
      other: ['CPR certification preferred', 'Background check required', 'Must love working with children']
    },
    application: {
      process: 'email',
      instructions: 'Send resume and cover letter to childcare@havenhouse.org',
      contactInfo: {
        name: 'Sarah Chen',
        email: 'childcare@havenhouse.org',
        phone: '(213) 555-0123'
      },
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
    },
    support: {
      training: {
        provided: true,
        description: 'Childcare training and CPR certification provided',
        duration: '1 week'
      },
      mentorship: true,
      resources: ['Educational materials provided', 'Meal during shift', 'Transportation assistance available']
    },
    status: 'active',
    tags: ['childcare', 'education', 'non-profit', 'part-time', 'entry-level']
  },
  {
    _id: '7',
    title: 'Warehouse Associate - Amazon Fulfillment Center',
    description: 'Join Amazon\'s fulfillment team at our state-of-the-art facility in City of Industry. Pick, pack, and ship customer orders using cutting-edge technology. This is an excellent opportunity to start a career in logistics and operations with one of the world\'s leading companies. We offer competitive benefits, career advancement opportunities, and a supportive work environment.',
    company: {
      name: 'Amazon',
      website: 'https://amazon.com',
      description: 'Global e-commerce and technology company, Fortune 500 company',
      size: '1,000,000+ employees',
      industry: 'E-commerce and Technology'
    },
    location: {
      address: {
        street: '19100 Krameria Ave',
        city: 'City of Industry',
        state: 'CA',
        zipCode: '91789'
      },
      isRemote: false,
      publicTransport: 'Metro Gold Line (Industry Station), Bus routes 280, 282'
    },
    employment: {
      type: 'full-time',
      schedule: 'Various shifts available: Day (7:00 AM - 5:30 PM), Evening (5:30 PM - 4:00 AM), Night (6:00 PM - 4:30 AM)',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      benefits: ['Health, dental, and vision insurance', '401(k) with company match', 'Paid time off', 'Holiday pay', 'Employee discount', 'Career advancement opportunities']
    },
    compensation: {
      type: 'hourly',
      amount: { min: 18, max: 21 },
      currency: 'USD',
      payFrequency: 'Weekly',
      overtime: 'Time and a half after 40 hours',
      shiftDifferential: 'Night shift premium: +$1.50/hour'
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 0,
        description: 'No prior experience required - we provide comprehensive training'
      },
      education: {
        level: 'high-school',
        required: true,
        description: 'High school diploma or GED required'
      },
      skills: ['Physical Stamina', 'Attention to Detail', 'Teamwork', 'Reliability', 'Basic computer skills'],
      other: ['Must be able to lift 50 lbs', 'Stand for long periods (8-10 hours)', 'Work in fast-paced environment', 'Must pass drug test', 'Background check required', 'Must be 18+ years old']
    },
    application: {
      process: 'online',
      instructions: 'Apply online at amazon.jobs or visit our hiring center at the facility',
      contactInfo: {
        name: 'Amazon Recruiting Team',
        email: 'recruiting@amazon.com',
        phone: '1-800-AMAZON',
        hiringCenter: '19100 Krameria Ave, City of Industry, CA 91789'
      },
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      documents: ['Resume', 'Valid ID', 'Social Security card', 'Direct deposit information']
    },
    support: {
      training: {
        provided: true,
        description: 'Comprehensive 1-week training program including safety protocols, warehouse operations, and technology systems',
        duration: '1 week',
        certification: 'Forklift certification available for qualified candidates'
      },
      mentorship: true,
      resources: ['Health insurance from day 1', '401(k) with company match', 'Paid time off', 'Career advancement opportunities', 'Tuition assistance program', 'Employee assistance program']
    },
    status: 'active',
    tags: ['warehouse', 'logistics', 'entry-level', 'full-time', 'benefits', 'career-growth'],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    applicationCount: 45
  },
  {
    _id: '8',
    title: 'Restaurant Server - The Cheesecake Factory',
    description: 'Join our team at The Cheesecake Factory in Westfield Century City. Provide excellent customer service in a fast-paced restaurant environment. Great tips and flexible scheduling available.',
    company: {
      name: 'The Cheesecake Factory',
      website: 'https://thecheesecakefactory.com',
      description: 'Full-service restaurant chain known for extensive menu and desserts'
    },
    location: {
      address: {
        street: '10250 Santa Monica Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90067'
      },
      isRemote: false
    },
    employment: {
      type: 'part-time',
      schedule: 'Flexible scheduling, evenings and weekends',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    compensation: {
      type: 'hourly',
      amount: { min: 15, max: 18 },
      currency: 'USD',
      tips: true
    },
    requirements: {
      experience: {
        level: 'entry-level',
        years: 0,
        description: 'Restaurant experience preferred but not required'
      },
      education: {
        level: 'high-school',
        required: true
      },
      skills: ['Customer Service', 'Communication', 'Multi-tasking', 'Teamwork'],
      other: ['Must be 18+', 'Food handler certification required', 'Weekend availability required']
    },
    application: {
      process: 'in-person',
      instructions: 'Apply in person at the restaurant during business hours',
      contactInfo: {
        name: 'Restaurant Manager',
        email: 'careers@thecheesecakefactory.com',
        phone: '(310) 277-7275'
      },
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
    },
    support: {
      training: {
        provided: true,
        description: 'Server training and food safety certification',
        duration: '3 days'
      },
      mentorship: true,
      resources: ['Employee meals', 'Flexible scheduling', 'Career advancement opportunities']
    },
    status: 'active',
    tags: ['restaurant', 'customer-service', 'part-time', 'tips', 'flexible']
  }
];

// Mock API service for demo
export const mockShelterService = {
  getShelters: async (params = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      shelters: mockShelters,
      pagination: {
        current: 1,
        pages: 1,
        total: mockShelters.length,
        hasNext: false,
        hasPrev: false
      }
    };
  },
  
  getShelter: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockShelters.find(shelter => shelter._id === id);
  }
};

export const mockJobService = {
  getJobs: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      jobs: mockJobs,
      pagination: {
        current: 1,
        pages: 1,
        total: mockJobs.length,
        hasNext: false,
        hasPrev: false
      }
    };
  },
  
  getJob: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockJobs.find(job => job._id === id);
  }
};

// Mock ratings data with real reviews
export const mockRatings = {
  '1': [
    {
      _id: 'r1',
      shelter: '1',
      individual: {
        personalInfo: {
          firstName: 'Maria',
          lastName: 'Gonzalez'
        }
      },
      overallRating: 5,
      review: {
        content: 'review1'
      },
      createdAt: new Date('2024-01-15')
    },
    {
      _id: 'r2',
      shelter: '1',
      individual: {
        personalInfo: {
          firstName: 'James',
          lastName: 'Wilson'
        }
      },
      overallRating: 4,
      review: {
        content: 'review2'
      },
      createdAt: new Date('2024-01-10')
    },
    {
      _id: 'r3',
      shelter: '1',
      individual: {
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Johnson'
        }
      },
      overallRating: 5,
      review: {
        content: 'review3'
      },
      createdAt: new Date('2024-01-05')
    }
  ],
  '2': [
    {
      _id: 'r4',
      shelter: '2',
      individual: {
        personalInfo: {
          firstName: 'Michael',
          lastName: 'Brown'
        }
      },
      overallRating: 4,
      review: {
        content: 'review4'
      },
      createdAt: new Date('2024-01-12')
    },
    {
      _id: 'r5',
      shelter: '2',
      individual: {
        personalInfo: {
          firstName: 'Lisa',
          lastName: 'Davis'
        }
      },
      overallRating: 5,
      review: {
        content: 'review5'
      },
      createdAt: new Date('2024-01-08')
    }
  ],
  '3': [
    {
      _id: 'r6',
      shelter: '3',
      individual: {
        personalInfo: {
          firstName: 'Jennifer',
          lastName: 'Martinez'
        }
      },
      overallRating: 5,
      review: {
        content: 'review6'
      },
      createdAt: new Date('2024-01-14')
    },
    {
      _id: 'r7',
      shelter: '3',
      individual: {
        personalInfo: {
          firstName: 'Amanda',
          lastName: 'Taylor'
        }
      },
      overallRating: 5,
      review: {
        content: 'review7'
      },
      createdAt: new Date('2024-01-09')
    }
  ],
  '4': [
    {
      _id: 'r8',
      shelter: '4',
      individual: {
        personalInfo: {
          firstName: 'Alex',
          lastName: 'Rodriguez'
        }
      },
      overallRating: 5,
      review: {
        content: 'review8'
      },
      createdAt: new Date('2024-01-11')
    },
    {
      _id: 'r9',
      shelter: '4',
      individual: {
        personalInfo: {
          firstName: 'Jordan',
          lastName: 'Smith'
        }
      },
      overallRating: 4,
      review: {
        content: 'review9'
      },
      createdAt: new Date('2024-01-07')
    }
  ],
  '5': [
    {
      _id: 'r10',
      shelter: '5',
      individual: {
        personalInfo: {
          firstName: 'Robert',
          lastName: 'Garcia'
        }
      },
      overallRating: 4,
      review: {
        content: 'review10'
      },
      createdAt: new Date('2024-01-13')
    },
    {
      _id: 'r11',
      shelter: '5',
      individual: {
        personalInfo: {
          firstName: 'David',
          lastName: 'Lee'
        }
      },
      overallRating: 5,
      review: {
        content: 'review11'
      },
      createdAt: new Date('2024-01-06')
    }
  ]
};

export const mockRatingService = {
  getShelterRatings: async (shelterId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ratings: mockRatings[shelterId] || []
    };
  }
};
