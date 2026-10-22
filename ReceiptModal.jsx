import React from 'react';
import { X, Printer, CheckCircle, Clock, Utensils, QrCode } from 'lucide-react';

const ReceiptModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Container */}
        <div className="space-y-6">
          <div className="text-center pb-5 border-b border-white/10">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">CampusBites Canteen Receipt</h3>
            <p className="text-xs text-slate-400 mt-0.5">College Campus Central Food Court</p>
            
            {/* Huge Pickup Token */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300">Pickup Token</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-wider mt-0.5">
                {order.token}
              </div>
              <p className="text-[11px] text-slate-300 mt-1">Show this token at the kitchen pickup counter</p>
            </div>
          </div>

          {/* Details metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/60 p-3.5 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-400">Order Status:</span>
              <p className="font-semibold text-emerald-400 mt-0.5">{order.status}</p>
            </div>
            <div>
              <span className="text-slate-400">Order Placed:</span>
              <p className="font-semibold text-white mt-0.5">
                {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">Student:</span>
              <p className="font-semibold text-white mt-0.5">{order.user?.name} ({order.user?.email})</p>
            </div>
            {order.notes && (
              <div className="col-span-2 border-t border-white/5 pt-2">
                <span className="text-slate-400">Note:</span>
                <p className="text-amber-200 mt-0.5 italic">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Itemized list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ordered Items</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-xs text-slate-400">x{item.qty}</span>
                  </div>
                  <span className="font-medium text-slate-200">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10 text-base font-bold">
              <span>Total Paid</span>
              <span className="text-amber-400 text-lg">₹{order.itemsPrice}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 transition"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center transition shadow-lg shadow-amber-500/20"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;
