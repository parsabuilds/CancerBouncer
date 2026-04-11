import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-atmosphere-warm flex flex-col items-center justify-between px-8 py-14 grain">
      {/* Top spacer */}
      <div />

      {/* Center content */}
      <div className="flex flex-col items-center w-full max-w-sm">
        {/* Logo + Branding */}
        <div className="flex flex-col items-center mb-14">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#4f8cff]/10 blur-2xl scale-150" />
            <img
              src="/images/Logo_transparent.png"
              alt="CancerBouncer"
              className="relative w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>
          <h1
            className="text-4xl font-extrabold text-white tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            CancerBouncer
          </h1>
          <p className="text-[#7b8db5] text-center text-[15px] leading-relaxed max-w-[280px]">
            Get Ahead of Cancer &mdash; Discover Your Risk in Minutes
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="w-full space-y-4 mb-8">
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Sign Up
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary">
            Login
          </button>
        </div>

        {/* Guest link */}
        <button
          onClick={() => navigate('/welcome')}
          className="text-[#5a6a8a] hover:text-[#8b9cc0] text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          Continue as Guest
        </button>
      </div>

      {/* Memorial */}
      <p className="text-[11px] text-[#3a4560] mt-12 text-center">
        In memory of{' '}
        <a
          href="https://www.instagram.com/jamesghambin/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c49a6c] hover:text-[#ddb98a] underline underline-offset-2 decoration-[#c49a6c]/30 transition-colors duration-200"
        >
          James Ghambin
        </a>
      </p>
    </div>
  );
}
