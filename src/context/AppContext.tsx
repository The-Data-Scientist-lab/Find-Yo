import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  duration?: string;
}

export interface Order {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  status: 'pending' | 'paid' | 'failed' | 'completed';
  contactMethod: 'whatsapp' | 'telegram';
  contactValue: string;
  createdAt: Date;
  totalAmount: number;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  orders: Order[];
  videoPackages: Package[];
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone?: string) => Promise<void>;
  logout: () => void;
  createOrder: (packageId: string, contactMethod: 'whatsapp' | 'telegram', contactValue: string) => Promise<Order>;
  verifyPayment: (orderId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

// Updated packages with adult video service descriptions
const DEFAULT_PACKAGES: Package[] = [
  {
    id: '4',
    name: 'Basic Pleasure',
    price: 489,
    description: 'See My B**BS 🍒 For next 10 minutes and let me make you cum💦',
    features: ['10 minute B**BS Show🍒', '4K quality', 'VIP treatment'],
    duration: '10 mins'
  },
  {
    id: '5',
    name: 'Ultimate Pleasure',
    price: 569,
    description: 'Playing with dildo 🍌 for next 15 minutes and let me make you cum💦',
    features: ['15 minute Dildo Show🍌', '4K quality', 'Ultimate experience', 'Priority support'],
    duration: '15 mins'
  },
  {
    id: '6',
    name: 'Connect With Me',
    price: 599,
    description: 'Stripping Black Dress 🥵 and fingering, screaming and cumming💦👅',
    features: ['30 minute Stripping Show🥵', '4K quality', 'Ultimate experience', 'Your choice of black dress or lingerie'],
    duration: '30 mins'
  },
  {
    id: '7',
    name: 'Incredible Experience',
    price: 649,
    description: 'I am your for next 45 minutes and i will do everything for you💋 on your command',
    features: ['40 minute Nude video call💋', '4K quality', 'Ultimate experience', 'Your choice of outfit'],
    duration: '40 mins'
  },
  {
    id: '8',
    name: 'Full Nude Show for 60 minutes💋',
    price: 799,
    description: 'I am yours for fingering, screaming, cumming, loud moaning and more💦👅',
    features: ['60 minute full Nude video call', '4K quality', 'Ultimate experience', 'Your choice of outfit'],
    duration: '60 mins'
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [videoPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  // Simulate loading user data from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOrders = localStorage.getItem('orders');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    }
    
    setIsLoading(false);
  }, []);

  // Simulate API login
  const login = async (email: string, password: string) => {
    // In a real app, this would call an API
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app this would be handled by backend
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Create mock user - in real app this would come from backend
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
      };
      
      // Store in localStorage to persist session
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API signup
  const signup = async (name: string, email: string, phone?: string) => {
    try {
      setUser({ id: Math.random().toString(36).substring(2, 9), name, email, phone });
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const createOrder = async (packageId: string, contactMethod: 'whatsapp' | 'telegram', contactValue: string) => {
    if (!user) throw new Error("You must be logged in to place an order");
    
    const pkg = videoPackages.find(p => p.id === packageId);
    if (!pkg) throw new Error("Invalid package selected");
    
    // Create the order
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.id,
      packageId,
      packageName: pkg.name,
      status: 'pending',
      contactMethod,
      contactValue,
      createdAt: new Date(),
      totalAmount: pkg.price,
    };
    
    // Add to orders
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return newOrder;
  };

  const verifyPayment = async (orderId: string) => {
    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 25000));
    
    // Always fail the payment for simulation
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'failed' as const } 
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    return false; // Payment failed
  };

  return (
    <AppContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        orders,
        videoPackages,
        selectedPackage,
        setSelectedPackage,
        login,
        signup,
        logout,
        createOrder,
        verifyPayment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
