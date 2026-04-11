import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeRisk } from '../services/api';

const STEP_TITLES = [
  { title: 'Basic Information', subtitle: 'Tell us about yourself' },
  { title: 'Lifestyle', subtitle: 'Your daily habits and routines' },
  { title: 'Medical History', subtitle: 'Past and family health background' },
  { title: 'Current Symptoms', subtitle: 'Any symptoms you are experiencing' },
  { title: 'Environment & Wellness', subtitle: 'Your surroundings and wellbeing' },
];

const LOADING_STEPS = [
  { label: 'Analyzing your health profile...', threshold: 20 },
  { label: 'Calculating risk factors...', threshold: 50 },
  { label: 'Getting AI recommendations...', threshold: 80 },
  { label: 'Preparing your results...', threshold: 100 },
];

function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

function calculateAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const selectClass = inputClass + ' appearance-none';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
const cardClass = 'bg-gray-900 rounded-2xl p-6 space-y-5';
const checkboxClass = 'accent-blue-500 w-4 h-4 rounded';
const sliderClass = 'accent-blue-500 w-full';

export default function Assessment({ setAssessmentCompleted, setAssessmentResults }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: 170,
    weight: 70,
    smokingStatus: '',
    alcoholConsumption: '',
    physicalActivity: '',
    diet: '',
    familyHistory: { cancer: false, heartDisease: false, diabetes: false, other: '' },
    personalHistory: { cancer: false, surgeries: '', chronicConditions: '' },
    currentSymptoms: {
      unexplainedWeightLoss: false,
      fatigue: false,
      fever: false,
      pain: false,
      digestiveIssues: false,
      skinChanges: false,
      other: '',
    },
    occupation: '',
    exposureToToxins: false,
    livingEnvironment: '',
    stressLevel: 5,
    sleepQuality: '',
  });

  const set = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setNested = (group, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  // --- Validation ---
  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!formData.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) e.gender = 'Please select a gender';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // --- Navigation ---
  function goNext() {
    if (!validateStep(step)) return;
    if (step < 4) {
      setDirection(1);
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setAnimating(false);
      }, 250);
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => s - 1);
        setAnimating(false);
      }, 250);
    }
  }

  // --- Submit ---
  async function handleSubmit() {
    if (!validateStep(step)) return;
    setLoading(true);
    setLoadingProgress(0);
    setSubmitError('');

    const interval = setInterval(() => {
      setLoadingProgress((p) => {
        if (p >= 95) return p;
        return p + Math.random() * 4 + 1;
      });
    }, 120);

    try {
      const age = calculateAge(formData.dateOfBirth);
      const heightCm = formData.height;
      const weightKg = formData.weight;

      if (heightCm <= 0) {
        throw new Error('Height must be greater than zero.');
      }

      const bmi = parseFloat(calculateBMI(heightCm, weightKg));

      const userData = {
        age,
        gender: formData.gender,
        bmi,
        lifestyle: {
          smoking: formData.smokingStatus,
          alcohol: formData.alcoholConsumption,
          exercise: formData.physicalActivity,
          diet: formData.diet,
        },
        medicalHistory: {
          familyCancer: formData.familyHistory.cancer,
          personalCancer: formData.personalHistory.cancer,
          chronicConditions: formData.personalHistory.chronicConditions,
          familyHeartDisease: formData.familyHistory.heartDisease,
          familyDiabetes: formData.familyHistory.diabetes,
          surgeries: formData.personalHistory.surgeries,
        },
        symptoms: {
          unexplainedWeightLoss: formData.currentSymptoms.unexplainedWeightLoss,
          fatigue: formData.currentSymptoms.fatigue,
          fever: formData.currentSymptoms.fever,
          pain: formData.currentSymptoms.pain,
          digestiveIssues: formData.currentSymptoms.digestiveIssues,
          skinChanges: formData.currentSymptoms.skinChanges,
          other: formData.currentSymptoms.other,
        },
        environmentalFactors: {
          toxinExposure: formData.exposureToToxins,
          livingEnvironment: formData.livingEnvironment,
          occupation: formData.occupation,
        },
        mentalHealth: {
          stressLevel: formData.stressLevel,
          sleepQuality: formData.sleepQuality,
        },
      };

      const response = await analyzeRisk(userData);

      clearInterval(interval);
      setLoadingProgress(100);

      await new Promise((r) => setTimeout(r, 600));

      setAssessmentCompleted(true);
      setAssessmentResults(response);
      navigate('/dashboard');
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setLoadingProgress(0);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    }
  }

  const currentLoadingLabel =
    LOADING_STEPS.find((s) => loadingProgress < s.threshold)?.label ||
    LOADING_STEPS[LOADING_STEPS.length - 1].label;

  // --- Transition style ---
  const transitionStyle = animating
    ? {
        opacity: 0,
        transform: `translateX(${direction * 60}px)`,
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }
    : {
        opacity: 1,
        transform: 'translateX(0)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      };

  const bmi = calculateBMI(formData.height, formData.weight);

  // --- Steps ---
  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className={cardClass}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Date of Birth <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                className={inputClass}
                value={formData.dateOfBirth}
                onChange={(e) => set('dateOfBirth', e.target.value)}
              />
              {errors.dateOfBirth && (
                <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Gender <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-4 mt-1">
                {['Male', 'Female', 'Prefer not to say'].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      className="accent-blue-500 w-4 h-4"
                      checked={formData.gender === g}
                      onChange={() => set('gender', g)}
                    />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className={labelClass}>Height: {formData.height} cm</label>
              <input
                type="range"
                min={100}
                max={250}
                className={sliderClass}
                value={formData.height}
                onChange={(e) => set('height', Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>100 cm</span>
                <span>250 cm</span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Weight: {formData.weight} kg</label>
              <input
                type="range"
                min={30}
                max={200}
                className={sliderClass}
                value={formData.weight}
                onChange={(e) => set('weight', Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>30 kg</span>
                <span>200 kg</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl px-4 py-3 text-center">
              <span className="text-gray-400 text-sm">BMI: </span>
              <span className="text-white font-semibold text-lg">{bmi}</span>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={cardClass}>
            <div>
              <label className={labelClass}>Smoking Status</label>
              <select
                className={selectClass}
                value={formData.smokingStatus}
                onChange={(e) => set('smokingStatus', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="never">Never</option>
                <option value="former">Former</option>
                <option value="current">Current</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Alcohol Consumption</label>
              <select
                className={selectClass}
                value={formData.alcoholConsumption}
                onChange={(e) => set('alcoholConsumption', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="moderate">Moderate</option>
                <option value="frequent">Frequent</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Physical Activity</label>
              <select
                className={selectClass}
                value={formData.physicalActivity}
                onChange={(e) => set('physicalActivity', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Diet</label>
              <select
                className={selectClass}
                value={formData.diet}
                onChange={(e) => set('diet', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="processed">Processed</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="text-white font-semibold text-lg">Family History</h3>
              <div className="space-y-3">
                {[
                  ['cancer', 'Cancer'],
                  ['heartDisease', 'Heart Disease'],
                  ['diabetes', 'Diabetes'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className={checkboxClass}
                      checked={formData.familyHistory[key]}
                      onChange={(e) => setNested('familyHistory', key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div>
                <label className={labelClass}>Other family conditions</label>
                <textarea
                  className={inputClass + ' resize-none'}
                  rows={3}
                  placeholder="Any other relevant family health history..."
                  value={formData.familyHistory.other}
                  onChange={(e) => setNested('familyHistory', 'other', e.target.value)}
                />
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="text-white font-semibold text-lg">Personal History</h3>
              <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className={checkboxClass}
                  checked={formData.personalHistory.cancer}
                  onChange={(e) => setNested('personalHistory', 'cancer', e.target.checked)}
                />
                History of cancer
              </label>
              <div>
                <label className={labelClass}>Previous surgeries</label>
                <textarea
                  className={inputClass + ' resize-none'}
                  rows={2}
                  placeholder="List any previous surgeries..."
                  value={formData.personalHistory.surgeries}
                  onChange={(e) => setNested('personalHistory', 'surgeries', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Chronic conditions</label>
                <textarea
                  className={inputClass + ' resize-none'}
                  rows={2}
                  placeholder="List any chronic conditions..."
                  value={formData.personalHistory.chronicConditions}
                  onChange={(e) => setNested('personalHistory', 'chronicConditions', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={cardClass}>
            <p className="text-gray-400 text-sm">
              Check any symptoms you are currently experiencing.
            </p>
            <div className="space-y-3">
              {[
                ['unexplainedWeightLoss', 'Unexplained weight loss'],
                ['fatigue', 'Fatigue'],
                ['fever', 'Recurring fever'],
                ['pain', 'Persistent pain'],
                ['digestiveIssues', 'Digestive issues'],
                ['skinChanges', 'Skin changes'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className={checkboxClass}
                    checked={formData.currentSymptoms[key]}
                    onChange={(e) => setNested('currentSymptoms', key, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div>
              <label className={labelClass}>Other symptoms</label>
              <textarea
                className={inputClass + ' resize-none'}
                rows={3}
                placeholder="Describe any other symptoms..."
                value={formData.currentSymptoms.other}
                onChange={(e) => setNested('currentSymptoms', 'other', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className={cardClass}>
            <div>
              <label className={labelClass}>Occupation</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Software Engineer"
                value={formData.occupation}
                onChange={(e) => set('occupation', e.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={formData.exposureToToxins}
                onChange={(e) => set('exposureToToxins', e.target.checked)}
              />
              Regular exposure to toxins or hazardous materials
            </label>

            <div>
              <label className={labelClass}>Living Environment</label>
              <select
                className={selectClass}
                value={formData.livingEnvironment}
                onChange={(e) => set('livingEnvironment', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="urban">Urban</option>
                <option value="suburban">Suburban</option>
                <option value="rural">Rural</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Stress Level: {formData.stressLevel}/10</label>
              <input
                type="range"
                min={0}
                max={10}
                className={sliderClass}
                value={formData.stressLevel}
                onChange={(e) => set('stressLevel', Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Sleep Quality</label>
              <select
                className={selectClass}
                value={formData.sleepQuality}
                onChange={(e) => set('sleepQuality', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {step + 1} of 5
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((step + 1) / 5) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${((step + 1) / 5) * 100}%`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Step title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{STEP_TITLES[step].title}</h1>
          <p className="text-gray-400 mt-1">{STEP_TITLES[step].subtitle}</p>
        </div>

        {/* Error banner */}
        {submitError && (
          <div className="mb-4 bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">
            {submitError}
          </div>
        )}

        {/* Form content */}
        <div ref={containerRef} style={transitionStyle}>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={animating}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={animating}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={animating || loading}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Submit Assessment
            </button>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl shadow-blue-500/10">
            {/* Pulsing glow ring */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-blue-500/30 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${Math.min(loadingProgress, 100)}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Step label */}
            <p className="text-white text-center font-medium">{currentLoadingLabel}</p>
            <p className="text-gray-500 text-center text-sm mt-1">
              {Math.round(Math.min(loadingProgress, 100))}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
