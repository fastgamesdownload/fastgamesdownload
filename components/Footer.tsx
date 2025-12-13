import React from 'react';
import { Gamepad2, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Gamepad2 className="h-9 w-9 text-red-600 mr-2" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter text-white leading-none">
                  FAST<span className="text-red-600">GAMES</span>
                </span>
                <span className="text-[0.6rem] text-zinc-500 tracking-[0.3em] font-medium uppercase leading-tight pl-0.5">
                  Download
                </span>
              </div>
            </div>
            <p className="text-zinc-500 text-sm">
              Sua plataforma definitiva para jogos digitais de alta performance. Jogue mais, espere menos.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-red-500 transition-colors">Novos Lançamentos</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Mais Vendidos</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Ofertas</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-red-500 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-red-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-red-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-red-500 transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-8 text-center">
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} Fastgames Download. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;