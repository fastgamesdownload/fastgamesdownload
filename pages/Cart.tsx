import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, formatPrice } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
        <p className="text-zinc-400 mb-8">Parece que você ainda não escolheu sua próxima aventura.</p>
        <Link to="/" className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
          Explorar Jogos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">Seu Carrinho</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-zinc-900 rounded-xl p-4 flex items-center border border-zinc-800 hover:border-zinc-700 transition-colors">
               <div className="w-24 h-32 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden">
                 {item.image ? (
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-600">
                     <CreditCard />
                   </div>
                 )}
               </div>
               
               <div className="ml-6 flex-1">
                 <div className="flex justify-between items-start">
                   <div>
                     <span className="text-xs text-red-500 font-bold uppercase tracking-wider">{item.type === 'plan' ? 'Assinatura' : 'Jogo'}</span>
                     <h3 className="text-xl font-bold text-white mt-1">{item.name}</h3>
                   </div>
                   <button 
                     onClick={() => removeFromCart(item.id)}
                     className="text-zinc-500 hover:text-red-500 transition-colors p-2"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
                 <div className="mt-4 text-right">
                   <p className="text-xl font-bold text-white">{formatPrice(item.price)}</p>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Resumo do Pedido</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({cart.length} itens)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Descontos</span>
                <span className="text-green-500">- {formatPrice(0)}</span>
              </div>
            </div>
            
            <div className="border-t border-zinc-800 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-black text-red-500">{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/20"
            >
              Finalizar Compra <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            
            <p className="text-center text-zinc-500 text-xs mt-4">
              Transação segura e criptografada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

function ShoppingCart(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
}