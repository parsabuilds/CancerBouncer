import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleStart = () => {
    setIsLoggedIn(true);
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center w-full max-w-sm space-y-8 text-center">
        {/* Doctor image */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg shadow-blue-950/30">
          <img
            src="/images/doctor.png"
            alt="Doctor"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Welcome to CancerBouncer
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            You're taking an important first step toward understanding your health.
            Our quick assessment will help identify potential risk factors and guide
            you with personalized recommendations — because when it comes to cancer,
            early awareness can make all the difference.
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full max-w-xs py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-base transition-colors duration-150 cursor-pointer"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}
