import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children, showNavbar }) {
  return (
    <>
      {/* Desktop wrapper — only visible on screens wider than phone size */}
      <div className="desktop-wrapper">
        <div className="desktop-bg" />

        {/* Message above the phone */}
        <div className="desktop-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <span>This app is designed for mobile devices</span>
        </div>

        {/* Phone frame */}
        <div className="phone-frame">
          {/* Phone notch */}
          <div className="phone-notch">
            <div className="phone-notch-cam" />
          </div>

          {/* Phone screen — the actual app lives here */}
          <div className="phone-screen">
            <div className="phone-scroll-area" style={{ background: 'var(--bg-base)' }}>
              <main className={showNavbar ? 'pb-24' : ''}>{children}</main>
            </div>
            {showNavbar && <Navbar />}
          </div>

          {/* Bottom bar indicator */}
          <div className="phone-home-bar">
            <div className="phone-home-indicator" />
          </div>
        </div>

        {/* Install guide link — below the phone */}
        <Link to="/install" className="desktop-install-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>How to install on your phone</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* Mobile — render directly, no frame */}
      <div className="mobile-wrapper">
        <div className="min-h-screen w-full" style={{ background: 'var(--bg-base)' }}>
          <main className={showNavbar ? 'pb-24' : ''}>{children}</main>
          {showNavbar && <Navbar />}
        </div>
      </div>
    </>
  );
}
