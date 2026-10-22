import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Lock, Mail, User, Home, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(name, email, password, isAdmin, hostelRoom);
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
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
      <div className="relative w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-xl shadow-orange-500/30 mb-3">
            <UtensilsCrossed className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Create CampusBites Account</h1>
          <p className="text-slate-400 text-xs mt-0.5">Register for fast digital food pickup on campus</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samarth Varma"
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. samarth@college.edu"
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel Room / Department</label>
              <div className="relative">
                <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  placeholder="e.g. Hostel 3, Room 112"
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Role Radio Pill */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdmin(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    !isAdmin
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}
                >
                  Student 🎓
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdmin(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    isAdmin
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}
                >
                  Canteen Admin 👨‍🍳
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Registering...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold transition">
              Sign In Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
