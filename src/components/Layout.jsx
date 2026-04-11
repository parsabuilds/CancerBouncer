import Navbar from './Navbar';

export default function Layout({ children, showNavbar }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <main className={showNavbar ? 'pb-20' : ''}>{children}</main>
      {showNavbar && <Navbar />}
    </div>
  );
}
