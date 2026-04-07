import { Link } from "react-router-dom"
import { Search, ScanLine, ClipboardList, Rocket, ArrowRight, Shield, Award, Zap } from "lucide-react"

export default function GetStarted() {
  const steps = [
    {
      icon: <Search size={22} />,
      title: "Find a Clinic",
      description: "Search our network of certified orthodontic providers near you. Find a clinic that fits your schedule and location."
    },
    {
      icon: <ScanLine size={22} />,
      title: "Get a Digital Scan",
      description: "Visit your clinic for a quick, painless 3D scan. No messy impressions needed — just modern technology."
    },
    {
      icon: <ClipboardList size={22} />,
      title: "Review Your Plan",
      description: "Your doctor will create a custom treatment plan. You can see your expected results before starting."
    },
    {
      icon: <Rocket size={22} />,
      title: "Begin Treatment",
      description: "Receive your aligners and start your journey. Use the OrthoGuide app to track progress every step of the way."
    },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-green-50 py-20">
        <div className="section-container text-center space-y-4 animate-fade-up">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded">
            New Patient Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Getting Started is <span className="text-green-600">Easy</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Follow these four simple steps to begin your orthodontic treatment with OrthoGuide.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="border border-gray-100 rounded p-8 hover:shadow-lg hover:border-green-200 transition-all group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-300">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-50 rounded mx-auto flex items-center justify-center">
                <Shield className="text-green-600" size={22} />
              </div>
              <h4 className="font-semibold text-gray-900">HIPAA Compliant</h4>
              <p className="text-sm text-gray-500">Your data is protected with medical-grade security.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-50 rounded mx-auto flex items-center justify-center">
                <Award className="text-green-600" size={22} />
              </div>
              <h4 className="font-semibold text-gray-900">Board Certified</h4>
              <p className="text-sm text-gray-500">All treatments are supervised by certified orthodontists.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-50 rounded mx-auto flex items-center justify-center">
                <Zap className="text-green-600" size={22} />
              </div>
              <h4 className="font-semibold text-gray-900">Smart Technology</h4>
              <p className="text-sm text-gray-500">AI-powered treatment planning for faster, better results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="section-container">
          <div className="bg-green-600 rounded p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-green-100 mb-6 max-w-md mx-auto">
              Create your account and take the first step toward your perfect smile.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-8 py-3.5 rounded text-sm hover:bg-green-50 transition-colors">
              Sign Up Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
