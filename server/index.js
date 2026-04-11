import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: ['POST'],
}));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Gemini Client ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Risk Calculation (baseline) ──
function calculateBaselineRisks(userData) {
  const { age, gender, bmi, lifestyle, medicalHistory, symptoms, environmentalFactors } = userData;

  let base = 5;
  if (age > 50) base += 15;
  else if (age > 40) base += 10;
  else if (age > 30) base += 5;

  if (bmi > 30) base += 10;
  else if (bmi > 25) base += 5;

  if (medicalHistory.familyCancer) base += 15;
  if (medicalHistory.personalCancer) base += 20;

  if (lifestyle.smoking === 'current') base += 20;
  else if (lifestyle.smoking === 'former') base += 10;
  if (lifestyle.alcohol === 'frequent') base += 10;
  else if (lifestyle.alcohol === 'moderate') base += 5;
  if (lifestyle.exercise === 'sedentary') base += 10;

  // Symptom contribution
  const symptomKeys = ['unexplainedWeightLoss', 'fatigue', 'fever', 'pain', 'digestiveIssues', 'skinChanges'];
  const activeSymptoms = symptomKeys.filter(k => symptoms?.[k]).length;
  base += activeSymptoms * 3;

  base = Math.min(base, 95);

  // Specific cancers
  let lung = base;
  if (lifestyle.smoking === 'current') lung += 30;
  else if (lifestyle.smoking === 'former') lung += 15;
  if (environmentalFactors?.toxinExposure) lung += 20;

  let colorectal = base;
  if (age > 50) colorectal += 20;
  if (medicalHistory.familyCancer) colorectal += 25;
  if (lifestyle.diet === 'processed') colorectal += 15;

  let breast = gender === 'Female' ? base : 0;
  if (gender === 'Female') {
    if (age > 50) breast += 20;
    if (medicalHistory.familyCancer) breast += 30;
  }

  let prostate = gender === 'Male' ? base : 0;
  if (gender === 'Male') {
    if (age > 50) prostate += 25;
    if (medicalHistory.familyCancer) prostate += 25;
  }

  return {
    general: { name: 'General Cancer Risk', risk: Math.min(base, 95) },
    lung: { name: 'Lung Cancer', risk: Math.min(lung, 95) },
    colorectal: { name: 'Colorectal Cancer', risk: Math.min(colorectal, 95) },
    breast: { name: 'Breast Cancer', risk: Math.min(breast, 95) },
    prostate: { name: 'Prostate Cancer', risk: Math.min(prostate, 95) },
  };
}

// ── Assessment Endpoint ──
app.post('/api/assess', async (req, res) => {
  try {
    const userData = req.body;

    if (!userData || !userData.age || !userData.gender) {
      return res.status(400).json({ error: 'Missing required fields: age, gender' });
    }

    // Step 1: Calculate baseline risks
    const baselineRisks = calculateBaselineRisks(userData);

    // Step 2: Send to Gemini for AI-enhanced analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a cancer risk education assistant. You do NOT provide medical diagnoses.
Based on the following user health profile and our baseline statistical risk estimates, provide:
1. Refined risk assessments (adjust our baseline estimates if the combination of factors warrants it)
2. Recommended cancer screenings with frequency
3. Lifestyle recommendations ranked by impact

User Profile:
- Age: ${userData.age}, Gender: ${userData.gender}, BMI: ${userData.bmi}
- Smoking: ${userData.lifestyle.smoking}, Alcohol: ${userData.lifestyle.alcohol}
- Exercise: ${userData.lifestyle.exercise}, Diet: ${userData.lifestyle.diet}
- Family history of cancer: ${userData.medicalHistory.familyCancer}
- Personal cancer history: ${userData.medicalHistory.personalCancer}
- Chronic conditions: ${userData.medicalHistory.chronicConditions || 'None'}
- Toxin exposure: ${userData.environmentalFactors?.toxinExposure || false}
- Stress level: ${userData.mentalHealth?.stressLevel || 'Unknown'}/10
- Sleep quality: ${userData.mentalHealth?.sleepQuality || 'Unknown'}
- Active symptoms: ${JSON.stringify(userData.symptoms || {})}

Our Baseline Risk Estimates:
${Object.values(baselineRisks).map(r => `- ${r.name}: ${r.risk}%`).join('\n')}

IMPORTANT: Respond ONLY with valid JSON in this exact structure (no markdown, no code fences):
{
  "cancerRisks": {
    "general": { "name": "General Cancer Risk", "risk": <number 0-95>, "reasoning": "<brief explanation>" },
    "lung": { "name": "Lung Cancer", "risk": <number 0-95>, "reasoning": "<brief explanation>" },
    "colorectal": { "name": "Colorectal Cancer", "risk": <number 0-95>, "reasoning": "<brief explanation>" },
    "breast": { "name": "Breast Cancer", "risk": <number 0-95>, "reasoning": "<brief explanation>" },
    "prostate": { "name": "Prostate Cancer", "risk": <number 0-95>, "reasoning": "<brief explanation>" }
  },
  "screenings": [
    { "test": "<name>", "frequency": "<how often>", "startAge": <number>, "description": "<why important>", "priority": "High|Medium|Low" }
  ],
  "lifestyle": [
    { "category": "<area>", "recommendation": "<specific action>", "impact": "High|Medium|Low", "description": "<why this helps>" }
  ],
  "summary": "<2-3 sentence overall assessment emphasizing this is educational, not medical advice>"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse AI response, stripping markdown fences if present
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleaned);
    } catch {
      // If AI response fails to parse, use baseline with default recommendations
      aiResponse = {
        cancerRisks: baselineRisks,
        screenings: [
          { test: 'Annual Physical Exam', frequency: 'Yearly', startAge: 18, description: 'Regular check-ups help detect issues early.', priority: 'High' },
          { test: 'Cancer Screening Panel', frequency: 'As recommended by doctor', startAge: 40, description: 'Age-appropriate cancer screenings.', priority: 'Medium' },
        ],
        lifestyle: [
          { category: 'Exercise', recommendation: 'Aim for 150 minutes of moderate activity per week', impact: 'High', description: 'Regular exercise reduces cancer risk significantly.' },
          { category: 'Diet', recommendation: 'Increase fruits, vegetables, and whole grains', impact: 'High', description: 'A balanced diet supports immune function and reduces cancer risk.' },
        ],
        summary: 'Based on your profile, we recommend discussing these results with your healthcare provider. This assessment is for educational purposes only and does not constitute medical advice.',
      };
    }

    // Ensure risk values are capped at 95
    if (aiResponse.cancerRisks) {
      for (const key of Object.keys(aiResponse.cancerRisks)) {
        if (aiResponse.cancerRisks[key].risk > 95) {
          aiResponse.cancerRisks[key].risk = 95;
        }
      }
    }

    res.json(aiResponse);
  } catch (error) {
    console.error('Assessment error:', error.message);
    res.status(500).json({ error: 'Failed to process assessment. Please try again.' });
  }
});

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
