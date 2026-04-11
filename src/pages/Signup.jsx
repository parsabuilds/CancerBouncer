import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      navigate('/welcome');
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
      };
      setError(messages[err.code] || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-atmosphere flex items-center justify-center px-6 py-12 grain">
      <div className="w-full max-w-[420px] mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/onboarding')}
          className="mb-10 p-2 -ml-2 rounded-xl text-[#5a6a8a] hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Card */}
        <div className="card">
          <h1
            className="text-[28px] font-extrabold text-white tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Create Account
          </h1>
          <p className="text-[#5a6a8a] text-sm mb-8">Join us to track your health insights</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#8b9cc0] mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#8b9cc0] mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
              <p className="text-[#3a4560] text-xs mt-2 ml-1">Must be at least 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[#5a6a8a] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4f8cff] hover:text-[#6ba0ff] font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
