import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { auth } from './config/firebase';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

const FactScreen = lazy(() => import('./pages/FactScreen'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Profile = lazy(() => import('./pages/Profile'));
const InstallGuide = lazy(() => import('./pages/InstallGuide'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const PROTECTED_ROUTES = ['/dashboard', '/recommendations', '/profile'];

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const location = useLocation();

  const showNavbar = isLoggedIn && assessmentCompleted && PROTECTED_ROUTES.includes(location.pathname);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => setIsLoggedIn(!!user));
  }, []);

  return (
    <Layout showNavbar={showNavbar}>
      <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<FactScreen />} />
        <Route path="/install" element={<InstallGuide />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/welcome" element={<WelcomeScreen setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/assessment"
          element={
            <Assessment
              setAssessmentCompleted={setAssessmentCompleted}
              setAssessmentResults={setAssessmentResults}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              assessmentCompleted={assessmentCompleted}
              assessmentResults={assessmentResults}
            />
          }
        />
        <Route
          path="/recommendations"
          element={
            <Recommendations
              assessmentCompleted={assessmentCompleted}
              assessmentResults={assessmentResults}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              setIsLoggedIn={setIsLoggedIn}
              setAssessmentCompleted={setAssessmentCompleted}
              setAssessmentResults={setAssessmentResults}
            />
          }
        />
      </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}
