import { Droplets, UtensilsCrossed, Thermometer, Clock, Phone, AlertTriangle } from "lucide-react"

export default function CareTips() {
  const tips = [
    {
      icon: <UtensilsCrossed size={22} />,
      title: "Eating & Drinking",
      items: [
        "Remove your aligners before eating or drinking anything except water.",
        "Avoid hard, sticky, or crunchy foods that can damage your trays.",
        "Always rinse your mouth before putting your aligners back in.",
      ]
    },
    {
      icon: <Droplets size={22} />,
      title: "Cleaning Your Aligners",
      items: [
        "Clean your aligners every morning and night with a soft toothbrush.",
        "Use lukewarm water — never hot water, as it can warp the plastic.",
        "Avoid colored mouthwash or toothpaste that can stain your trays.",
      ]
    },
    {
      icon: <Thermometer size={22} />,
      title: "Oral Hygiene",
      items: [
        "Brush and floss your teeth after every meal before reinserting aligners.",
        "Use fluoride toothpaste to strengthen your enamel during treatment.",
        "Schedule dental cleanings every 6 months throughout your treatment.",
      ]
    },
    {
      icon: <Clock size={22} />,
      title: "Wear Time",
      items: [
        "Wear your aligners for at least 20 to 22 hours every day.",
        "Switch to your next set of trays as directed by your doctor.",
        "Keep your previous tray as a backup in case your current one breaks.",
      ]
    },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-green-50 py-20">
        <div className="section-container text-center space-y-4 animate-fade-up">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded">
            Care Guidelines
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Taking Care of Your <span className="text-green-600">Aligners</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Follow these simple tips to get the best results from your orthodontic treatment.
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, i) => (
              <div key={i} className="border border-gray-100 rounded p-8 hover:shadow-md hover:border-green-200 transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded flex items-center justify-center">
                    {tip.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{tip.title}</h3>
                </div>
                <ul className="space-y-3">
                  {tip.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white border border-gray-200 rounded p-8">
            <div className="w-14 h-14 bg-red-50 rounded flex items-center justify-center shrink-0">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Need Urgent Help?</h3>
              <p className="text-sm text-gray-500">
                If you experience severe pain, a broken tray, or any dental emergency, contact your clinic right away.
              </p>
            </div>
            <a href="tel:+919876543210" className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded text-sm transition-colors inline-flex items-center gap-2">
              <Phone size={16} /> Call Clinic
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
