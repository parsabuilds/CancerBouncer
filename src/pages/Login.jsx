import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      };
      setError(messages[err.code] || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetMessage('');
    setResetError('');
    if (!email) {
      setResetError('Please enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setResetError(messages[err.code] || 'Failed to send reset email.');
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
            Welcome Back
          </h1>
          <p className="text-[#5a6a8a] text-sm mb-8">Sign in to continue your health journey</p>

          <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Forgot password */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#4f8cff] hover:text-[#6ba0ff] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Forgot Password?
            </button>
            {resetMessage && (
              <p className="text-emerald-400 text-sm mt-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3">{resetMessage}</p>
            )}
            {resetError && (
              <p className="text-red-400 text-sm mt-3 bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">{resetError}</p>
            )}
          </div>

          {/* Footer link */}
          <p className="mt-8 text-center text-[#5a6a8a] text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#4f8cff] hover:text-[#6ba0ff] font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
