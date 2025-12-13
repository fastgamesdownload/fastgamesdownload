import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Lock } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, purchase, formatPrice } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await purchase();
    setLoading(false);
    navigate('/library'); // Or a success page
    alert('Compra realizada com sucesso!');
  };

  if (cart.length === 0) {
      navigate('/');
      return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
           <h1 className="text-3xl font-bold text-white">Pagamento Seguro</h1>
           <p className="text-zinc-500 mt-2 flex items-center justify-center"><Lock className="w-4 h-4 mr-2" /> Checkout criptografado de 256-bits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center">
               <CreditCard className="mr-3 text-red-600" /> Dados do Cartão
             </h2>
             
             <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Nome no Cartão</label>
                  <input type="text" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="Como aparece no cartão" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Número do Cartão</label>
                  <input type="text" required maxLength={19} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="0000 0000 0000 0000" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Validade</label>
                    <input type="text" required placeholder="MM/AA" maxLength={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">CVV</label>
                    <input type="text" required maxLength={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" placeholder="123" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4 mt-6 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${loading ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/30'}`}
                >
                  {loading ? 'Processando...' : `Pagar ${formatPrice(total)}`}
                </button>
             </form>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Resumo da Compra</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2 scrollbar-thin">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3 last:border-0">
                  <div className="flex items-center">
                    {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded mr-3 object-cover" />}
                    <span className="text-zinc-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-white">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
               <span className="text-lg font-bold text-white">Total</span>
               <span className="text-2xl font-bold text-red-500">{formatPrice(total)}</span>
            </div>
            <div className="mt-8 bg-zinc-800/50 p-4 rounded-lg flex items-start">
               <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
               <p className="text-xs text-zinc-400">
                 Ao clicar em pagar, você concorda com nossos Termos de Serviço. O acesso aos jogos digitais é imediato após a confirmação.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;