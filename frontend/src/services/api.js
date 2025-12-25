import axios from 'axios';

const API_URL = 'https://aulaclick-api.onrender.com/api';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si no se ha especificado Content-Type y no es FormData, usar JSON por defecto
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No intentar refresh si es un error de login o registro
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login/') ||
      originalRequest.url?.includes('/auth/register/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  sendVerificationCode: (data) => api.post('/auth/send-code/', data),
  resendVerificationCode: (email) => api.post('/auth/resend-code/', { email }),
  verifyAndRegister: (data) => api.post('/auth/verify-register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
  requestPasswordReset: (email) => api.post('/auth/password-reset/request/', { email }),
  resetPassword: (data) => api.post('/auth/password-reset/confirm/', data),
};





export const courseAPI = {
  getAll: () => api.get('/courses/'),
  getById: (id) => api.get(`/courses/${id}/`),
  create: (data) => api.post('/courses/', data),
  update: (id, data) => api.put(`/courses/${id}/`, data),
  delete: (id) => api.delete(`/courses/${id}/`),
  getMyCourses: () => api.get('/courses/my_courses/'),
  enroll: (id) => api.post(`/courses/${id}/enroll/`),
};

export const lessonAPI = {
  getAll: (courseId) => api.get(`/lessons/?course=${courseId}`),
  getById: (id) => api.get(`/lessons/${id}/`),
  create: (data) => api.post('/lessons/', data),
  update: (id, data) => api.put(`/lessons/${id}/`, data),
  delete: (id) => api.delete(`/lessons/${id}/`),
  updateProgress: (id, data) => api.post(`/lessons/${id}/update_progress/`, data),
};

export const enrollmentAPI = {
  getAll: () => api.get('/enrollments/'),
  approve: (id) => api.post(`/enrollments/${id}/approve/`),
  reject: (id) => api.post(`/enrollments/${id}/reject/`),
  delete: (id) => api.delete(`/enrollments/${id}/`),
};

export const voucherAPI = {
  getAll: () => api.get('/vouchers/'),
  create: (data) => api.post('/vouchers/', data),
  approve: (id, notes) => api.post(`/vouchers/${id}/approve/`, { notes }),
  reject: (id, notes) => api.post(`/vouchers/${id}/reject/`, { notes }),
  markAsSeen: (id) => api.post(`/vouchers/${id}/mark_as_seen/`),
};

export const uploadAPI = {
  uploadFile: (file, type = 'auto') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload/', formData);
  },
};

export const userAPI = {
  getAll: (params) => api.get('/users/', { params }),
  getById: (id) => api.get(`/users/${id}/`),
  update: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

export default api;

