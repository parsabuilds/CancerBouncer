import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';

const IOS_STEPS = [
  {
    number: 1,
    title: 'Open in Safari',
    description: 'Make sure you\'re using Safari — this won\'t work in Chrome or other browsers on iPhone.',
    image: null,
    safariLogo: true,
  },
  {
    number: 2,
    title: 'Tap the Share button',
    description: 'Tap the Share icon (square with an arrow) at the bottom of the screen.',
    image: '/images/install/ios-step1-share.png',
  },
  {
    number: 3,
    title: 'Tap "Add to Home Screen"',
    description: 'Scroll down in the share sheet and tap "Add to Home Screen."',
    image: '/images/install/ios-step2-add-homescreen.png',
  },
  {
    number: 4,
    title: 'Tap "Add"',
    description: 'Confirm the name and tap "Add" in the top right. The app icon will appear on your home screen!',
    image: '/images/install/ios-step3-confirm.png',
  },
];

const ANDROID_STEPS = [
  {
    number: 1,
    title: 'Open in Chrome',
    description: 'Make sure you\'re using Google Chrome to visit this site.',
    image: null,
    chromeLogo: true,
  },
  {
    number: 2,
    title: 'Tap the menu',
    description: 'Tap the three-dot menu icon (⋮) in the top right corner of Chrome.',
    image: '/images/install/android-step1-menu.png',
  },
  {
    number: 3,
    title: 'Tap "Install app"',
    description: 'Select "Install app" or "Add to Home screen" from the menu. Confirm when prompted.',
    image: '/images/install/android-step2-install.png',
  },
];

