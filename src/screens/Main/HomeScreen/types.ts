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

export { MOCK_URGENT_REQUESTS } from "../../../shared/constants/mockData";
