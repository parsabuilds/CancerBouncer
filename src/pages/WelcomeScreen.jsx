import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleStart = () => {
    setIsLoggedIn(true);
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-atmosphere flex flex-col items-center justify-center px-8 py-14 grain">
      <div className="flex flex-col items-center w-full max-w-sm text-center">
        {/* Doctor image */}
        <div className="relative mb-10">
          <div className="absolute inset-0 rounded-full bg-[#4f8cff]/8 blur-3xl scale-[2]" />
          <div className="relative w-36 h-36 rounded-full overflow-hidden ring-2 ring-white/5 ring-offset-4 ring-offset-[#05080f] shadow-2xl shadow-[#4f8cff]/10">
            <img
              src="/images/doctor.png"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-3xl font-extrabold text-white tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Welcome to CancerBouncer
        </h1>
        <p className="text-[#7b8db5] text-[15px] leading-[1.7] mb-10 max-w-[320px]">
          You&apos;re taking an important first step toward understanding your health.
          Our quick assessment will help identify potential risk factors and guide
          you with personalized recommendations.
        </p>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="btn-primary flex items-center justify-center gap-3"
        >
          Start Assessment
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
