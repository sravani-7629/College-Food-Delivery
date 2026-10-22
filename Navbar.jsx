import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  LayoutDashboard,
  LogOut,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles
} from 'lucide-react';

const Navbar = ({ cartCount = 0, onOpenCart }) => {
  const { user, logout, quickSwitchRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleToggle = () => {
    if (user?.isAdmin) {
      quickSwitchRole('student');
      navigate('/menu');
    } else {
      quickSwitchRole('admin');
      navigate('/admin');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to={user?.isAdmin ? '/admin' : '/menu'} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition duration-300">
            <UtensilsCrossed className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-white bg-clip-text text-transparent">
                CampusBites
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Express
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Campus Food Delivery & Canteen</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
          {!user?.isAdmin ? (
            <>
              <Link
                to="/menu"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive('/menu')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                Menu
              </Link>
              <Link
                to="/my-orders"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive('/my-orders')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-4 h-4" />
                My Orders
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive('/admin')
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Kitchen Orders
              </Link>
              <Link
                to="/menu"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                <UtensilsCrossed className="w-4 h-4" />
                Preview Student Menu
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Role Switcher Badge */}
          <button
            onClick={handleRoleToggle}
            title="Click to toggle between Student and Kitchen Admin view instantly"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 transition shadow-sm hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-slate-400">Mode:</span>
            {user?.isAdmin ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400">
                <GraduationCap className="w-3.5 h-3.5" /> Student
              </span>
            )}
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Switch</span>
          </button>

          {/* Cart Trigger (for student) */}
          {!user?.isAdmin && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 text-slate-200 hover:text-amber-400 transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User profile dropdown / status */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-slate-200 leading-tight truncate max-w-[110px]">{user?.name || 'Guest'}</p>
              <p className="text-slate-400 text-[10px]">{user?.isAdmin ? 'Canteen Admin' : 'Campus Student'}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
