import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import api from "../api"
import Logo from "../components/Logo"
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react"

export default function Signup() {
  const [step, setStep] = useState(1) // 1: Info, 2: OTP, 3: Success
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("patient")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let interval = null
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timer])

  const validatePasswordStrength = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character"
    return null
  }

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    if (!name || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    const error = validatePasswordStrength(password)
    if (error) {
      toast.error(error)
      return
    }
    
    setIsLoading(true)
    try {
      const { data } = await api.post("/send_otp", { email, action: "signup" })
      toast.success(data.message || "OTP sent successfully!")
      setTimer(30)
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtpAndSignup = async (e) => {
    e.preventDefault()
    if (!otp) {
      toast.error("Please enter the OTP")
      return
    }
    
    setIsLoading(true)
    try {
      // Step 1: Verify OTP
      await api.post("/verify_otp", { email, otp })
      
      // Step 2: Signup
      const { data } = await api.post("/signup", { name, email, password, role })
      toast.success(data.message || "Account created!")
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP or Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-up border border-gray-200 rounded p-8 bg-white">
        <div className="text-center mb-8">
          <Logo size={48} className="justify-center mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Create Account</h2>
          {step === 1 && <p className="text-gray-500 text-sm mt-1">Join OrthoGuide to start your journey.</p>}
          {step === 2 && <p className="text-gray-500 text-sm mt-1">Check your email for the verification code.</p>}
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a...</label>
              <div className="flex bg-gray-50 rounded p-1 mb-2">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`flex-1 text-sm font-medium py-2 rounded transition-all ${role === 'patient' ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >Patient</button>
                <button
                  type="button"
                  onClick={() => setRole('clinician')}
                  className={`flex-1 text-sm font-medium py-2 rounded transition-all ${role === 'clinician' ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >Clinician</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. John Doe"
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. youremail@domain.com"
                className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full border border-gray-200 rounded px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded text-sm transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? "Validating..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtpAndSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">6-Digit Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full tracking-widest text-center text-lg border border-gray-200 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating Account..." : "Verify & Sign Up"}
            </button>

            <div className="text-center mt-6">
              {timer > 0 ? (
                <p className="text-sm font-bold text-emerald-600 animate-pulse">
                  Resend code in <span className="inline-block min-w-[1.5rem]">{timer}</span> s
                </p>
              ) : (
                <p className="text-sm text-gray-500 font-medium">
                  Didn't receive code?{" "}
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={isLoading}
                    className="text-emerald-600 font-black hover:underline transition-all"
                  >
                    Resend Now
                  </button>
                </p>
              )}
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-2" />
            <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
            <Link to="/login" className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded text-sm transition-colors">
              Go to Login
            </Link>
          </div>
        )}

        {step === 1 && (
          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
              Already have an account? Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
