const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));
// Serve static character assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

/**
 * Lightweight heuristic for character companion personalization.
 * Analyzes the user's name only as an approximate, non-intrusive hint.
 */
function determineCompanion(name) {
  const cleanName = (name || '').trim().toLowerCase();
  const firstName = cleanName.split(/\s+/)[0];

  // Specific common female names (global & Indian)
  const femaleNames = new Set([
    'priya', 'ananya', 'shreya', 'sneha', 'pooja', 'neha', 'divya', 'rhea',
    'riya', 'tanvi', 'isha', 'aarti', 'kavya', 'meera', 'aditi', 'swati',
    'sarah', 'emma', 'olivia', 'mia', 'sophia', 'isabella', 'charlotte',
    'amelia', 'harper', 'evelyn', 'abigail', 'emily', 'elizabeth', 'chloe',
    'maya', 'aanya', 'diya', 'sakshi', 'simran', 'komal', 'sunita', 'radha',
    'deepika', 'katrina', 'anushka', 'alia', 'kriti', 'sonam', 'rashmika'
  ]);

  // Specific common male names (global & Indian)
  const maleNames = new Set([
    'aarav', 'aditya', 'rahul', 'rohan', 'arjun', 'amit', 'vikram', 'karan',
    'varun', 'sid', 'siddharth', 'ayush', 'dev', 'kabir', 'dhruv', 'manish',
    'raj', 'rohit', 'sachin', 'virat', 'shivam', 'harsh', 'pranav', 'nihal',
    'alex', 'john', 'david', 'michael', 'james', 'robert', 'william', 'lucas',
    'liam', 'noah', 'oliver', 'henry', 'daniel', 'ethan', 'matthew', 'sam'
  ]);

  let gender = 'neutral';

  if (femaleNames.has(firstName)) {
    gender = 'female';
  } else if (maleNames.has(firstName)) {
    gender = 'male';
  } else {
    // Suffix rules for gentle heuristic
    if (firstName.endsWith('a') || firstName.endsWith('i') || firstName.endsWith('ee') || 
        firstName.endsWith('ya') || firstName.endsWith('shree') || firstName.endsWith('ika') ||
        firstName.endsWith('ita') || firstName.endsWith('ine') || firstName.endsWith('elle')) {
      // Exclude some common male exceptions ending in a/i
      const maleExceptions = new Set(['krishna', 'shiva', 'rama', 'ravi', 'ali', 'eli', 'luka', 'luca', 'ezra']);
      if (!maleExceptions.has(firstName)) {
        gender = 'female';
      } else {
        gender = 'male';
      }
    } else if (firstName.endsWith('av') || firstName.endsWith('am') || firstName.endsWith('an') ||
               firstName.endsWith('esh') || firstName.endsWith('ik') || firstName.endsWith('it') ||
               firstName.endsWith('raj') || firstName.endsWith('deep') || firstName.endsWith('arth') ||
               firstName.endsWith('el') || firstName.endsWith('on') || firstName.endsWith('er')) {
      gender = 'male';
    }
  }

  if (gender === 'female') {
    return {
      gender: 'female',
      name: 'Tara - Cosmic Starlight',
      avatar: '/assets/characters/character-female.svg',
      title: 'Your Cosmic Starlight Guide',
      note: 'Soft starlight intuition attuned to your feelings'
    };
  } else if (gender === 'male') {
    return {
      gender: 'male',
      name: 'Aditya - Solar Voyager',
      avatar: '/assets/characters/character-male.svg',
      title: 'Your Solar Voyager Companion',
      note: 'Radiant warmth guiding you through dark skies'
    };
  } else {
    return {
      gender: 'neutral',
      name: 'Nova - Astral Spark',
      avatar: '/assets/characters/character-neutral.svg',
      title: 'Your Celestial Astral Guide',
      note: 'Peaceful celestial spark illuminating your journey'
    };
  }
}

/**
 * Checks if problem hints at an immediate emergency/crisis.
 */
function checkForCrisis(text) {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'harm myself',
    'self-harm', 'cutting myself', 'can\'t go on living', 'better off dead'
  ];
  const lower = (text || '').toLowerCase();
  return crisisKeywords.some(keyword => lower.includes(keyword));
}

/**
 * Intelligent contextual fallback response generator.
 * Emulates the exact system prompt rules when no API key is supplied or API is unavailable.
 */
