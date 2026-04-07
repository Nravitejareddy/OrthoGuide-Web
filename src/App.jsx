import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom"
import Layout from "./layouts/Layout"
import { Toaster } from "@/components/ui/sonner"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ForgotPassword from "./pages/ForgotPassword"
import CareTips from "./pages/CareTips"
import Support from "./pages/Support"
import PatientDashboard from "./components/dashboards/PatientDashboard"
import ClinicianDashboard from "./components/dashboards/ClinicianDashboard"
import AdminDashboard from "./components/dashboards/AdminDashboard"
import ProfilePage from "./components/dashboards/ProfilePage"
import NotificationsPage from "./components/dashboards/NotificationsPage"
import SettingsPage from "./components/dashboards/SettingsPage"
import HelpPage from "./components/dashboards/HelpPage"
import PatientProfile from "./pages/patient/PatientProfile"
import PatientNotifications from "./pages/patient/PatientNotifications"
import AIAssistant from "./pages/patient/AIAssistant"
import Reminders from "./pages/patient/Reminders"
import CareGuide from "./pages/patient/CareGuide"
import CareGuideDetail from "./pages/patient/CareGuideDetail"
import ReportIssue from "./pages/patient/ReportIssue"
import PatientProgress from "./pages/patient/PatientProgress"
import ChangePassword from "./pages/patient/ChangePassword"
import ClinicianChangePassword from "./pages/clinician/ChangePassword"
import ClinicianEditProfile from "./pages/clinician/EditProfile"
import HelpCenter from "./pages/patient/HelpCenter"
import Appointments from "./pages/patient/Appointments"
import ClinicianProfile from "./pages/clinician/ClinicianProfile"
import PatientsList from "./pages/clinician/PatientsList"
import ClinicianSchedule from "./pages/clinician/ClinicianSchedule"
import ClinicianAddPatient from "./pages/clinician/AddPatient"
import PatientProfileDetail from "./pages/clinician/PatientProfileDetail"
import ClinicianHelpCenter from "./pages/clinician/ClinicianHelpCenter"
import AdminProfile from "./pages/admin/AdminProfile"
import AccountInactive from "./pages/AccountInactive"
import ReactivationRequest from "./pages/ReactivationRequest"

import ManageClinicians from "./pages/admin/ManageClinicians"
import ManagePatients from "./pages/admin/ManagePatients"
import AddClinician from "./pages/admin/AddClinician"
import AddPatient from "./pages/admin/AddPatient"
import AdminNotifications from "./pages/admin/AdminNotifications"

import ClinicSettings from "./pages/admin/ClinicSettings"
import { useAuth } from "./hooks/useAuth"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-md m-4">
          <div>
            <h2 className="text-lg font-bold text-red-700">Something went wrong.</h2>
            <p className="text-sm text-red-500 mt-2">This part of the dashboard failed to load.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Wrapper with Role check
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" />
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />
  }
  return children
}

