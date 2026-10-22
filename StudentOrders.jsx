import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ReceiptModal from '../components/ReceiptModal';
import { getOrders, getUserOrders, cancelOrder, subscribeToSync } from '../services/storageService';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  RotateCcw,
  Ban,
  ArrowRight,
  Sparkles,
  ChefHat,
  ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_STEPS = ['Pending', 'Preparing', 'Ready', 'Completed'];

const StudentOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'completed'

  const loadOrders = () => {
    if (user) {
      const userOrds = getUserOrders(user.id || user.email);
      // If user has no orders yet, let's also show all orders or sample orders so the UI is never blank
      if (userOrds.length === 0) {
        setOrders(getOrders());
      } else {
        setOrders(userOrds);
      }
    } else {
      setOrders(getOrders());
    }
  };

  useEffect(() => {
    loadOrders();
    const unsubscribe = subscribeToSync((detail) => {
      if (detail?.type === 'ORDERS_UPDATED') {
        loadOrders();
      }
    });
    return unsubscribe;
  }, [user]);

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
      loadOrders();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'active') return o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready';
    if (filterTab === 'completed') return o.status === 'Completed' || o.status === 'Cancelled';
    return true;
  });

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Live Order Tracker
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Canteen Orders
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Track real-time cooking progress & pickup tokens at the kitchen counter
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
          >
            <span>Order More Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 w-fit">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === 'active'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Active ({orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready').length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === 'completed'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            History & Completed ({orders.filter((o) => o.status === 'Completed' || o.status === 'Cancelled').length})
          </button>
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500 mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">No orders in this category</h3>
            <p className="text-sm text-slate-500 mt-1">Check your other tabs or visit the menu to grab a bite!</p>
            <Link
              to="/menu"
              className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Browse Campus Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status === 'Cancelled';

              return (
                <div
                  key={order._id}
                  className="bg-slate-900/80 border border-white/10 hover:border-amber-500/30 rounded-3xl p-6 shadow-xl transition"
                >
                  {/* Top Bar: Token & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">Pickup Token</span>
                        <span className="text-2xl font-black font-mono text-amber-400">{order.token}</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Order ID: {order._id}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                          order.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : order.status === 'Preparing'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                            : order.status === 'Ready'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-2 ring-emerald-500/30'
                            : order.status === 'Completed'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {order.status === 'Ready' && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                        {order.status === 'Preparing' && <ChefHat className="w-3.5 h-3.5 text-blue-400" />}
                        {order.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                        {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Tracker Bar (if not cancelled) */}
                  {!isCancelled && (
                    <div className="py-6 border-b border-white/5">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step} className="flex flex-col items-center text-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition duration-300 mb-2 ${
                                  isCurrent
                                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                                    : isDone
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-500 border border-white/5'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-[11px] font-bold ${
                                  isCurrent
                                    ? 'text-amber-400'
                                    : isDone
                                    ? 'text-white'
                                    : 'text-slate-500'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="py-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order Summary</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-white/5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-400">{item.qty}x</span>
                            <span className="font-semibold text-white">{item.name}</span>
                          </div>
                          <span className="text-slate-300 font-mono">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 italic">
                        📍 {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm">
                      <span className="text-slate-400">Total Paid: </span>
                      <span className="text-lg font-black text-amber-400 font-mono">₹{order.itemsPrice}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/5 transition"
                      >
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Token Receipt</span>
                      </button>

                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Digital Receipt Modal */}
      <ReceiptModal
        order={selectedReceiptOrder}
        isOpen={Boolean(selectedReceiptOrder)}
        onClose={() => setSelectedReceiptOrder(null)}
      />
    </div>
  );
};

export default StudentOrders;
