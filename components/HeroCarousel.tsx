import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroCarouselProps {
  games: Game[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredGames = games.slice(0, 3); // Top 3 games for carousel

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 10000); // Increased to 10 seconds
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);

  if (featuredGames.length === 0) return null;

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden group">
      {featuredGames.map((game, index) => (
        <div
          key={game.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={game.banner}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl animate-fade-in-up">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-red-500 uppercase bg-red-500/10 border border-red-500/20 rounded-full backdrop-blur-sm">
                  Destaque da Semana
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                  {game.title}
                </h1>
                <p className="text-lg text-zinc-300 mb-8 line-clamp-2">
                  {game.description}
                </p>
                <div className="flex space-x-4">
                   <Link 
                     to={`/game/${game.id}`}
                     className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center"
                   >
                     Jogar Agora
                   </Link>
                   <Link
                     to={`/game/${game.id}`}
                     className="px-8 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold rounded-lg backdrop-blur-md transition-all flex items-center"
                   >
                     <Play className="w-4 h-4 mr-2 fill-current" /> Trailer
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-red-600 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-red-600 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {featuredGames.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-red-600 w-8' : 'bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;