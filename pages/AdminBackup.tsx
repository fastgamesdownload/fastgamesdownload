import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Database, ShieldAlert, RefreshCw, CheckCircle, Clock, Download } from 'lucide-react';

interface Backup {
  id: string;
  date: string;
  size: string;
  status: 'Completed' | 'Processing';
  type: 'Full' | 'Incremental';
}

const AdminBackup: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<Backup[]>([
    { id: 'bk-102', date: new Date(Date.now() - 86400000).toLocaleString(), size: '1.2 GB', status: 'Completed', type: 'Full' },
    { id: 'bk-101', date: new Date(Date.now() - 172800000).toLocaleString(), size: '450 MB', status: 'Completed', type: 'Incremental' },
    { id: 'bk-100', date: new Date(Date.now() - 604800000).toLocaleString(), size: '1.1 GB', status: 'Completed', type: 'Full' },
  ]);

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

  const handleCreateBackup = () => {
    setLoading(true);
    // Simulate backup process
    setTimeout(() => {
      const newBackup: Backup = {
        id: `bk-${Date.now()}`,
        date: new Date().toLocaleString(),
        size: '1.2 GB',
        status: 'Completed',
        type: 'Full'
      };
      setBackups([newBackup, ...backups]);
      setLoading(false);
      alert('Backup do sistema realizado com sucesso!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Database className="mr-3 text-red-600" /> Backup do Sistema
            </h1>
            <p className="text-zinc-400 mt-2">Crie e gerencie cópias de segurança do site.</p>
          </div>
          <button 
            onClick={handleCreateBackup}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center shadow-lg transition-all ${loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20 hover:-translate-y-0.5'}`}
          >
            {loading ? (
              <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Processando...</>
            ) : (
              <><Database className="w-5 h-5 mr-2" /> Criar Novo Backup</>
            )}
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
             <h3 className="font-bold text-white">Histórico de Backups</h3>
             <span className="text-xs text-zinc-500">Última atualização: Agora mesmo</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/30">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Tamanho</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {backups.map((bk) => (
                  <tr key={bk.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-zinc-400">{bk.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white flex items-center">
                       <Clock className="w-4 h-4 mr-2 text-zinc-500" /> {bk.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <span className={`px-2 py-1 rounded text-xs border ${bk.type === 'Full' ? 'border-blue-900/50 bg-blue-900/20 text-blue-400' : 'border-zinc-700 bg-zinc-800 text-zinc-400'}`}>
                        {bk.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{bk.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="flex items-center text-sm text-green-400">
                         <CheckCircle className="w-4 h-4 mr-1.5" /> {bk.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full" title="Download">
                         <Download className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {backups.length === 0 && (
             <div className="p-8 text-center text-zinc-500">Nenhum backup encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBackup;