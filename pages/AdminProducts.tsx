import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, Layout, Tag, DollarSign, Star, ShieldAlert, Monitor, Youtube, Images, Trash2, Upload } from 'lucide-react';
import { CATEGORIES, PLATFORMS } from '../constants';

const AdminProducts: React.FC = () => {
  const { user, addGame } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    banner: '',
    category: CATEGORIES[1], // Default to first actual category
    platform: PLATFORMS[0],
    videoUrl: '',
    rating: '4.5',
    screenshots: [] as string[]
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const filePromises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            }
          };
          reader.readAsDataURL(file as Blob);
        });
      });

      Promise.all(filePromises).then(base64Images => {
        setFormData(prev => ({
          ...prev,
          screenshots: [...prev.screenshots, ...base64Images]
        }));
      });
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGame = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || 'https://picsum.photos/400/600',
      banner: formData.banner || 'https://picsum.photos/1920/1080',
      rating: parseFloat(formData.rating),
      category: formData.category,
      platform: formData.platform,
      videoUrl: formData.videoUrl,
      screenshots: formData.screenshots,
      releaseDate: new Date().toISOString(),
      tags: [formData.category, formData.platform, 'Novo']
    };

    addGame(newGame);
    alert('Jogo adicionado com sucesso!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Layout className="mr-3 text-red-600" /> Painel do Administrador
          </h1>
          <p className="text-zinc-400 mt-2">Adicionar novo produto ao catálogo.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Col */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Título do Jogo</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title} 
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none" 
                  placeholder="Ex: Cyber Adventure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Plataforma</label>
                <div className="relative">
                   <Monitor className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                   <select 
                     name="platform"
                     value={formData.platform}
                     onChange={handleChange}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none appearance-none"
                   >
                     {PLATFORMS.map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Categoria</label>
                <div className="relative">
                   <Tag className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                   <select 
                     name="category"
                     value={formData.category}
                     onChange={handleChange}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none appearance-none"
                   >
                     {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-2">Preço (R$)</label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                    <input 
                      type="number" 
                      name="price"
                      required
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
                      placeholder="0.00"
                    />
                 </div>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-2">Avaliação (0-5)</label>
                 <div className="relative">
                    <Star className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                    <input 
                      type="number" 
                      name="rating"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
                    />
                 </div>
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-6">
               <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">URL da Capa (Vertical)</label>
                <div className="relative">
                   <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                   <input 
                     type="text" 
                     name="image"
                     value={formData.image}
                     onChange={handleChange}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
                     placeholder="https://..."
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">URL do Banner (Horizontal)</label>
                <div className="relative">
                   <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                   <input 
                     type="text" 
                     name="banner"
                     value={formData.banner}
                     onChange={handleChange}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
                     placeholder="https://..."
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">URL do Vídeo YouTube (Opcional)</label>
                <div className="relative">
                   <Youtube className="absolute left-3 top-3.5 w-5 h-5 text-zinc-500" />
                   <input 
                     type="text" 
                     name="videoUrl"
                     value={formData.videoUrl}
                     onChange={handleChange}
                     className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
                     placeholder="https://www.youtube.com/watch?v=..."
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Capturas de Tela (Upload)</label>
                <div className="bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
                   <input 
                     type="file"
                     id="screenshot-upload"
                     multiple
                     accept="image/*"
                     onChange={handleScreenshotUpload}
                     className="hidden"
                   />
                   <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors">
                     <Upload className="w-8 h-8 mb-2" />
                     <span className="text-sm font-medium">Clique para enviar imagens</span>
                     <span className="text-xs text-zinc-500 mt-1">Carregar do dispositivo</span>
                   </label>
                </div>
                
                {/* Preview */}
                {formData.screenshots.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {formData.screenshots.map((shot, idx) => (
                      <div key={idx} className="relative group aspect-video bg-black rounded overflow-hidden border border-zinc-700">
                        <img src={shot} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeScreenshot(idx)}
                          className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição</label>
                <textarea 
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none resize-none"
                  placeholder="Sinopse do jogo..."
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-end">
             <button 
               type="button" 
               onClick={() => navigate('/')}
               className="mr-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
             >
               Cancelar
             </button>
             <button 
               type="submit"
               className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center"
             >
               <Save className="w-5 h-5 mr-2" /> Salvar Produto
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;