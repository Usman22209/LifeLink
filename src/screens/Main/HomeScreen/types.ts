export interface UrgentRequest {
  id: string;
  bloodType: string;
  hospital: string;
  city: string;
  state?: string;
  patientName?: string;
  patientImage?: string;
  units: number;
  urgency: "critical" | "high" | "urgent" | "normal";
  time: string;
  required_date?: string;
  time_left?: string;
  timeLeft?: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
  requester_id?: string;
}
