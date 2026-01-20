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
  resetPassword: (data: { password: string }, token: string) => {
    const url = API_CONFIG.AUTH.resetPassword;
    return HTTP_CLIENT.patch(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  logout: () => {
    const url = API_CONFIG.AUTH.logout;
    return HTTP_CLIENT.post(url);
  },
};
