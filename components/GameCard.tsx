import React from 'react';
import { Game } from '../types';
import { Star, ShoppingBag, Download, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { addToCart, cart, formatPrice, user } = useStore();
  const isInCart = cart.some(item => item.id === game.id);
  const isDigital = game.mediaType === 'Digital';
  const isOwned = user?.library.includes(game.id);
  
  const canDownloadDirectly = isDigital && (
    user?.status === 'Premium' || 
    user?.status === 'VIP' || 
    user?.role === 'admin' || 
    isOwned
  );

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (canDownloadDirectly) {
      if (game.downloadUrl) {
        window.open(game.downloadUrl, '_blank');
      } else {
        alert(`O link de download para "${game.title}" ainda não está disponível.`);
      }
    } else {
      if (!isInCart) {
        addToCart({
          id: game.id,
          name: game.title,
          price: isDigital ? 0 : game.price,
          type: 'game',
          image: game.image
        });
      }
    }
  };

  return (
    <Link to={`/game/${game.id}`} className="group relative block bg-zinc-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-500 transform hover:-translate-y-2 hover:neon-glow-hover">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={game.image} 
          alt={game.title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Action Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
           <button 
             onClick={handleAction}
             className={`px-6 py-3 rounded-xl font-bold flex items-center shadow-2xl transition-all transform active:scale-95 ${
               canDownloadDirectly 
               ? 'bg-blue-600 text-white hover:bg-blue-500' 
               : isInCart 
                 ? 'bg-zinc-100 text-black' 
                 : 'bg-red-600 text-white hover:bg-red-500'
             }`}
           >
             {canDownloadDirectly ? (
               <><Download className="w-5 h-5 mr-2" /> Baixar</>
             ) : (
               <>
                 <ShoppingBag className="w-5 h-5 mr-2" />
                 {isInCart ? 'No Carrinho' : 'Comprar'}
               </>
             )}
           </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-yellow-400 flex items-center text-xs font-bold border border-white/10">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {game.rating}
          </div>
          {game.isFeatured && (
            <div className="bg-red-600/90 backdrop-blur-md p-1.5 rounded-lg text-white border border-red-400/30">
               <Zap className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>

        <div className={`absolute bottom-4 left-4 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg ${isDigital ? 'bg-blue-600/40' : 'bg-red-600/40'}`}>
          {game.mediaType || 'Física'}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors line-clamp-1 mb-1">{game.title}</h3>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-4">{game.platform}</p>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
           <span className="text-[10px] text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md border border-white/5 uppercase font-medium">{game.category}</span>
           <span className="text-xl font-black text-white">
             {isDigital ? (canDownloadDirectly ? 'LIVRE' : 'VIP') : game.price === 0 ? 'FREE' : formatPrice(game.price)}
           </span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;