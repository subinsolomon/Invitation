import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const configService = {
  getConfig: async () => {
    try {
      const response = await api.get('/config');
      return response.data;
    } catch (error) {
      console.error('Error fetching config:', error);
      throw error;
    }
  },
};

export const rsvpService = {
  submitRSVP: async (data) => {
    try {
      const response = await api.post('/rsvp', data);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getRSVPCount: async () => {
    try {
      const response = await api.get('/rsvp/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching RSVP count:', error);
      throw error;
    }
  },

  getAllRSVPs: async () => {
    try {
      const response = await api.get('/rsvp');
      return response.data;
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      throw error;
    }
  },
};

export default api;
