import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { CheckCircle, Users, Shield, Smile, ArrowRight, Star } from "lucide-react"
import { getPublicStats } from "../api"

export default function Home() {
  const [stats, setStats] = useState({
    total_patients: "10,000+",
    total_clinicians: "500+",
    satisfaction_rate: "99%",
    support_available: "24/7"
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getPublicStats()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="bg-white">

      {/* ═══════ HERO ═══════ */}
      <section className="bg-green-50 py-20 md:py-28">
        <div className="section-container text-center space-y-6 animate-fade-up">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded">
            Trusted by 500+ Clinics
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Your Smile Journey <br className="hidden md:block" />
            <span className="text-green-600">Starts Here</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            OrthoGuide helps patients track their orthodontic treatment, connect with doctors, and get the perfect smile — all in one place.
          </p>
          <div className="flex justify-center pt-4">
            <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 rounded-md text-sm transition-all inline-flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95">
              Sign In <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              A simple process to manage your orthodontic care from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              step="1"
              title="Find a Doctor"
              description="Search our network of certified orthodontic providers near you and book your first consultation."
              icon={<Users className="text-green-600" size={24} />}
            />
            <FeatureCard
              step="2"
              title="Get Your Plan"
              description="Your doctor creates a custom treatment plan. See your future smile before you even begin."
              icon={<CheckCircle className="text-green-600" size={24} />}
            />
            <FeatureCard
              step="3"
              title="Track Progress"
              description="Use the OrthoGuide app to track your treatment, get reminders, and stay connected with your doctor."
              icon={<Smile className="text-green-600" size={24} />}
            />
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value={stats.total_patients} label="Happy Patients" />
            <StatItem value={stats.total_clinicians} label="Partner Clinics" />
            <StatItem value={stats.satisfaction_rate} label="Satisfaction Rate" />
            <StatItem value={stats.support_available} label="Support Available" />
          </div>
        </div>
      </section>

      {/* ═══════ FOR EVERY ROLE ═══════ */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Everyone</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Whether you are a patient, doctor, or administrator — OrthoGuide has the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard
              title="For Patients"
              description="Track your treatment progress, view upcoming sessions, get care tips, and message your doctor directly."
              image="/images/patient_app.png"
            />
            <RoleCard
              title="For Doctors"
              description="Manage your patients, create treatment plans, schedule sessions, and monitor patient progress in real time."
              image="/images/doctor_app.png"
            />
            <RoleCard
              title="For Admins"
              description="Oversee the entire system, manage user accounts, view analytics, and configure clinic settings."
              image="/images/admin_app.png"
            />
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIAL ═══════ */}
      <section className="bg-green-600 py-16">
        <div className="section-container text-center text-white">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="white" />)}
          </div>
          <blockquote className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed mb-6">
            "OrthoGuide made my entire treatment so easy. I could track everything from my phone and my doctor was always just a message away."
          </blockquote>
          <p className="text-green-100 text-sm font-medium">— Ravi T., Patient</p>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20">
        <div className="section-container text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Start Your Journey?</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Join thousands of patients and doctors who trust OrthoGuide for better orthodontic care.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-4 rounded-md text-sm transition-all shadow-xl hover:scale-105 active:scale-95">
            Sign In to Start <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ step, title, description, icon }) {
  return (
    <div className="bg-white border border-gray-100 rounded p-8 hover:shadow-lg transition-shadow group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center group-hover:bg-green-100 transition-colors">
          {icon}
        </div>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">Step {step}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-bold text-green-600">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function RoleCard({ title, description, image }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-green-200 hover:shadow-lg transition-all group flex flex-col bg-white">
      <div className="bg-gray-100 p-6 flex justify-center items-center h-64 overflow-hidden relative">
        <img 
          src={image} 
          alt={`${title} App View`} 
          className="w-48 h-auto rounded-xl shadow-md border border-gray-200 transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 absolute top-6"
        />
      </div>
      <div className="p-8 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>
        <Link to="/login" className="text-sm font-semibold text-green-600 hover:text-green-700 inline-flex items-center gap-2 transition-colors mt-auto">
          Sign In <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
