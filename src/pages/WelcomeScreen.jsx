import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleStart = () => {
    setIsLoggedIn(true);
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen w-full bg-atmosphere flex flex-col items-center justify-center px-6 grain">
      <div className="w-full max-w-md flex flex-col items-center text-center py-16">
        {/* Doctor */}
        <div className="relative mb-12">
          <div className="absolute inset-0 rounded-full bg-[#4f8cff]/8 blur-3xl scale-[2.5]" />
          <div className="relative w-40 h-40 rounded-full overflow-hidden ring-2 ring-white/5 ring-offset-[6px] ring-offset-[var(--bg-base)] shadow-2xl">
            <img src="/images/doctor.png" alt="Doctor" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Text */}
        <h1
          className="text-3xl font-extrabold text-white tracking-tight mb-5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Welcome to CancerBouncer
        </h1>
        <p className="text-[#7b8db5] text-base leading-[1.8] mb-12 max-w-sm">
          You&apos;re taking an important first step toward understanding your health.
          Our quick assessment will help identify potential risk factors and provide
          personalized recommendations.
        </p>

        {/* CTA */}
        <button onClick={handleStart} className="btn-primary flex items-center justify-center gap-3 text-base">
          Start Assessment
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
