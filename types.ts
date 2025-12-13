export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  banner: string;
  rating: number;
  category: string;
  platform: string;
  videoUrl?: string;
  screenshots: string[];
  releaseDate: string;
  tags: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  isHidden?: boolean;
}

export interface CartItem {
  id: string;
  type: 'game' | 'plan';
  name: string;
  price: number;
  image?: string;
  details?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  library: string[]; // Game IDs
  role: 'admin' | 'user';
  status: 'Normal' | 'Premium' | 'VIP';
}