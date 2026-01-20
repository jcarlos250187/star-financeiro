
import React, { useState } from 'react';
import { AppState, Client } from '../types';
import { ICONS } from '../constants';

interface ClientsListProps {
  state: AppState;
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  // Added onUpdateClient to interface to fix type mismatch with App.tsx
  onUpdateClient: (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt'>>) => void;
  onSelectClient: (client: Client) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ state, onAddClient, onSelectClient }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', observations: '' });

  const filteredClients = state.clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient(formData);
    setFormData({ name: '', phone: '', email: '', observations: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Clientes</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ICONS.Plus className="w-6 h-6" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold text-slate-800">Novo Cliente</h3>
          <input 
            type="text" required placeholder="Nome Completo" 
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="tel" placeholder="WhatsApp" 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <input 
              type="email" placeholder="E-mail" 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <textarea 
            placeholder="Observações (opcional)" 
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-24"
            value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Salvar Cliente</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">Cancelar</button>
          </div>
        </form>
      )}

      <div className="relative">
        <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {filteredClients.map(client => (
          <div 
            key={client.id} 
            onClick={() => onSelectClient(client)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{client.name}</h4>
                <p className="text-sm text-slate-500">{client.phone}</p>
              </div>
            </div>
            <ICONS.Plus className="w-5 h-5 text-slate-300" />
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ICONS.Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Nenhum cliente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsList;