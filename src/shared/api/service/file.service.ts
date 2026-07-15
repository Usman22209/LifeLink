import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import HTTP_CLIENT_UPLOAD from "../controller/HTTP_CLIENT_UPLOAD";
import { API_CONFIG } from "../config";

export const FILE_SERVICE = {
  uploadImage: (file: any) => {
    const url = API_CONFIG.FILE.upload;
    const formData = new FormData();
    formData.append("file", file);
    return HTTP_CLIENT_UPLOAD.post(url, formData);
  },
  deleteImage: (publicId: string) => {
    const url = API_CONFIG.FILE.delete;
    return HTTP_CLIENT.post(url, { publicId });
  },
};
