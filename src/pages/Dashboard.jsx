import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight, AlertTriangle, Shield } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';

const COLORS = {
  general: '#ef4444', lung: '#4f8cff', colorectal: '#2dd4bf',
  breast: '#f472b6', prostate: '#fbbf24',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !p-3 !rounded-xl shadow-2xl">
      <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{label}</p>
      <p className="text-[#7b8db5] text-sm mt-1">
        Risk: <span className="text-white font-bold">{payload[0].value}%</span>
      </p>
    </div>
  );
};

export default function Dashboard({ assessmentCompleted, assessmentResults }) {
  const nav = useNavigate();

  if (!assessmentCompleted || !assessmentResults) {
    return (
      <div className="min-h-screen bg-atmosphere flex items-center justify-center px-8 grain">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-[#131c30] rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-white/5">
            <Shield className="w-11 h-11 text-[#3a4560]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>No Assessment Yet</h2>
          <p className="text-[#5a6a8a] text-[15px] leading-relaxed mb-10">
            Complete your cancer risk assessment to see personalized results and recommendations.
          </p>
          <button onClick={() => nav('/assessment')} className="btn-primary max-w-[260px] mx-auto">
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const { cancerRisks, summary } = assessmentResults;

  const risks = Object.entries(cancerRisks || {})
    .filter(([, d]) => d?.risk > 0)
    .map(([k, d]) => ({
      key: k, name: d.name || k, risk: d.risk,
      reasoning: d.reasoning || '', color: COLORS[k] || '#6b7280',
    }));

  const chartData = risks.map(r => ({
    name: r.name.replace(' Cancer', '').replace(' Risk', ''),
    risk: r.risk, color: r.color,
  }));

  return (
    <div className="min-h-screen bg-atmosphere px-6 pt-10 pb-28 grain">
      <div className="max-w-[480px] mx-auto">
        {/* Title */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-10 h-10 bg-[#4f8cff]/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#4f8cff]" />
          </div>
          <h1 className="text-[24px] font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Your Risk Assessment
          </h1>
        </div>

        {/* Summary */}
        {summary && (
          <div className="card !border-l-[3px] !border-l-[#4f8cff] mb-8">
            <p className="text-[#8b9cc0] text-[14px] leading-[1.7]">{summary}</p>
          </div>
        )}

        {/* Chart */}
        <div className="card mb-8">
          <h2 className="text-white font-bold text-[17px] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Risk Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#5a6a8a', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#3a4560', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="risk" radius={[8, 8, 0, 0]} maxBarSize={42}>
                {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {risks.map(r => (
            <div key={r.key} className="card !p-5 !border-l-[3px]" style={{ borderLeftColor: r.color }}>
              <p className="text-[#5a6a8a] text-[11px] font-semibold uppercase tracking-wider mb-2">{r.name}</p>
              <p className="text-[28px] font-extrabold mb-3" style={{ color: r.color, fontFamily: 'var(--font-display)' }}>{r.risk}%</p>
              <div className="w-full bg-[#0c1221] rounded-full h-[5px] mb-3">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.risk}%`, backgroundColor: r.color }} />
              </div>
              <p className="text-[#3a4560] text-[11px] leading-relaxed">{r.reasoning}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => nav('/recommendations')}
          className="btn-primary flex items-center justify-center gap-2.5 mb-8"
        >
          View Recommendations
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-[#0c1221] rounded-2xl px-5 py-4 border border-white/[0.03]">
          <AlertTriangle className="w-4 h-4 text-[#fbbf24] mt-0.5 shrink-0" />
          <p className="text-[#3a4560] text-[11px] leading-relaxed">
            This assessment is for educational purposes only and does not constitute medical advice.
            Please consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
