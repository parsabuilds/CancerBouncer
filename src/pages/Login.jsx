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
  const [resetMsg, setResetMsg] = useState('');
  const [resetErr, setResetErr] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      const m = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      };
      setError(m[err.code] || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetMsg(''); setResetErr('');
    if (!email) { setResetErr('Enter your email address first.'); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMsg('Password reset email sent. Check your inbox.');
    } catch (err) {
      setResetErr(err.code === 'auth/user-not-found' ? 'No account found.' : 'Failed to send reset email.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-atmosphere flex items-center justify-center px-6 grain">
      <div className="w-full max-w-md py-12">
        {/* Back */}
        <button
          onClick={() => navigate('/onboarding')}
          className="mb-10 p-2.5 -ml-2 rounded-xl text-[#5a6a8a] hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="card !p-8 sm:!p-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome Back
          </h1>
          <p className="text-[#5a6a8a] text-sm mb-10">Sign in to continue your health journey</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#8b9cc0] mb-2.5">Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8b9cc0] mb-2.5">Password</label>
              <input type="password" placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)} required className="input-field" />
            </div>

            {error && (
              <div className="bg-red-500/8 border border-red-500/15 rounded-xl px-5 py-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary text-base">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button type="button" onClick={handleReset}
              className="text-[#4f8cff] hover:text-[#6ba0ff] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer">
              Forgot Password?
            </button>
            {resetMsg && <p className="text-emerald-400 text-sm mt-4 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-5 py-3">{resetMsg}</p>}
            {resetErr && <p className="text-red-400 text-sm mt-4 bg-red-500/8 border border-red-500/15 rounded-xl px-5 py-3">{resetErr}</p>}
          </div>

          <p className="mt-10 text-center text-[#5a6a8a] text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#4f8cff] hover:text-[#6ba0ff] font-medium transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
