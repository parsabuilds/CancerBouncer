import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, RefreshCw } from 'lucide-react';
import { auth } from '../config/firebase';

export default function Profile({ setIsLoggedIn, setAssessmentCompleted, setAssessmentResults }) {
  const navigate = useNavigate();
  const firebaseUser = auth.currentUser;
  const userEmail = firebaseUser?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : null;

  const handleRetakeAssessment = () => {
    setAssessmentCompleted(false);
    setAssessmentResults(null);
    navigate('/assessment');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await firebaseUser.delete();
      setIsLoggedIn(false);
      setAssessmentCompleted(false);
      setAssessmentResults(null);
      navigate('/onboarding');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. You may need to re-login and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      if (firebaseUser) {
        await auth.signOut();
      }
      setIsLoggedIn(false);
      setAssessmentCompleted(false);
      setAssessmentResults(null);
      navigate('/onboarding');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-gray-700">
            {userInitial ? (
              <span className="text-3xl font-bold text-white">{userInitial}</span>
            ) : (
              <User className="w-10 h-10 text-gray-500" />
            )}
          </div>
          <p className="text-white font-semibold text-lg">
            {userEmail || 'Guest User'}
          </p>
          {firebaseUser && (
            <button className="text-blue-400 text-sm mt-2 hover:text-blue-300 transition-colors">
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={handleRetakeAssessment}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-blue-500/50 text-blue-400 font-semibold hover:bg-blue-500/10 transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshCw className="w-5 h-5" />
            Retake Assessment
          </button>

          {firebaseUser && (
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-500/50 text-red-400 font-semibold hover:bg-red-500/10 transition-all duration-200 active:scale-[0.98]"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all duration-200 active:scale-[0.98] mb-8"
        >
          <LogOut className="w-5 h-5" />
          {firebaseUser ? 'Log Out' : 'Exit Guest Mode'}
        </button>

        <p className="text-center text-gray-600 text-xs">App Version 1.0.0</p>
      </div>
    </div>
  );
}
