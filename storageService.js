import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, DEMO_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  MENU: 'campusbites_menu_items',
  ORDERS: 'campusbites_orders',
  USERS: 'campusbites_users',
  ACTIVE_USER: 'userInfo',
  CART: 'campusbites_cart',
};

// Broadcast channel / event name for real-time reactivity between components/tabs
const EVENT_NAME = 'campusbites_sync_event';

export const dispatchSync = (detail) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  }
};

export const subscribeToSync = (callback) => {
  if (typeof window === 'undefined') return () => {};
  const handler = (event) => callback(event.detail);
  window.addEventListener(EVENT_NAME, handler);
  // Also listen to storage events from other browser tabs
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
};

// ======================
// MENU SERVICES
// ======================
export const getMenuItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
      return INITIAL_MENU_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading menu from localStorage', err);
    return INITIAL_MENU_ITEMS;
  }
};

export const saveMenuItems = (items) => {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
  dispatchSync({ type: 'MENU_UPDATED', items });
};

export const addMenuItem = (itemData) => {
  const items = getMenuItems();
  const newItem = {
    ...itemData,
    _id: `food-${Date.now()}`,
    available: itemData.available ?? true,
    rating: itemData.rating || 4.5,
    prepTime: itemData.prepTime || '10 mins',
    price: Number(itemData.price) || 50,
  };
  const updated = [newItem, ...items];
  saveMenuItems(updated);
  return newItem;
};

export const updateMenuItem = (id, updatedFields) => {
  const items = getMenuItems();
  const updated = items.map((item) =>
    item._id === id ? { ...item, ...updatedFields } : item
  );
  saveMenuItems(updated);
  return updated.find((i) => i._id === id);
};

export const deleteMenuItem = (id) => {
  const items = getMenuItems();
  const updated = items.filter((item) => item._id !== id);
  saveMenuItems(updated);
};

export const resetMenuToDefault = () => {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
  dispatchSync({ type: 'MENU_RESET', items: INITIAL_MENU_ITEMS });
  return INITIAL_MENU_ITEMS;
};

// ======================
// ORDERS SERVICES
// ======================
export const getOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders from localStorage', err);
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  dispatchSync({ type: 'ORDERS_UPDATED', orders });
};

export const createOrder = ({ user, orderItems, itemsPrice, notes = '' }) => {
  const orders = getOrders();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    _id: `ord-${Date.now()}`,
    token: `ORD-${randomSuffix}`,
    user: {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      hostelRoom: user.hostelRoom || 'Campus Pickup Counter',
    },
    orderItems,
    itemsPrice,
    notes,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const updatedOrders = [newOrder, ...orders];
  saveOrders(updatedOrders);
  return newOrder;
};

export const updateOrderStatus = (orderId, status) => {
  const orders = getOrders();
  const updated = orders.map((ord) =>
    ord._id === orderId ? { ...ord, status, updatedAt: new Date().toISOString() } : ord
  );
  saveOrders(updated);
  return updated.find((o) => o._id === orderId);
};

export const cancelOrder = (orderId) => {
  const orders = getOrders();
  const updated = orders.map((ord) =>
    ord._id === orderId ? { ...ord, status: 'Cancelled' } : ord
  );
  saveOrders(updated);
};

export const getUserOrders = (userId) => {
  const orders = getOrders();
  if (!userId) return [];
  return orders.filter((o) => o.user && (o.user.id === userId || o.user.email === userId));
};

// ======================
// USERS / AUTH SERVICES
// ======================
export const getUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEMO_USERS;
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const authenticateUser = (email, password) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );
  if (!user) {
    throw new Error('Invalid email or password. You can use the Quick Demo Logins!');
  }
  return {
    id: user.id,
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: Boolean(user.isAdmin),
    hostelRoom: user.hostelRoom,
    phone: user.phone,
    token: `mock-jwt-token-${user.id}-${Date.now()}`,
  };
};

export const registerNewUser = ({ name, email, password, isAdmin = false, hostelRoom = '', phone = '' }) => {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    throw new Error('An account with this email already exists!');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.trim(),
    password,
    isAdmin: Boolean(isAdmin),
    hostelRoom: hostelRoom || (isAdmin ? 'Admin Office' : 'Campus Hostel'),
    phone: phone || '+91 90000 00000',
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  return {
    id: newUser.id,
    _id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    hostelRoom: newUser.hostelRoom,
    phone: newUser.phone,
    token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
  };
};

// ======================
// CART SERVICES
// ======================
export const getSavedCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};
