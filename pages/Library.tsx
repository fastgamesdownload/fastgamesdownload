import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Download, PlayCircle, Filter, ChevronRight, Gamepad2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PLATFORMS } from '../constants';

const Library: React.FC = () => {
  const { user, games } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPlatform, setSelectedPlatform] = useState('Todos');

  const myGames = useMemo(() => {
     if (!user) return [];
     return games.filter(g => user.library.includes(g.id));
  }, [user, games]);

  const filteredLibrary = useMemo(() => {
    return myGames.filter(game => {
      const matchCat = selectedCategory === 'Todos' || game.category === selectedCategory;
      const matchPlat = selectedPlatform === 'Todos' || game.platform === selectedPlatform;
      return matchCat && matchPlat;
    });
  }, [myGames, selectedCategory, selectedPlatform]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center">
            <Gamepad2 className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-white">Minha Biblioteca</h1>
              <div className="text-zinc-400 text-sm mt-1">
                {myGames.length} {myGames.length === 1 ? 'jogo adquirido' : 'jogos adquiridos'}
              </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Vertical Category Menu */}
        <div className="lg:col-span-1">
             <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl overflow-hidden sticky top-24 shadow-xl">
                <div className="p-4 bg-zinc-950 border-b border-zinc-800">
                   <h3 className="text-lg font-bold text-white flex items-center">
                     <Layers className="w-4 h-4 mr-2 text-red-600" /> Categorias
                   </h3>
                </div>
                <div className="p-2 space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                   {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                          selectedCategory === cat 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' 
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {cat}
                        {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
                      </button>
                   ))}
                </div>
             </div>
        </div>

        {/* Right Column: Content and Platform Filters */}
        <div className="lg:col-span-3">
          
          {/* Platform Filters */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 overflow-x-auto">
             <div className="flex items-center space-x-2 min-w-max">
                <Filter className="w-4 h-4 text-zinc-500 mr-2" />
                <button 
                  onClick={() => setSelectedPlatform('Todos')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${selectedPlatform === 'Todos' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  Todos
                </button>
                {PLATFORMS.map(p => (
                  <button 
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${selectedPlatform === p ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {p}
                  </button>
                ))}
             </div>
          </div>

          {myGames.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlayCircle className="w-10 h-10 text-zinc-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sua biblioteca está vazia</h2>
              <p className="text-zinc-400 mb-8">Comece sua coleção agora com os melhores títulos.</p>
              <Link to="/" className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                Ir para a Loja
              </Link>
            </div>
          ) : filteredLibrary.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h2>
              <p className="text-zinc-500">Tente ajustar os filtros de categoria ou plataforma.</p>
              <button onClick={() => {setSelectedCategory('Todos'); setSelectedPlatform('Todos');}} className="mt-4 text-red-500 hover:text-red-400 text-sm font-bold">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLibrary.map(game => (
                <div key={game.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all group">
                  <div className="relative aspect-video">
                    <img src={game.banner} alt={game.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                       <button className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transform hover:scale-110 transition-all" title="Jogar">
                         <PlayCircle className="w-6 h-6" />
                       </button>
                       <button className="p-3 bg-zinc-700 text-white rounded-full hover:bg-zinc-600 transform hover:scale-110 transition-all" title="Baixar">
                         <Download className="w-6 h-6" />
                       </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{game.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{game.platform}</span>
                       <span className="text-xs text-green-500 font-medium">Pronto</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;