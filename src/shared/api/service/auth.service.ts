import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";
export const AUTH_SERVICE = {
  login: (data: { email: string; password: string }) => {
    const url = API_CONFIG.AUTH.login;
    return HTTP_CLIENT.post(url, data);
  },
  signup: (data: { password: string; email: string }) => {
    const url = API_CONFIG.AUTH.signup;
    return HTTP_CLIENT.post(url, data);
  },
  forgotPassword: (data: { email: string }) => {
    const url = API_CONFIG.AUTH.forgotPassword;
    return HTTP_CLIENT.post(url, data);
  },
  googleLogin: (data: { idToken: string }) => {   
    const url = API_CONFIG.AUTH.googleLogin;  
    return HTTP_CLIENT.post(url, data); 
  },
  logout: () => {
    const url = API_CONFIG.AUTH.logout;
    return HTTP_CLIENT.post(url);
  },
};
