import { Users, Activity, Shield, BarChart3, Loader2, TrendingUp, Calendar, Download, PieChart as PieChartIcon, Database } from "lucide-react"
import { useState, useEffect } from "react"
import { getAnalyticsOverview, getAllUsers } from "@/api"
import { toast } from "sonner"
import StatCard from "@/components/admin/StatCard"
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export default function AdminDashboard({ user }) {
  const [data, setData] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([
          getAnalyticsOverview(),
          getAllUsers()
        ])
        setData(analyticsRes.data)
        setAllUsers(usersRes.data)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()

    // Dynamic greeting logic
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning,")
    else if (hour < 17) setGreeting("Good Afternoon,")
    else setGreeting("Good Evening,")
  }, [])

  if (!user) return null;

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  const COLORS = ['#9333ea', '#3b82f6', '#bfdbfe']; // Matching the design color scheme from the image
  
  const roleData = [
    { name: 'Patients', value: data.total_patients },
    { name: 'Clinicians', value: data.total_clinicians },
    { name: 'Admins', value: data.total_admins },
  ];

  const handleRequestExport = () => {
    try {
        const headers = ["ID", "Name", "Email", "Role", "Status"];
        // Support structure whether backend returns flat array or object based
        let flatUsers = [];
        if (Array.isArray(allUsers)) {
           flatUsers = allUsers;
        } else {
           flatUsers = [
              ...(allUsers.patients || []),
              ...(allUsers.clinicians || []),
              ...(allUsers.admins || [])
           ];
        }
        
        const rows = flatUsers.map(u => [u.id, u.name, u.email, u.role, u.status]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `system_dump_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("System data dump exported successfully");
    } catch (err) {
        toast.error("Failed to export system data");
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-12">
      {/* Premium Header - With Greeting and Command Center */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
           <p className="text-sm font-black text-purple-600 uppercase tracking-[0.25em] mb-2 drop-shadow-sm">{greeting}</p>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">{user.name || "System Admin"} 👋</h1>
           <p className="text-gray-500 font-medium text-sm">Command Center <span className="text-gray-300 mx-2">|</span> Platform metrics and global growth analytics</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Today's Date</p>
           <p className="text-sm font-bold text-gray-800">{todayStr}</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registered" value={data.total_users?.toString() || "0"} change="+12%" icon={<Users size={22} />} color="indigo" />
        <StatCard title="Active Patients" value={data.active_patients?.toString() || "0"} change="+8%" icon={<Activity size={22} />} color="green" />
        <StatCard title="Medical Staff" value={data.total_clinicians?.toString() || "0"} change="+3%" icon={<TrendingUp size={22} />} color="blue" />
        <StatCard title="Appointments Today" value={data.appointments_today?.toString() || "0"} change="0%" icon={<Calendar size={22} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-none">User Acquisition Growth</h3>
              <p className="text-[11px] text-gray-400 font-medium mt-2">Monthly trajectory performance (Year-to-Date)</p>
            </div>
            
            <div className="hidden sm:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100/80">
               <span className="px-4 py-1.5 text-xs font-bold bg-purple-600 text-white rounded-lg shadow-md shadow-purple-500/20 transition-all">Monthly</span>
            </div>
          </div>
          
          <div className="h-[280px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.growth} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                    dy={12}
                    padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 0, fill: 'transparent'}} // Hide Y-Axis text entirely
                    width={10}
                />
                <Tooltip 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: "4 4"}}
                  contentStyle={{
                      borderRadius: '16px', 
                      border: '0', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                  }}
                  itemStyle={{fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9333ea'}}
                  labelStyle={{fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8b5cf6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    animationDuration={1500}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8b5cf6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Donut */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           
           <div className="w-full text-left mb-4 relative z-10">
              <h3 className="text-lg font-black text-gray-900 leading-none mb-2">User Distribution</h3>
              <p className="text-[11px] text-gray-400 font-medium">Breakdown by user roles</p>
           </div>
           
           <div className="h-[220px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                          animationDuration={1500}
                      >
                          {roleData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                          ))}
                      </Pie>
                      <Tooltip 
                           contentStyle={{borderRadius: '16px', border: '0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                  </PieChart>
              </ResponsiveContainer>
              
              {/* Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-3xl font-black text-gray-900 leading-none tracking-tight">{data.total_users}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total Users</p>
              </div>
           </div>
           
           {/* Custom Legend */}
           <div className="w-full mt-4 space-y-3 relative z-10">
               {roleData.map((role, idx) => {
                   const percentage = data.total_users > 0 ? ((role.value / data.total_users) * 100).toFixed(0) : "0";
                   return (
                       <div key={idx} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                               <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: COLORS[idx]}}></span>
                               <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{role.name}</span>
                           </div>
                           <span className="text-sm font-black text-gray-900">{percentage}%</span>
                       </div>
                   )
               })}
           </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6 relative z-10">
            <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 bg-white border border-gray-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <Database size={28} className="text-purple-600" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 leading-none mb-2 tracking-tight">System Data Export</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xl">Generate a comprehensive CSV dump of all platform analytics, including patient records, clinician performance, and system logs.</p>
                </div>
            </div>
            <button 
                onClick={handleRequestExport}
                className="w-full md:w-auto px-8 py-4 bg-[#7435f0] text-white font-bold rounded-2xl hover:bg-[#6329d4] transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-1 active:translate-y-0 text-sm flex items-center justify-center gap-3 group shrink-0"
            >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" /> Generate CSV Dump
            </button>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  )
}
