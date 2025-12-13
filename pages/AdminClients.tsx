import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldAlert, Shield, ShieldCheck, Crown, User as UserIcon } from 'lucide-react';

const AdminClients: React.FC = () => {
  const { user, clients, updateClient } = useStore();
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'VIP': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
      case 'Premium': return 'text-purple-500 border-purple-500/20 bg-purple-500/10';
      default: return 'text-zinc-400 border-zinc-700 bg-zinc-800';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="mr-3 text-red-600" /> Gestão de Clientes
            </h1>
            <p className="text-zinc-400 mt-2">Gerencie permissões e status dos usuários.</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Função</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-400">
                           <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{client.name}</div>
                          <div className="text-xs text-zinc-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.role === 'admin' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                         {client.role === 'admin' ? <ShieldCheck className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
                         {client.role === 'admin' ? 'Administrador' : 'Usuário'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <select 
                         value={client.status}
                         onChange={(e) => updateClient(client.id, { status: e.target.value as any })}
                         className={`text-xs font-bold px-3 py-1 rounded-full border outline-none cursor-pointer ${getStatusColor(client.status)}`}
                       >
                         <option value="Normal" className="bg-zinc-900 text-zinc-400">Normal</option>
                         <option value="Premium" className="bg-zinc-900 text-purple-400">Premium</option>
                         <option value="VIP" className="bg-zinc-900 text-yellow-400">VIP</option>
                       </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       {client.id !== user.id && ( // Prevent admin from demoting themselves
                         <button 
                           onClick={() => updateClient(client.id, { role: client.role === 'admin' ? 'user' : 'admin' })}
                           className={`px-3 py-1 rounded text-xs font-bold transition-colors border ${client.role === 'user' ? 'border-red-600 text-red-500 hover:bg-red-600 hover:text-white' : 'border-zinc-600 text-zinc-400 hover:bg-zinc-700'}`}
                         >
                           {client.role === 'user' ? 'Promover a Admin' : 'Remover Admin'}
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClients;