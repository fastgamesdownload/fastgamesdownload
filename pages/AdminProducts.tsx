
import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Image as ImageIcon, 
  Layout, 
  ShieldAlert, 
  Trash2, 
  Upload, 
  Cpu, 
  Package, 
  Plus,
  ArrowLeft,
  Search,
  Pencil,
  Monitor,
  Video,
  Star,
  X
} from 'lucide-react';
import { CATEGORIES, PLATFORMS } from '../constants';
import { Game } from '../types';

const AdminProducts: React.FC = () => {
  const { user, addGame, updateGame, deleteGame, games } = useStore();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'list' | 'add'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGameId, setEditingGameId] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const screenshotsInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    title: '',
    description: '',
    price: '0.00',
    mediaType: 'Digital' as 'Física' | 'Digital',
    isFeatured: false,
    image: '',
    banner: '',
    category: CATEGORIES[1], 
    platform: PLATFORMS[0],
    videoUrl: '',
    downloadUrl: '',
    rating: '4.5',
    screenshots: [] as string[]
  };

  const [formData, setFormData] = useState(initialFormState);

  const getYoutubeEmbedUrl = (input: string) => {
    if (!input) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return `https://www.youtube.com/embed/${input}?rel=0`;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?rel=0` : null;
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, [field]: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Fix for line 107 error:
   * Array.from(e.target.files) can sometimes return unknown[] in certain TypeScript configurations.
   * Explicitly casting it to File[] ensures that the 'file' variable is correctly typed for readAsDataURL.
   */
  const handleScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({ 
              ...prev, 
              screenshots: [...prev.screenshots, event.target?.result as string] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (game: Game) => {
    setEditingGameId(game.id);
    setFormData({
      title: game.title,
      description: game.description,
      price: game.price.toString(),
      mediaType: game.mediaType || 'Digital',
      isFeatured: !!game.isFeatured,
      image: game.image,
      banner: game.banner,
      category: game.category,
      platform: game.platform,
      videoUrl: game.videoUrl || '',
      downloadUrl: game.downloadUrl || '',
      rating: game.rating.toString(),
      screenshots: game.screenshots || []
    });
    setView('add');
  };

  const handleDelete = (gameId: string) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      deleteGame(gameId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueId = editingGameId || `game-${Date.now()}`;

    const gameData: Game = {
      id: uniqueId,
      title: formData.title,
      description: formData.description,
      price: formData.mediaType === 'Digital' ? 0 : parseFloat(formData.price),
      image: formData.image || 'https://picsum.photos/400/600',
      banner: formData.banner || 'https://picsum.photos/1920/1080',
      rating: parseFloat(formData.rating),
      category: formData.category,
      platform: formData.platform,
      videoUrl: formData.videoUrl,
      downloadUrl: formData.downloadUrl,
      screenshots: formData.screenshots,
      releaseDate: editingGameId ? (games.find(g => g.id === editingGameId)?.releaseDate || new Date().toISOString()) : new Date().toISOString(),
      tags: [formData.category, formData.platform, formData.mediaType, 'Novo'],
      mediaType: formData.mediaType,
      isFeatured: formData.isFeatured
    };

    if (editingGameId) {
      updateGame(gameData);
      alert('Produto atualizado com sucesso!');
    } else {
      addGame(gameData);
      alert('Novo produto salvo com sucesso!');
    }
    
    setView('list');
    setEditingGameId(null);
    setFormData(initialFormState);
  };

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const previewEmbedUrl = getYoutubeEmbedUrl(formData.videoUrl);

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Layout className="mr-3 text-red-600" /> 
              {view === 'list' ? 'Gestão de Estoque' : editingGameId ? 'Editar Postagem' : 'Nova Postagem'}
            </h1>
            <p className="text-zinc-400 mt-2">Gerencie seu catálogo de jogos e mídias.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {view === 'list' ? (
              <button 
                onClick={() => { setEditingGameId(null); setFormData(initialFormState); setView('add'); }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 mr-2" /> Novo Produto
              </button>
            ) : (
              <button onClick={() => setView('list')} className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg flex items-center transition-colors hover:bg-zinc-700">
                <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Lista
              </button>
            )}
          </div>
        </div>

        {view === 'list' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Pesquisar por título ou plataforma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-950/50 border-b border-zinc-800">
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Mídia</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Destaque</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredGames.length > 0 ? filteredGames.map((game) => (
                      <tr key={game.id} className="hover:bg-zinc-800/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={game.image} className="h-12 w-9 rounded bg-zinc-800 mr-4 object-cover border border-zinc-700" alt="" />
                            <div>
                               <div className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">{game.title}</div>
                               <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">{game.platform}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${game.mediaType === 'Digital' ? 'text-blue-400 border border-blue-900/50 bg-blue-900/10' : 'text-red-400 border border-red-900/50 bg-red-900/10'}`}>
                            {game.mediaType || 'Física'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {game.isFeatured ? (
                            <span className="flex items-center text-xs font-bold text-yellow-500">
                              <Star className="w-3 h-3 mr-1 fill-current" /> Sim
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-zinc-600">Não</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <button onClick={() => handleEdit(game)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                             <button onClick={() => handleDelete(game.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">Nenhum produto encontrado no banco de dados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl animate-fade-in-up">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div>
                     <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Título do Jogo</label>
                     <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all" placeholder="Ex: God of War" />
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Tipo de Mídia</label>
                         <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setFormData(p => ({ ...p, mediaType: 'Digital' }))} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${formData.mediaType === 'Digital' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                              <Cpu className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase">Digital</span>
                            </button>
                            <button type="button" onClick={() => setFormData(p => ({ ...p, mediaType: 'Física' }))} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${formData.mediaType === 'Física' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                              <Package className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase">Física</span>
                            </button>
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Exibir no Banner?</label>
                         <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setFormData(p => ({ ...p, isFeatured: true }))} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${formData.isFeatured ? 'bg-yellow-600 border-yellow-600 text-white shadow-lg shadow-yellow-900/40' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                              <Star className={`w-5 h-5 mb-1 ${formData.isFeatured ? 'fill-current' : ''}`} />
                              <span className="text-[10px] font-bold uppercase">Sim</span>
                            </button>
                            <button type="button" onClick={() => setFormData(p => ({ ...p, isFeatured: false }))} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${!formData.isFeatured ? 'bg-zinc-700 border-zinc-700 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                              <Trash2 className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold uppercase">Não</span>
                            </button>
                         </div>
                      </div>
                   </div>

                   {formData.mediaType === 'Digital' && (
                     <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Link para Download</label>
                       <input type="text" name="downloadUrl" value={formData.downloadUrl} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Ex: https://mega.nz/..." />
                     </div>
                   )}

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Plataforma</label>
                        <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none cursor-pointer focus:ring-2 focus:ring-red-600">
                          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Categoria</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none cursor-pointer focus:ring-2 focus:ring-red-600">
                          {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>

                   {formData.mediaType === 'Física' && (
                     <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Preço (R$)</label>
                       <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none" />
                     </div>
                   )}

                   <div>
                     <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Descrição Detalhada</label>
                     <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none resize-none focus:ring-2 focus:ring-red-600" placeholder="Conte mais sobre o jogo..." />
                   </div>

                   {/* Screenshots Section */}
                   <div className="pt-4">
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center">
                         <Monitor className="w-4 h-4 mr-2" /> Capturas de Tela (Screenshots)
                      </label>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={screenshotsInputRef}
                        onChange={handleScreenshotsUpload}
                      />
                      <button 
                        type="button"
                        onClick={() => screenshotsInputRef.current?.click()}
                        className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-800/30 text-zinc-400 hover:text-white hover:border-red-600 transition-all flex flex-col items-center justify-center mb-4"
                      >
                         <Upload className="w-8 h-8 mb-2" />
                         <span className="text-sm font-bold">Clique para enviar múltiplas imagens</span>
                         <span className="text-[10px] text-zinc-600 uppercase mt-1">Hospedagem direta no site</span>
                      </button>

                      {formData.screenshots.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                           {formData.screenshots.map((shot, idx) => (
                             <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 group">
                                <img src={shot} alt="" className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => removeScreenshot(idx)}
                                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                   <X className="w-3 h-3" />
                                </button>
                             </div>
                           ))}
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-8">
                   {/* URL da Capa - Upload Area */}
                   <div>
                     <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Imagem da Capa (Vertical)</label>
                     <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       ref={coverInputRef} 
                       onChange={(e) => handleFileUpload(e, 'image')}
                     />
                     <div 
                       onClick={() => coverInputRef.current?.click()}
                       className={`relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-zinc-800/50 ${formData.image ? 'border-red-600/50' : 'border-zinc-700 hover:border-red-600 hover:bg-zinc-800'}`}
                     >
                       {formData.image ? (
                         <>
                           <img src={formData.image} alt="Capa" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white font-bold flex items-center"><Upload className="w-5 h-5 mr-2" /> Trocar Capa</span>
                           </div>
                         </>
                       ) : (
                         <div className="text-center p-6">
                            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-400 font-bold text-sm">Clique para enviar imagem</p>
                            <p className="text-zinc-600 text-[10px] mt-1 uppercase tracking-tighter">Proporção 3:4 recomendada</p>
                         </div>
                       )}
                     </div>
                   </div>

                   {/* URL do Banner - Upload Area */}
                   <div>
                     <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Banner do Jogo (Horizontal)</label>
                     <input 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       ref={bannerInputRef} 
                       onChange={(e) => handleFileUpload(e, 'banner')}
                     />
                     <div 
                       onClick={() => bannerInputRef.current?.click()}
                       className={`relative w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-zinc-800/50 ${formData.banner ? 'border-red-600/50' : 'border-zinc-700 hover:border-red-600 hover:bg-zinc-800'}`}
                     >
                       {formData.banner ? (
                         <>
                           <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-white font-bold flex items-center"><Upload className="w-5 h-5 mr-2" /> Trocar Banner</span>
                           </div>
                         </>
                       ) : (
                         <div className="text-center p-6">
                            <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-400 font-bold text-sm">Clique para enviar imagem</p>
                            <p className="text-zinc-600 text-[10px] mt-1 uppercase tracking-tighter">Proporção 16:9 recomendada</p>
                         </div>
                       )}
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Vídeo do YouTube (Trailer)</label>
                     <div className="relative">
                       <Video className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                       <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all" placeholder="Ex: dQw4w9WgXcQ ou URL completa" />
                     </div>
                   </div>

                   {previewEmbedUrl && (
                     <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
                       <iframe width="100%" height="100%" src={previewEmbedUrl} frameBorder="0" allowFullScreen title="Preview"></iframe>
                     </div>
                   )}
                </div>
             </div>

             <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-end space-x-4">
                <button type="button" onClick={() => setView('list')} className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors">Cancelar</button>
                <button type="submit" className="px-10 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xl flex items-center transition-all transform hover:scale-105">
                  <Save className="w-5 h-5 mr-2" /> {editingGameId ? 'Salvar Alterações' : 'Publicar no Catálogo'}
                </button>
             </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
