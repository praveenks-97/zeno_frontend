import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(8, 12, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.45)',
              }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #a5b4fc 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Project Zeno
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Avatar chip */}
                <div
                  className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white/80">{user.username}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: hovered ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${hovered ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: hovered ? '#f87171' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
