import { createContext, useContext, useState, createElement, ReactNode } from 'react';

export type UserRole = 'buyer' | 'supplier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export interface WaterListing {
  id: string;
  supplierId: string;
  supplierName: string;
  tankSize: number; // in liters
  price: number;
  deliveryArea: string;
  available: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  listingId: string;
  tankSize: number;
  price: number;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  createdAt: string;
  address: string;
  phone: string;
  rating?: number;
}

const STORAGE_KEYS = {
  USERS: 'waterlink_users',
  LISTINGS: 'waterlink_listings',
  ORDERS: 'waterlink_orders',
  CURRENT_USER: 'waterlink_current_user',
};

export const mockDb = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  
  getListings: (): WaterListing[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]'),
  saveListings: (listings: WaterListing[]) => localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings)),
  
  getOrders: (): Order[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]'),
  saveOrders: (orders: Order[]) => localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)),
  
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)),
};

// Initialize some mock data if empty
if (mockDb.getListings().length === 0) {
  const initialListings: WaterListing[] = [
    { id: 'l1', supplierId: 's1', supplierName: 'Crystal Clear Water', tankSize: 5000, price: 1500, deliveryArea: 'Downtown', available: true },
    { id: 'l2', supplierId: 's1', supplierName: 'Crystal Clear Water', tankSize: 10000, price: 2800, deliveryArea: 'Downtown', available: true },
    { id: 'l3', supplierId: 's2', supplierName: 'Blue Oasis Supplies', tankSize: 2000, price: 800, deliveryArea: 'Suburbs', available: true },
  ];
  mockDb.saveListings(initialListings);
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => User | null;
  signup: (name: string, email: string, role: UserRole, phone?: string, address?: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockDb.getCurrentUser());

  const login = (email: string) => {
    const users = mockDb.getUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      mockDb.setCurrentUser(existingUser);
      setUser(existingUser);
      return existingUser;
    }
    return null;
  };

  const signup = (name: string, email: string, role: UserRole, phone?: string, address?: string) => {
    const users = mockDb.getUsers();
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), name, email, role, phone, address };
    users.push(newUser);
    mockDb.saveUsers(users);
    mockDb.setCurrentUser(newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    mockDb.setCurrentUser(null);
    setUser(null);
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, login, signup, logout } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
