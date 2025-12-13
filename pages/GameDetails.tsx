import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Star, Calendar, ShieldCheck, Download, Youtube, Monitor, Image as ImageIcon } from 'lucide-react';

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { games, addToCart, cart, user, formatPrice } = useStore();
  const navigate = useNavigate();

  const game = games.find(g => g.id === id);
  const isInCart = cart.some(item => item.id === game?.id);
  const isOwned = user?.library.includes(game?.id || '');

  if (!game) {
    return <div className="text-center py-20 text-white">Jogo não encontrado</div>;
  }

  const handleAction = () => {
    if (isOwned) {
       alert("Iniciando download...");
    } else if (isInCart) {
      navigate('/cart');
    } else {
      addToCart({
        id: game.id,
        name: game.title,
        price: game.price,
        type: 'game',
        image: game.image
      });
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = game.videoUrl ? getYoutubeEmbedUrl(game.videoUrl) : null;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Banner */}
      <div className="h-[400px] w-full relative">
        <img src={game.banner} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Cover & Stats */}
          <div className="md:col-span-1">
             <div className="rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border-4 border-zinc-800 mb-6">
                <img src={game.image} alt={game.title} className="w-full aspect-[3/4] object-cover" />
             </div>
             
             <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center text-zinc-400 text-sm border-b border-zinc-800 pb-2">
                   <span className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Avaliação</span>
                   <span className="text-white font-bold">{game.rating}/5.0</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 text-sm border-b border-zinc-800 pb-2">
                   <span className="flex items-center"><Monitor className="w-4 h-4 mr-2" /> Plataforma</span>
                   <span className="text-white font-bold">{game.platform}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 text-sm border-b border-zinc-800 pb-2">
                   <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Lançamento</span>
                   <span className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 text-sm">
                   <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> DRM Free</span>
                   <span className="text-green-500 font-bold">Sim</span>
                </div>
             </div>
          </div>

          {/* Right Column: Details & Buy */}
          <div className="md:col-span-2 pt-10 md:pt-32">
             <div className="flex flex-wrap items-center gap-3 mb-4">
                {game.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full uppercase tracking-wide">{tag}</span>
                ))}
             </div>
             
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">{game.title}</h1>
             
             <div className="prose prose-invert max-w-none mb-8 text-zinc-300 leading-relaxed">
               <p>{game.description}</p>
               <p>Mergulhe nesta experiência única com gráficos de última geração e jogabilidade fluida. O Fastgames Download garante servidores de alta velocidade para que você comece a jogar em minutos.</p>
             </div>

             {/* Video Section */}
             {embedUrl && (
               <div className="mb-8">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Youtube className="mr-2 text-red-600" /> Trailer
                 </h3>
                 <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xl border border-zinc-800">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={embedUrl} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                 </div>
               </div>
             )}
             
             {/* Screenshots Gallery */}
             {game.screenshots && game.screenshots.length > 0 && (
               <div className="mb-8">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ImageIcon className="mr-2 text-red-600" /> Capturas de Tela
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {game.screenshots.map((shot, idx) => (
                     <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-lg group">
                        <img 
                          src={shot} 
                          alt={`Screenshot ${idx + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Preço Atual</p>
                  <p className="text-4xl font-bold text-white">{game.price === 0 ? 'Grátis' : formatPrice(game.price)}</p>
                </div>

                <button 
                  onClick={handleAction}
                  className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center transition-all transform hover:scale-105 shadow-xl ${
                    isOwned 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isInCart 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isOwned ? (
                    <><Download className="w-6 h-6 mr-3" /> Instalar Agora</>
                  ) : isInCart ? (
                    <><ShoppingCart className="w-6 h-6 mr-3" /> Ver no Carrinho</>
                  ) : (
                    <><ShoppingCart className="w-6 h-6 mr-3" /> Adicionar ao Carrinho</>
                  )}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;