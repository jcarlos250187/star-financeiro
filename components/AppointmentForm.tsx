
import React, { useState, useEffect } from 'react';
import { AppState, Client, Appointment } from '../types';
import { ICONS } from '../constants';

interface AppointmentFormProps {
  state: AppState;
  selectedClient: Client | null;
  editingAppointment: Appointment | null;
  onSave: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ state, selectedClient, editingAppointment, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    serviceId: state.services[0]?.id || '',
    customPrice: state.services[0]?.defaultPrice.toString() || '0',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: 'pending' as 'paid' | 'pending',
    observations: ''
  });

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        serviceId: editingAppointment.serviceId,
        customPrice: editingAppointment.customPrice.toString(),
        date: editingAppointment.date,
        time: editingAppointment.time,
        status: editingAppointment.status,
        observations: editingAppointment.observations
      });
    }
  }, [editingAppointment]);

  const handleServiceChange = (id: string) => {
    const service = state.services.find(s => s.id === id);
    setFormData({
      ...formData,
      serviceId: id,
      customPrice: service ? service.defaultPrice.toString() : formData.customPrice
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingAppointment?.id || '',
      clientId: selectedClient?.id || editingAppointment?.clientId || '',
      serviceId: formData.serviceId,
      date: formData.date,
      time: formData.time,
      customPrice: parseFloat(formData.customPrice),
      status: formData.status,
      observations: formData.observations
    });
  };

  const clientName = selectedClient?.name || state.clients.find(c => c.id === editingAppointment?.clientId)?.name || 'Cliente';

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-end sm:items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] shadow-2xl p-8 space-y-6 animate-in slide-in-from-bottom-full duration-300">
        <header className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingAppointment ? 'Editar Registro' : 'Novo Atendimento'}</h2>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">{clientName}</p>
          </div>
          <button type="button" onClick={onCancel} className="text-slate-300 p-2 hover:bg-slate-100 rounded-full transition-colors">✕</button>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selecione o Serviço</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-800 appearance-none"
              value={formData.serviceId}
              onChange={e => handleServiceChange(e.target.value)}
            >
              {state.services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preço Acordado (R$)</label>
              <input 
                type="number" step="0.01" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-800"
                value={formData.customPrice} onChange={e => setFormData({...formData, customPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Situação Atual</label>
              <select 
                className={`w-full p-4 rounded-2xl border-none outline-none font-black ${formData.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'paid' | 'pending'})}
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data do Serviço</label>
              <input 
                type="date" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Horário</label>
              <input 
                type="time" 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700"
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
            {editingAppointment ? 'Salvar Alterações' : 'Finalizar Registro'}
          </button>
          
          {editingAppointment && (
            <button 
              type="button" 
              onClick={() => onDelete(editingAppointment.id)}
              className="w-full flex items-center justify-center gap-2 py-3 text-red-400 font-black uppercase text-[10px] tracking-widest hover:text-red-600 transition-colors"
            >
              <ICONS.Trash className="w-3 h-3" />
              Excluir permanentemente
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
