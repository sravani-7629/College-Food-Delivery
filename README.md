# 🍔 CampusBites - College Food Delivery & Canteen System (Frontend Only)

A modern, responsive, and backend-free college canteen ordering and management web application built with **React**, **Vite**, and **Tailwind CSS**.

> **No Backend or Database Needed**: All authentication, menu catalogs, real-time order tokens, status tracking, and cart operations run completely standalone in your browser using persistent local storage!

---

## ✨ Key Features

### 🎓 Student Portal
- **Interactive Food Catalog**: 16 delicious campus canteen specialties (Burgers, Pizzas, Hakka Noodles, Egg Chicken Rolls, Veg/Chicken Thalis, Milkshakes, Sundaes, Samosas, etc.) with high-resolution food images, preparation times, and calorie details.
- **Dietary & Category Filters**: Quickly filter by *All*, *Veg Only 🟢*, or *Non-Veg 🔴*, and category chips (*Burgers & Sandwiches*, *Rolls & Noodles*, *Meals & Rice*, *Snacks*, *Beverages & Desserts*).
- **Live Search**: Instant keyword search by dish name or ingredients.
- **Smart Food Basket / Cart Drawer**: Add items with quantity steppers, select campus delivery points (Canteen Counter 1/2, Hostel Lobbies, Library Food Court), and add special kitchen instructions.
- **Token-Based Ordering with Confetti**: Generates instant unique pickup tokens (e.g., `#ORD-7821`) so students can collect food at the counter without standing in long payment queues.
- **Live Order Tracker (`My Orders`)**: Step-by-step cooking progress (*Pending* ➔ *Cooking* ➔ *Ready at Counter* ➔ *Collected*).
- **Digital Canteen Receipt Modal**: Printable itemized token bill for quick verification at the pickup desk.

### 👨‍🍳 Canteen Admin Dashboard
- **Live Kitchen Kanban**: Real-time 3-column order fulfillment board (*New Incoming* ➔ *In Kitchen* ➔ *Ready for Pickup*).
- **1-Click Order Advancement**: Move orders forward through preparation with a single click.
- **Financial & Operations KPIs**: Real-time dashboard showing Total Sales (₹), Pending Orders, Cooking Count, and Ready Tokens.
- **Food Catalog & Menu Inventory Management**:
  - Add new dishes with custom prices, categories, and prep times.
  - One-click *In Stock / Out of Stock* toggle switch.
  - Delete or reset menu back to default 16 items.

### ⚡ Zero-Friction Demo Experience
- **1-Click Role Switcher Pill**: Top navigation includes a switcher to instantly alternate between Student and Admin views.
- **Pre-loaded Demo Logins**:
  - **Student Account**: `student@college.edu` / `student123`
  - **Admin Account**: `admin@college.edu` / `admin123`

---

## 🚀 How to Run in VS Code

### Step 1: Open in VS Code
1. Open **Visual Studio Code**.
2. Click **File** > **Open Folder...**
3. Select the `College-Food-Delivery-Frontend` folder.

### Step 2: Open Terminal & Run
In VS Code, press `Ctrl + ~` (or go to `Terminal` > `New Terminal`) and run:

```bash
npm run dev
```

### Step 3: Open in Browser
Click on the displayed local link (usually `http://localhost:5173`) or open your browser and navigate to:
```
http://localhost:5173
```

---

## 🛠️ Project Structure

```
College-Food-Delivery-Frontend/
├── public/
│   ├── items/                  # 16 High-res food photos (burger, thali, rolls, etc.)
│   ├── food-bg.jpg             # Background artwork
│   └── menu-bg.jpg             # Menu background artwork
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation with role switcher & cart trigger
│   │   ├── CartDrawer.jsx      # Slide-out basket & checkout with confetti
│   │   └── ReceiptModal.jsx    # Printable digital token receipt
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state & 1-click demo login
│   ├── data/
│   │   └── initialData.js      # 16 Pre-configured menu items and sample orders
│   ├── services/
│   │   └── storageService.js   # Standalone local storage mock backend
│   ├── pages/
│   │   ├── Login.jsx           # Glassmorphism login with instant demo buttons
│   │   ├── Register.jsx        # Account registration
│   │   ├── StudentMenu.jsx     # Menu browsing, search, dietary filtering
│   │   ├── StudentOrders.jsx   # Real-time order tracking & receipts
│   │   └── AdminDashboard.jsx  # Kitchen Kanban board & menu manager
│   ├── App.jsx                 # Routing and protected views
│   ├── index.css               # Tailwind styling & glassmorphism
│   └── main.jsx                # Application root
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 Creating a Production Build

To test or build the optimized production bundle:
```bash
npm run build
npm run preview
```
