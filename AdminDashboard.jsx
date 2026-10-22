import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  getOrders,
  updateOrderStatus,
  subscribeToSync,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  resetMenuToDefault
} from '../services/storageService';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  Power,
  UtensilsCrossed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // New Item Modal
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Fast Food',
    isVeg: true,
    prepTime: '8-10 mins',
    description: '',
    image: '/items/burger.jpg'
  });

  const loadData = () => {
    setOrders(getOrders());
    setMenuItems(getMenuItems());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToSync((detail) => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      alert('Please provide item name and price');
      return;
    }
    addMenuItem({
      ...newItem,
      price: Number(newItem.price),
    });
    setIsAddItemOpen(false);
    setNewItem({
      name: '',
      price: '',
      category: 'Burgers & Sandwiches',
      isVeg: true,
      prepTime: '8-10 mins',
      description: '',
      image: '/items/burger.jpg'
    });
    loadData();
  };

  const handleToggleAvailability = (id, currentVal) => {
    updateMenuItem(id, { available: !currentVal });
    loadData();
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this menu item?')) {
      deleteMenuItem(id);
      loadData();
    }
  };

  const handleResetMenu = () => {
    if (window.confirm('Reset canteen menu to default 16 items?')) {
      resetMenuToDefault();
      loadData();
    }
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.itemsPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const completedOrders = orders.filter((o) => o.status === 'Completed');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Header with quick stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <ChefHat className="w-4 h-4" />
              Kitchen Live Control Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Canteen Admin Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Live token queue, order fulfillment status, and real-time food catalog manager
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/10 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Kitchen Kanban ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu Inventory ({menuItems.length})</span>
            </button>
          </div>
        </div>

        {/* 4 KPI metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-2">₹{totalRevenue}</div>
            <span className="text-[11px] text-slate-500">From {orders.length} campus orders</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">New Pending</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-2">{pendingOrders.length}</div>
            <span className="text-[11px] text-slate-500">Awaiting kitchen prep</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Now Cooking</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <ChefHat className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-400 font-mono mt-2">{preparingOrders.length}</div>
            <span className="text-[11px] text-slate-500">In cooking pots / griddles</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ready at Counter</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-400 font-mono mt-2">{readyOrders.length}</div>
            <span className="text-[11px] text-slate-500">Tokens on calling screen</span>
          </div>
        </div>

        {/* TAB 1: KITCHEN KANBAN PIPELINE */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: NEW PENDING ORDERS */}
            <div className="bg-slate-900/60 border border-amber-500/20 rounded-3xl p-5 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-amber-300 uppercase tracking-wider">
                    New Incoming ({pendingOrders.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Step 1</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No pending orders right now.
                  </div>
                ) : (
                  pendingOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-slate-800/90 border border-white/10 hover:border-amber-400/40 p-4 rounded-2xl shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-black text-amber-400">{order.token}</span>
                        <span className="text-xs font-mono font-bold text-white">₹{order.itemsPrice}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">Student: {order.user?.name}</p>

                      <div className="my-2.5 py-2 border-y border-white/5 space-y-1 text-xs">
                        {order.orderItems?.map((i, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>{i.qty}x {i.name}</span>
                            <span className="text-slate-400">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-amber-200/90 italic bg-amber-500/10 p-2 rounded-xl mb-3">
                          📍 {order.notes}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(order._id, 'Preparing')}
                          className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Start Cooking</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(order._id, 'Ready')}
                          className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                          title="Skip directly to Ready"
                        >
                          Ready
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: IN PREPARATION */}
            <div className="bg-slate-900/60 border border-blue-500/20 rounded-3xl p-5 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-spin" />
                  <h3 className="font-extrabold text-sm text-blue-300 uppercase tracking-wider">
                    In Kitchen ({preparingOrders.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Step 2</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {preparingOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No dishes cooking right now.
                  </div>
                ) : (
                  preparingOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-slate-800/90 border border-white/10 hover:border-blue-400/40 p-4 rounded-2xl shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-black text-blue-400">{order.token}</span>
                        <span className="text-xs font-mono font-bold text-white">₹{order.itemsPrice}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">Student: {order.user?.name}</p>

                      <div className="my-2.5 py-2 border-y border-white/5 space-y-1 text-xs">
                        {order.orderItems?.map((i, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>{i.qty}x {i.name}</span>
                            <span className="text-slate-400">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-blue-200/90 italic bg-blue-500/10 p-2 rounded-xl mb-3">
                          📍 {order.notes}
                        </p>
                      )}

                      <button
                        onClick={() => handleStatusChange(order._id, 'Ready')}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Send to Counter (Mark Ready)</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: READY TO COLLECT / RECENTLY COMPLETED */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-5 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <h3 className="font-extrabold text-sm text-emerald-300 uppercase tracking-wider">
                    Ready for Pickup ({readyOrders.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Step 3</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {readyOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No orders waiting at pickup counter.
                  </div>
                ) : (
                  readyOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-slate-800/90 border border-emerald-500/30 p-4 rounded-2xl shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-mono font-black text-emerald-400 animate-pulse">{order.token}</span>
                        <span className="text-xs font-mono font-bold text-white">₹{order.itemsPrice}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">Student: {order.user?.name}</p>

                      <div className="my-2.5 py-2 border-y border-white/5 space-y-1 text-xs">
                        {order.orderItems?.map((i, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>{i.qty}x {i.name}</span>
                            <span className="text-slate-400">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleStatusChange(order._id, 'Completed')}
                        className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Collected by Student</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MENU INVENTORY MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-3xl border border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">Canteen Menu Inventory</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update item pricing, toggle availability if ran out of stock, or add new dishes
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetMenu}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-white/5 transition"
                  title="Restore initial 16 dishes"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Default Menu</span>
                </button>
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add New Food Item</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex gap-4 items-center shadow-lg hover:border-white/20 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/vite.svg';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-bold text-amber-400">₹{item.price}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{item.category}</span>
                    </div>

                    {/* Stock status toggle */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAvailability(item._id, item.available ?? true)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          item.available !== false
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.available !== false ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ADD NEW ITEM MODAL */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Add Food to Canteen Menu</span>
            </h3>

            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Masala Dosa, Cold Coffee"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="e.g. 70"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Burgers & Sandwiches">Burgers & Sandwiches</option>
                    <option value="Rolls & Noodles">Rolls & Noodles</option>
                    <option value="Meals & Rice">Meals & Rice</option>
                    <option value="Snacks & Sides">Snacks & Sides</option>
                    <option value="Beverages & Desserts">Beverages & Desserts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Diet Type</label>
                  <select
                    value={newItem.isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.value === 'veg' })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="veg">Vegetarian 🟢</option>
                    <option value="non-veg">Non-Vegetarian 🔴</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={newItem.prepTime}
                    onChange={(e) => setNewItem({ ...newItem, prepTime: e.target.value })}
                    placeholder="e.g. 5-7 mins"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Special ingredients, taste description..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Item Photo Preview</label>
                <select
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="/items/burger.jpg">Burger</option>
                  <option value="/items/pizza.jpg">Pizza</option>
                  <option value="/items/sandwich.jpg">Sandwich</option>
                  <option value="/items/french-fries.jpg">French Fries</option>
                  <option value="/items/veg-noodles.jpg">Veg Noodles</option>
                  <option value="/items/chicken-noodles.jpg">Chicken Noodles</option>
                  <option value="/items/paneer-roll.jpg">Paneer Roll</option>
                  <option value="/items/chicken-roll.jpg">Chicken Roll</option>
                  <option value="/items/fried-rice.jpg">Fried Rice</option>
                  <option value="/items/veg-thali.jpg">Veg Thali</option>
                  <option value="/items/chicken-thali.jpg">Chicken Thali</option>
                  <option value="/items/samosa.jpg">Samosa</option>
                  <option value="/items/ice-cream.jpg">Ice Cream</option>
                  <option value="/items/milkshake.jpg">Milkshake</option>
                  <option value="/items/coffee.jpg">Coffee</option>
                  <option value="/items/coke.jpg">Cold Drink</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
