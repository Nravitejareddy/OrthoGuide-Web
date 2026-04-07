import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Loader2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { patientChatbot } from "../../api"
import ReactMarkdown from "react-markdown"

export default function AIAssistant({ user }) {
  const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const [messages, setMessages] = useState([
    { 
      sender: "ai", 
      text: `Hello ${user?.name || 'there'}! I am your OrthoGuide AI Assistant. How can I help you with your treatment today?`,
      timestamp: getTimestamp()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!user) return null

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    const ts = getTimestamp();
    setMessages(prev => [...prev, { sender: "user", text: userMsg, timestamp: ts }])
    setInput("")
    setIsLoading(true)

    try {
      const res = await patientChatbot({ message: userMsg, patient_id: user.patient_id || user.user_id || user.id })
      setMessages(prev => [...prev, { sender: "ai", text: res.data.answer, timestamp: getTimestamp() }])
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: "ai",
        text: "I'm having trouble connecting right now. Please try again or contact support if the issue persists.",
        timestamp: getTimestamp()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] animate-fade-up overflow-hidden relative -mt-4 -mb-18">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-50/50 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50/30 blur-[100px]"></div>
      </div>

      {/* Header Container - Fixed at top */}
      <div className="flex items-center gap-4 py-4 px-2 border-b border-gray-100/50 backdrop-blur-sm shrink-0 z-20">
        <Link to="/dashboard" className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
            AI ASSISTANT
            <Sparkles size={14} className="text-green-500" />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">CLINICAL SUPPORT & FAQ</p>
        </div>
      </div>

      {/* Main Column: Messages + Input Bar */}
      <div className="flex-grow flex flex-col min-h-0 relative">
        {/* Chat window - scrolls independently */}
        <div className="flex-grow py-8 overflow-y-auto space-y-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-4 pb-36">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse text-right" : "text-left"}`}>
              {msg.sender === "ai" ? (
                <div className="w-10 h-10 rounded-xl bg-white text-green-600 border border-green-100 flex items-center justify-center shrink-0 shadow-lg transform rotate-[-6deg]">
                  <Sparkles size={18} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg transform rotate-[6deg]">
                  <User size={18} />
                </div>
              )}
              
              <div className="space-y-1">
                <div className={`p-5 rounded-md text-[15px] font-medium leading-relaxed shadow-sm ${msg.sender === "ai"
                    ? "bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-slate-200/50"
                    : "bg-slate-900 text-white rounded-tr-none shadow-slate-900/20"
                  }`}>
                  {msg.sender === "ai" ? (
                    <div className="markdown-content text-left">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.timestamp && (
                  <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-tight px-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-white border border-green-100 flex items-center justify-center text-green-600 shadow-lg animate-pulse rotate-[-6deg]">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-md rounded-tl-none border border-gray-100 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Floating Input Area (Pill-style) - Lowered to the absolute bottom border */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 bg-gradient-to-t from-white via-white/80 to-transparent pt-12 pb-0">
          <div className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl p-2 rounded-full border border-gray-100 shadow-2xl shadow-slate-300 group-within:border-green-500/30 transition-all">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your concern (pain, food, cleaning)..."
                className="flex-grow px-8 py-3.5 bg-transparent border-none text-[15px] font-bold focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 flex items-center justify-center bg-teal-400 hover:bg-teal-500 disabled:opacity-30 text-white rounded-full transition-all shadow-lg shadow-teal-100 hover:scale-105 active:scale-95 shrink-0"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="-mr-0.5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
