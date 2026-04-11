import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Shield, ChevronRight } from 'lucide-react';

const PRIORITY_STYLES = {
  High: 'bg-red-500/15 text-red-400 border border-red-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  Low: 'bg-green-500/15 text-green-400 border border-green-500/30',
};

const IMPACT_STYLES = {
  High: 'bg-red-500/15 text-red-400 border border-red-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  Low: 'bg-green-500/15 text-green-400 border border-green-500/30',
};

function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>
      {priority}
    </span>
  );
}

function ImpactBadge({ impact }) {
  const style = IMPACT_STYLES[impact] || IMPACT_STYLES.Low;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style}`}>
      {impact} Impact
    </span>
  );
}

export default function Recommendations({ assessmentCompleted, assessmentResults }) {
  const navigate = useNavigate();

  if (!assessmentCompleted || !assessmentResults) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Assessment Yet</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Complete your cancer risk assessment to receive personalized recommendations.
          </p>
          <button
            onClick={() => navigate('/assessment')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 active:scale-95"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const { screenings = [], lifestyle = [] } = assessmentResults;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Your Recommendations</h1>

        {screenings.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Recommended Screenings</h2>
            </div>
            <div className="space-y-3">
              {screenings.map((screening, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 hover:scale-[1.01] transition-all duration-200 cursor-default"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-medium text-sm">{screening.test}</h3>
                    <PriorityBadge priority={screening.priority} />
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    {screening.frequency && (
                      <p className="text-blue-400 text-xs font-medium">
                        Every {screening.frequency}
                      </p>
                    )}
                    {screening.startAge && (
                      <p className="text-gray-500 text-xs">
                        Starting age {screening.startAge}
                      </p>
                    )}
                  </div>
                  {screening.description && (
                    <p className="text-gray-500 text-xs leading-relaxed">{screening.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {lifestyle.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-500/15 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Lifestyle Recommendations</h2>
            </div>
            <div className="space-y-3">
              {lifestyle.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 hover:scale-[1.01] transition-all duration-200 cursor-default"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      {item.category && (
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                          {item.category}
                        </p>
                      )}
                      <h3 className="text-white font-medium text-sm">{item.recommendation}</h3>
                    </div>
                    {item.impact && <ImpactBadge impact={item.impact} />}
                  </div>
                  {item.description && (
                    <p className="text-gray-500 text-xs leading-relaxed mt-2">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
        >
          Back to Dashboard
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
