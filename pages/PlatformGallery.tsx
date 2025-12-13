import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import GameCard from '../components/GameCard';
import { Monitor, Gamepad2, Ghost } from 'lucide-react';

const PlatformGallery: React.FC = () => {
  const { platformName } = useParams<{ platformName: string }>();
  const { games } = useStore();

  const decodedPlatformName = decodeURIComponent(platformName || '');
  
  const platformGames = games.filter(g => 
    g.platform.toLowerCase() === decodedPlatformName.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Platform Banner Header */}
      <div className="relative bg-zinc-900 border-b border-zinc-800 py-16 mb-8">
         <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/300?grayscale')] opacity-10 bg-cover bg-center" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center space-x-4">
               <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-900/50">
                  <Gamepad2 className="w-10 h-10 text-white" />
               </div>
               <div>
                 <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-1">Galeria de Jogos</h2>
                 <h1 className="text-4xl md:text-5xl font-black text-white">{decodedPlatformName}</h1>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {platformGames.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {platformGames.map(game => (
               <GameCard key={game.id} game={game} />
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
              <Ghost className="w-16 h-16 text-zinc-700 mb-4" />
              <h2 className="text-2xl font-bold text-zinc-300">Nenhum jogo encontrado</h2>
              <p className="text-zinc-500 mt-2">Não há jogos cadastrados para a plataforma <span className="text-white font-bold">{decodedPlatformName}</span> no momento.</p>
              <Link to="/" className="mt-6 px-6 py-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors">Voltar para Loja</Link>
           </div>
         )}
      </div>
    </div>
  );
};

export default PlatformGallery;