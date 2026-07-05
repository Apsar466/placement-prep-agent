import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000, // 30s timeout for AI endpoints
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    const message = error.response?.data?.detail || "An unexpected AI error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default api;
// ... existing axios setup ...

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const analyzeSkills = async (data) => {
  return api.post('/skill/analyze', data);
};

export const getDashboardMetrics = async (userId = "user_001") => {
  return api.get(`/dashboard/metrics?user_id=${userId}`);
};

export const startInterview = async (companyName, role, interviewType = "TECHNICAL_DSA") => {
  return api.post('/interview/start', { company_name: companyName, role, interview_type: interviewType });
};

export const evaluateInterview = async (sessionId, userAnswer, finishInterview = false) => {
  return api.post('/interview/evaluate', { session_id: sessionId, user_answer: userAnswer, finish_interview: finishInterview });
};

export const getCompanyPrep = async (companyName, role = "SDE-1") => {
  return api.post('/company/prepare', { company_name: companyName, role });
};

export const generateRoadmap = async (targetCompanies, hoursPerDay = 4.0, focusAreas = []) => {
  return api.post('/roadmap/generate', { target_companies: targetCompanies, hours_per_day: hoursPerDay, focus_areas: focusAreas });
};