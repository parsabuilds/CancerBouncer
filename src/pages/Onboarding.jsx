import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-atmosphere-warm flex flex-col items-center justify-center px-6 grain">
      <div className="w-full max-w-md flex flex-col items-center py-8">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[#4f8cff]/10 blur-3xl scale-[2]" />
          <img
            src="/images/Logo_transparent.png"
            alt="CancerBouncer"
            className="relative w-36 h-36 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <h1
          className="text-5xl font-extrabold text-white tracking-tight mb-4 text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          CancerBouncer
        </h1>
        <p className="text-[#7b8db5] text-center text-lg leading-relaxed mb-10 max-w-xs">
          Get Ahead of Cancer &mdash; Discover Your Risk in Minutes
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4 mb-6">
          <button onClick={() => navigate('/signup')} className="btn-primary text-base">
            Sign Up
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary text-base">
            Login
          </button>
        </div>

        {/* Guest */}
        <button
          onClick={() => navigate('/welcome')}
          className="text-[#5a6a8a] hover:text-[#8b9cc0] text-base font-medium transition-colors bg-transparent border-none cursor-pointer"
        >
          Continue as Guest
        </button>
      </div>

      {/* Memorial — fixed to bottom */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-[#3a4560]">
        In memory of{' '}
        <a
          href="https://www.instagram.com/jamesghambin/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c49a6c] hover:text-[#ddb98a] underline underline-offset-2 decoration-[#c49a6c]/30 transition-colors"
        >
          James Ghambin
        </a>
      </p>
    </div>
  );
}
