
import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_SERVICES, ICONS } from './constants';
import Dashboard from './components/Dashboard';
import ClientsList from './components/ClientsList';
import AppointmentForm from './components/AppointmentForm';
import ServicesManager from './components/ServicesManager';

// Redefinindo interfaces localmente para evitar erros de resolução de arquivo no preview
interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  observations: string;
  createdAt: string;
}

interface ServiceType {
  id: string;
  name: string;
  defaultPrice: number;
}

interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  customPrice: number;
  status: 'paid' | 'pending';
  observations: string;
}

interface AppState {
  clients: Client[];
  services: ServiceType[];
  appointments: Appointment[];
}

const LogoSVG = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M50 5 L62 35 L95 35 L68 55 L78 90 L50 70 L22 90 L32 55 L5 35 L38 35 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M42 55 Q50 45 58 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'clients' | 'services' | 'reminders' | 'ai'>('dashboard');
  const [state, setState] = useState<AppState>({
    clients: [],
    services: INITIAL_SERVICES,
    appointments: []
  });
  const [selectedClientForAppointment, setSelectedClientForAppointment] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('star_financeiro_vfinal');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed) setState(parsed);
      } catch (e) { console.error("Erro storage:", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('star_financeiro_vfinal', JSON.stringify(state));
  }, [state]);

  const addClient = useCallback((clientData: any) => {
    const newClient = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, clients: [newClient, ...prev.clients] }));
  }, []);

  const addService = useCallback((serviceData: any) => {
    const newService = { ...serviceData, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, services: [...prev.services, newService] }));
  }, []);

  const deleteService = useCallback((id: string) => {
    setState(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  }, []);

  const addAppointment = useCallback((appointmentData: any) => {
    const newAppointment = { ...appointmentData, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, appointments: [newAppointment, ...prev.appointments] }));
    setSelectedClientForAppointment(null);
  }, []);

  const NavItem = ({ id, icon: Icon, label }: any) => {
    const active = view === id;
    return (
      <button 
        onClick={() => setView(id)}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 ${active ? 'text-slate-900 scale-110' : 'text-slate-400'}`}
      >
        <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] w-full overflow-x-hidden">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-8 fixed h-full z-50">
        <div className="flex flex-col items-center mb-12">
          <LogoSVG className="w-16 h-16 text-slate-900 mb-4" />
          <h1 className="text-xl font-black tracking-[0.2em] text-slate-900 uppercase">S.T.A.R</h1>
          <p className="text-[10px] tracking-[0.4em] text-slate-400 uppercase font-bold -mt-1">Financeiro</p>
        </div>
        <nav className="space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${view === 'dashboard' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><ICONS.Home className="w-5 h-5"/> Dashboard</button>
          <button onClick={() => setView('clients')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${view === 'clients' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><ICONS.Users className="w-5 h-5"/> Clientes</button>
          <button onClick={() => setView('services')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${view === 'services' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><ICONS.Briefcase className="w-5 h-5"/> Serviços</button>
        </nav>
      </aside>

      <main className="flex-1 md:ml-72 min-h-screen pb-32 md:pb-12 px-4 pt-6 md:px-12 md:pt-12">
        <div className="max-w-5xl mx-auto">
          {view === 'dashboard' && <Dashboard state={state as any} />}
          {view === 'clients' && <ClientsList state={state as any} onAddClient={addClient} onSelectClient={setSelectedClientForAppointment} />}
          {view === 'services' && <ServicesManager state={state as any} onAddService={addService} onDeleteService={deleteService} />}
          {['reminders', 'ai'].includes(view) && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
               <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4 animate-pulse">
                 <ICONS.Sparkles className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-black text-slate-900">Módulo em Breve</h2>
               <p className="text-slate-400 font-medium">A inteligência S.T.A.R está chegando.</p>
            </div>
          )}
        </div>
      </main>

      <div className="md:hidden fixed bottom-6 left-4 right-4 h-20 glass border border-white/20 rounded-[32px] shadow-2xl flex items-center justify-between px-6 z-[100] safe-bottom">
        <NavItem id="dashboard" icon={ICONS.Home} label="Home" />
        <NavItem id="clients" icon={ICONS.Users} label="Clientes" />
        <div className="relative -top-8">
           <button onClick={() => setView('clients')} className="w-16 h-16 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform ring-8 ring-[#f8fafc]">
             <ICONS.Plus className="w-8 h-8" />
           </button>
        </div>
        <NavItem id="services" icon={ICONS.Briefcase} label="Serviços" />
        <NavItem id="ai" icon={ICONS.Sparkles} label="S.T.A.R AI" />
      </div>

      {selectedClientForAppointment && (
        <AppointmentForm 
          state={state as any} 
          selectedClient={selectedClientForAppointment} 
          onSave={addAppointment} 
          onCancel={() => setSelectedClientForAppointment(null)} 
        />
      )}
    </div>
  );
};

export default App;