function generateContextualResponse(name, problem, isCrisis) {
  const probLower = problem.toLowerCase();
  const userName = name.trim();

  if (isCrisis) {
    return {
      understandingYou: `Dear ${userName}, I hear the heavy pain and darkness in what you shared, and my heart reaches out to you with deep care. You are not alone in this difficult moment.`,
      wordsForYou: `Please remember that your life has sacred value. When things feel unbearable, it is crucial to reach out to someone who can truly support you right now. Please talk with a trusted friend, family member, or connect immediately with a free, confidential crisis helpline like Tele-MANAS (14416) or Vandrevala Foundation (9999 666 555), or 988 if you are in the US/Canada. They have kind people ready to listen and help you through this night.`,
      rememberThis: `You are worthy of care, warmth, and safe support. Please hold on and reach out for help today.`,
      fullText: `Understanding You\nDear ${userName}, I hear the heavy pain in what you shared, and my heart reaches out to you with deep care.\n\nA Few Words for You\nPlease remember that your life has sacred value. When things feel unbearable, please connect with a trusted person or free crisis helpline like Tele-MANAS (14416) or 988. They have caring people ready to listen.\n\nRemember This\nYou are worthy of care and safe support. Please hold on and let someone walk with you.`
    };
  }

  // Identify emotional themes
  let theme = 'general';
  if (probLower.includes('exam') || probLower.includes('study') || probLower.includes('test') || probLower.includes('college') || probLower.includes('marks') || probLower.includes('fail')) {
    theme = 'academic';
  } else if (probLower.includes('alone') || probLower.includes('lonely') || probLower.includes('nobody') || probLower.includes('isolated') || probLower.includes('friend')) {
    theme = 'loneliness';
  } else if (probLower.includes('job') || probLower.includes('work') || probLower.includes('career') || probLower.includes('boss') || probLower.includes('interview') || probLower.includes('money') || probLower.includes('fired')) {
    theme = 'career';
  } else if (probLower.includes('breakup') || probLower.includes('love') || probLower.includes('relationship') || probLower.includes('heart') || probLower.includes('divorce') || probLower.includes('cheated')) {
    theme = 'heartbreak';
  } else if (probLower.includes('tired') || probLower.includes('exhaust') || probLower.includes('burnout') || probLower.includes('drained') || probLower.includes('overwhelm') || probLower.includes('stress')) {
    theme = 'burnout';
  } else if (probLower.includes('ugly') || probLower.includes('failure') || probLower.includes('worthless') || probLower.includes('not good enough') || probLower.includes('hate myself')) {
    theme = 'self-doubt';
  }

  const responses = {
    academic: {
      understandingYou: `I hear how heavy this academic pressure feels right now, ${userName}. Preparing for exams and comparing your timeline to others can feel utterly exhausting and scary.`,
      wordsForYou: `Take a deep breath and gently relax your shoulders. Your worth as a human being is never defined by a single exam score or syllabus. You have carried yourself through difficult challenges before, and you don't have to conquer everything all at once. Just focus on one small, gentle step at a time, and remember to give yourself grace and proper rest.`,
      rememberThis: `A single test is just one small chapter in a very large and beautiful story. You have so much more magic within you.`
    },
    loneliness: {
      understandingYou: `Feeling isolated or disconnected from people around you can be deeply aching, ${userName}. It's completely valid that your heart feels tender right now.`,
      wordsForYou: `Even when the quiet feels heavy, please know that your presence in this world matters quietly and profoundly. Loneliness is often a reminder of how deeply we yearn for genuine connection, not a reflection of your worth. Be gentle with your thoughts tonight, treat yourself like a cherished friend, and trust that warm, understanding souls will cross your path.`,
      rememberThis: `You are never truly alone under this cosmic sky. The stars and kind hearts are quietly rooting for you.`
    },
    career: {
      understandingYou: `Navigating career uncertainty and workplace stress takes a real toll on your spirit, ${userName}. It is completely understandable to feel overwhelmed and restless.`,
      wordsForYou: `Every person’s journey has winding paths, unexpected pauses, and seasons of recalibration. What you're experiencing now is a detour, not a dead end. Give yourself credit for how persistently you keep showing up. Take tonight to recharge your energy without guilt, because clear clarity always blossoms when you give your mind room to breathe.`,
      rememberThis: `Your trajectory is entirely your own. One setback cannot dim the brightness of your future.`
    },
    heartbreak: {
      understandingYou: `Heartache carries a tender, quiet grief that takes time to heal, ${userName}. It is completely okay to feel sad, bruised, or confused right now.`,
      wordsForYou: `Please do not rush your heart to feel okay before it is ready. It takes tremendous bravery to care and love deeply. Wrap yourself in comfort, let yourself feel whatever rises without self-judgment, and know that your capacity to love and be loved remains whole and luminous. Soft days of renewed joy will slowly return to your horizon.`,
      rememberThis: `The cracks in your heart are where new starlight and gentle wisdom will enter. You will smile with warmth again.`
    },
    burnout: {
      understandingYou: `It sounds like you have been carrying an enormous invisible weight for far too long, ${userName}. Feeling drained and overwhelmed is your spirit's gentle signal that it needs peace.`,
      wordsForYou: `You do not have to be strong every single minute of every single day. It is more than okay to put down the burdens, step back from expectations, and simply exist for a while. Drink some water, let your mind wander without pressure, and remember that rest is not a reward you have to earn—it is your fundamental right.`,
      rememberThis: `Even the brightest stars rest in the quiet darkness. Allow yourself to rest, breathe, and heal.`
    },
    'self-doubt': {
      understandingYou: `I hear that quiet, critical voice telling you that you are falling short, ${userName}. It can be so painful when your own thoughts turn against you.`,
      wordsForYou: `Please let me remind you of the truth: you do not need to be flawless to deserve happiness, respect, and kindness. Look at everything you have quietly survived and the gentle courage you carry inside you. For tonight, try speaking to yourself with the same gentleness you would offer to a dear friend in tears. You are doing so much better than you realize.`,
      rememberThis: `You are enough just as you are right now. Your worth has never been up for negotiation.`
    },
    general: {
      understandingYou: `I hear the genuine struggle in what you are going through, ${userName}. Carrying this on your mind takes real energy, and your feelings are completely seen and respected.`,
      wordsForYou: `When the road feels murky and overwhelming, remember that you only ever need to navigate the next few moments. You don't have to figure out the whole puzzle today. Give yourself permission to pause, breathe deeply, and be proud of your quiet resilience. Difficult moments are like passing clouds in space; the clear, bright sky behind them always endures.`,
      rememberThis: `This difficult moment will pass, but the strength and wisdom you uncover will stay with you.`
    }
  };

  const choice = responses[theme] || responses.general;
  const fullText = `Understanding You\n${choice.understandingYou}\n\nA Few Words for You\n${choice.wordsForYou}\n\nRemember This\n${choice.rememberThis}`;

  return {
    understandingYou: choice.understandingYou,
    wordsForYou: choice.wordsForYou,
    rememberThis: choice.rememberThis,
    fullText: fullText
  };
}