function StepCard({ step }) {
  return (
    <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full font-bold"
          style={{
            width: 36,
            height: 36,
            fontSize: 15,
            background: 'linear-gradient(135deg, var(--accent-blue), #3b6fd4)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
          }}
        >
          {step.number}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-white font-semibold mb-1"
            style={{ fontSize: 16, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          >
            {step.title}
          </h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#7b8db5', fontFamily: 'var(--font-body)' }}>
            {step.description}
          </p>
        </div>
      </div>

      {step.safariLogo && (
        <div className="mt-4 flex justify-center py-4">
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            <svg width="64" height="64" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="safariGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5AC8FA" />
                  <stop offset="100%" stopColor="#007AFF" />
                </linearGradient>
              </defs>
              <circle cx="64" cy="64" r="60" fill="url(#safariGrad)" />
              <circle cx="64" cy="64" r="55" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              {Array.from({ length: 72 }).map((_, i) => {
                const angle = (i * 5 * Math.PI) / 180;
                const isMajor = i % 9 === 0;
                const outerR = 54;
                const innerR = isMajor ? 48 : 51;
                return (
                  <line
                    key={i}
                    x1={64 + Math.sin(angle) * innerR}
                    y1={64 - Math.cos(angle) * innerR}
                    x2={64 + Math.sin(angle) * outerR}
                    y2={64 - Math.cos(angle) * outerR}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={isMajor ? 2 : 0.8}
                  />
                );
              })}
              <polygon points="64,20 72,64 64,108 56,64" fill="none" />
              <polygon points="64,20 72,64 64,64 56,64" fill="#FF3B30" opacity="0.9" />
              <polygon points="64,108 72,64 64,64 56,64" fill="white" opacity="0.9" />
              <circle cx="64" cy="64" r="3" fill="white" />
            </svg>
          </div>
        </div>
      )}

      {step.chromeLogo && (
        <div className="mt-4 flex justify-center py-4">
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
            <svg width="54" height="54" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="chromeClip"><circle cx="96" cy="96" r="96" /></clipPath>
              </defs>
              <g clipPath="url(#chromeClip)">
                {/* Red */}
                <path d="M168 42H96a54 54 0 0 0-46.8 27L1.8 72.6A96 96 0 0 1 168 42z" fill="#DB4437" />
                {/* Green */}
                <path d="M49.2 69L1.8 72.6A96 96 0 0 0 96 192l24-41.4A54 54 0 0 1 49.2 69z" fill="#0F9D58" />
                {/* Yellow */}
                <path d="M168 42H96c19.8 0 37.2 10.8 46.8 27l24-41.4A96 96 0 0 0 168 42z" fill="#FFCD40" />
                <path d="M142.8 69L168 42a96 96 0 0 1 22.2 126.6L120 150.6A54 54 0 0 0 142.8 69z" fill="#FFCD40" />
                {/* Green bottom */}
                <path d="M120 150.6l70.2 18A96 96 0 0 1 96 192l24-41.4z" fill="#0F9D58" />
              </g>
              {/* Center blue circle */}
              <circle cx="96" cy="96" r="36" fill="#4285F4" />
              <circle cx="96" cy="96" r="24" fill="#F1F1F1" />
              <circle cx="96" cy="96" r="24" fill="#4285F4" />
            </svg>
          </div>
        </div>
      )}

      {step.image && (
        <div
          className="mt-4 rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-auto block"
            style={{ maxHeight: 360, objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}

export default function InstallGuide() {
  const navigate = useNavigate();

  const detectOS = () => {
    if (typeof navigator === 'undefined') return 'ios';
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'android';
    return 'ios';
  };

  const [activeOS, setActiveOS] = useState(detectOS);
  const steps = activeOS === 'ios' ? IOS_STEPS : ANDROID_STEPS;

  return (
    <div className="bg-atmosphere grain" style={{ minHeight: '100vh', minHeight: '100dvh' }}>
      <div className="px-5 pt-5 pb-10" style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 36,
              height: 36,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1
            className="text-white font-bold"
            style={{
              fontSize: 20,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            Install the App
          </h1>
        </div>

        {/* Intro */}
        <div
          className="card mb-6"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(79,140,255,0.1), rgba(45,212,191,0.05))',
            border: '1px solid rgba(79,140,255,0.12)',
          }}
        >
          <div className="flex items-start gap-3">
            <Smartphone size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#a0b0cc', fontFamily: 'var(--font-body)' }}>
              Install CancerBouncer on your home screen for the best experience — instant access, full-screen mode, and offline support.
            </p>
          </div>
        </div>

        {/* OS Toggle */}
        <div
          className="flex mb-6 p-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            onClick={() => setActiveOS('ios')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-medium transition-all"
            style={{
              fontSize: 13,
              fontFamily: 'var(--font-display)',
              background: activeOS === 'ios' ? 'rgba(79,140,255,0.15)' : 'transparent',
              color: activeOS === 'ios' ? '#fff' : '#5a6a88',
              border: activeOS === 'ios' ? '1px solid rgba(79,140,255,0.2)' : '1px solid transparent',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            iPhone
          </button>
          <button
            onClick={() => setActiveOS('android')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-medium transition-all"
            style={{
              fontSize: 13,
              fontFamily: 'var(--font-display)',
              background: activeOS === 'android' ? 'rgba(45,212,191,0.15)' : 'transparent',
              color: activeOS === 'android' ? '#fff' : '#5a6a88',
              border: activeOS === 'android' ? '1px solid rgba(45,212,191,0.2)' : '1px solid transparent',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.69-.04-.86.27l-1.86 3.22c-1.44-.65-3.05-1.01-4.76-1.01-1.71 0-3.32.36-4.76 1.01L5.08 5.71c-.16-.31-.54-.43-.86-.27-.31.16-.43.54-.27.86L5.79 9.48C2.71 11.11.48 14.09.48 17.6h22.44c0-3.51-2.23-6.49-5.32-8.12zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm9.5 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
            </svg>
            Android
          </button>
        </div>

        {/* Steps */}
        <div>
          {steps.map((step) => (
            <StepCard key={`${activeOS}-${step.number}`} step={step} />
          ))}
        </div>

        {/* Done / Go to app */}
        <button
          onClick={() => navigate('/')}
          className="btn-primary mt-4 flex items-center justify-center gap-2"
        >
          <Monitor size={18} />
          Go to App
        </button>
      </div>
    </div>
  );
}
