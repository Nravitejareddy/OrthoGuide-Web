import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, AlertCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ProfilePage({ user, role }) {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-lg text-gray-400">
        <AlertCircle size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">User profile data not available.</p>
        <p className="text-xs mt-1">Please try refreshing the page or logging in again.</p>
      </div>
    )
  }

  const roleLabel = role === "clinician" ? "Doctor" : role === "admin" ? "Admin" : "Patient"

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3 pt-2 mb-6">
        <Link to="/dashboard" className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none uppercase">My Profile</h1>
          <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-tight">Account Information</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 leading-none">{user.name || "User Name"}</h2>
            <p className="text-sm text-gray-500 mt-2">{roleLabel} · ID: <span className="font-mono text-gray-700">{user.user_id || user.id || "N/A"}</span></p>
            <span className="inline-flex mt-3 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              Active Account
            </span>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm hover:translate-y-[-1px]">
            <Edit size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-5 pb-3 border-b border-gray-50 flex items-center gap-2">
            <User size={16} className="text-green-600" />
            Personal Information
          </h3>
          <div className="space-y-5">
            <InfoRow icon={<User size={16} />} label="Full Name" value={user.name || "N/A"} />
            <InfoRow icon={<Mail size={16} />} label="Email Address" value={user.email || "N/A"} />
            <InfoRow icon={<Phone size={16} />} label="Phone Number" value={user.phone || "N/A"} />
            <InfoRow icon={<MapPin size={16} />} label="Mailing Address" value={user.address || "N/A"} />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-5 pb-3 border-b border-gray-50 flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            Account Security
          </h3>
          <div className="space-y-5">
            <InfoRow icon={<Shield size={16} />} label="User Role" value={roleLabel} />
            <InfoRow icon={<Calendar size={16} />} label="Member Since" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : "January 2024"} />
            <InfoRow icon={<Shield size={16} />} label="Identity Verification" value="Verified" />
            <InfoRow icon={<Shield size={16} />} label="Account ID" value={user.user_id || user.id || "N/A"} />
          </div>
        </div>
      </div>

      {/* Treatment Info (Patient only) */}
      {role === "patient" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-5 pb-3 border-b border-gray-50">Treatment Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-gray-50/50 p-4 rounded-lg">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Clinic Doctor</p>
              <p className="text-sm font-semibold text-gray-900">Dr. Smith</p>
            </div>
            <div className="bg-gray-50/50 p-4 rounded-lg">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Type</p>
              <p className="text-sm font-semibold text-gray-900">Clear Aligners</p>
            </div>
            <div className="bg-gray-50/50 p-4 rounded-lg">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Initial Scan</p>
              <p className="text-sm font-semibold text-gray-900">Jan 15, 2024</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-green-500/60 mt-0.5">{icon}</div>
      <div className="flex-grow">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}
