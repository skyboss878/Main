// Updated auth service using consolidated API
import { authApi } from '../utils/api';

export const register = async (data) => {
  return await authApi.register(data);
};

export const login = async (data) => {
  return await authApi.login(data);
};

export const getProfile = async () => {
  return await authApi.getProfile();
};

export const logout = async () => {
  return await authApi.logout();
};

// Re-export for backward compatibility
export { authApi as default };

