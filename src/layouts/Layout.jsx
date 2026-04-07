import { Outlet, Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { Menu, X, Phone, Mail, MapPin } from "lucide-react"
import Logo from "../components/Logo"

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Care Tips", path: "/care-tips" },
  { label: "Support", path: "/support" },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname.startsWith("/dashboard")

  // Hide layout chrome on dashboard pages
  if (isDashboard) return <Outlet />

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ═══════ NAVBAR ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="section-container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size={32} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  location.pathname === link.path ? "text-green-600" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors shadow-sm">
              Sign In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 p-2">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
            <div className="section-container py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3.5 text-sm font-semibold text-white bg-green-600 rounded text-center shadow-sm">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══════ PAGE CONTENT ═══════ */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-gray-900 text-white">
        <div className="section-container pt-16 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Brand */}
            <div className="space-y-6">
              <Logo size={32} textColor="text-white" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Making orthodontic care simple, smart, and accessible for everyone.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-green-500">Quick Links</h4>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-600/50 block"></span>
                       {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:pl-12">
              <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-green-500">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-gray-400 group">
                  <div className="p-2 bg-gray-800 rounded group-hover:bg-green-600/20 transition-colors">
                    <Phone size={14} className="text-green-500" />
                  </div>
                  +91 72990 53348
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400 group">
                  <div className="p-2 bg-gray-800 rounded group-hover:bg-green-600/20 transition-colors">
                    <Mail size={14} className="text-green-500" />
                  </div>
                  prime@saveetha.com
                </li>
                {location.pathname === "/" && (
                  <li className="flex items-center gap-3 text-sm text-gray-400 group border-t border-gray-800 pt-4 mt-4">
                    <div className="p-2 bg-gray-800 rounded group-hover:bg-green-600/20 transition-colors">
                      <MapPin size={14} className="text-green-500" />
                    </div>
                    162, Poonamallee High Rd, Velappanchavadi, Chennai, Tamil Nadu 600077
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} OrthoGuide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
