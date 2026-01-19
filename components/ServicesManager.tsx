
import React, { useState } from 'react';
import { AppState, ServiceType } from '../types';
import { ICONS } from '../constants';

interface ServicesManagerProps {
  state: AppState;
  onAddService: (service: Omit<ServiceType, 'id'>) => void;
  onDeleteService: (id: string) => void;
}

const ServicesManager: React.FC<ServicesManagerProps> = ({ state, onAddService, onDeleteService }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', defaultPrice: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.defaultPrice) return;
    
    onAddService({
      name: formData.name,
      defaultPrice: parseFloat(formData.defaultPrice)
    });
    setFormData({ name: '', defaultPrice: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Meus Serviços</h2>
          <p className="text-sm text-slate-500">Gerencie seu catálogo e preços padrão.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          <ICONS.Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Nome do Serviço</label>
              <input 
                type="text" required placeholder="Ex: Manutenção de PC" 
                className="w-full p-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Valor Padrão (R$)</label>
              <input 
                type="number" step="0.01" required placeholder="0,00" 
                className="w-full p-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.defaultPrice} onChange={e => setFormData({...formData, defaultPrice: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Salvar Serviço</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.services.map(service => (
          <div key={service.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <ICONS.Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{service.name}</h4>
                <p className="text-sm font-medium text-emerald-600">R$ {service.defaultPrice.toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={() => onDeleteService(service.id)}
              className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
