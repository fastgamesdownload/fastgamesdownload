import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import HeroCarousel from '../components/HeroCarousel';
import GameCard from '../components/GameCard';
import { CATEGORIES } from '../constants';
import { Filter, PlayCircle, BookOpen, Newspaper, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const NEWS = [
  { id: 'n1', title: 'Grand Theft Auto VI: Novos rumores sobre o mapa vazam online.', date: 'Há 2 horas', category: 'Lançamentos' },
  { id: 'n2', title: 'Cyberpunk 2077 recebe atualização massiva de performance para PCs.', date: 'Há 5 horas', category: 'Updates' },
  { id: 'n3', title: 'Promoção de Inverno: Melhores jogos por menos de R$ 50.', date: 'Há 1 dia', category: 'Ofertas' }
];

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

  const isSubscriber = user?.status === 'VIP' || user?.status === 'Premium';
  const isAdmin = user?.role === 'admin';
  const hasGames = myGames.length > 0;
  
  const showLibrarySection = user && (isAdmin || isSubscriber || hasGames) && !searchQuery && selectedCategory === 'Todos';

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      
      {/* Activity Ticker */}
      <div className="bg-red-600/10 border-b border-red-600/20 py-2 relative overflow-hidden hidden md:block">
        <div className="animate-slide-infinite whitespace-nowrap">
          {[1,2,3].map(i => (
            <span key={i} className="inline-flex items-center space-x-8 px-8">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center">
                <Zap className="w-3 h-3 mr-2 fill-current" /> Novo Download: Call of Duty Modern Warfare
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center">
                <TrendingUp className="w-3 h-3 mr-2" /> Top do Mês: Cyber Drift 2077
              </span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center">
                <Zap className="w-3 h-3 mr-2 fill-current" /> Usuário VIP "Matrix" acaba de se juntar
              </span>
            </span>
          ))}
        </div>
      </div>

      <HeroCarousel games={featuredGames} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* User Library Section */}
        {showLibrarySection && (
          <div className="mb-12 animate-fade-in-up">
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-red-600/10 transition-colors" />
               
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center space-x-4">
                   <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-900/40">
                     <BookOpen className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-white tracking-tight">Sua Biblioteca</h2>
                     <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Acesso Rápido</p>
                   </div>
                 </div>
                 <Link to="/library" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all border border-white/5">Ver Coleção Completa</Link>
               </div>
               
               <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {myGames.length > 0 ? myGames.slice(0, 5).map(game => (
                    <div key={game.id} className="flex-shrink-0 w-72 group relative rounded-2xl overflow-hidden aspect-video border border-white/5 shadow-xl transition-all hover:border-red-600/30">
                       <img src={game.banner} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity flex flex-col items-center justify-center">
                          <button className="bg-red-600 text-white p-4 rounded-full mb-3 hover:bg-red-500 transform scale-0 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-red-900/50">
                             <PlayCircle className="w-8 h-8 fill-current" />
                          </button>
                          <span className="text-white font-black text-sm tracking-tight translate-y-4 group-hover:translate-y-0 transition-all duration-300">{game.title}</span>
                       </div>
                    </div>
                  )) : (
                    <div className="flex-shrink-0 w-full py-16 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
                       <p className="text-zinc-500 text-sm font-medium">
                         {isAdmin ? 'Módulo Administrativo Ativo. Sem jogos pendentes.' : 'Sua prateleira virtual está pronta para novos títulos.'}
                       </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
             {/* Filters Bar */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-6 mb-12 shadow-2xl border border-white/5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-3 text-white">
                   <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5">
                     <Filter className="w-5 h-5 text-red-500" />
                   </div>
                   <span className="font-black text-xl tracking-tight">Explorar Catálogo</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                  {CATEGORIES.slice(0, 7).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        selectedCategory === cat
                          ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                          : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Grid */}
            <div className="mb-12">
              <h2 className="text-3xl font-black text-white mb-10 border-l-8 border-red-600 pl-6 flex items-center">
                {searchQuery ? `RESULTADOS: "${searchQuery}"` : selectedCategory === 'Todos' ? 'TOP LANÇAMENTOS' : selectedCategory.toUpperCase()}
              </h2>
              
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGames.map(game => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-zinc-900/30 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <p className="text-zinc-500 text-xl font-medium">Nenhuma aventura encontrada por aqui.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / News Section */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-zinc-900/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                   <Newspaper className="w-5 h-5 text-red-500" />
                   <h3 className="font-black text-white tracking-tight uppercase text-sm">Plantão Gamer</h3>
                </div>
                <div className="space-y-6">
                   {NEWS.map(post => (
                     <div key={post.id} className="group cursor-pointer">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1 block">{post.category}</span>
                        <h4 className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors leading-tight mb-2 line-clamp-2">{post.title}</h4>
                        <span className="text-[10px] text-zinc-500">{post.date}</span>
                        <div className="mt-4 border-b border-white/5 group-last:border-0" />
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Ver todas as notícias</button>
             </div>

             {/* Ad / Subscription Card */}
             {!isSubscriber && (
               <div className="bg-gradient-to-br from-red-600 to-red-900 rounded-3xl p-8 border border-red-500/30 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full" />
                  <Zap className="w-12 h-12 text-white/20 mb-6 absolute top-4 right-4 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">SEJA VIP</h3>
                  <p className="text-red-100 text-xs font-medium mb-6 leading-relaxed">Downloads ilimitados e acesso antecipado ao catálogo.</p>
                  <Link to="/subscription" className="block w-full text-center py-4 bg-white text-red-600 rounded-2xl font-black text-sm hover:bg-zinc-100 transition-colors shadow-xl">ASSINAR AGORA</Link>
               </div>
             )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;