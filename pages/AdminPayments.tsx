import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldAlert, Save, QrCode, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminPayments: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    pixEnabled: true,
    pixKeyType: 'CNPJ',
    pixKey: '00.000.000/0001-00',
    cardEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    paypalEnabled: false
  });

  // Protect the route
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-red-900/50">
           <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
           <p className="text-zinc-400 mb-6">Você não tem permissão para acessar esta área.</p>
           <button onClick={() => navigate('/')} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg">Voltar</button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings({
      ...settings,
      [e.target.name]: value
    });
  };

  const toggleMethod = (key: 'pixEnabled' | 'cardEnabled' | 'paypalEnabled') => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configurações de pagamento salvas com sucesso!');
    navigate('/admin/settings');
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <CreditCard className="mr-3 text-red-600" /> Gerenciar Pagamentos
          </h1>
          <p className="text-zinc-400 mt-2">Configure gateways e chaves de API.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
            
            {/* PIX Settings */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                    <div className="flex items-center">
                        <QrCode className="w-6 h-6 text-green-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Configuração PIX</h2>
                            <p className="text-xs text-zinc-500">Pagamento instantâneo</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => toggleMethod('pixEnabled')}>
                        {settings.pixEnabled ? <ToggleRight className="w-10 h-10 text-green-500" /> : <ToggleLeft className="w-10 h-10 text-zinc-600" />}
                    </button>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!settings.pixEnabled && 'opacity-50 pointer-events-none'}`}>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Tipo de Chave</label>
                        <select 
                            name="pixKeyType"
                            value={settings.pixKeyType}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-600 outline-none"
                        >
                            <option value="CPF">CPF</option>
                            <option value="CNPJ">CNPJ</option>
                            <option value="Email">Email</option>
                            <option value="Random">Aleatória</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Chave PIX</label>
                        <input 
                            type="text" 
                            name="pixKey"
                            value={settings.pixKey}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-600 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Credit Card Settings */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                    <div className="flex items-center">
                        <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Cartão de Crédito (Stripe)</h2>
                            <p className="text-xs text-zinc-500">Processamento via API</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => toggleMethod('cardEnabled')}>
                        {settings.cardEnabled ? <ToggleRight className="w-10 h-10 text-blue-500" /> : <ToggleLeft className="w-10 h-10 text-zinc-600" />}
                    </button>
                </div>
                
                <div className={`space-y-6 ${!settings.cardEnabled && 'opacity-50 pointer-events-none'}`}>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Public Key</label>
                        <input 
                            type="text" 
                            name="stripePublicKey"
                            value={settings.stripePublicKey}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Secret Key</label>
                        <input 
                            type="password" 
                            name="stripeSecretKey"
                            value={settings.stripeSecretKey}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                 <button 
                   type="button" 
                   onClick={() => navigate('/admin/settings')}
                   className="mr-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit"
                   className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center"
                 >
                   <Save className="w-5 h-5 mr-2" /> Salvar Configurações
                 </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPayments;