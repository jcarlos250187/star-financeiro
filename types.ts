
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  observations: string;
  deliveryDate?: string; // Novo campo para data de entrega
  createdAt: string;
}

export interface ServiceType {
  id: string;
  name: string;
  defaultPrice: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  customPrice: number;
  status: 'paid' | 'pending';
  observations: string;
}

export interface AppState {
  clients: Client[];
  services: ServiceType[];
  appointments: Appointment[];
}
