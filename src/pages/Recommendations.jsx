import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Shield, ArrowLeft } from 'lucide-react';

const BADGE = {
  High: 'bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20',
  Medium: 'bg-[#fbbf24]/10 text-[#fcd34d] border border-[#fbbf24]/20',
  Low: 'bg-[#2dd4bf]/10 text-[#5eead4] border border-[#2dd4bf]/20',
};

function Badge({ label }) {
  return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${BADGE[label] || BADGE.Low}`}>{label}</span>;
}

export default function Recommendations({ assessmentCompleted, assessmentResults }) {
  const nav = useNavigate();

  if (!assessmentCompleted || !assessmentResults) {
    return (
      <div className="min-h-screen w-full bg-atmosphere flex items-center justify-center px-6 grain">
        <div className="text-center max-w-sm">
          <div className="w-28 h-28 bg-[#131c30] rounded-full flex items-center justify-center mx-auto mb-10 ring-1 ring-white/5">
            <Shield className="w-14 h-14 text-[#3a4560]" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>No Recommendations Yet</h2>
          <p className="text-[#5a6a8a] text-base leading-relaxed mb-12">Complete your assessment to receive personalized recommendations.</p>
          <button onClick={() => nav('/assessment')} className="btn-primary max-w-xs mx-auto text-base">Start Assessment</button>
        </div>
      </div>
    );
  }

  const { screenings = [], lifestyle = [] } = assessmentResults;

  return (
    <div className="min-h-screen w-full bg-atmosphere flex justify-center px-6 grain">
      <div className="w-full max-w-lg pt-12 pb-28">
        <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-12" style={{ fontFamily: 'var(--font-display)' }}>Your Recommendations</h1>

        {screenings.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#4f8cff]/10 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#4f8cff]" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Recommended Screenings</h2>
            </div>
            <div className="space-y-5">
              {screenings.map((s, i) => (
                <div key={i} className="card hover:ring-1 hover:ring-white/5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-white font-semibold text-base" style={{ fontFamily: 'var(--font-display)' }}>{s.test}</h3>
                    {s.priority && <Badge label={s.priority} />}
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    {s.frequency && <p className="text-[#4f8cff] text-sm font-medium">{s.frequency}</p>}
                    {s.startAge && <p className="text-white text-sm">Starting age {s.startAge}</p>}
                  </div>
                  {s.description && <p className="text-white text-sm leading-relaxed">{s.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {lifestyle.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#f472b6]/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#f472b6]" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Lifestyle Changes</h2>
            </div>
            <div className="space-y-5">
              {lifestyle.map((l, i) => (
                <div key={i} className="card hover:ring-1 hover:ring-white/5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      {l.category && <p className="text-white text-sm font-semibold uppercase tracking-wider mb-2">{l.category}</p>}
                      <h3 className="text-white font-semibold text-base" style={{ fontFamily: 'var(--font-display)' }}>{l.recommendation}</h3>
                    </div>
                    {l.impact && <Badge label={l.impact} />}
                  </div>
                  {l.description && <p className="text-white text-sm leading-relaxed mt-3">{l.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <button onClick={() => nav('/dashboard')} className="btn-secondary flex items-center justify-center gap-3 text-base">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
