import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";

export const SUPPORT_SERVICE = {
  getFaqs: () => {
    return HTTP_CLIENT.get(API_CONFIG.SUPPORT.faqs);
  },
  submitContact: (data: { subject: string; message: string }) => {
    return HTTP_CLIENT.post(API_CONFIG.SUPPORT.contact, data);
  },
};
