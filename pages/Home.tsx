import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import HeroCarousel from '../components/HeroCarousel';
import GameCard from '../components/GameCard';
import { CATEGORIES } from '../constants';
import { Filter, PlayCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { games, searchQuery, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  const featuredGames = useMemo(() => {
    const featured = games.filter(g => g.isFeatured);
    return featured.length > 0 ? featured : games.slice(0, 3);
  }, [games]);

  const myGames = user ? games.filter(g => user.library.includes(g.id)) : [];

  // Regra de visibilidade da biblioteca na home: Mostrar para Admin OU se o usuário tiver jogos OU se for VIP/Premium
  const isSubscriber = user?.status === 'VIP' || user?.status === 'Premium';
  const isAdmin = user?.role === 'admin';
  const hasGames = myGames.length > 0;
  
  const showLibrarySection = user && (isAdmin || isSubscriber || hasGames) && !searchQuery && selectedCategory === 'Todos';

  return (
    <div className="min-h-screen pb-20">
      <HeroCarousel games={featuredGames} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* User Library Section */}
        {showLibrarySection && (
          <div className="mb-12 animate-fade-in-up">
            <div className="bg-gradient-to-r from-zinc-900 to-black rounded-2xl p-6 border border-zinc-800 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-3">
                   <div className="bg-red-600 p-2 rounded-lg">
                     <BookOpen className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-white">Sua Biblioteca</h2>
                     <p className="text-zinc-400 text-sm">{isAdmin ? 'Acesso Administrativo Total' : 'Continue de onde parou'}</p>
                   </div>
                 </div>
                 <Link to="/library" className="text-sm text-red-500 hover:text-red-400 font-medium">Ver todos</Link>
               </div>
               
               <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  {myGames.length > 0 ? myGames.slice(0, 4).map(game => (
                    <div key={game.id} className="flex-shrink-0 w-64 group relative rounded-xl overflow-hidden aspect-video border border-zinc-800">
                       <img src={game.banner} alt={game.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <button className="bg-red-600 text-white p-3 rounded-full mb-2 hover:bg-red-700 transform hover:scale-110 transition-all">
                             <PlayCircle className="w-8 h-8 fill-current" />
                          </button>
                          <span className="text-white font-bold text-sm">{game.title}</span>
                       </div>
                    </div>
                  )) : (
                    <div className="flex-shrink-0 w-full py-10 text-center border border-dashed border-zinc-800 rounded-xl">
                       <p className="text-zinc-500 text-sm">
                         {isAdmin ? 'Sua biblioteca administrativa está vazia. Adicione jogos para testar o sistema.' : 'Você ainda não possui jogos na sua biblioteca.'}
                       </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-xl border border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-white">
               <Filter className="w-5 h-5 text-red-500" />
               <span className="font-bold text-lg">Explorar</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {CATEGORIES.slice(0, 8).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {CATEGORIES.length > 8 && (
                 <span className="px-2 py-2 text-xs text-zinc-500">...</span>
              )}
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="mb-8">
           <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">
             {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory === 'Todos' ? 'Jogos em Destaque' : selectedCategory}
           </h2>
           
           {filteredGames.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredGames.map(game => (
                 <GameCard key={game.id} game={game} />
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
               <p className="text-zinc-500 text-xl">Nenhum jogo encontrado.</p>
             </div>
           )}
        </div>

      </main>
    </div>
  );
};

export default Home;