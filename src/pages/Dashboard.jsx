import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight, AlertTriangle, Shield } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const CANCER_COLORS = {
  general: '#ef4444',
  lung: '#3b82f6',
  colorectal: '#10b981',
  breast: '#ec4899',
  prostate: '#f59e0b',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-gray-300 text-sm mt-1">
          Risk: <span className="text-white font-semibold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ assessmentCompleted, assessmentResults }) {
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
            Complete your cancer risk assessment to see personalized results and recommendations.
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

  const { cancerRisks, summary } = assessmentResults;

  const filteredRisks = Object.entries(cancerRisks || {})
    .filter(([, data]) => data && data.risk > 0)
    .map(([key, data]) => ({
      key,
      name: data.name || key,
      risk: data.risk,
      reasoning: data.reasoning || '',
      color: CANCER_COLORS[key] || '#6b7280',
    }));

  const chartData = filteredRisks.map((r) => ({
    name: r.name.replace(' Cancer', '').replace(' Risk', ''),
    risk: r.risk,
    color: r.color,
  }));

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-7 h-7 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Your Risk Assessment</h1>
        </div>

        {summary && (
          <div className="bg-gray-900 border-l-4 border-blue-500 rounded-r-xl p-4 mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl p-4 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">Risk Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="risk" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {filteredRisks.map((item) => (
            <div
              key={item.key}
              className="bg-gray-900 rounded-xl p-4 border-l-4 transition-all duration-200"
              style={{ borderLeftColor: item.color }}
            >
              <p className="text-gray-400 text-xs font-medium mb-1">{item.name}</p>
              <p className="text-3xl font-bold mb-2" style={{ color: item.color }}>
                {item.risk}%
              </p>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${item.risk}%`, backgroundColor: item.color }}
                />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{item.reasoning}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/recommendations')}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] mb-6"
        >
          View Recommendations
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-2 bg-gray-900/50 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-gray-500 text-xs leading-relaxed">
            This assessment is for educational purposes only and does not constitute medical advice.
            Please consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
