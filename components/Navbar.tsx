import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Gamepad2, Search, User, Menu, X, Globe, Settings, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PLATFORMS } from '../constants';

const Navbar: React.FC = () => {
  const { cart, searchQuery, setSearchQuery, user, language, setLanguage } = useStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const translations = {
    pt: { store: 'Início', platforms: 'Plataformas', plans: 'Planos', library: 'Minha Biblioteca', settings: 'Configurações', contact: 'Contato' },
    en: { store: 'Home', platforms: 'Platforms', plans: 'Plans', library: 'My Library', settings: 'Settings', contact: 'Contact' },
    es: { store: 'Inicio', platforms: 'Plataformas', plans: 'Planes', library: 'Mi Biblioteca', settings: 'Configuraciones', contact: 'Contacto' }
  };

  const t = translations[language];

  // Regra de Acesso: Mostrar biblioteca se for Admin OU se for VIP/Premium OU se tiver comprado algum jogo individualmente
  const isSubscribed = user?.status === 'VIP' || user?.status === 'Premium';
  const hasGames = user && user.library.length > 0;
  const isAdmin = user?.role === 'admin';
  
  const showLibraryLink = user && (isAdmin || isSubscribed || hasGames);

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/')}>
            <Gamepad2 className="h-9 w-9 text-red-600 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter text-white leading-none">
                FAST<span className="text-red-600">GAMES</span>
              </span>
              <span className="text-[0.6rem] text-zinc-400 tracking-[0.3em] font-medium uppercase leading-tight pl-0.5 group-hover:text-red-500 transition-colors">
                Download
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              
              <div 
                className="relative group"
                onMouseEnter={() => setIsPlatformOpen(true)}
                onMouseLeave={() => setIsPlatformOpen(false)}
              >
                <button className="text-zinc-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center outline-none">
                  {t.platforms} <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                <div className={`absolute left-0 mt-0 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl py-1 z-50 transition-all duration-200 transform origin-top ${isPlatformOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {PLATFORMS.map((platform) => (
                    <Link 
                      key={platform}
                      to={`/platform/${encodeURIComponent(platform)}`}
                      className="block px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-500 transition-colors"
                    >
                      {platform}
                    </Link>
                  ))}
                </div>
              </div>

              {showLibraryLink && (
                <Link to="/library" className="text-zinc-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.library}</Link>
              )}

              <Link to="/subscription" className="text-zinc-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.plans}</Link>

              <Link to="/contact" className="text-zinc-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.contact}</Link>
              
              {user?.role === 'admin' && (
                <Link to="/admin/settings" className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <Settings className="w-4 h-4 mr-1" />
                  {t.settings}
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder={language === 'pt' ? "Buscar jogos..." : language === 'en' ? "Search games..." : "Buscar juegos..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder-zinc-500"
              />
              <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-zinc-400 hover:text-white">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="text-zinc-300 hover:text-white flex items-center"
              >
                <Globe className="h-5 w-5 mr-1" />
                <span className="uppercase text-xs font-bold">{language}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl py-1 z-50">
                  <button onClick={() => { setLanguage('pt'); setIsLangOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white">Português</button>
                  <button onClick={() => { setLanguage('en'); setIsLangOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white">English</button>
                  <button onClick={() => { setLanguage('es'); setIsLangOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white">Español</button>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-zinc-300 group-hover:text-red-500 transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>
            <div className="flex items-center space-x-2 text-zinc-300 cursor-pointer hover:text-white">
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">{user ? user.name : 'Entrar'}</span>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="text-zinc-300 block px-3 py-2 text-base font-medium">
              <span className="text-zinc-500 text-xs uppercase mb-1 block">{t.platforms}</span>
              <div className="pl-4 border-l border-zinc-800 space-y-1">
                {PLATFORMS.map((platform) => (
                  <Link 
                    key={platform}
                    to={`/platform/${encodeURIComponent(platform)}`}
                    className="block text-zinc-400 hover:text-red-500 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {platform}
                  </Link>
                ))}
              </div>
            </div>

            {showLibraryLink && (
              <Link to="/library" className="text-zinc-300 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t.library}</Link>
            )}

            <Link to="/subscription" className="text-zinc-300 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t.plans}</Link>
             
            <Link to="/contact" className="text-zinc-300 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t.contact}</Link>
            
            {user?.role === 'admin' && (
              <Link to="/admin/settings" className="text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>{t.settings}</Link>
            )}

            <Link to="/cart" className="text-zinc-300 hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Carrinho ({cart.length})</Link>
            
            <div className="border-t border-zinc-800 mt-2 pt-2">
              <p className="px-3 text-zinc-500 text-xs uppercase mb-1">Idioma / Language</p>
              <div className="flex space-x-4 px-3">
                 <button onClick={() => setLanguage('pt')} className={`text-sm ${language === 'pt' ? 'text-red-500' : 'text-zinc-400'}`}>PT</button>
                 <button onClick={() => setLanguage('en')} className={`text-sm ${language === 'en' ? 'text-red-500' : 'text-zinc-400'}`}>EN</button>
                 <button onClick={() => setLanguage('es')} className={`text-sm ${language === 'es' ? 'text-red-500' : 'text-zinc-400'}`}>ES</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;