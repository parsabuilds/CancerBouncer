import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { auth } from './config/firebase';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import FactScreen from './pages/FactScreen';
import Onboarding from './pages/Onboarding';
import WelcomeScreen from './pages/WelcomeScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';

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
      <Routes>
        <Route path="/" element={<FactScreen />} />
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
