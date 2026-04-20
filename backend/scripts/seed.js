/**
 * Seed script — populates MongoDB with shelter, job, and staff user data.
 * Run with: node backend/scripts/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Shelter = require('../models/Shelter');
const Job = require('../models/Job');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shelter-match';

// ─── Shelter seed data ────────────────────────────────────────────────────────

const shelterSeeds = [
  {
    staff: { email: 'staff@urm.org', password: 'staff123' },
    shelter: {
      name: 'Union Rescue Mission',
      description: "Los Angeles' oldest and largest private homeless services provider, serving the community since 1891. We offer emergency shelter, three meals daily, medical care, job training, and comprehensive support services.",
      address: { street: '545 S San Pedro St', city: 'Los Angeles', state: 'CA', zipCode: '90013', coordinates: { lat: 34.0522, lng: -118.2437 } },
      contact: { phone: '(213) 347-6300', email: 'info@urm.org', website: 'https://urm.org' },
      capacity: { totalBeds: 200, availableBeds: 45 },
      services: [
        { name: 'Emergency Shelter', available: true, description: 'Safe overnight accommodation' },
        { name: 'Meals', available: true, description: 'Three nutritious meals daily' },
        { name: 'Medical Care', available: true, description: 'On-site medical clinic' },
        { name: 'Job Training', available: true, description: 'Culinary arts and maintenance training' },
        { name: 'Counseling', available: true, description: 'Individual and group counseling' },
        { name: 'Case Management', available: true, description: 'Personalized case management' },
        { name: 'Childcare', available: true, description: 'Supervised childcare' },
        { name: 'Transportation', available: true, description: 'Bus tokens and transportation assistance' },
      ],
      requirements: [
        { type: 'ID Required', description: 'Valid government ID or birth certificate', mandatory: true },
        { type: 'Intake Interview', description: 'Comprehensive intake assessment', mandatory: true },
      ],
      operatingHours: {
        monday: { open: '06:00', close: '22:00', closed: false },
        tuesday: { open: '06:00', close: '22:00', closed: false },
        wednesday: { open: '06:00', close: '22:00', closed: false },
        thursday: { open: '06:00', close: '22:00', closed: false },
        friday: { open: '06:00', close: '22:00', closed: false },
        saturday: { open: '07:00', close: '20:00', closed: false },
        sunday: { open: '07:00', close: '20:00', closed: false },
      },
      rating: { average: 4.2, count: 234 },
      isActive: true,
      verificationStatus: 'verified',
    },
  },
  {
    staff: { email: 'staff@lamission.org', password: 'staff123' },
    shelter: {
      name: 'Los Angeles Mission',
      description: 'Providing hope and healing to the homeless community through emergency services, recovery programs, and job training since 1936.',
      address: { street: '303 E 5th St', city: 'Los Angeles', state: 'CA', zipCode: '90013', coordinates: { lat: 34.0505, lng: -118.2408 } },
      contact: { phone: '(213) 629-1227', email: 'info@lamission.org', website: 'https://lamission.org' },
      capacity: { totalBeds: 150, availableBeds: 28 },
      services: [
        { name: 'Emergency Shelter', available: true, description: 'Emergency overnight shelter' },
        { name: 'Meals', available: true, description: 'Over 1,000 meals served daily' },
        { name: 'Recovery Programs', available: true, description: 'Substance abuse recovery' },
        { name: 'Job Training', available: true, description: 'Vocational training programs' },
        { name: 'Medical Care', available: true, description: 'Medical and dental services' },
        { name: 'Legal Aid', available: true, description: 'Legal assistance services' },
      ],
      requirements: [
        { type: 'ID Required', description: 'Valid government ID', mandatory: true },
        { type: 'Intake Interview', description: 'Intake assessment required', mandatory: true },
      ],
      operatingHours: {
        monday: { open: '06:00', close: '22:00', closed: false },
        tuesday: { open: '06:00', close: '22:00', closed: false },
        wednesday: { open: '06:00', close: '22:00', closed: false },
        thursday: { open: '06:00', close: '22:00', closed: false },
        friday: { open: '06:00', close: '22:00', closed: false },
        saturday: { open: '07:00', close: '20:00', closed: false },
        sunday: { open: '07:00', close: '20:00', closed: false },
      },
      rating: { average: 4.5, count: 189 },
      isActive: true,
      verificationStatus: 'verified',
    },
  },
  {
    staff: { email: 'staff@dwcweb.org', password: 'staff123' },
    shelter: {
      name: "Downtown Women's Center",
      description: "The only organization in Los Angeles exclusively dedicated to serving and empowering women experiencing homelessness. We provide comprehensive services in a safe, trauma-informed environment.",
      address: { street: '442 S San Pedro St', city: 'Los Angeles', state: 'CA', zipCode: '90013', coordinates: { lat: 34.0438, lng: -118.2509 } },
      contact: { phone: '(213) 613-4000', email: 'info@dwcweb.org', website: 'https://dwcweb.org' },
      capacity: { totalBeds: 75, availableBeds: 12 },
      services: [
        { name: 'Women Only Shelter', available: true, description: 'Safe shelter exclusively for women' },
        { name: 'Meals', available: true, description: 'Three meals daily' },
        { name: 'Medical Care', available: true, description: 'Health and wellness services' },
        { name: 'Mental Health', available: true, description: 'Trauma-informed mental health services' },
        { name: 'Case Management', available: true, description: 'Personalized support services' },
        { name: 'Job Training', available: true, description: 'Employment readiness programs' },
      ],
      requirements: [
        { type: 'Women Only', description: 'Shelter exclusively for women', mandatory: true },
        { type: 'ID Required', description: 'Valid government ID', mandatory: true },
      ],
      operatingHours: {
        monday: { open: '07:00', close: '21:00', closed: false },
        tuesday: { open: '07:00', close: '21:00', closed: false },
        wednesday: { open: '07:00', close: '21:00', closed: false },
        thursday: { open: '07:00', close: '21:00', closed: false },
        friday: { open: '07:00', close: '21:00', closed: false },
        saturday: { open: '08:00', close: '18:00', closed: false },
        sunday: { open: '08:00', close: '18:00', closed: false },
      },
      rating: { average: 4.7, count: 156 },
      isActive: true,
      verificationStatus: 'verified',
    },
  },
  {
    staff: { email: 'staff@havenhouse.org', password: 'staff123' },
    shelter: {
      name: 'Haven House',
      description: 'Providing emergency shelter and comprehensive services to families experiencing homelessness. We offer safe housing, case management, job training, and support services to help families achieve stability.',
      address: { street: '1234 W 3rd St', city: 'Los Angeles', state: 'CA', zipCode: '90017', coordinates: { lat: 34.0677, lng: -118.2600 } },
      contact: { phone: '(213) 555-0123', email: 'info@havenhouse.org', website: 'https://havenhouse.org' },
      capacity: { totalBeds: 50, availableBeds: 7 },
      services: [
        { name: 'Family Shelter', available: true, description: 'Safe space for families with children' },
        { name: 'Case Management', available: true, description: 'Individual support services' },
        { name: 'Job Training', available: true, description: 'Skills development programs' },
        { name: 'Childcare', available: true, description: 'Childcare during program participation' },
        { name: 'Housing Assistance', available: true, description: 'Housing placement services' },
      ],
      requirements: [
        { type: 'Family Only', description: 'Shelter for families with children', mandatory: true },
        { type: 'ID Required', description: 'Valid government ID', mandatory: true },
        { type: 'Intake Interview', description: 'Comprehensive intake process', mandatory: true },
      ],
      operatingHours: {
        monday: { open: '08:00', close: '20:00', closed: false },
        tuesday: { open: '08:00', close: '20:00', closed: false },
        wednesday: { open: '08:00', close: '20:00', closed: false },
        thursday: { open: '08:00', close: '20:00', closed: false },
        friday: { open: '08:00', close: '20:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '09:00', close: '18:00', closed: false },
      },
      rating: { average: 4.6, count: 124 },
      isActive: true,
      verificationStatus: 'verified',
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function seedShelters() {
  const shelterIds = [];

  for (const seed of shelterSeeds) {
    // Create or find staff user
    let user = await User.findOne({ email: seed.staff.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(seed.staff.password, 10);
      user = await User.create({
        email: seed.staff.email,
        password: hashedPassword,
        userType: 'shelter',
        isVerified: true,
        isActive: true,
      });
    }

    // Create or update shelter
    let shelter = await Shelter.findOne({ user: user._id });
    if (!shelter) {
      shelter = await Shelter.create({ user: user._id, ...seed.shelter });
      console.log(`  Created shelter: ${shelter.name}`);
    } else {
      // Update capacity so it reflects current values
      shelter.capacity = seed.shelter.capacity;
      await shelter.save();
      console.log(`  Updated shelter: ${shelter.name}`);
    }

    shelterIds.push({ shelterId: shelter._id, shelterName: shelter.name, userId: user._id });
  }

  return shelterIds;
}

async function seedJobs(shelterIds) {
  // Map shelter names to IDs and user IDs
  const shelterMap = {};
  for (const s of shelterIds) {
    shelterMap[s.shelterName] = { shelterId: s.shelterId, userId: s.userId };
  }

  const now = Date.now();
  const jobSeeds = [
    {
      shelterName: 'Union Rescue Mission',
      title: 'Kitchen Assistant',
      description: 'Join our culinary team and help prepare and serve over 1,000 nutritious meals daily to shelter residents. This position offers excellent opportunities for growth and skill development in food service and hospitality.',
      company: { name: 'Union Rescue Mission', website: 'https://urm.org', description: "LA's oldest and largest private homeless services provider" },
      location: { address: { street: '545 S San Pedro St', city: 'Los Angeles', state: 'CA', zipCode: '90013' }, coordinates: { lat: 34.0522, lng: -118.2437 }, isRemote: false },
      employment: { type: 'part-time', schedule: 'Mon–Fri, 6:00 AM – 2:00 PM', startDate: new Date(now + 7 * 86400000) },
      compensation: { type: 'hourly', amount: { min: 16, max: 19 }, benefits: ['Health insurance after 90 days', 'Paid time off', 'Employee meals'] },
      requirements: { experience: { level: 'entry-level', years: 0, description: 'No prior experience required' }, education: { level: 'high-school', required: false }, skills: ['Teamwork', 'Reliability', 'Physical stamina'] },
      application: { process: 'in-person', deadline: new Date(now + 14 * 86400000), instructions: 'Visit shelter 8 AM–5 PM to apply' },
      status: 'active',
    },
    {
      shelterName: 'Los Angeles Mission',
      title: 'Maintenance Worker',
      description: 'General maintenance and repair work at our downtown facility. Keep our shelter safe and comfortable for hundreds of residents.',
      company: { name: 'Los Angeles Mission', website: 'https://lamission.org', description: 'Providing hope and healing to the homeless community' },
      location: { address: { street: '303 E 5th St', city: 'Los Angeles', state: 'CA', zipCode: '90013' }, coordinates: { lat: 34.0505, lng: -118.2408 }, isRemote: false },
      employment: { type: 'full-time', schedule: 'Mon–Fri, 8:00 AM – 4:00 PM', startDate: new Date(now + 3 * 86400000) },
      compensation: { type: 'hourly', amount: { min: 19, max: 23 } },
      requirements: { experience: { level: 'mid-level', years: 2, description: '2+ years maintenance experience preferred' }, education: { level: 'high-school', required: true }, skills: ['Plumbing', 'Electrical', 'Carpentry'] },
      application: { process: 'email', deadline: new Date(now + 10 * 86400000), instructions: 'Send resume to hr@lamission.org' },
      status: 'active',
    },
    {
      shelterName: "Downtown Women's Center",
      title: 'Receptionist / Front Desk',
      description: "Front desk receptionist for women's shelter. Answer phones, greet visitors, and provide administrative support in a compassionate, trauma-informed environment.",
      company: { name: "Downtown Women's Center", website: 'https://dwcweb.org', description: 'Dedicated to serving and empowering women experiencing homelessness' },
      location: { address: { street: '442 S San Pedro St', city: 'Los Angeles', state: 'CA', zipCode: '90013' }, coordinates: { lat: 34.0438, lng: -118.2509 }, isRemote: false },
      employment: { type: 'full-time', schedule: 'Mon–Fri, 9:00 AM – 5:00 PM', startDate: new Date(now + 5 * 86400000) },
      compensation: { type: 'hourly', amount: { min: 18, max: 21 }, benefits: ['Health insurance', 'Paid time off', 'Professional development'] },
      requirements: { experience: { level: 'entry-level', years: 1, description: '1 year office or customer service experience preferred' }, education: { level: 'high-school', required: true }, skills: ['Communication', 'Organization', 'Compassion', 'Bilingual (Spanish/English) a plus'] },
      application: { process: 'email', deadline: new Date(now + 21 * 86400000), instructions: 'Email resume to jobs@dwcweb.org' },
      status: 'active',
    },
    {
      shelterName: 'Haven House',
      title: 'Case Manager',
      description: 'Provide comprehensive case management services to families experiencing homelessness. Help families navigate resources, set goals, and move toward stable housing.',
      company: { name: 'Haven House', website: 'https://havenhouse.org', description: 'Shelter and support services for families' },
      location: { address: { street: '1234 W 3rd St', city: 'Los Angeles', state: 'CA', zipCode: '90017' }, coordinates: { lat: 34.0677, lng: -118.2600 }, isRemote: false },
      employment: { type: 'full-time', schedule: 'Mon–Fri, 8:00 AM – 5:00 PM', startDate: new Date(now + 14 * 86400000) },
      compensation: { type: 'salary', amount: { min: 45000, max: 55000 }, benefits: ['Full health benefits', 'Retirement plan', '15 days PTO'] },
      requirements: { experience: { level: 'mid-level', years: 2, description: '2+ years in social services or case management' }, education: { level: 'bachelors', required: true }, skills: ['Case Management', 'Crisis Intervention', 'Resource Navigation', 'Report Writing'] },
      application: { process: 'online', deadline: new Date(now + 30 * 86400000), instructions: 'Apply at havenhouse.org/careers' },
      status: 'active',
    },
    {
      shelterName: 'Union Rescue Mission',
      title: 'Security Officer',
      description: 'Maintain safety and security at our shelter facility. Ensure a safe environment for residents and staff through monitoring, conflict de-escalation, and emergency response.',
      company: { name: 'Union Rescue Mission', website: 'https://urm.org', description: "LA's oldest and largest private homeless services provider" },
      location: { address: { street: '545 S San Pedro St', city: 'Los Angeles', state: 'CA', zipCode: '90013' }, coordinates: { lat: 34.0522, lng: -118.2437 }, isRemote: false },
      employment: { type: 'full-time', schedule: 'Night shift: 10:00 PM – 6:00 AM', startDate: new Date(now + 7 * 86400000) },
      compensation: { type: 'hourly', amount: { min: 20, max: 24 }, benefits: ['Overtime available', 'Paid training', 'Health insurance'] },
      requirements: { experience: { level: 'entry-level', years: 0, description: 'Security experience preferred but not required' }, education: { level: 'high-school', required: true }, skills: ['De-escalation', 'Communication', 'Reliability', 'Physical fitness'] },
      application: { process: 'in-person', deadline: new Date(now + 14 * 86400000), instructions: 'Apply in person Mon–Fri 9 AM–4 PM' },
      status: 'active',
    },
  ];

  for (const jobSeed of jobSeeds) {
    const entry = shelterMap[jobSeed.shelterName];
    if (!entry) {
      console.log(`  Skipping job "${jobSeed.title}" — shelter not found`);
      continue;
    }

    const exists = await Job.findOne({ shelter: entry.shelterId, title: jobSeed.title });
    if (!exists) {
      await Job.create({ shelter: entry.shelterId, postedBy: entry.userId, ...jobSeed });
      console.log(`  Created job: ${jobSeed.title} @ ${jobSeed.shelterName}`);
    } else {
      console.log(`  Skipped job (already exists): ${jobSeed.title}`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.\n');

  console.log('Seeding shelters...');
  const shelterIds = await seedShelters();

  console.log('\nSeeding jobs...');
  await seedJobs(shelterIds);

  console.log('\nDone! Seed complete.');
  console.log('\nStaff login credentials:');
  shelterSeeds.forEach(s => {
    console.log(`  ${s.shelter.name}: ${s.staff.email} / ${s.staff.password}`);
  });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
