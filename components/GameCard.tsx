import React from 'react';
import { Game } from '../types';
import { Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { addToCart, cart, formatPrice } = useStore();
  const isInCart = cart.some(item => item.id === game.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart) {
      addToCart({
        id: game.id,
        name: game.title,
        price: game.price,
        type: 'game',
        image: game.image
      });
    }
  };

  return (
    <Link to={`/game/${game.id}`} className="group relative block bg-zinc-900 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={game.image} 
          alt={game.title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={handleAddToCart}
             className={`px-6 py-3 rounded-full font-bold flex items-center shadow-lg transition-transform transform hover:scale-105 ${isInCart ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
           >
             <ShoppingBag className="w-5 h-5 mr-2" />
             {isInCart ? 'No Carrinho' : 'Comprar'}
           </button>
        </div>

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-yellow-400 flex items-center text-xs font-bold">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {game.rating}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors line-clamp-1">{game.title}</h3>
        </div>
        <div className="flex justify-between items-center mt-3">
           <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded uppercase tracking-wider">{game.category}</span>
           <span className="text-lg font-bold text-white">{game.price === 0 ? 'Grátis' : formatPrice(game.price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;