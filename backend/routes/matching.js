/**
 * POST /api/match
 * Uses Google Gemini to rank shelters based on a user's needs profile.
 * Falls back to weighted scoring if the API is unavailable.
 */

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Shelter = require('../models/Shelter');

const router = express.Router();

// ─── Fallback: weighted scoring (no AI) ──────────────────────────────────────

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const NEED_KEYWORDS = {
  housing:           ['shelter', 'housing', 'emergency'],
  employment:        ['job', 'employment', 'training', 'vocational'],
  mental_health:     ['mental', 'counseling', 'therapy'],
  substance_abuse:   ['recovery', 'substance', 'addiction'],
  domestic_violence: ['domestic', 'violence', 'women'],
  food_assistance:   ['meal', 'food', 'nutrition'],
  clothing:          ['clothing', 'clothes'],
  transportation:    ['transportation', 'transit', 'bus'],
  legal_aid:         ['legal', 'law'],
  medical_care:      ['medical', 'health', 'clinic'],
};

function weightedFallback(shelters, needs, specialRequirements, userLat, userLng) {
  return shelters.map(shelter => {
    const svcText = shelter.services.filter(s => s.available !== false).map(s => s.name.toLowerCase()).join(' ');
    let matched = 0;
    for (const need of needs) {
      const kws = NEED_KEYWORDS[need] || [need.replace('_', ' ')];
      if (kws.some(k => svcText.includes(k))) matched++;
    }
    const svcScore = needs.length ? matched / needs.length : 0.5;
    const coords = shelter.address?.coordinates;
    const dist = userLat && userLng && coords?.lat && coords?.lng
      ? haversine(userLat, userLng, coords.lat, coords.lng) : null;
    const distScore = dist === null ? 0.5 : Math.max(0, 1 - dist / 25);
    const availScore = shelter.capacity.totalBeds ? shelter.capacity.availableBeds / shelter.capacity.totalBeds : 0;
    const ratingScore = (shelter.rating?.average || 0) / 5;
    const total = svcScore * 0.40 + distScore * 0.30 + availScore * 0.20 + ratingScore * 0.10;

    return {
      shelter,
      matchScore: Math.round(total * 100),
      distanceMiles: dist !== null ? Math.round(dist * 10) / 10 : null,
      reasoning: `${Math.round(svcScore * 100)}% service match · ${shelter.capacity.availableBeds} beds available · ${shelter.rating?.average?.toFixed(1) || 'N/A'}★`,
      breakdown: {
        serviceMatch: Math.round(svcScore * 100),
        distance: Math.round(distScore * 100),
        availability: Math.round(availScore * 100),
        rating: Math.round(ratingScore * 100),
      },
    };
  })
  .filter(r => r.shelter.capacity.availableBeds > 0)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 5);
}

// ─── Gemini matching ──────────────────────────────────────────────────────────

async function geminiMatch(shelters, profile, userLat, userLng) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Build a compact shelter summary for the prompt
  const shelterSummaries = shelters.map((s, i) => {
    const coords = s.address?.coordinates;
    const dist = userLat && userLng && coords?.lat && coords?.lng
      ? `${haversine(userLat, userLng, coords.lat, coords.lng).toFixed(1)} miles away`
      : 'distance unknown';
    return `${i + 1}. ${s.name} (ID: ${s._id})
   Services: ${s.services.filter(sv => sv.available !== false).map(sv => sv.name).join(', ')}
   Available beds: ${s.capacity.availableBeds}/${s.capacity.totalBeds}
   Rating: ${s.rating?.average?.toFixed(1) || 'N/A'}/5 (${s.rating?.count || 0} reviews)
   Distance: ${dist}
   Description: ${s.description?.slice(0, 120)}...`;
  }).join('\n\n');

  const prompt = `You are a shelter matching assistant for ShelterLink, a platform that connects homeless individuals with shelters in Los Angeles.

A person needs help finding the best shelter. Here is their profile:
- Name: ${profile.name}
- Needs: ${profile.needs.join(', ')}
- Special requirements: ${profile.specialRequirements?.join(', ') || 'none'}
- Family size: ${profile.familySize}
- Employment status: ${profile.employmentStatus}
- Urgency: ${profile.urgencyLevel?.replace('_', ' ')}

Here are the available shelters:

${shelterSummaries}

Rank ALL shelters from best to worst match for this person. For each shelter return:
- id: the shelter ID exactly as shown
- matchScore: integer 0-100
- reasoning: one sentence explaining why this shelter fits (mention specific services, distance, or availability)

Respond ONLY with valid JSON in this exact format, no markdown, no explanation:
{
  "matches": [
    { "id": "...", "matchScore": 85, "reasoning": "..." },
    ...
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(clean);

  // Merge Gemini scores back onto full shelter objects
  return parsed.matches
    .map(m => {
      const shelter = shelters.find(s => s._id?.toString() === m.id?.toString());
      if (!shelter) return null;
      const coords = shelter.address?.coordinates;
      const dist = userLat && userLng && coords?.lat && coords?.lng
        ? Math.round(haversine(userLat, userLng, coords.lat, coords.lng) * 10) / 10
        : null;
      return {
        shelter,
        matchScore: m.matchScore,
        distanceMiles: dist,
        reasoning: m.reasoning,
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}

// ─── Route ────────────────────────────────────────────────────────────────────

router.post('/', async (req, res) => {
  try {
    const {
      needs = [],
      specialRequirements = [],
      userLat,
      userLng,
      familySize = 1,
      name = 'User',
      employmentStatus = 'unemployed',
      urgencyLevel = 'planning_ahead',
    } = req.body;

    const shelters = await Shelter.find({
      isActive: true,
      verificationStatus: 'verified',
    }).lean();

    if (!shelters.length) {
      return res.json({ matches: [], source: 'empty' });
    }

    const profile = { name, needs, specialRequirements, familySize, employmentStatus, urgencyLevel };

    let matches;
    let source;

    if (process.env.GEMINI_API_KEY) {
      try {
        matches = await geminiMatch(shelters, profile, userLat, userLng);
        source = 'gemini';
      } catch (aiErr) {
        console.error('Gemini error, falling back to weighted scoring:', aiErr.message);
        matches = weightedFallback(shelters, needs, specialRequirements, userLat, userLng);
        source = 'weighted-fallback';
      }
    } else {
      matches = weightedFallback(shelters, needs, specialRequirements, userLat, userLng);
      source = 'weighted';
    }

    res.json({ matches, source });
  } catch (err) {
    console.error('Matching error:', err);
    res.status(500).json({ message: 'Error running matching algorithm' });
  }
});

module.exports = router;
