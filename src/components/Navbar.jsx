import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, User } from 'lucide-react';

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recommendations', icon: ClipboardList, label: 'Tips' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass">
      <div className="max-w-[480px] mx-auto flex items-center justify-around py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 px-5 py-2 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-[#4f8cff]' : 'text-[#3a4560] hover:text-[#5a6a8a]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-semibold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
