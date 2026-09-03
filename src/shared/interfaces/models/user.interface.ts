export interface User {
  id: string;
  email: string;
  full_name: string;
  is_onboarded: boolean;
  phone?: string;
  gender?: "male" | "female";
  dob?: string;
  blood_group?: string;
  country?: string;
  state?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  profile_image?: string;
  language_preference?: string;
  notifications_enabled?: boolean;
  hide_phone_number?: boolean;
  stats?: {
    donations_count?: number;
    lives_saved?: number;
    last_donated_at?: string;
    is_eligible?: boolean;
    next_eligible_date?: string;
  };
}

export interface Profile {
  full_name?: string;
  phone?: string;
  gender?: "male" | "female";
  dob?: string;
  blood_group?: string;
  country?: string;
  state?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  profile_image?: string;
  is_onboarded: boolean;
  language_preference?: string;
  notifications_enabled?: boolean;
  hide_phone_number?: boolean;
  stats?: {
    donations_count?: number;
    lives_saved?: number;
    last_donated_at?: string;
    is_eligible?: boolean;
    next_eligible_date?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  session: {
    access_token: string;
    refresh_token: string;
  };
  user: User;
}

export interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  user: User | null;
}
