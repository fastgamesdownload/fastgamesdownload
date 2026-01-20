import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  updateGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: 'pt' | 'en' | 'es';
  setLanguage: (lang: 'pt' | 'en' | 'es') => void;
  clients: User[];
  updateClient: (userId: string, updates: Partial<User>) => void;
  deleteClient: (userId: string) => void;
  formatPrice: (value: number) => string;
  importDatabase: (data: { games: Game[], clients: User[] }) => boolean;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_GAMES_KEY = 'fastgames_catalog_v2';
const STORAGE_USERS_KEY = 'fastgames_users_v2';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const savedGames = localStorage.getItem(STORAGE_GAMES_KEY);
      return savedGames ? JSON.parse(savedGames) : GAMES;
    } catch (e) {
      console.error("Erro ao carregar jogos:", e);
      return GAMES;
    }
  });

  const [clients, setClients] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (savedUsers) return JSON.parse(savedUsers);
      
      return [
        { id: 'u1', name: 'Admin Master', email: 'admin@fastgames.com', isSubscribed: true, library: ['1', '2'], role: 'admin', status: 'VIP' },
        { id: 'u2', name: 'João Silva', email: 'joao@email.com', isSubscribed: false, library: ['3'], role: 'user', status: 'Normal' }
      ];
    } catch (e) {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt');

  // Sync automatic updates
  useEffect(() => {
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    const admin = clients.find(c => c.role === 'admin');
    if (admin) setUser(admin);
  }, [clients]);

  const addGame = (newGame: Game) => {
    setGames((prev) => [newGame, ...prev]);
  };

  const updateGame = (updatedGame: Game) => {
    setGames((prev) => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
  };

  const deleteGame = (gameId: string) => {
    setGames((prev) => prev.filter(g => g.id !== gameId));
  };

  const updateClient = (userId: string, updates: Partial<User>) => {
    setClients(prev => prev.map(client => 
      client.id === userId ? { ...client, ...updates } : client
    ));
  };

  const deleteClient = (userId: string) => {
    setClients(prev => prev.filter(client => client.id !== userId));
  };

  const importDatabase = (data: { games: Game[], clients: User[] }): boolean => {
    try {
      // Limpeza prévia para evitar conflitos de espaço no LocalStorage
      localStorage.removeItem(STORAGE_GAMES_KEY);
      localStorage.removeItem(STORAGE_USERS_KEY);

      if (data.games && Array.isArray(data.games)) {
        localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(data.games));
        setGames(data.games);
      }
      
      if (data.clients && Array.isArray(data.clients)) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(data.clients));
        setClients(data.clients);
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao importar banco de dados:", error);
      // Se falhar (ex: QuotaExceeded), tentamos restaurar o mínimo possível
      alert("Erro de Armazenamento: O arquivo de backup é muito grande para este navegador (LocalStorage cheio). Tente remover algumas capturas de tela Base64 do JSON antes de restaurar.");
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm("Isso apagará todos os seus produtos e clientes customizados. Continuar?")) {
      localStorage.removeItem(STORAGE_GAMES_KEY);
      localStorage.removeItem(STORAGE_USERS_KEY);
      window.location.reload();
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

  const clearCart = () => setCart([]);

  const login = () => {
    const admin = clients.find(c => c.role === 'admin');
    if (admin) setUser(admin);
  };

  const purchase = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const newLibrary = [...user.library];
          let newSubStatus = user.isSubscribed;
          cart.forEach(item => {
            if (item.type === 'game' && !newLibrary.includes(item.id)) newLibrary.push(item.id);
            else if (item.type === 'plan') newSubStatus = true;
          });
          updateClient(user.id, { library: newLibrary, isSubscribed: newSubStatus });
          clearCart();
        }
        resolve();
      }, 1000);
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      user, login, purchase,
      games, addGame, updateGame, deleteGame,
      searchQuery, setSearchQuery,
      language, setLanguage,
      clients, updateClient, deleteClient,
      formatPrice, importDatabase, resetToDefaults
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};