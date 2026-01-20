import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldAlert, Shield, ShieldCheck, Crown, User as UserIcon, Pencil, Trash2, ArrowLeft, Save, Mail, UserCircle } from 'lucide-react';
import { User } from '../types';

const AdminClients: React.FC = () => {
  const { user, clients, updateClient, deleteClient } = useStore();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

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

  const handleEditClick = (client: User) => {
    setEditingClient(client);
    setFormData({ name: client.name, email: client.email });
    setView('edit');
  };

  const handleDeleteClick = (client: User) => {
    if (client.role === 'admin') {
      alert('Não é possível excluir um administrador.');
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}? Esta ação não pode ser desfeita.`)) {
      deleteClient(client.id);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, {
        name: formData.name,
        email: formData.email
      });
      alert('Cliente atualizado com sucesso!');
      setView('list');
      setEditingClient(null);
    }
  };

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
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="mr-3 text-red-600" /> {view === 'list' ? 'Gestão de Clientes' : 'Editar Cliente'}
            </h1>
            <p className="text-zinc-400 mt-2">
              {view === 'list' ? 'Gerencie permissões, status e perfis dos usuários.' : `Alterando informações de ${editingClient?.name}`}
            </p>
          </div>
          {view === 'edit' && (
            <button 
              onClick={() => setView('list')}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg flex items-center transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Lista
            </button>
          )}
        </div>

        {view === 'list' ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl animate-fade-in">
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
                    <tr key={client.id} className="hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-400 group-hover:border-red-600/50 transition-colors">
                             <UserIcon className="w-5 h-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white group-hover:text-red-500 transition-colors">{client.name}</div>
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
                        <div className="flex items-center justify-end space-x-2">
                           {client.id !== user.id && (
                             <button 
                               onClick={() => updateClient(client.id, { role: client.role === 'admin' ? 'user' : 'admin' })}
                               className={`px-3 py-1 rounded text-[10px] font-bold transition-colors border uppercase tracking-wider ${client.role === 'user' ? 'border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white' : 'border-zinc-600 text-zinc-400 hover:bg-zinc-700'}`}
                               title={client.role === 'user' ? 'Promover a Admin' : 'Remover Admin'}
                             >
                               {client.role === 'user' ? 'Tornar Admin' : 'Revogar'}
                             </button>
                           )}
                           
                           <button 
                             onClick={() => handleEditClick(client)}
                             className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                             title="Editar Perfil"
                           >
                             <Pencil className="w-4 h-4" />
                           </button>

                           {client.role !== 'admin' && (
                             <button 
                               onClick={() => handleDeleteClick(client)}
                               className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-all"
                               title="Excluir Cliente"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Edit View */
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl animate-fade-in-up max-w-2xl mx-auto">
             <form onSubmit={handleSaveEdit} className="space-y-6">
                <div className="flex items-center justify-center mb-8">
                   <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 text-zinc-400 overflow-hidden">
                         <UserCircle className="w-20 h-20 opacity-20" />
                         <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/10 uppercase">
                           {formData.name.charAt(0)}
                         </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-red-600 p-2 rounded-full border-4 border-zinc-900">
                         <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Nome Completo</label>
                      <div className="relative">
                         <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                         <input 
                           type="text" 
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                           placeholder="Nome do usuário"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                         <input 
                           type="email" 
                           required
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                           placeholder="email@exemplo.com"
                         />
                      </div>
                   </div>

                   <div className="pt-4 grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                         <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Status Atual</span>
                         <span className={`text-sm font-bold ${getStatusColor(editingClient?.status || 'Normal').split(' ')[0]}`}>
                           {editingClient?.status}
                         </span>
                      </div>
                      <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                         <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Nível de Acesso</span>
                         <span className="text-sm font-bold text-white">
                           {editingClient?.role === 'admin' ? 'Administrador' : 'Usuário Comum'}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-zinc-800 flex justify-end">
                   <button 
                     type="button" 
                     onClick={() => setView('list')}
                     className="mr-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center"
                   >
                     <Save className="w-5 h-5 mr-2" /> Salvar Alterações
                   </button>
                </div>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;