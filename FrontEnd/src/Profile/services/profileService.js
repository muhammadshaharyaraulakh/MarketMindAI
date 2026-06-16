import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return { 
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
};

export const profileService = {
  updateProfile: async (fullName, email) => {
    return axios.put('http://localhost:8000/api/user/profile-information', { name: fullName, email: email }, { headers: getHeaders() });
  },
  updatePassword: async (current_password, password, password_confirmation) => {
    return axios.put('http://localhost:8000/api/user/password', { current_password, password, password_confirmation }, { headers: getHeaders() });
  },
  addRecoveryEmail: async (recovery_email) => {
    return axios.post('http://localhost:8000/api/add-recovery-email', { recovery_email }, { headers: getHeaders() });
  },
  updateRecoveryEmail: async (recovery_email) => {
    return axios.post('http://localhost:8000/api/update-recovery-email', { recovery_email }, { headers: getHeaders() });
  },
  removeRecoveryEmail: async () => {
    return axios.post('http://localhost:8000/api/remove-recovery-email', {}, { headers: getHeaders() });
  },
  confirmPassword: async (password) => {
    return axios.post('http://localhost:8000/api/user/confirm-password', { password }, { headers: getHeaders() });
  },
  enable2FA: async () => {
    return axios.post('http://localhost:8000/api/user/two-factor-authentication', {}, { headers: getHeaders() });
  },
  disable2FA: async () => {
    return axios.delete('http://localhost:8000/api/user/two-factor-authentication', { headers: getHeaders() });
  },
  get2FAQR: async () => {
    return axios.get('http://localhost:8000/api/user/two-factor-qr-code', { headers: getHeaders() });
  },
  verify2FA: async (code) => {
    return axios.post('http://localhost:8000/api/user/confirmed-two-factor-authentication', { code }, { headers: getHeaders() });
  },
  getRecoveryCodes: async () => {
    return axios.get('http://localhost:8000/api/user/two-factor-recovery-codes', { headers: getHeaders() });
  },
  getSessions: async () => {
    return axios.get('http://localhost:8000/api/user/sessions', { headers: getHeaders() });
  },
  revokeSession: async (id) => {
    return axios.delete(`http://localhost:8000/api/user/sessions/${id}`, { headers: getHeaders() });
  },
  revokeAllSessions: async () => {
    return axios.delete('http://localhost:8000/api/user/sessions', { headers: getHeaders() });
  }
};
