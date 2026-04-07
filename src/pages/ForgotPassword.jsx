import { useState, useEffect, useRef } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { toast } from "sonner"
import api from "../api"
import Logo from "../components/Logo"
import { Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Info, ArrowLeft, Clock } from "lucide-react"

export default function ForgotPassword() {
  const location = useLocation()
  const role = location.state?.role || "patient"
  
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("")
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const navigate = useNavigate()
  const otpRefs = useRef([])

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

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only digits
    
    const newOtp = [...otpArray]
    newOtp[index] = value.slice(-1) // Take only last digit
    setOtpArray(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1].focus()
    }
  }

  // Handle Backspace in OTP boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1].focus()
    }
  }

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    
    setIsLoading(true)
    try {
      const { data } = await api.post("/send_otp", { email, role })
      toast.success(data.message || "OTP sent successfully!")
      setTimer(30)
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault()
    const otp = otpArray.join("")
    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP")
      return
    }
    
    setIsLoading(true)
    try {
      const { data } = await api.post("/verify_otp", { email, otp })
      toast.success(data.message || "OTP verified!")
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character"
    return null
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    const error = validatePassword(newPassword)
    if (error) {
      toast.error(error)
      return
    }
    
    setIsLoading(true)
    try {
      const { data } = await api.post("/reset_password", { email, new_password: newPassword, role })
      toast.success(data.message || "Password reset successfully!")
      setStep(4)
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9FAFB] relative overflow-hidden flex items-center justify-center py-8 px-4">
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      
      <div className="w-full max-w-md z-10 animate-fade-up">
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 md:p-8">
          {/* Top Icon Block */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              {step === 4 ? (
                <CheckCircle2 size={24} className="text-green-500" />
              ) : (
                <ShieldCheck size={24} className="text-green-500" />
              )}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {step === 1 ? "Reset Password" : step === 2 ? "Verify OTP" : step === 3 ? "Create Password" : "Reset Successful"}
            </h2>
            <div className="mt-1.5 text-center text-gray-500 text-sm font-medium">
                {step === 1 ? "Enter your email to receive a code." : 
                 step === 2 ? "Enter OTP" : 
                 step === 3 ? "Set your new secure password." : 
                 "Your password has been reset."}
            </div>
            {step === 2 && (
               <p className="text-gray-400 text-[11px] mt-2 leading-relaxed max-w-[260px] mx-auto text-center">
                 We've sent a 6-digit code to your registered email address
               </p>
            )}
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex. youremail@domain.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Secure Code <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpArray.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-9 h-12 sm:w-11 sm:h-14 text-center text-lg font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all shadow-sm"
                  />
                ))}
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs font-medium">
                    <Clock size={14} />
                    Resend code in <span className="text-green-600 font-bold">{timer} s</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-medium">
                    Didn't receive code?{" "}
                    <button 
                      type="button" 
                      onClick={handleSendOtp} 
                      disabled={isLoading}
                      className="text-green-600 font-bold hover:underline"
                    >
                      Resend Now
                    </button>
                  </p>
                )}
              </div>

              {/* Note Section */}
              <div className="bg-green-50/50 rounded-xl p-4 border border-green-100/50 flex gap-3">
                <Info size={16} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-green-800 font-medium leading-relaxed">
                  <span className="font-bold">Note:</span> The OTP is valid for 5 minutes. If you don't receive it, check if your email address is correct.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold h-12 rounded-xl tracking-[1px] text-xs uppercase transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-6 leading-relaxed">
                Your password has been successfully updated. You can now use your new credentials to sign in.
              </p>
              <Link 
                to="/login" 
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 flex items-center justify-center rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
              >
                Return to Login
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
            <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-green-600 text-xs font-bold transition-colors">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
