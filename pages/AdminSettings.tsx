import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, ShieldAlert, Layout, Users, CreditCard, ChevronRight, Database } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();

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

  const menuItems = [
    {
      title: 'Gerenciar Produtos',
      description: 'Adicionar, editar ou remover jogos do catálogo.',
      icon: <Layout className="w-8 h-8 text-red-500" />,
      link: '/admin/products',
      color: 'hover:border-red-600/50'
    },
    {
      title: 'Gerenciar Clientes',
      description: 'Administrar permissões, status VIP e usuários.',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      link: '/admin/clients',
      color: 'hover:border-blue-600/50'
    },
    {
      title: 'Pagamentos',
      description: 'Configurar chaves de API, Pix e métodos de pagamento.',
      icon: <CreditCard className="w-8 h-8 text-green-500" />,
      link: '/admin/payments',
      color: 'hover:border-green-600/50'
    },
    {
      title: 'Backup do Sistema',
      description: 'Gerenciar cópias de segurança de todo o site.',
      icon: <Database className="w-8 h-8 text-yellow-500" />,
      link: '/admin/backup',
      color: 'hover:border-yellow-600/50'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Settings className="mr-3 text-red-600" /> Configurações do Sistema
          </h1>
          <p className="text-zinc-400 mt-2">Painel de controle administrativo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.link}
              className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group ${item.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                  {item.icon}
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;