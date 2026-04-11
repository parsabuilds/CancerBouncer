import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Shield, ArrowLeft } from 'lucide-react';

const BADGE = {
  High: 'bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20',
  Medium: 'bg-[#fbbf24]/10 text-[#fcd34d] border border-[#fbbf24]/20',
  Low: 'bg-[#2dd4bf]/10 text-[#5eead4] border border-[#2dd4bf]/20',
};

function Badge({ label }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${BADGE[label] || BADGE.Low}`}>
      {label}
    </span>
  );
}

export default function Recommendations({ assessmentCompleted, assessmentResults }) {
  const nav = useNavigate();

  if (!assessmentCompleted || !assessmentResults) {
    return (
      <div className="min-h-screen bg-atmosphere flex items-center justify-center px-8 grain">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-[#131c30] rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-white/5">
            <Shield className="w-11 h-11 text-[#3a4560]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>No Recommendations Yet</h2>
          <p className="text-[#5a6a8a] text-[15px] leading-relaxed mb-10">
            Complete your assessment to receive personalized recommendations.
          </p>
          <button onClick={() => nav('/assessment')} className="btn-primary max-w-[260px] mx-auto">Start Assessment</button>
        </div>
      </div>
    );
  }

  const { screenings = [], lifestyle = [] } = assessmentResults;

  return (
    <div className="min-h-screen bg-atmosphere px-6 pt-10 pb-28 grain">
      <div className="max-w-[480px] mx-auto">
        <h1 className="text-[24px] font-extrabold text-white tracking-tight mb-10" style={{ fontFamily: 'var(--font-display)' }}>
          Your Recommendations
        </h1>

        {/* Screenings */}
        {screenings.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 bg-[#4f8cff]/10 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-[#4f8cff]" />
              </div>
              <h2 className="text-[17px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Recommended Screenings</h2>
            </div>
            <div className="space-y-4">
              {screenings.map((s, i) => (
                <div key={i} className="card hover:ring-1 hover:ring-white/5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-white font-semibold text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>{s.test}</h3>
                    {s.priority && <Badge label={s.priority} />}
                  </div>
                  <div className="flex items-center gap-5 mb-3">
                    {s.frequency && <p className="text-[#4f8cff] text-[13px] font-medium">{s.frequency}</p>}
                    {s.startAge && <p className="text-[#3a4560] text-[13px]">Starting age {s.startAge}</p>}
                  </div>
                  {s.description && <p className="text-[#5a6a8a] text-[13px] leading-relaxed">{s.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lifestyle */}
        {lifestyle.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 bg-[#f472b6]/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#f472b6]" />
              </div>
              <h2 className="text-[17px] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Lifestyle Changes</h2>
            </div>
            <div className="space-y-4">
              {lifestyle.map((l, i) => (
                <div key={i} className="card hover:ring-1 hover:ring-white/5 transition-all duration-200">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      {l.category && (
                        <p className="text-[#3a4560] text-[11px] font-semibold uppercase tracking-wider mb-1.5">{l.category}</p>
                      )}
                      <h3 className="text-white font-semibold text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>{l.recommendation}</h3>
                    </div>
                    {l.impact && <Badge label={l.impact} />}
                  </div>
                  {l.description && <p className="text-[#5a6a8a] text-[13px] leading-relaxed mt-3">{l.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back */}
        <button
          onClick={() => nav('/dashboard')}
          className="btn-secondary flex items-center justify-center gap-2.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