/**
 * Call Google Gemini API if key is present
 */
async function callGeminiApi(name, problem, isCrisis) {
  const rawKey = process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
  if (!apiKey) {
    return null;
  }

  const systemInstruction = `You are Param Sundhari, a kind and supportive AI well-wisher. The user will provide their name and a problem they are currently facing. Respond with empathy, understanding and encouragement. Use the user's name naturally. Acknowledge their feelings without judging them. Give practical, simple and positive encouragement. Do not diagnose medical or psychological conditions. Do not pretend to be a human or professional therapist. Do not make unrealistic promises. Keep the response warm, concise and personalized. If the user indicates immediate danger or a serious crisis, encourage them to contact a trusted person and appropriate emergency/crisis support. Keep responses approximately 100-180 words. Format your output strictly in JSON with three keys: "understandingYou", "wordsForYou", and "rememberThis".`;

  const userPrompt = `User Name: ${name}\nProblem: ${problem}\nProvide the structured response in JSON format with keys "understandingYou", "wordsForYou", "rememberThis".`;

  // We try Gemini 1.5 flash or 2.0 flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\n${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error status: ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error('Empty response from Gemini API');
  }

  const parsed = JSON.parse(textContent);
  return {
    understandingYou: parsed.understandingYou || '',
    wordsForYou: parsed.wordsForYou || '',
    rememberThis: parsed.rememberThis || '',
    fullText: `Understanding You\n${parsed.understandingYou}\n\nA Few Words for You\n${parsed.wordsForYou}\n\nRemember This\n${parsed.rememberThis}`
  };
}

/**
 * Main API endpoint
 */
app.post('/api/support', async (req, res) => {
  try {
    const { name, problem } = req.body;

    // Requirement 20 & 4: Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please tell me your name first ✨'
      });
    }

    if (!problem || !problem.trim()) {
      return res.status(400).json({
        success: false,
        error: "Tell me what's troubling you. I'm listening 💜"
      });
    }

    const trimmedName = name.trim();
    const trimmedProblem = problem.trim();

    // Check crisis conditions
    const isCrisis = checkForCrisis(trimmedProblem);

    // Personalize companion
    const companion = determineCompanion(trimmedName);

    let aiResult = null;

    // Attempt Gemini API if key is present
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
      try {
        aiResult = await callGeminiApi(trimmedName, trimmedProblem, isCrisis);
      } catch (geminiErr) {
        console.warn('Gemini API call encountered an issue, seamlessly using compassionate fallback engine:', geminiErr.message);
      }
    }

    // Fallback if no API key or if API failed
    if (!aiResult) {
      aiResult = generateContextualResponse(trimmedName, trimmedProblem, isCrisis);
    }

    return res.json({
      success: true,
      character: companion,
      response: aiResult,
      isCrisis: isCrisis
    });
  } catch (error) {
    console.error('Server error handling /api/support:', error);
    return res.status(500).json({
      success: false,
      error: "I couldn't connect right now. Please try again in a moment."
    });
  }
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌌 Param Sundhari server running on http://localhost:${PORT}`);
});
