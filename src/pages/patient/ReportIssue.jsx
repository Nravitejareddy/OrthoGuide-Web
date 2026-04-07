import { AlertTriangle, FileText, Send, Loader2, CheckCircle2, Camera, X, Info, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { reportIssue, getPatientIssues } from "../../api"
import { toast } from "sonner"
import { Link } from "react-router-dom"

const ISSUE_OPTIONS = [
  "Loose Bracket / Band",
  "Poking Wire",
  "Lost Aligner",
  "Severe Pain",
  "Swollen Gums",
  "Broken Appliance"
]

export default function ReportIssue({ user }) {
  const [selectedIssues, setSelectedIssues] = useState([])
  const [painLevel, setPainLevel] = useState(0)
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [status, setStatus] = useState("idle") // idle, loading, success, error
  const [pastIssuesCount, setPastIssuesCount] = useState(0)

  useEffect(() => {
    const fetchPastIssues = async () => {
      if (!user?.user_id && !user?.id) return;
      try {
        const res = await getPatientIssues(user.user_id || user.id);
        setPastIssuesCount(res.data?.length || 0);
      } catch (err) {
        console.error("Failed to fetch past issues:", err);
      }
    };
    fetchPastIssues();
  }, [user]);

  if (!user) return null

  const toggleIssue = (issue) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue) 
        : [...prev, issue]
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
      toast.success("Photo attached!")
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedIssues.length === 0) {
      toast.error("Please select at least one issue type.")
      return
    }
    if (painLevel === 0) {
      toast.error("Please rate your pain level.")
      return
    }

    setStatus("loading")
    try {
      let base64Photo = ""
      if (photo) {
        base64Photo = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(photo)
        })
      }

      await reportIssue({
        patient_id: user.user_id || user.id,
        issue_type: selectedIssues.join(", "),
        description: description,
        photo_url: base64Photo,
        severity: painLevel
      })
      setStatus("success")
      setSelectedIssues([])
      setPainLevel(0)
      setDescription("")
      setPhoto(null)
      setPhotoPreview(null)
      setPastIssuesCount(prev => prev + 1)
      toast.success("Report submitted! Your doctor has been notified.")
    } catch (err) {
      console.error(err)
      setStatus("error")
      toast.error("Failed to submit report. Please try again.")
    }
  }

  return (
    <div className="space-y-6 animate-fade-up min-h-screen pb-20 relative">
      {/* Premium Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-green-50/50 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-50/40 blur-[100px]"></div>
      </div>

      {/* Standard Header */}
      <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-20 mb-4">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-grow">
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
            Report an Issue
            <AlertTriangle size={14} className="text-red-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Help us understand what's happening so we can provide the best care.</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-md overflow-hidden">
          <form className="divide-y divide-gray-100" onSubmit={handleSubmit}>
            
            {/* Step 1: Select Issues */}
            <div className="p-8 space-y-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select all that apply</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ISSUE_OPTIONS.map(issue => (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => toggleIssue(issue)}
                    className={`flex items-center justify-between p-4 rounded-md border-2 transition-all text-left ${
                      selectedIssues.includes(issue)
                        ? "border-green-500 bg-green-50 text-green-700 shadow-md scale-[1.02]"
                        : "border-gray-50 bg-gray-50/50 text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    <span className="text-sm font-semibold">{issue}</span>
                    {selectedIssues.includes(issue) && <CheckCircle2 size={18} className="text-green-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Pain Level */}
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-end">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">How much pain are you in?</label>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  painLevel >= 8 ? "bg-red-50 text-red-600" : painLevel >= 4 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                }`}>
                  {painLevel === 0 ? "Select Level" : painLevel >= 8 ? "Severe" : painLevel >= 4 ? "Moderate" : "Mild"}
                </span>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPainLevel(level)}
                    className={`h-12 flex items-center justify-center rounded-md font-bold text-sm transition-all shadow-sm ${
                      painLevel === level
                        ? "bg-green-600 text-white scale-110 shadow-lg ring-4 ring-green-100"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest px-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Step 3: Photo & Description */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capture / Upload Photo</label>
                  {!photoPreview ? (
                    <div className="relative border-2 border-dashed border-gray-100 rounded-md bg-gray-50/30 aspect-video flex flex-col items-center justify-center text-gray-400 hover:bg-green-50/30 hover:border-green-200 transition-all cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="p-4 bg-white border border-gray-100 rounded-md shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Camera size={24} className="group-hover:text-green-500 transition-colors" />
                      </div>
                      <span className="text-xs font-semibold">Click to upload photo</span>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200 shadow-xl group">
                      <img src={photoPreview} alt="Issue Issue" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={removePhoto}
                          className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 flex items-start gap-2 italic">
                    <Info size={12} className="shrink-0 mt-0.5" />
                    Photos help our clinical team assess the severity of the issue faster.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Details</label>
                  <textarea
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what happened..."
                    className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="p-8 bg-gray-50/30">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-md text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${
                  status === "loading" ? "opacity-70 pointer-events-none" : 
                  status === "success" ? "bg-green-600 hover:bg-green-600 cursor-default" : ""
                }`}
              >
                {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : 
                 status === "success" ? <CheckCircle2 size={18} /> : 
                 <Send size={18} />}
                {status === "loading" ? "Submitting Report..." : 
                 status === "success" ? "Report Submitted Successfully" : 
                 "Send Formal Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