// Public Route Wrapper (Redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" /> : children
}

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user } = useAuth()
  if (!user) return null
  return (
    <ErrorBoundary>
      {user.role === "admin" && <AdminDashboard user={user} />}
      {user.role === "clinician" && <ClinicianDashboard user={user} />}
      {user.role === "patient" && <PatientDashboard user={user} />}
    </ErrorBoundary>
  )
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public pages - Restricted if logged in */}
        <Route path="/" element={<Layout />}>
          <Route index element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="care-tips" element={<PublicRoute><CareTips /></PublicRoute>} />
          <Route path="support" element={<PublicRoute><Support /></PublicRoute>} />
          <Route path="account-inactive" element={<PublicRoute><AccountInactive /></PublicRoute>} />
          <Route path="reactivation-request" element={<PublicRoute><ReactivationRequest /></PublicRoute>} />
        </Route>

        {/* Dashboard with Sidebar (Nested Routes) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardRouter />} />
          <Route path="profile" element={<ProfileWrapper />} />
          <Route path="notifications" element={<NotificationsWrapper />} />
          <Route path="settings" element={<SettingsWrapper />} />
          <Route path="help" element={<HelpWrapper />} />
          
          {/* Patient Specific Routes */}
          <Route path="patient/profile" element={<ProtectedRoute requiredRole="patient"><PatientProfileWrapper /></ProtectedRoute>} />
          <Route path="patient/notifications" element={<ProtectedRoute requiredRole="patient"><PatientNotificationsWrapper /></ProtectedRoute>} />
          <Route path="patient/progress" element={<ProtectedRoute requiredRole="patient"><PatientProgressWrapper /></ProtectedRoute>} />
          <Route path="patient/ai-assistant" element={<ProtectedRoute requiredRole="patient"><AIAssistantWrapper /></ProtectedRoute>} />
          <Route path="patient/reminders" element={<ProtectedRoute requiredRole="patient"><RemindersWrapper /></ProtectedRoute>} />
          <Route path="patient/care-guide" element={<ProtectedRoute requiredRole="patient"><CareGuideWrapper /></ProtectedRoute>} />
          <Route path="patient/care-guide/:tipId" element={<ProtectedRoute requiredRole="patient"><CareGuideDetailWrapper /></ProtectedRoute>} />
          <Route path="patient/report-issue" element={<ProtectedRoute requiredRole="patient"><ReportIssueWrapper /></ProtectedRoute>} />
          <Route path="patient/change-password" element={<ProtectedRoute requiredRole="patient"><ChangePasswordWrapper /></ProtectedRoute>} />
          <Route path="patient/help-center" element={<ProtectedRoute requiredRole="patient"><HelpCenterWrapper /></ProtectedRoute>} />
          <Route path="patient/appointments" element={<ProtectedRoute requiredRole="patient"><AppointmentsWrapper /></ProtectedRoute>} />
          
          {/* Clinician Specific Routes */}
          <Route path="clinician/profile" element={<ProtectedRoute requiredRole="clinician"><ClinicianProfileWrapper /></ProtectedRoute>} />
          <Route path="clinician/edit-profile" element={<ProtectedRoute requiredRole="clinician"><ClinicianEditProfile /></ProtectedRoute>} />
          <Route path="clinician/patients" element={<ProtectedRoute requiredRole="clinician"><PatientsListWrapper /></ProtectedRoute>} />
          <Route path="clinician/change-password" element={<ProtectedRoute requiredRole="clinician"><ClinicianChangePassword /></ProtectedRoute>} />
          <Route path="clinician/patients/new" element={<ProtectedRoute requiredRole="clinician"><ClinicianAddPatientWrapper /></ProtectedRoute>} />
          <Route path="clinician/patients/:id" element={<ProtectedRoute requiredRole="clinician"><ClinicianAddPatientWrapper /></ProtectedRoute>} />
          <Route path="clinician/patients/profile/:id" element={<ProtectedRoute requiredRole="clinician"><PatientProfileDetailWrapper /></ProtectedRoute>} />
          <Route path="clinician/schedule" element={<ProtectedRoute requiredRole="clinician"><ClinicianScheduleWrapper /></ProtectedRoute>} />
          <Route path="clinician/help-center" element={<ProtectedRoute requiredRole="clinician"><ClinicianHelpCenterWrapper /></ProtectedRoute>} />

          {/* Admin Specific Routes */}
          <Route path="admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminProfileWrapper /></ProtectedRoute>} />

          <Route path="admin/clinicians" element={<ProtectedRoute requiredRole="admin"><ManageCliniciansWrapper /></ProtectedRoute>} />
          <Route path="admin/clinicians/new" element={<ProtectedRoute requiredRole="admin"><AddClinicianWrapper /></ProtectedRoute>} />
          <Route path="admin/clinicians/:id" element={<ProtectedRoute requiredRole="admin"><AddClinicianWrapper /></ProtectedRoute>} />
          <Route path="admin/patients" element={<ProtectedRoute requiredRole="admin"><ManagePatientsWrapper /></ProtectedRoute>} />
          <Route path="admin/patients/new" element={<ProtectedRoute requiredRole="admin"><AddPatientWrapper /></ProtectedRoute>} />
          <Route path="admin/patients/:id" element={<ProtectedRoute requiredRole="admin"><AddPatientWrapper /></ProtectedRoute>} />

          <Route path="admin/notifications" element={<ProtectedRoute requiredRole="admin"><AdminNotificationsWrapper /></ProtectedRoute>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

// Wrappers to pass user/role to components
const ProfileWrapper = () => {
  const { user } = useAuth()
  return <ProfilePage user={user} role={user?.role} />
}
const NotificationsWrapper = () => {
  const { user } = useAuth()
  return <NotificationsPage user={user} role={user?.role} />
}
const SettingsWrapper = () => {
  const { user } = useAuth()
  return <SettingsPage user={user} role={user?.role} />
}
const HelpWrapper = () => {
  const { user } = useAuth()
  if (user?.role === "patient") return <HelpCenter />
  return <HelpPage user={user} role={user?.role} />
}

// Patient route wrappers
const PatientProfileWrapper = () => {
  const { user } = useAuth()
  return <PatientProfile user={user} />
}
const PatientNotificationsWrapper = () => {
  const { user } = useAuth()
  return <PatientNotifications user={user} />
}
const AIAssistantWrapper = () => {
  const { user } = useAuth()
  return <AIAssistant user={user} />
}
const RemindersWrapper = () => {
  const { user } = useAuth()
  return <Reminders user={user} />
}
const CareGuideWrapper = () => {
  const { user } = useAuth()
  return <CareGuide user={user} />
}
const CareGuideDetailWrapper = () => {
  const { user } = useAuth()
  return <CareGuideDetail user={user} />
}
const ReportIssueWrapper = () => {
  const { user } = useAuth()
  return <ReportIssue user={user} />
}
const PatientProgressWrapper = () => {
  const { user } = useAuth()
  return <PatientProgress user={user} />
}
const ChangePasswordWrapper = () => {
  const { user } = useAuth()
  return <ChangePassword />
}
const HelpCenterWrapper = () => {
  const { user } = useAuth()
  return <HelpCenter />
}
const AppointmentsWrapper = () => {
  const { user } = useAuth()
  return <Appointments />
}

// Clinician route wrappers
const ClinicianProfileWrapper = () => {
  const { user } = useAuth()
  return <ClinicianProfile user={user} />
}
const PatientsListWrapper = () => {
  const { user } = useAuth()
  return <PatientsList user={user} />
}
const ClinicianScheduleWrapper = () => {
  const { user } = useAuth()
  return <ClinicianSchedule user={user} />
}
const ClinicianAddPatientWrapper = () => {
  const { user } = useAuth()
  return <ClinicianAddPatient user={user} />
}
const PatientProfileDetailWrapper = () => {
  const { user } = useAuth()
  return <PatientProfileDetail user={user} />
}
const ClinicianHelpCenterWrapper = () => {
  const { user } = useAuth()
  return <ClinicianHelpCenter user={user} />
}

// Admin route wrappers
const AdminProfileWrapper = () => {
  const { user } = useAuth()
  return <AdminProfile user={user} />
}

const ManageCliniciansWrapper = () => {
  const { user } = useAuth()
  return <ManageClinicians user={user} />
}
const ManagePatientsWrapper = () => {
  const { user } = useAuth()
  return <ManagePatients user={user} />
}
const AddClinicianWrapper = () => {
  const { user } = useAuth()
  return <AddClinician user={user} />
}
const AddPatientWrapper = () => {
  const { user } = useAuth()
  return <AddPatient user={user} />
}

const ClinicSettingsWrapper = () => {
  const { user } = useAuth()
  return <ClinicSettings user={user} />
}

const AdminNotificationsWrapper = () => {
  const { user } = useAuth()
  return <AdminNotifications user={user} />
}

function NotFound() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 text-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 text-sm mb-8 px-4">The page you are looking for does not exist.</p>
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded text-sm transition-colors">
        Go Home
      </Link>
    </div>
  )
}

export default App
