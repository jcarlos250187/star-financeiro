
import React, { useState, useEffect } from 'react';
import { AppState, Client, Appointment } from '../types';

interface AppointmentFormProps {
  state: AppState;
  selectedClient: Client | null;
  editingAppointment: Appointment | null;
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ state, selectedClient, editingAppointment, onSave, onCancel }) => {
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
      id: editingAppointment?.id || '', // id será gerado no App.tsx se vazio
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-in slide-in-from-bottom-full duration-300">
        <header className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{editingAppointment ? 'Editar Atendimento' : 'Novo Atendimento'}</h2>
            <p className="text-sm text-slate-500">Cliente: <span className="font-semibold text-indigo-600">{clientName}</span></p>
          </div>
          <button type="button" onClick={onCancel} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full">✕</button>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Serviço</label>
            <select 
              className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium text-slate-700"
              value={formData.serviceId}
              onChange={e => handleServiceChange(e.target.value)}
            >
              {state.services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (R$ {s.defaultPrice})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Final</label>
              <input 
                type="number" step="0.01" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium"
                value={formData.customPrice} onChange={e => setFormData({...formData, customPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
              <select 
                className={`w-full p-3 rounded-xl border-none outline-none font-bold ${formData.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'paid' | 'pending'})}
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data</label>
              <input 
                type="date" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none text-sm"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Horário</label>
              <input 
                type="time" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none text-sm"
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all">
            {editingAppointment ? 'Atualizar Dados' : 'Confirmar Lançamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
