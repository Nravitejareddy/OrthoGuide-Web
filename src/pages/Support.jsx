import { Link } from "react-router-dom"
import { MessageCircle, Phone, Mail, BookOpen, HelpCircle, ArrowRight } from "lucide-react"

export default function Support() {
  const categories = [
    {
      icon: <BookOpen size={22} />,
      title: "Patient Help",
      description: "Guides for changing trays, managing discomfort, cleaning aligners, and tracking your progress.",
      link: "/care-tips"
    },
    {
      icon: <HelpCircle size={22} />,
      title: "Doctor Help",
      description: "Resources for managing patients, creating treatment plans, and using the clinician dashboard.",
      link: "/login"
    },
    {
      icon: <MessageCircle size={22} />,
      title: "General Questions",
      description: "Common questions about accounts, billing, privacy, and how OrthoGuide works.",
      link: "/get-started"
    },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-green-50 py-20">
        <div className="section-container text-center space-y-4 animate-fade-up">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            How Can We <span className="text-green-600">Help You?</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Find answers to your questions or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={cat.link}
                className="border border-gray-100 rounded p-8 hover:shadow-lg hover:border-green-200 transition-all group block"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded flex items-center justify-center mb-5 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{cat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{cat.description}</p>
                <span className="text-sm font-medium text-green-600 inline-flex items-center gap-1">
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still Need Help?</h2>
            <p className="text-gray-500 text-sm">Reach out to us directly. We are here to help.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded p-8 text-center">
              <div className="w-12 h-12 bg-green-50 rounded mx-auto flex items-center justify-center mb-4">
                <Phone className="text-green-600" size={22} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
              <p className="text-sm text-gray-500 mb-3">Available Monday to Saturday, 9 AM to 6 PM</p>
              <a href="tel:+917299053348" className="text-green-600 font-semibold text-sm">+91 72990 53348</a>
            </div>

            <div className="bg-white border border-gray-200 rounded p-8 text-center">
              <div className="w-12 h-12 bg-green-50 rounded mx-auto flex items-center justify-center mb-4">
                <Mail className="text-green-600" size={22} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
              <p className="text-sm text-gray-500 mb-3">We usually reply within 24 hours</p>
              <a href="mailto:prime@saveetha.com" className="text-green-600 font-semibold text-sm">prime@saveetha.com</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
