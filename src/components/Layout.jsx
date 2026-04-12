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
            <div className="min-h-full w-full" style={{ background: 'var(--bg-base)' }}>
              <main className={showNavbar ? 'pb-24' : ''}>{children}</main>
              {showNavbar && <Navbar />}
            </div>
          </div>

          {/* Bottom bar indicator */}
          <div className="phone-home-bar">
            <div className="phone-home-indicator" />
          </div>
        </div>
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
