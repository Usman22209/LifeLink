import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";

export interface CreateReportPayload {
  target_type: "request" | "user";
  target_id: string;
  reason: string;
  category?: string;
  description?: string;
}

export const SUPPORT_SERVICE = {
  submitContact: (data: { subject: string; message: string }) => {
    return HTTP_CLIENT.post(API_CONFIG.SUPPORT.contact, data);
  },
  submitReport: (data: CreateReportPayload) => {
    return HTTP_CLIENT.post(API_CONFIG.REPORTS.create, data);
  },
};
