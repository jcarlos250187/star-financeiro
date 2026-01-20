
import React, { useState } from 'react';
import { AppState, Client } from '../types';
import { ICONS } from '../constants';

interface ClientsListProps {
  state: AppState;
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onUpdateClient: (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>) => void;
  onDeleteClient: (id: string) => void;
  onSelectClient: (client: Client) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ state, onAddClient, onDeleteClient, onSelectClient }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    observations: '',
    deliveryDate: '' // Estado para o novo campo
  });

  const filteredClients = state.clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient(formData);
    setFormData({ name: '', phone: '', email: '', observations: '', deliveryDate: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Clientes</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl active:scale-90 transition-all"
        >
          <ICONS.Plus className="w-6 h-6" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[32px] shadow-md border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Novo Cadastro</h3>
          
          <input 
            type="text" required placeholder="Nome Completo" 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-800"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              type="tel" placeholder="WhatsApp" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-800"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Data da Entrega</label>
              <input 
                type="date" 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-800"
                value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})}
              />
            </div>
          </div>

          <input 
            type="email" placeholder="E-mail (opcional)" 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-800"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          />

          <textarea 
            placeholder="Observações do cliente" 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none h-24 font-medium text-slate-600"
            value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})}
          />
          
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl">Salvar</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs">Sair</button>
          </div>
        </form>
      )}

      <div className="relative">
        <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou celular..." 
          className="w-full pl-12 pr-4 py-4 rounded-[28px] bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-600"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredClients.map(client => (
          <div 
            key={client.id} 
            className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group hover:border-slate-200 transition-all"
          >
            <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => onSelectClient(client)}>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xl">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-slate-900 truncate">{client.name}</h4>
                <div className="flex gap-2 items-center">
                  <p className="text-xs font-bold text-slate-400">{client.phone}</p>
                  {client.deliveryDate && (
                    <span className="text-[9px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full font-black uppercase">
                      Entrega: {new Date(client.deliveryDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClient(client.id);
                }}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="Excluir cliente"
              >
                <ICONS.Trash className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onSelectClient(client)}
                className="p-3 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-tighter"
              >
                Atender
              </button>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <ICONS.Users className="w-16 h-16 mx-auto mb-4 text-slate-100" />
            <p className="font-black text-slate-300 uppercase text-xs tracking-widest">Nenhum cliente por aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsList;
