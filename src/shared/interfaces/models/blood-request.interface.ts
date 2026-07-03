// Blood Request Status
export enum BloodRequestStatus {
  OPEN = "open",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

// Urgency Level
export enum UrgencyLevel {
  NORMAL = "normal",
  HIGH = "high",
  CRITICAL = "critical",
}

// Donation Status
export enum DonationStatus {
  INTENT = "intent",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Requester Profile (nested in blood request)
export interface RequesterProfile {
  id: string;
  phone?: string;
  blood_group?: string;
  city?: string;
  profile_image?: string;
}

// Donor Profile (nested in donation)
export interface DonorProfile {
  id: string;
  phone?: string;
  blood_group?: string;
  city?: string;
  profile_image?: string;
}

// Main Blood Request Interface
export interface BloodRequest {
  id: string;
  requester_id: string;
  patient_name?: string;
  blood_group: string;
  units_required: number;
  fulfilled_units: number;
  hospital_name: string;
  hospital_address?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  urgency: UrgencyLevel;
  contact_number?: string;
  description?: string;
  status: BloodRequestStatus;
  is_verified: boolean;
  required_date?: string;
  created_at: string;
  updated_at: string;
  requester?: RequesterProfile;
  donation_count?: number;
}

// Donation Interface
export interface Donation {
  id: string;
  request_id: string;
  donor_id: string;
  status: DonationStatus;
  created_at: string;
  updated_at: string;
  donor?: DonorProfile;
}

// Create Blood Request DTO
export interface CreateBloodRequestDto {
  patient_name?: string;
  blood_group: string;
  units_required: number;
  hospital_name: string;
  hospital_address?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  urgency?: UrgencyLevel;
  contact_number?: string;
  description?: string;
  required_date?: string;
}

// Update Blood Request DTO
export interface UpdateBloodRequestDto {
  patient_name?: string;
  units_required?: number;
  hospital_address?: string;
  urgency?: UrgencyLevel;
  contact_number?: string;
  description?: string;
  status?: BloodRequestStatus;
}

// Pagination Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Pagination Metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Blood Request Feed Response
export interface BloodRequestFeedResponse {
  success: boolean;
  message: string;
  data: {
    requests: BloodRequest[];
    pagination: PaginationMeta;
  };
}

// My Blood Requests Response
export interface MyBloodRequestsResponse {
  success: boolean;
  message: string;
  data: {
    requests: BloodRequest[];
    pagination: PaginationMeta;
  };
}

// Blood Request Details Response
export interface BloodRequestDetailsResponse {
  success: boolean;
  message: string;
  data: BloodRequest;
}

// Donation Response
export interface DonationResponse {
  success: boolean;
  message: string;
  data: Donation;
}

// Donations for Request Response
export interface DonationsForRequestResponse {
  success: boolean;
  message: string;
  data: {
    request_id: string;
    donations: Donation[];
    stats: {
      total: number;
      intent: number;
      completed: number;
      cancelled: number;
    };
  };
}

// Accept Request DTO
export interface AcceptRequestDto {
  request_id: string;
}

// Update Donation Status DTO
export interface UpdateDonationStatusDto {
  status: DonationStatus;
}
