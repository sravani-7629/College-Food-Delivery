import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, ArrowRight, Sparkles, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = role === 'admin' ? 'admin@college.edu' : 'student@college.edu';
      const demoPass = role === 'admin' ? 'admin123' : 'student123';
      const data = await login(demoEmail, demoPass);
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, rgba(245, 158, 11, 0.15), transparent 70%), radial-gradient(ellipse at bottom, rgba(234, 88, 12, 0.1), transparent 70%)",
      }}
    >
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl shadow-orange-500/30 mb-4">
            <UtensilsCrossed className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">CampusBites</h1>
          <p className="text-slate-400 text-sm mt-1">Smart College Food Delivery & Canteen System</p>
        </div>

        {/* Glass Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          <h2 className="text-xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mb-6">Enter your student / admin account to continue</p>

          {/* Error notice */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Quick Demo 1-Click Login Buttons */}
          <div className="mb-6 space-y-2">
            <p className="text-[11px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Instant Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-amber-500/20 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition shadow-sm hover:scale-[1.02]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-emerald-500/20 text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5 transition shadow-sm hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
              or enter credentials
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@college.edu"
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold transition">
              Create New Account
            </Link>
          </div>

        </div>

        {/* Feature badge pill */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Standalone Client • Runs 100% locally in VS Code</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
