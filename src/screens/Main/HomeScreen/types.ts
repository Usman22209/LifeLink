export interface UrgentRequest {
  id: string;
  bloodType: string;
  hospital: string;
  city: string;
  state?: string;
  patientImage?: string;
  units: number;
  urgency: "critical" | "urgent" | "normal";
  time: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
}

export const MOCK_URGENT_REQUESTS: UrgentRequest[] = [
  {
    id: "1",
    bloodType: "B+",
    hospital: "Mayo Hospital",
    city: "Lahore",
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    units: 3,
    urgency: "critical",
    time: "2h ago",
    distance: "3.2 km",
    latitude: 31.5723,
    longitude: 74.3213,
  },
  {
    id: "2",
    bloodType: "A-",
    hospital: "Jinnah Hospital",
    city: "Lahore",
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    units: 2,
    urgency: "urgent",
    time: "4h ago",
    distance: "5.1 km",
    latitude: 31.4806,
    longitude: 74.303,
  },
  {
    id: "3",
    bloodType: "O-",
    hospital: "Services Hospital",
    city: "Lahore",
    state: "Punjab",
    patientImage:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
    units: 1,
    urgency: "normal",
    time: "6h ago",
    distance: "1.8 km",
    latitude: 31.5428,
    longitude: 74.3364,
  },
];
