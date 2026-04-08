import axios from 'axios';

const api = axios.create({
  baseURL: 'http://180.235.121.253:8170',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const loginUser = (credentials) => api.post('/login', credentials);
export const getPublicStats = () => api.get('/public/stats');
export const changePassword = (data) => api.post('/change_password', data);
export const getPatientProfileData = (id) => api.get(`/patient/profile/${id}`);
export const getPatientDashboardData = (id) => api.get(`/patient/dashboard/${id}`);
export const patientChatbot = (data) => api.post('/patient/chatbot', { message: data.message, patient_id: data.patient_id });
export const getChatHistory = (id) => api.get(`/patient/chat_history/${id}`);
export const getPatientProfile = (id) => api.get(`/patient/profile/${id}`);
export const getClinicianProfile = (id) => api.get(`/clinician/profile/${id}`);
export const getAdminProfile = (id) => api.get(`/admin/profile/${id}`);
export const updatePatientProfile = (data) => api.post('/patient/update_profile', data);

// Dashboard APIs
export const reportIssue = (data) => api.post('/patient/report_issue', data);
export const getClinicianSchedule = (id) => api.get(`/clinician/schedule/${id}`);
export const getClinicianPatients = (id) => api.get(`/clinician/patients/${id}`);
export const getClinicianDashboard = (id) => api.get(`/clinician/dashboard/${id}`);
export const updateClinicianProfile = (data) => api.post('/clinician/update_profile', data);
export const clinicianAddPatient = (data) => api.post('/clinician/add_patient', data);
export const clinicianAddSchedule = (data) => api.post('/clinician/schedule/add', data);
export const getAllUsers = () => api.get('/admin/users');
export const adminUpdateUser = (userData) => api.post('/admin/user/update', userData);
export const adminCreateUser = (userData) => api.post('/admin/user/create', userData);
export const adminGetUser = (role, id) => api.get(`/admin/user/${role}/${id}`);
export const adminDeleteUser = (role, id) => api.delete(`/admin/user/delete/${role}/${id}`);
export const adminResetPassword = (userData) => api.post('/admin/user/reset_password', userData);
export const getSystemSettings = () => api.get('/admin/system_settings');
export const updateSystemSettings = (data) => api.post('/admin/system_settings', data);
export const updateAdminProfile = (data) => api.post('/admin/profile/update', data);
export const getAnalyticsOverview = () => api.get('/admin/analytics/overview');
export const getSystemAlerts = () => api.get('/admin/system_alerts');
export const resolveSystemAlert = (id) => api.post(`/admin/system_alerts/resolve/${id}`);
export const getPatientNotifications = (userId, role = "patient") => api.get(`/patient/notifications/${userId}?role=${role}`);
export const markNotificationRead = (id) => api.post(`/notification/read/${id}`);
export const markAllNotificationsRead = (data) => api.post('/notification/read_all', data);
export const getUnreadNotificationsCount = (userId, role) => api.get(`/notifications/unread_count/${userId}/${role}`);
export const getNotificationSettings = (patientId) => api.get(`/patient/notification/settings/${patientId}`);
export const updateNotificationSettings = (data) => api.post('/patient/notification/settings', data);

// Patient Appointments
export const getPatientAppointments = (patientId) => api.get(`/patient/appointments/${patientId}`);

// Patient Issues (for Report Issue page)
export const getPatientIssues = (patientId) => api.get(`/patient/issues/${patientId}`);

// Patient Care Guide (dynamic tips based on treatment)
export const getCareGuide = (patientId) => api.get(`/patient/care_guide/${patientId}`);

// Appointment Management
export const rescheduleAppointment = (data) => api.put('/appointment/reschedule', data);
export const getPatientProfileById = (patientId) => api.get(`/clinician/patient/${patientId}`);
export const updatePatientTreatment = (data) => api.post('/clinician/update_patient', data);
export const clinicianDeactivatePatient = (data) => api.post('/clinician/patient/deactivate', data);
export const sendMessageToPatient = (data) => api.post('/clinician/patient/send_message', data);
export const cancelAppointment = (id) => api.delete(`/appointment/delete/${id}`);
export const completeAppointment = (id) => api.post(`/appointment/complete/${id}`);

// Support & Account APIs
export const getSupportInfo = () => api.get('/system/support?role=patient');
export const deactivateAccount = (data) => api.post('/account/deactivate', data);
export const reactivateAccount = (data) => api.post('/account/reactivate', data);
export const submit_reactivation_request = (data) => api.post('/patient/reactivation/request', data);

// Admin Reactivation Management
export const getAdminReactivationRequests = () => api.get('/admin/reactivation/requests');
export const adminReactivationAction = (data) => api.post('/admin/reactivation/action', data);
export const markAdminReactivationRead = (id) => api.post(`/admin/reactivation/read/${id}`);

export default api;
