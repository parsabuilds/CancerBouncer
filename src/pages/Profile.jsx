import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, RefreshCw } from 'lucide-react';
import { auth } from '../config/firebase';

export default function Profile({ setIsLoggedIn, setAssessmentCompleted, setAssessmentResults }) {
  const nav = useNavigate();
  const user = auth.currentUser;
  const email = user?.email;
  const initial = email ? email.charAt(0).toUpperCase() : null;

  const resetState = () => {
    setIsLoggedIn(false);
    setAssessmentCompleted(false);
    setAssessmentResults(null);
  };

  const handleRetake = () => {
    setAssessmentCompleted(false);
    setAssessmentResults(null);
    nav('/assessment');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await user.delete();
      resetState();
      nav('/onboarding');
    } catch {
      alert('Failed to delete account. You may need to re-login and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      if (user) await auth.signOut();
      resetState();
      nav('/onboarding');
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-atmosphere px-6 pt-10 pb-28 grain">
      <div className="max-w-[420px] mx-auto">
        <h1 className="text-[24px] font-extrabold text-white tracking-tight mb-10" style={{ fontFamily: 'var(--font-display)' }}>
          Profile
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full bg-[#4f8cff]/8 blur-2xl scale-150" />
            <div className="relative w-28 h-28 bg-[#131c30] rounded-full flex items-center justify-center ring-2 ring-white/5 ring-offset-4 ring-offset-[#05080f]">
              {initial ? (
                <span className="text-4xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>{initial}</span>
              ) : (
                <User className="w-12 h-12 text-[#3a4560]" />
              )}
            </div>
          </div>
          <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
            {email || 'Guest User'}
          </p>
          {user && (
            <button className="text-[#4f8cff] text-sm font-medium mt-2 hover:text-[#6ba0ff] transition-colors bg-transparent border-none cursor-pointer">
              Edit Profile
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-10">
          <button onClick={handleRetake} className="btn-secondary flex items-center justify-center gap-3">
            <RefreshCw className="w-[18px] h-[18px]" />
            Retake Assessment
          </button>

          {user && (
            <button
              onClick={handleDelete}
              className="w-full py-4 px-6 bg-transparent text-[#f87171] font-semibold text-[15px] border border-[#ef4444]/20 rounded-[14px] cursor-pointer transition-all duration-200 hover:bg-[#ef4444]/5 flex items-center justify-center gap-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Trash2 className="w-[18px] h-[18px]" />
              Delete Account
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 px-6 bg-[#131c30] text-[#8b9cc0] font-semibold text-[15px] border border-white/[0.04] rounded-[14px] cursor-pointer transition-all duration-200 hover:bg-[#1a2540] flex items-center justify-center gap-3 mb-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <LogOut className="w-[18px] h-[18px]" />
          {user ? 'Log Out' : 'Exit Guest Mode'}
        </button>

        <p className="text-center text-[#1e293b] text-xs">App Version 1.0.0</p>
      </div>
    </div>
  );
}
