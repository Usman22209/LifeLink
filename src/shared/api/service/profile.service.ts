import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";
import { Profile } from "@shared/interfaces/models/user.interface";

export const PROFILE_SERVICE = {
  updateProfile: (data: Profile) => {
    const url = API_CONFIG.PROFILE.me;
    return HTTP_CLIENT.put(url, data);
  },
  getProfile: () => {
    const url = API_CONFIG.PROFILE.me;
    return HTTP_CLIENT.get(url);
  },
  deleteAccount: () => {
    const url = API_CONFIG.PROFILE.delete;
    return HTTP_CLIENT.delete(url);
  },
  updateSettings: (data: {
    notifications_enabled?: boolean;
    language_preference?: string;
  }) => {
    const url = API_CONFIG.PROFILE.settings;
    return HTTP_CLIENT.patch(url, data);
  },
};
