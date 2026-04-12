import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeRisk } from '../services/api';

const STEPS = [
  { title: 'Basic Information', sub: 'Tell us about yourself' },
  { title: 'Lifestyle', sub: 'Your daily habits and routines' },
  { title: 'Medical History', sub: 'Past and family health background' },
  { title: 'Current Symptoms', sub: 'Any symptoms you may be experiencing' },
  { title: 'Environment & Wellness', sub: 'Your surroundings and wellbeing' },
];

const LOADING = [
  { label: 'Analyzing your health profile...', at: 20 },
  { label: 'Calculating risk factors...', at: 50 },
  { label: 'Getting AI recommendations...', at: 80 },
  { label: 'Preparing your results...', at: 100 },
];

function calcBMI(h, w) { const m = h / 100; return (w / (m * m)).toFixed(1); }
function calcAge(dob) {
  const b = new Date(dob), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() - b.getMonth() < 0 || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a;
}

export default function Assessment({ setAssessmentCompleted, setAssessmentResults }) {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [anim, setAnim] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitErr, setSubmitErr] = useState('');

  const [f, setF] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    height: 170, weight: 70,
    smokingStatus: '', alcoholConsumption: '', physicalActivity: '', diet: '',
    familyHistory: { cancer: false, heartDisease: false, diabetes: false, other: '' },
    personalHistory: { cancer: false, surgeries: '', chronicConditions: '' },
    currentSymptoms: {
      unexplainedWeightLoss: false, fatigue: false, fever: false,
      pain: false, digestiveIssues: false, skinChanges: false, other: '',
    },
    occupation: '', exposureToToxins: false, livingEnvironment: '',
    stressLevel: 5, sleepQuality: '',
  });

  const set = (k, v) => { setF(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };
  const setN = (g, k, v) => { setF(p => ({ ...p, [g]: { ...p[g], [k]: v } })); };

  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!f.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
      if (!f.gender) e.gender = 'Please select a gender';
    }
    setErrors(e);
    return !Object.keys(e).length;
  }

  function next() {
    if (!validate(step) || step >= 4) return;
    setDir(1); setAnim(true);
    setTimeout(() => { setStep(s => s + 1); setAnim(false); }, 200);
  }
  function back() {
    if (step <= 0) return;
    setDir(-1); setAnim(true);
    setTimeout(() => { setStep(s => s - 1); setAnim(false); }, 200);
  }

  async function submit() {
    if (!validate(step)) return;
    setLoading(true); setProgress(0); setSubmitErr('');
    const iv = setInterval(() => setProgress(p => p >= 95 ? p : p + Math.random() * 4 + 1), 120);
    try {
      if (f.height <= 0) throw new Error('Height must be greater than zero.');
      const res = await analyzeRisk({
        age: calcAge(f.dateOfBirth), gender: f.gender, bmi: parseFloat(calcBMI(f.height, f.weight)),
        lifestyle: { smoking: f.smokingStatus, alcohol: f.alcoholConsumption, exercise: f.physicalActivity, diet: f.diet },
        medicalHistory: { familyCancer: f.familyHistory.cancer, personalCancer: f.personalHistory.cancer, chronicConditions: f.personalHistory.chronicConditions, familyHeartDisease: f.familyHistory.heartDisease, familyDiabetes: f.familyHistory.diabetes, surgeries: f.personalHistory.surgeries },
        symptoms: { ...f.currentSymptoms },
        environmentalFactors: { toxinExposure: f.exposureToToxins, livingEnvironment: f.livingEnvironment, occupation: f.occupation },
        mentalHealth: { stressLevel: f.stressLevel, sleepQuality: f.sleepQuality },
      });
      clearInterval(iv); setProgress(100);
      await new Promise(r => setTimeout(r, 500));
      setAssessmentCompleted(true); setAssessmentResults(res); nav('/dashboard');
    } catch (err) {
      clearInterval(iv); setLoading(false); setProgress(0);
      setSubmitErr(err.message || 'Something went wrong.');
    }
  }

  const loadLabel = LOADING.find(s => progress < s.at)?.label || LOADING[3].label;
  const tx = anim
    ? { opacity: 0, transform: `translateX(${dir * 30}px)`, transition: 'all 0.2s ease' }
    : { opacity: 1, transform: 'translateX(0)', transition: 'all 0.2s ease' };

  const bmiVal = calcBMI(f.height, f.weight);

  /* ── Reusable mini-components ── */
  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-[#8b9cc0] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
      {children} {required && <span className="text-[#f472b6]">*</span>}
    </label>
  );

  const Section = ({ title }) => (
    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
  );

  const Check = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-4 text-[#b0bdd4] text-[15px] cursor-pointer py-2.5 px-1 hover:text-white transition-colors rounded-lg">
      <input type="checkbox" checked={checked} onChange={onChange} className="shrink-0" />
      {label}
    </label>
  );

  /* ── Steps ── */
  function renderStep() {
    switch (step) {
      case 0: return (
        <div className="space-y-8">
          {/* Name */}
          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>First Name</Label>
                <input type="text" className="input-field" placeholder="John" value={f.firstName} onChange={e => set('firstName', e.target.value)} />
              </div>
              <div>
                <Label>Last Name</Label>
                <input type="text" className="input-field" placeholder="Doe" value={f.lastName} onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>
          </div>

          {/* DOB */}
          <div className="card">
            <Label required>Date of Birth</Label>
            <input type="date" className="input-field" value={f.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
            {errors.dateOfBirth && <p className="text-[#f472b6] text-sm mt-3">{errors.dateOfBirth}</p>}
          </div>

          {/* Gender */}
          <div className="card">
            <Label required>Gender</Label>
            <div className="flex flex-wrap gap-6 mt-2">
              {['Male', 'Female', 'Prefer not to say'].map(g => (
                <label key={g} className="flex items-center gap-3 text-[#b0bdd4] text-[15px] cursor-pointer hover:text-white transition-colors">
                  <input type="radio" name="gender" checked={f.gender === g} onChange={() => set('gender', g)} />
                  {g}
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-[#f472b6] text-sm mt-3">{errors.gender}</p>}
          </div>

          {/* Height & Weight */}
          <div className="card">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <Label>Height</Label>
                  <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>{f.height} cm</span>
                </div>
                <input type="range" min={100} max={250} value={f.height} onChange={e => set('height', +e.target.value)} />
                <div className="flex justify-between text-xs text-[#3a4560] mt-2"><span>100 cm</span><span>250 cm</span></div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <Label>Weight</Label>
                  <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>{f.weight} kg</span>
                </div>
                <input type="range" min={30} max={200} value={f.weight} onChange={e => set('weight', +e.target.value)} />
                <div className="flex justify-between text-xs text-[#3a4560] mt-2"><span>30 kg</span><span>200 kg</span></div>
              </div>

              <div className="bg-[#0a0e1a] rounded-2xl px-6 py-5 text-center border border-white/[0.04]">
                <span className="text-[#5a6a8a] text-sm block mb-1">Body Mass Index</span>
                <span className="text-white font-extrabold text-3xl" style={{ fontFamily: 'var(--font-display)' }}>{bmiVal}</span>
              </div>
            </div>
          </div>
        </div>
      );

      case 1: return (
        <div className="card">
          <div className="space-y-8">
            <div><Label>Smoking Status</Label><select className="select-field" value={f.smokingStatus} onChange={e => set('smokingStatus', e.target.value)}>
              <option value="">Select...</option><option value="never">Never smoked</option><option value="former">Former smoker</option><option value="current">Current smoker</option>
            </select></div>
            <div><Label>Alcohol Consumption</Label><select className="select-field" value={f.alcoholConsumption} onChange={e => set('alcoholConsumption', e.target.value)}>
              <option value="">Select...</option><option value="none">None</option><option value="occasional">Occasional (1-2 drinks/week)</option><option value="moderate">Moderate (3-7 drinks/week)</option><option value="frequent">Frequent (8+ drinks/week)</option>
            </select></div>
            <div><Label>Physical Activity</Label><select className="select-field" value={f.physicalActivity} onChange={e => set('physicalActivity', e.target.value)}>
              <option value="">Select...</option><option value="sedentary">Sedentary (little to no exercise)</option><option value="light">Light (1-3 days/week)</option><option value="moderate">Moderate (3-5 days/week)</option><option value="active">Active (6-7 days/week)</option>
            </select></div>
            <div><Label>Diet Type</Label><select className="select-field" value={f.diet} onChange={e => set('diet', e.target.value)}>
              <option value="">Select...</option><option value="balanced">Balanced</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="processed">Mostly processed foods</option>
            </select></div>
          </div>
        </div>
      );

      case 2: return (
        <div className="space-y-8">
          <div className="card">
            <Section title="Family History" />
            <p className="text-[#5a6a8a] text-sm mb-6">Does anyone in your immediate family have a history of:</p>
            <div className="space-y-1 mb-6">
              <Check label="Cancer" checked={f.familyHistory.cancer} onChange={e => setN('familyHistory', 'cancer', e.target.checked)} />
              <Check label="Heart Disease" checked={f.familyHistory.heartDisease} onChange={e => setN('familyHistory', 'heartDisease', e.target.checked)} />
              <Check label="Diabetes" checked={f.familyHistory.diabetes} onChange={e => setN('familyHistory', 'diabetes', e.target.checked)} />
            </div>
            <Label>Other conditions</Label>
            <textarea className="input-field resize-none" rows={3} placeholder="Any other relevant family history..." value={f.familyHistory.other} onChange={e => setN('familyHistory', 'other', e.target.value)} />
          </div>

          <div className="card">
            <Section title="Personal History" />
            <div className="mb-6 mt-4">
              <Check label="Previous cancer diagnosis" checked={f.personalHistory.cancer} onChange={e => setN('personalHistory', 'cancer', e.target.checked)} />
            </div>
            <div className="space-y-6">
              <div>
                <Label>Previous surgeries</Label>
                <textarea className="input-field resize-none" rows={2} placeholder="List any previous surgeries..." value={f.personalHistory.surgeries} onChange={e => setN('personalHistory', 'surgeries', e.target.value)} />
              </div>
              <div>
                <Label>Chronic conditions</Label>
                <textarea className="input-field resize-none" rows={2} placeholder="List any chronic conditions..." value={f.personalHistory.chronicConditions} onChange={e => setN('personalHistory', 'chronicConditions', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      );

      case 3: return (
        <div className="card">
          <Section title="Current Symptoms" />
          <p className="text-[#5a6a8a] text-sm mb-6 mt-1">Check any symptoms you are currently experiencing.</p>
          <div className="space-y-1 mb-8">
            {[['unexplainedWeightLoss','Unexplained weight loss'],['fatigue','Persistent fatigue'],['fever','Recurring fever'],['pain','Persistent pain'],['digestiveIssues','Digestive issues'],['skinChanges','Skin changes']].map(([k,l]) => (
              <Check key={k} label={l} checked={f.currentSymptoms[k]} onChange={e => setN('currentSymptoms', k, e.target.checked)} />
            ))}
          </div>
          <Label>Other symptoms</Label>
          <textarea className="input-field resize-none" rows={3} placeholder="Describe any other symptoms..." value={f.currentSymptoms.other} onChange={e => setN('currentSymptoms', 'other', e.target.value)} />
        </div>
      );

      case 4: return (
        <div className="card">
          <div className="space-y-8">
            <div><Label>Occupation</Label><input type="text" className="input-field" placeholder="e.g. Software Engineer" value={f.occupation} onChange={e => set('occupation', e.target.value)} /></div>
            <Check label="Regular exposure to toxins or hazardous materials" checked={f.exposureToToxins} onChange={e => set('exposureToToxins', e.target.checked)} />
            <div><Label>Living Environment</Label><select className="select-field" value={f.livingEnvironment} onChange={e => set('livingEnvironment', e.target.value)}>
              <option value="">Select...</option><option value="urban">Urban</option><option value="suburban">Suburban</option><option value="rural">Rural</option>
            </select></div>
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <Label>Stress Level</Label>
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>{f.stressLevel}/10</span>
              </div>
              <input type="range" min={0} max={10} value={f.stressLevel} onChange={e => set('stressLevel', +e.target.value)} />
              <div className="flex justify-between text-xs text-[#3a4560] mt-2"><span>Low</span><span>High</span></div>
            </div>
            <div><Label>Sleep Quality</Label><select className="select-field" value={f.sleepQuality} onChange={e => set('sleepQuality', e.target.value)}>
              <option value="">Select...</option><option value="poor">Poor (&lt;5 hours)</option><option value="fair">Fair (5-7 hours)</option><option value="good">Good (7-9 hours)</option><option value="excellent">Excellent (9+ hours)</option>
            </select></div>
          </div>
        </div>
      );

      default: return null;
    }
  }

  return (
    <div className="min-h-screen w-full bg-atmosphere flex justify-center px-6 grain">
      <div className="w-full max-w-lg pt-12 pb-16">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-[#5a6a8a]">Step {step + 1} of 5</span>
            <span className="text-sm font-bold text-[#4f8cff]">{Math.round(((step + 1) / 5) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[#131c30] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#4f8cff] to-[#2dd4bf]"
              style={{ width: `${((step + 1) / 5) * 100}%`, transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>{STEPS[step].title}</h1>
          <p className="text-[#5a6a8a] text-base">{STEPS[step].sub}</p>
        </div>

        {/* Error */}
        {submitErr && (
          <div className="mb-8 bg-red-500/8 border border-red-500/15 rounded-2xl px-6 py-5 text-red-400 text-sm">{submitErr}</div>
        )}

        {/* Content */}
        <div style={tx}>{renderStep()}</div>

        {/* Buttons */}
        <div className="flex gap-4 mt-12">
          {step > 0 ? (
            <button onClick={back} disabled={anim} className="btn-secondary flex-1 text-base">Back</button>
          ) : <div className="flex-1" />}
          {step < 4 ? (
            <button onClick={next} disabled={anim} className="btn-primary flex-1 text-base">Next</button>
          ) : (
            <button onClick={submit} disabled={anim || loading} className="btn-primary flex-1 text-base">Submit Assessment</button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#05080f]/90 backdrop-blur-md flex items-center justify-center p-8">
          <div className="card max-w-sm w-full text-center !p-10">
            <div className="flex justify-center mb-10">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-[#4f8cff]/15 animate-ping" />
                <div className="absolute inset-4 rounded-full bg-[#4f8cff]/20 animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-[#4f8cff]" />
              </div>
            </div>
            <div className="w-full h-2 bg-[#131c30] rounded-full overflow-hidden mb-6">
              <div className="h-full rounded-full bg-gradient-to-r from-[#4f8cff] to-[#2dd4bf]"
                style={{ width: `${Math.min(progress, 100)}%`, transition: 'width 0.3s ease' }} />
            </div>
            <p className="text-white font-semibold text-base" style={{ fontFamily: 'var(--font-display)' }}>{loadLabel}</p>
            <p className="text-[#3a4560] text-sm mt-2">{Math.round(Math.min(progress, 100))}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
