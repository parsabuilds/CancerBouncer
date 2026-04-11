import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center w-full max-w-xs space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/images/Logo_transparent.png"
            alt="CancerBouncer logo"
            className="w-28 h-28 object-contain drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            CancerBouncer
          </h1>
          <p className="text-gray-400 text-center text-sm leading-relaxed">
            Get Ahead of Cancer — Discover Your Risk in Minutes
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3 pt-4">
          <button
            onClick={() => navigate('/signup')}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-base transition-colors duration-150 cursor-pointer"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 rounded-xl border border-gray-600 hover:border-gray-400 text-gray-200 hover:text-white font-semibold text-base transition-colors duration-150 bg-transparent cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Guest link */}
        <button
          onClick={() => navigate('/welcome')}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-150 bg-transparent border-none cursor-pointer"
        >
          Continue as Guest
        </button>
      </div>

      {/* Memorial */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-600">
        In memory of{' '}
        <a
          href="https://www.instagram.com/jamesghambin/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-700 hover:text-amber-500 underline underline-offset-2 transition-colors duration-150"
        >
          James Ghambin
        </a>
      </p>
    </div>
  );
}
