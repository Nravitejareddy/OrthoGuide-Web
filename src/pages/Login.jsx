import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import Logo from "../components/Logo"

export default function Login() {
  const [role, setRole] = useState("patient")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const roles = [
    { value: "patient", label: "Patient" },
    { value: "clinician", label: "Doctor" },
    { value: "admin", label: "Admin" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!userId.trim() || !password.trim()) {
      setError("Please enter both your ID and password.")
      return
    }

    setIsLoading(true)
    const result = await login({ user_id: userId, password, role })
    setIsLoading(false)

    if (result?.success) {
      navigate("/dashboard")
    } else if (result?.error?.toLowerCase().includes("inactive")) {
      navigate("/account-inactive", { state: { userId, role } })
    } else {
      setError(result?.error || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size={48} className="justify-center mb-4" />
          <p className="text-gray-500 text-sm mt-1">Sign in to your OrthoGuide account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-md p-8">
          {/* Role Tabs */}
          <div className="flex bg-gray-50 rounded-md p-1 mb-6">
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => { setRole(r.value); setError(""); }}
                className={`flex-1 text-sm font-medium py-2.5 rounded-md transition-all ${
                  role === r.value
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {role === "patient" ? "Patient ID" : role === "clinician" ? "Doctor ID" : "Admin ID"}
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={role === "patient" ? "e.g. PAT192210667" : role === "clinician" ? "e.g. DOC192210667" : "e.g. admin001"}
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password", { state: { role } })}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Forgot Password?
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}

function ArrowRight({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
