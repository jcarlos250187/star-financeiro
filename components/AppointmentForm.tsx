
import React, { useState } from 'react';
import { AppState, Client, ServiceType, Appointment } from '../types';

interface AppointmentFormProps {
  state: AppState;
  selectedClient: Client;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ state, selectedClient, onSave, onCancel }) => {
  const [serviceId, setServiceId] = useState(state.services[0]?.id || '');
  const [customPrice, setCustomPrice] = useState(state.services[0]?.defaultPrice.toString() || '0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  const [status, setStatus] = useState<'paid' | 'pending'>('pending');
  const [observations, setObservations] = useState('');

  const handleServiceChange = (id: string) => {
    setServiceId(id);
    const service = state.services.find(s => s.id === id);
    if (service) setCustomPrice(service.defaultPrice.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      clientId: selectedClient.id,
      serviceId,
      date,
      time,
      customPrice: parseFloat(customPrice),
      status,
      observations
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 animate-in slide-in-from-bottom-full duration-300">
        <header className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Novo Atendimento</h2>
            <p className="text-sm text-slate-500">Para: <span className="font-semibold text-blue-600">{selectedClient.name}</span></p>
          </div>
          <button type="button" onClick={onCancel} className="text-slate-400 p-2">✕</button>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Serviço</label>
            <select 
              className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none font-medium text-slate-700"
              value={serviceId}
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
                value={customPrice} onChange={e => setCustomPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
              <select 
                className={`w-full p-3 rounded-xl border-none outline-none font-bold ${status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                value={status} onChange={e => setStatus(e.target.value as 'paid' | 'pending')}
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
                value={date} onChange={e => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Horário</label>
              <input 
                type="time" 
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none text-sm"
                value={time} onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Observações do Atendimento</label>
            <textarea 
              className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none h-20 text-sm"
              placeholder="Detalhes adicionais..."
              value={observations} onChange={e => setObservations(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
            Salvar Atendimento
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
