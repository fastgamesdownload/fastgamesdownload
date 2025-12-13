import React from 'react';
import { PLANS } from '../constants';
import { Check, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
  const { addToCart, user, formatPrice } = useStore();
  const navigate = useNavigate();

  const handleSubscribe = (plan: any) => {
    addToCart({
      id: plan.id,
      name: `Assinatura ${plan.name}`,
      price: plan.price,
      type: 'plan',
      details: plan
    });
    navigate('/cart');
  };

  // Filter out hidden plans (like the Starter test plan)
  const visiblePlans = PLANS.filter(plan => !plan.isHidden);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-red-500 font-bold uppercase tracking-widest mb-2">Fastgames Premium</h2>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Escolha Seu Nível de Poder</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Desbloqueie acesso ilimitado, downloads mais rápidos e conteúdos exclusivos com nossos planos de assinatura mensal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visiblePlans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative rounded-2xl p-8 flex flex-col ${
              plan.isPopular 
                ? 'bg-zinc-900 border-2 border-red-600 shadow-2xl shadow-red-900/20 scale-105 z-10' 
                : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                <Zap className="w-4 h-4 mr-1 fill-current" /> Mais Popular
              </div>
            )}

            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">{formatPrice(plan.price)}</span>
              <span className="text-zinc-500">/mês</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-zinc-300">
                  <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.isPopular ? 'text-red-500' : 'text-zinc-500'}`} />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                plan.isPopular
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {user?.isSubscribed ? 'Mudar Plano' : 'Assinar Agora'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;