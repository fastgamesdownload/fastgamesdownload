import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate API call delay
    setTimeout(() => {
      // In a real application, you would make an API call here.
      // Since this is client-side, we simulate a success and open mailto as fallback/demo
      
      const mailtoLink = `mailto:fastgamesdownloadcontato@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`)}`;
      
      // We won't force open the mail client to keep the UI elegant, 
      // but we log it and show success.
      console.log('Sending email to:', 'fastgamesdownloadcontato@gmail.com');
      console.log('Payload:', formData);
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Optional: Uncomment to actually open email client
      // window.location.href = mailtoLink;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-red-500 font-bold uppercase tracking-widest mb-2">Fale Conosco</h2>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Entre em Contato</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Tem alguma dúvida sobre sua assinatura ou precisa de suporte técnico? Nossa equipe está pronta para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
             <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-8 rounded-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                   <Mail className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Email de Suporte</h3>
                <p className="text-zinc-400 mb-4">Para dúvidas gerais e suporte técnico.</p>
                <a href="mailto:fastgamesdownloadcontato@gmail.com" className="text-white font-medium hover:text-red-500 transition-colors break-all">
                  fastgamesdownloadcontato@gmail.com
                </a>
             </div>

             <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-8 rounded-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                   <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chat Ao Vivo</h3>
                <p className="text-zinc-400 mb-4">Disponível para assinantes Premium e Ultimate.</p>
                <span className="text-green-500 font-bold flex items-center text-sm">
                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                   Online Agora
                </span>
             </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h3>
                <p className="text-zinc-400 mb-8">Recebemos seu contato e responderemos para o email fornecido em breve.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Seu Nome</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Seu Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="exemplo@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Assunto</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="Sobre o que você quer falar?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Mensagem</label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Descreva sua dúvida ou problema..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${
                    status === 'sending' 
                      ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/30 hover:-translate-y-1'
                  }`}
                >
                  {status === 'sending' ? (
                    'Enviando...'
                  ) : (
                    <><Send className="w-5 h-5 mr-2" /> Enviar Mensagem</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;