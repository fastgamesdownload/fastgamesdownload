import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  ShieldAlert, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  FileJson,
  ArrowLeft
} from 'lucide-react';

const AdminBackup: React.FC = () => {
  const { user, games, clients, importDatabase, resetToDefaults } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-red-900/50">
           <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
           <button onClick={() => navigate('/')} className="px-6 py-2 bg-zinc-800 text-white rounded-lg">Voltar</button>
        </div>
      </div>
    );
  }

  // FUNÇÃO: EXPORTAR BANCO DE DADOS
  const handleExport = () => {
    setLoading(true);
    try {
      const database = {
        version: "2.0",
        exportDate: new Date().toISOString(),
        games: games,
        clients: clients
      };

      const dataStr = JSON.stringify(database, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", `fastgames_db_backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      URL.revokeObjectURL(url);
      
      setTimeout(() => {
        setLoading(false);
        alert('Banco de dados exportado com sucesso!');
      }, 500);
    } catch (err) {
      setLoading(false);
      alert('Erro ao exportar dados. O banco de dados pode estar muito grande para o processamento do navegador.');
    }
  };

  // FUNÇÃO: IMPORTAR E RESTAURAR BANCO DE DADOS
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') throw new Error("Falha na leitura do arquivo");
        
        const json = JSON.parse(result);
        
        // Verificação robusta da estrutura do backup
        if (json && json.games && Array.isArray(json.games)) {
          const gameCount = json.games.length;
          const clientCount = json.clients?.length || 0;

          if (window.confirm(`ATENÇÃO: Confirmar restauração de ${gameCount} produtos e ${clientCount} clientes? \n\nIsso substituirá todos os dados atuais.`)) {
            
            const success = importDatabase({
              games: json.games,
              clients: json.clients || []
            });

            if (success) {
              alert('Restauração concluída com sucesso! O sistema será reiniciado para aplicar as mudanças.');
              window.location.reload();
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
          alert('Erro: O arquivo selecionado não é um backup válido do Fastgames.');
        }
      } catch (err) {
        setLoading(false);
        alert('Erro ao processar arquivo: Certifique-se de que é um arquivo .json válido.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      setLoading(false);
      alert('Erro na leitura física do arquivo.');
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center text-zinc-500 text-sm mb-2">
               <button onClick={() => navigate('/admin/settings')} className="hover:text-red-500 flex items-center transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Configurações
               </button>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Database className="mr-3 text-red-600" /> Banco de Dados & Backup
            </h1>
            <p className="text-zinc-400 mt-2">Proteja suas postagens e informações de clientes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
           
           {/* Card: Exportar */}
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl hover:border-red-900/30 transition-all group">
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                 <Download className="w-6 h-6 text-red-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Exportar DB</h3>
              <p className="text-zinc-500 text-sm mb-6">Baixe uma cópia completa de todos os seus produtos e clientes em formato JSON.</p>
              <button 
                onClick={handleExport}
                disabled={loading}
                className="w-full py-3 bg-zinc-800 hover:bg-red-600 text-white font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileJson className="w-4 h-4 mr-2" />}
                Baixar Backup
              </button>
           </div>

           {/* Card: Importar (Restaurar) */}
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl hover:border-blue-900/30 transition-all group">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                 <Upload className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Restaurar DB</h3>
              <p className="text-zinc-500 text-sm mb-6">Suba um arquivo de backup (.json) para restaurar as postagens e clientes salvos anteriormente.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full py-3 bg-zinc-800 hover:bg-blue-600 text-white font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Restaurar Agora
              </button>
           </div>

           {/* Card: Reset */}
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl hover:border-orange-900/30 transition-all group">
              <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                 <Trash2 className="w-6 h-6 text-orange-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Limpar Tudo</h3>
              <p className="text-zinc-500 text-sm mb-6">Apaga todos os dados e retorna o site para as configurações originais de fábrica.</p>
              <button 
                onClick={resetToDefaults}
                disabled={loading}
                className="w-full py-3 bg-zinc-800 hover:bg-orange-600 text-white font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4 mr-2" /> Resetar Fábrica
              </button>
           </div>

        </div>

        {/* Info Box */}
        <div className="bg-red-900/10 border border-red-900/20 rounded-xl p-6 flex items-start">
           <AlertTriangle className="w-6 h-6 text-red-600 mr-4 flex-shrink-0 mt-1" />
           <div>
              <h4 className="text-red-500 font-bold mb-1">Atenção ao Navegador</h4>
              <p className="text-zinc-400 text-sm">
                Os dados são salvos no seu navegador local (LocalStorage). Se você limpar o cache ou formatar o computador, seus produtos adicionados serão perdidos. 
                <strong> É altamente recomendado baixar um backup semanalmente</strong> para garantir a segurança do seu catálogo.
              </p>
           </div>
        </div>

        {/* Status Section */}
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
           <h3 className="text-xl font-bold text-white mb-6">Status do Sistema</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Produtos no Catálogo:</span>
                    <span className="text-white font-bold">{games.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Base de Clientes:</span>
                    <span className="text-white font-bold">{clients.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Sincronização:</span>
                    <span className="text-green-500 font-bold flex items-center">
                       <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" /> 
                       Ativa
                    </span>
                 </div>
              </div>
              <div className="flex flex-col justify-center border-l border-zinc-800 md:pl-8">
                 <p className="text-xs text-zinc-500 italic">
                   "A restauração de backup substituirá todos os dados, incluindo as imagens (Base64) das capturas de tela e capas hospedadas localmente."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBackup;