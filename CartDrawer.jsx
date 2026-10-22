import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createOrder } from '../services/storageService';

const CartDrawer = ({ isOpen, onClose, cart, setCart, user, onOrderSuccess }) => {
  const [deliveryLocation, setDeliveryLocation] = useState('Campus Canteen Counter 1');
  const [notes, setNotes] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const orderPayload = {
        user: user || { id: 'guest-id', name: 'Student', email: 'student@college.edu' },
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        itemsPrice: totalAmount,
        notes: `${deliveryLocation} - ${notes}`.trim(),
      };

      const newOrder = createOrder(orderPayload);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch (e) {
        // Safe fallback
      }

      setCart([]);
      setIsOrdering(false);
      onClose();
      if (onOrderSuccess) {
        onOrderSuccess(newOrder);
      }
    } catch (err) {
      console.error('Order creation error', err);
      setIsOrdering(false);
      alert('Unable to place order: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-white/10 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Food Basket</h2>
                <p className="text-xs text-slate-400">{cart.length} unique item{cart.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Your basket is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1">
                  Explore our fresh canteen menu and add your favorite snacks, rolls, and thalis!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
                >
                  Browse Menu Now
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="p-3.5 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3 hover:border-white/15 transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-700 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/vite.svg';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="font-semibold text-sm text-white truncate">{item.name}</h4>
                        </div>
                        <p className="text-xs text-amber-400 font-bold mt-0.5">₹{item.price}</p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-slate-900/90 px-2 py-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => updateQty(item._id, -1)}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, 1)}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery / Pickup Point Selection */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Pickup & Delivery Point
                  </label>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="Campus Canteen Express Counter 1">Campus Canteen Express Counter 1</option>
                    <option value="Canteen Takeaway Counter 2">Canteen Takeaway Counter 2</option>
                    <option value="Hostel Block A - Entrance Lobby">Hostel Block A - Entrance Lobby</option>
                    <option value="Hostel Block B - Entrance Lobby">Hostel Block B - Entrance Lobby</option>
                    <option value="Central Library Food Court">Central Library Food Court</option>
                    <option value="Student Activity Center (SAC)">Student Activity Center (SAC)</option>
                  </select>
                </div>

                {/* Special Cooking / Delivery Notes */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    Kitchen Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra ketchup, mild spicy, call on arrival"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer with Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-slate-950/70 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Canteen Convenience Fee</span>
                  <span className="text-emerald-400 font-semibold">FREE (₹0)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-amber-400 text-lg">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isOrdering}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isOrdering ? (
                  <span>Generating Pickup Token...</span>
                ) : (
                  <>
                    <span>Place Order & Generate Token</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant digital token for queue-free counter pickup
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
