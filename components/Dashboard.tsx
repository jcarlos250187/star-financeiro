
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppState } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [monthsCount, setMonthsCount] = useState(6);

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    if (monthsCount === 1) {
      // Visão detalhada de 30 dias (agrupada por blocos de 5 dias para melhor visualização)
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - (i * 5));
        const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        
        const periodStart = new Date(d);
        periodStart.setHours(0, 0, 0, 0);
        const periodEnd = new Date(d);
        periodEnd.setDate(d.getDate() + 5);
        periodEnd.setHours(23, 59, 59, 999);

        const total = state.appointments
          .filter(a => {
            const ad = new Date(a.date);
            return ad >= periodStart && ad < periodEnd && a.status === 'paid';
          })
          .reduce((sum, a) => sum + a.customPrice, 0);
        
        data.push({ name: label, valor: total });
      }
    } else {
      // Visão mensal
      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mLabel = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
        const mIdx = d.getMonth();
        const yIdx = d.getFullYear();
        
        const total = state.appointments
          .filter(a => {
            const ad = new Date(a.date);
            return ad.getMonth() === mIdx && ad.getFullYear() === yIdx && a.status === 'paid';
          })
          .reduce((sum, a) => sum + a.customPrice, 0);
        
        data.push({ name: mLabel, valor: total });
      }
    }
    return data;
  }, [state.appointments, monthsCount]);

  // Faturamento apenas do que foi efetivamente PAGO no mês atual
  const faturamentoMes = useMemo(() => {
    const now = new Date();
    return state.appointments
      .filter(a => {
        const ad = new Date(a.date);
        return ad.getMonth() === now.getMonth() && 
               ad.getFullYear() === now.getFullYear() && 
               a.status === 'paid';
      })
      .reduce((sum, a) => sum + a.customPrice, 0);
  }, [state.appointments]);

  const StatCard = ({ title, value, icon: Icon, variant = "light" }: any) => (
    <div className={`p-6 rounded-[32px] border ${variant === 'dark' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-100'} shadow-sm transition-all active:scale-95`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${variant === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 uppercase">Estável</span>
      </div>
      <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${variant === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{title}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex justify-between items-center md:items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none tracking-tight">Dashboard</h2>
          <p className="text-sm font-bold text-slate-400 mt-2">Gestão em tempo real do seu negócio.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Recebido (Mês)" value={`R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={ICONS.Wallet} variant="dark" />
        <StatCard title="Total Clientes" value={state.clients.length} icon={ICONS.Users} />
        <StatCard title="Atendimentos" value={state.appointments.length} icon={ICONS.Briefcase} />
        <StatCard title="Pendentes" value={state.appointments.filter(a => a.status === 'pending').length} icon={ICONS.Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Fluxo S.T.A.R</h3>
              <p className="text-xs font-bold text-slate-400 uppercase">Apenas valores confirmados (Pagos)</p>
            </div>
            <select 
              className="bg-slate-50 border-none px-4 py-2 rounded-2xl text-xs font-black uppercase text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              value={monthsCount}
              onChange={(e) => setMonthsCount(Number(e.target.value))}
            >
              <option value={1}>Últimos 30 dias</option>
              <option value={3}>3 meses</option>
              <option value={6}>6 meses</option>
              <option value={12}>1 ano</option>
            </select>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 9, fontWeight: 800, fill: '#cbd5e1'}} 
                  dy={15} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border-none">
                          <p className="text-[10px] font-bold text-slate-400 mb-1">{payload[0].payload.name}</p>
                          <p className="text-sm font-black">R$ {payload[0].value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#0f172a" 
                  strokeWidth={5} 
                  fill="url(#colorVal)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Últimas Ações</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
            {state.appointments.length > 0 ? (
              [...state.appointments].reverse().slice(0, 8).map(app => {
                const client = state.clients.find(c => c.id === app.clientId);
                return (
                  <div key={app.id} className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${app.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                      {client?.name.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{client?.name || 'Cliente Removido'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(app.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">R${app.customPrice.toFixed(2)}</p>
                      <p className={`text-[9px] font-black uppercase ${app.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{app.status === 'paid' ? 'Pago' : 'Pendente'}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-xs font-bold text-slate-300 uppercase italic">Aguardando seu primeiro atendimento...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
