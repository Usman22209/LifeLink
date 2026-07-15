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
};
