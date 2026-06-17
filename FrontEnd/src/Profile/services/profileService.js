import axios from 'axios';

export const profileService = {
  updateProfile: async (data) => {
    return axios.put('/api/user/profile-information', data);
  },
  updatePassword: async (current_password, password, password_confirmation) => {
    return axios.put('/api/user/password', { current_password, password, password_confirmation });
  },
  confirmPassword: async (password) => {
    return axios.post('/api/user/confirm-password', { password });
  },
  enable2FA: async () => {
    return axios.post('/api/user/two-factor-authentication');
  },
  disable2FA: async () => {
    return axios.delete('/api/user/two-factor-authentication');
  },
  get2FAQR: async () => {
    return axios.get('/api/user/two-factor-qr-code');
  },
  verify2FA: async (code) => {
    return axios.post('/api/user/confirmed-two-factor-authentication', { code });
  },
  getRecoveryCodes: async () => {
    return axios.get('/api/user/two-factor-recovery-codes');
  },
  getSessions: async () => {
    return axios.get('/api/user/sessions');
  },
  revokeSession: async (id) => {
    return axios.delete(`/api/user/sessions/${id}`);
  },
  revokeAllSessions: async () => {
    return axios.delete('/api/user/sessions');
  }
};
