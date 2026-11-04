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
  getStatus: async () => {
    try {
      const response = await api.get('/rsvp/status');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  submitRSVP: async (data) => {
    try {
      const response = await api.post('/rsvp', data);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw { ...error.response.data, status: error.response.status };
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

export const feedbackService = {
  getStatus: async () => {
    try {
      const response = await api.get('/feedback/status');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  submitFeedback: async (data) => {
    try {
      const response = await api.post('/feedback', data);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw { ...error.response.data, status: error.response.status };
      }
      throw error;
    }
  },
};

export const shareMemoriesService = {
  getStatus: async () => {
    try {
      const response = await api.get('/share-memories/status');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
};

export const weddingPhaseService = {
  getPhase: async () => {
    try {
      const response = await api.get('/wedding/phase');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },
};


export const dashboardService = {
  getData: async (accessToken) => {
    try {
      const response = await api.get('/dashboard', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  setFeedbackEnabled: async (accessToken, enabled) => {
    try {
      const response = await api.patch('/dashboard/feedback-status', { enabled }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  setRSVPEnabled: async (accessToken, enabled) => {
    try {
      const response = await api.patch('/dashboard/rsvp-status', { enabled }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  setMemorySharingEnabled: async (accessToken, enabled) => {
    try {
      const response = await api.patch('/dashboard/memory-sharing-status', { enabled }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  setWeddingPhase: async (accessToken, phase) => {
    try {
      const response = await api.patch('/dashboard/wedding-phase', { phase }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

};

export default api;
