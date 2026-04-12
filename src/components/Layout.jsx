import Navbar from './Navbar';

export default function Layout({ children, showNavbar }) {
  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--bg-base)' }}>
      <main className={showNavbar ? 'pb-24' : ''}>{children}</main>
      {showNavbar && <Navbar />}
    </div>
  );
}
