import React, { createContext, useState, useEffect } from 'react';
import { authenticateUser, registerNewUser, getUsers } from '../services/storageService';
import { DEMO_USERS } from '../data/initialData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Auto sign-in as student demo user by default for instant zero-friction preview!
        const defaultStudent = {
          id: 'student-demo-id',
          _id: 'student-demo-id',
          name: 'Alex Student',
          email: 'student@college.edu',
          isAdmin: false,
          hostelRoom: 'Hostel Block 4, Room 302',
          phone: '+91 98765 43210',
          token: 'mock-jwt-token-student-demo-id',
        };
        setUser(defaultStudent);
        localStorage.setItem('userInfo', JSON.stringify(defaultStudent));
      }
    } catch (e) {
      console.error('Auth init error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = authenticateUser(email, password);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password, isAdmin, hostelRoom, phone) => {
    const data = registerNewUser({ name, email, password, isAdmin, hostelRoom, phone });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // 1-Click quick role switcher
  const quickSwitchRole = (targetRole) => {
    const demo = DEMO_USERS.find((u) => (targetRole === 'admin' ? u.isAdmin : !u.isAdmin));
    if (demo) {
      const logged = {
        id: demo.id,
        _id: demo.id,
        name: demo.name,
        email: demo.email,
        isAdmin: demo.isAdmin,
        hostelRoom: demo.hostelRoom,
        phone: demo.phone,
        token: `mock-jwt-token-${demo.id}`,
      };
      setUser(logged);
      localStorage.setItem('userInfo', JSON.stringify(logged));
      return logged;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
