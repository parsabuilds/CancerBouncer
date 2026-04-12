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
    <div className="card !p-4 !rounded-xl shadow-2xl !border-white/10">
      <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{label}</p>
      <p className="text-[#7b8db5] text-sm mt-1">Risk: <span className="text-white font-bold">{payload[0].value}%</span></p>
    </div>
  );
};

export default function Dashboard({ assessmentCompleted, assessmentResults }) {
  const nav = useNavigate();

  if (!assessmentCompleted || !assessmentResults) {
    return (
      <div className="min-h-screen w-full bg-atmosphere flex items-center justify-center px-6 grain">
        <div className="text-center max-w-sm">
          <div className="w-28 h-28 bg-[#131c30] rounded-full flex items-center justify-center mx-auto mb-10 ring-1 ring-white/5">
            <Shield className="w-14 h-14 text-[#3a4560]" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>No Assessment Yet</h2>
          <p className="text-[#5a6a8a] text-base leading-relaxed mb-12">
            Complete your cancer risk assessment to see personalized results and recommendations.
          </p>
          <button onClick={() => nav('/assessment')} className="btn-primary max-w-xs mx-auto text-base">Start Assessment</button>
        </div>
      </div>
    );
  }

  const { cancerRisks, summary } = assessmentResults;
  const risks = Object.entries(cancerRisks || {}).filter(([, d]) => d?.risk > 0)
    .map(([k, d]) => ({ key: k, name: d.name || k, risk: d.risk, reasoning: d.reasoning || '', color: COLORS[k] || '#6b7280' }));
  const chartData = risks.map(r => ({ name: r.name.replace(' Cancer', '').replace(' Risk', ''), risk: r.risk, color: r.color }));

  return (
    <div className="min-h-screen w-full bg-atmosphere flex justify-center px-6 grain">
      <div className="w-full max-w-lg pt-12 pb-28">
        {/* Title */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[#4f8cff]/10 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-[#4f8cff]" />
          </div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Your Risk Assessment</h1>
        </div>

        {/* Summary */}
        {summary && (
          <div className="card !border-l-[3px] !border-l-[#4f8cff] mb-10">
            <p className="text-white text-[15px] leading-[1.8]">{summary}</p>
          </div>
        )}

        {/* Chart */}
        <div className="card mb-10">
          <h2 className="text-white font-bold text-lg mb-8" style={{ fontFamily: 'var(--font-display)' }}>Risk Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#5a6a8a', fontSize: 12, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#3a4560', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="risk" radius={[8, 8, 0, 0]} maxBarSize={44}>
                {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {risks.map(r => (
            <div key={r.key} className="card !p-6 !border-l-[3px]" style={{ borderLeftColor: r.color }}>
              <p className="text-white text-sm font-semibold uppercase tracking-wider mb-3">{r.name}</p>
              <p className="text-[32px] font-extrabold mb-4" style={{ color: r.color, fontFamily: 'var(--font-display)' }}>{r.risk}%</p>
              <div className="w-full bg-[#0c1221] rounded-full h-1.5 mb-4">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.risk}%`, backgroundColor: r.color }} />
              </div>
              <p className="text-white text-sm leading-relaxed">{r.reasoning}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={() => nav('/recommendations')} className="btn-primary flex items-center justify-center gap-3 mb-10 text-base">
          View Recommendations <ChevronRight className="w-5 h-5" />
        </button>

        {/* Disclaimer */}
        <div className="flex items-start gap-4 bg-[#0a0e1a] rounded-2xl px-6 py-5 border border-white/[0.04]">
          <AlertTriangle className="w-5 h-5 text-[#fbbf24] mt-0.5 shrink-0" />
          <p className="text-[#3a4560] text-xs leading-relaxed">
            This assessment is for educational purposes only and does not constitute medical advice. Please consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
