import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Game, User } from '../types';
import { GAMES } from '../constants';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  user: User | null;
  login: () => void;
  purchase: () => Promise<void>;
  games: Game[];
  addGame: (game: Game) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'pt' | 'en' | 'es';
  setLanguage: (lang: 'pt' | 'en' | 'es') => void;
  clients: User[];
  updateClient: (userId: string, updates: Partial<User>) => void;
  formatPrice: (value: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(GAMES);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Mock Clients Data
  const [clients, setClients] = useState<User[]>([
    {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@fastgames.com',
      isSubscribed: true,
      library: ['1', '2'],
      role: 'admin',
      status: 'VIP'
    },
    {
      id: 'u2',
      name: 'João Silva',
      email: 'joao@email.com',
      isSubscribed: false,
      library: ['3'],
      role: 'user',
      status: 'Normal'
    },
    {
      id: 'u3',
      name: 'Maria Souza',
      email: 'maria@email.com',
      isSubscribed: true,
      library: [],
      role: 'user',
      status: 'Premium'
    }
  ]);

  // Current logged in user (Defaulting to the first admin for demo)
  const [user, setUser] = useState<User | null>(clients[0]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt');

  const addGame = (newGame: Game) => {
    setGames((prev) => [newGame, ...prev]);
  };

  const updateClient = (userId: string, updates: Partial<User>) => {
    setClients(prev => prev.map(client => 
      client.id === userId ? { ...client, ...updates } : client
    ));
    // Also update current user if it's the same person
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = () => {
    setUser(clients[0]); // Reset to admin
  };

  const purchase = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const newLibrary = [...user.library];
          let newSubStatus = user.isSubscribed;

          cart.forEach(item => {
            if (item.type === 'game') {
              if (!newLibrary.includes(item.id)) {
                newLibrary.push(item.id);
              }
            } else if (item.type === 'plan') {
              newSubStatus = true;
            }
          });

          const updatedUser = { ...user, library: newLibrary, isSubscribed: newSubStatus };
          setUser(updatedUser);
          // Update in clients list too
          updateClient(user.id, updatedUser);
          clearCart();
        }
        resolve();
      }, 1500);
    });
  };

  const formatPrice = (value: number) => {
    switch (language) {
      case 'en':
        // Conversion rate BRL to USD (approx 0.18)
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value * 0.18);
      case 'es':
        // Conversion rate BRL to EUR (approx 0.16)
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value * 0.16);
      default: // pt
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
  };

  return (
    <StoreContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      user,
      login,
      purchase,
      games,
      addGame,
      searchQuery,
      setSearchQuery,
      language,
      setLanguage,
      clients,
      updateClient,
      formatPrice
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};