import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import ReceiptModal from '../components/ReceiptModal';
import { getMenuItems, subscribeToSync, getSavedCart, saveCart } from '../services/storageService';
import {
  Search,
  Sparkles,
  Clock,
  Flame,
  Star,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Burgers & Sandwiches',
  'Rolls & Noodles',
  'Meals & Rice',
  'Snacks & Sides',
  'Beverages & Desserts',
];

const StudentMenu = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState(() => getSavedCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [recentlyPlacedOrder, setRecentlyPlacedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Sync menu items & listen for updates
  useEffect(() => {
    setMenuItems(getMenuItems());
    const unsubscribe = subscribeToSync((detail) => {
      if (detail?.type === 'MENU_UPDATED' || detail?.type === 'MENU_RESET') {
        setMenuItems(getMenuItems());
      }
    });
    return unsubscribe;
  }, []);

  // Save cart changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Add item to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x._id === item._id);
      if (existing) {
        return prev.map((x) => (x._id === item._id ? { ...x, qty: x.qty + 1 } : x));
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
    showToast(`Added ${item.name} to cart!`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((x) => {
          if (x._id === id) {
            const next = x.qty + delta;
            return next > 0 ? { ...x, qty: next } : null;
          }
          return x;
        })
        .filter(Boolean)
    );
  };

  const getItemCartQty = (id) => {
    const found = cart.find((x) => x._id === id);
    return found ? found.qty : 0;
  };

  // Filter logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesDiet =
      vegFilter === 'all' ||
      (vegFilter === 'veg' && item.isVeg) ||
      (vegFilter === 'non-veg' && !item.isVeg);

    return matchesSearch && matchesCategory && matchesDiet;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-500 selection:text-black">
      
      {/* Navbar */}
      <Navbar
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Live Campus Canteen Food Hub
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Order Delicious Bites <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                  Skip The Campus Queue
                </span>
              </h1>
              <p className="text-slate-400 mt-2 max-w-xl text-sm sm:text-base">
                Freshly prepared meals, sizzlers, rolls, hot cappuccino & snacks ready for pickup at your college counter in minutes.
              </p>
            </div>

            {/* Quick Hero Banner Badge */}
            <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-3xl border border-white/10 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-xl">
                ⚡
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-amber-400">Average Pickup</p>
                <p className="text-xl font-extrabold text-white">7 - 10 Mins</p>
                <p className="text-[11px] text-slate-400">Tokens shown on live counters</p>
              </div>
            </div>
          </div>

          {/* Search Bar & Dietary Filter Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search food by name, ingredients (e.g. Burger, Thali, Fries)..."
                className="w-full bg-slate-900/90 border border-white/10 focus:border-amber-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-lg hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Diet Filter Chips */}
            <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-900/90 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  vegFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Diet
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  vegFilter === 'veg'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Veg Only
              </button>
              <button
                onClick={() => setVegFilter('non-veg')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  vegFilter === 'non-veg'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition duration-150 ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-950 shadow-lg'
                    : 'bg-slate-900/70 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Food Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{selectedCategory}</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {filteredItems.length} items
            </span>
          </h2>
          <span className="text-xs text-slate-400">All prices include campus subsidy</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500 mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">No food items found</h3>
            <p className="text-sm text-slate-500 mt-1">Try resetting your filters or search keywords</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setVegFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const qty = getItemCartQty(item._id);

              return (
                <div
                  key={item._id}
                  className="group bg-slate-900/70 border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = '/vite.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                    {/* Veg / Non-Veg Indicator Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-bold">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <span className={item.isVeg ? 'text-emerald-300' : 'text-rose-300'}>
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Prep time badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-amber-300">
                      <Clock className="w-3 h-3" />
                      <span>{item.prepTime || '8 mins'}</span>
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-2xl font-black text-white font-mono drop-shadow-md">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400/80">
                          {item.category}
                        </span>
                        {item.rating && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-white mt-1 group-hover:text-amber-400 transition leading-snug">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {item.description || 'Freshly cooked delicious campus canteen specialty.'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-5 pt-4 border-t border-white/5">
                      {qty > 0 ? (
                        <div className="flex items-center justify-between bg-slate-800 rounded-2xl p-1.5 border border-amber-500/30">
                          <button
                            onClick={() => updateCartQty(item._id, -1)}
                            className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold text-amber-400 text-sm">{qty} in basket</span>
                          <button
                            onClick={() => updateCartQty(item._id, 1)}
                            className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          disabled={item.available === false}
                          className="w-full py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition active:scale-95"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>{item.available === false ? 'Out of Stock' : 'Add to Basket'}</span>
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

      {/* Sticky Bottom Cart Bar on Mobile / Desktop when Cart has items */}
      {cartTotalItems > 0 && !isCartOpen && (
        <div className="sticky bottom-4 z-30 max-w-xl mx-auto px-4 w-full">
          <div className="p-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl shadow-2xl shadow-orange-500/30 flex items-center justify-between text-slate-950 font-bold">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center text-sm font-extrabold">
                {cartTotalItems}
              </div>
              <div>
                <p className="text-xs leading-none uppercase tracking-wider text-slate-900">Total in Basket</p>
                <p className="text-lg leading-tight font-black">₹{cartTotalPrice}</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 text-xs font-extrabold transition shadow-md flex items-center gap-2"
            >
              <span>View Cart & Checkout</span>
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        user={user}
        onOrderSuccess={(newOrder) => {
          setRecentlyPlacedOrder(newOrder);
        }}
      />

      {/* Digital Receipt Modal on order placement */}
      <ReceiptModal
        order={recentlyPlacedOrder}
        isOpen={Boolean(recentlyPlacedOrder)}
        onClose={() => {
          setRecentlyPlacedOrder(null);
          navigate('/my-orders');
        }}
      />
    </div>
  );
};

export default StudentMenu;
