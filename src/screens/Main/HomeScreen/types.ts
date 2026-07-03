export interface UrgentRequest {
  id: string;
  bloodType: string;
  hospital: string;
  city: string;
  units: number;
  urgency: "critical" | "urgent" | "normal";
  time: string;
  distance?: string;
}

export const MOCK_URGENT_REQUESTS: UrgentRequest[] = [
  { id: "1", bloodType: "B+",  hospital: "Mayo Hospital",     city: "Lahore", units: 3, urgency: "critical", time: "2h ago",  distance: "3.2 km" },
  { id: "2", bloodType: "A-",  hospital: "Jinnah Hospital",   city: "Lahore", units: 2, urgency: "urgent",   time: "4h ago",  distance: "5.1 km" },
  { id: "3", bloodType: "O-",  hospital: "Services Hospital", city: "Lahore", units: 1, urgency: "normal",   time: "6h ago",  distance: "1.8 km" },
];
