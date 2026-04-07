import { Calendar, UserCheck, Video, CheckCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getPatientAppointments } from "../../api"
import { usePatientData } from "../../hooks/usePatientData"

export default function RegularCheckup({ user }) {
  const { profileData, loading: profileLoading } = usePatientData(user?.user_id || user?.id);
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.user_id && !user?.id) return;
      try {
        const res = await getPatientAppointments(user.user_id || user.id);
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  if (!user) return null;

  // Get next upcoming appointment
  const nextAppointment = appointments.upcoming?.[0];

  // Get clinic info from profile
  const clinicAddress = profileData?.clinic_address;
  const doctorName = nextAppointment?.clinician_name || profileData?.doctor_name;

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 leading-tight tracking-tight flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md text-green-600"><Calendar size={28} /></div>
            Treatment Appointments
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Manage your treatment appointments with {doctorName || 'your doctor'}.</p>
        </div>
      </div>

      {loading || profileLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-green-600 h-10 w-10" />
        </div>
      ) : error ? (
        <div className="bg-red-50/80 backdrop-blur-md border border-red-100 rounded-md p-8 text-red-700 font-semibold shadow-xl shadow-red-100">
          {error}
        </div>
      ) : (
        <>
          {/* Next Appt */}
          {nextAppointment ? (
            <div className="bg-green-600 rounded-md overflow-hidden shadow-2xl shadow-green-100/50 flex flex-col md:flex-row items-stretch border border-green-700/30 group">
              <div className="p-10 md:w-2/3 text-white relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none -rotate-12 group-hover:scale-110 transition-transform duration-500">
                   <UserCheck size={180} />
                </div>
                <span className="inline-block px-4 py-1.5 bg-green-500/50 backdrop-blur-sm rounded-full text-[10px] font-semibold tracking-widest uppercase mb-6 border border-white/20">Upcoming Appointment</span>
                <h2 className="text-4xl font-semibold leading-tight mb-4">
                  {new Date(nextAppointment.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  <span className="block text-green-100/80 text-2xl mt-1">{nextAppointment.time}</span>
                </h2>
                <div className="flex items-center gap-3 text-green-50/90 font-medium">
                  <div className="p-2 bg-white/10 rounded-lg"><UserCheck size={20} /></div>
                  {nextAppointment.type || 'Treatment Appointment'} with {doctorName}
                </div>
              </div>
              <div className="bg-green-700/80 backdrop-blur-lg p-10 w-full md:w-1/3 flex flex-col items-center justify-center text-center border-l border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-green-300/80 font-semibold mb-3">Office Location</p>
                <p className="text-base font-medium text-white max-w-[200px] leading-relaxed">{clinicAddress || "Contact clinic for address"}</p>
                <button className="mt-8 w-full py-4 bg-white text-green-700 font-semibold rounded-md hover:bg-green-50 transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                  Reschedule
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-md p-10 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-blue-50 rounded-md text-blue-500"><Calendar size={28} /></div>
                 <div>
                    <h3 className="text-xl font-semibold text-gray-900">No Upcoming Appointments</h3>
                    <p className="text-sm text-gray-500 font-medium">Everything looks good for now. We'll notify you when it's time for your next appointment.</p>
                 </div>
              </div>
              <button 
                onClick={() => window.location.href = `mailto:${profileData?.support_email || 'support@orthoguide.com'}`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-2 group"
              >
                  Contact Clinician <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}

          {/* Past Sessions */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-md shadow-xl shadow-slate-200/50 p-8 flex flex-col gap-4">
            <h3 className="text-[10px] font-semibold text-gray-400 mb-2 pb-3 border-b border-gray-100 uppercase tracking-widest">Past Appointments</h3>
            {appointments.past && appointments.past.length > 0 ? (
                <div className="space-y-3 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                  {appointments.past.map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-md transition-colors hover:bg-gray-100/50">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={18} />
                        <span className="font-semibold text-gray-700 text-sm">{apt.type || 'Appointment'}</span>
                      </div>
                      <span className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-300 opacity-60">
                   <CheckCircle size={32} strokeWidth={1} />
                   <p className="text-[10px] font-semibold uppercase tracking-widest mt-3">No history yet</p>
                </div>
              )}
            </div>
        </>
      )}
    </div>
  )
}
