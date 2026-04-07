# OrthoGuide - Web Dashboard (Frontend)

The OrthoGuide Frontend is built with a modern, high-performance tech stack (React 19 + Vite 8), delivering a premium user experience for patients and clinical staff. It leverages advanced animations and data visualization to track treatment progress.

---

## 🎨 Design Philosophy
- **Responsive Branding:** Optimized for desktops and tablets.
- **Micro-Animations:** Powered by [Framer Motion](https://www.framer.com/motion/) for smooth state transitions.
- **Glassmorphism:** Uses modern backdrop-blur effects and soft shadows for a premium look.
- **Dynamic Charting:** Real-time progress visualization with [Recharts](https://recharts.org/).

---

## 🛠 Tech Stack
- **Core Framework:** React 19 (Component-based architecture)
- **Routing:** React Router 7 (Client-side routing with deep-link support)
- **Styling:** TailwindCSS 4 (Modern utility-first styling with native CSS nesting)
- **UI Engine:** Lucide React (Icons) & Radix UI (Unstyled components)
- **HTTP Client:** Axios (Custom interceptors for error handling)
- **Visualization:** Recharts & Date-fns (Complex date/progress logic)
- **Build System:** Vite 8 (Ultra-fast HMR and optimized builds)

---

## 🏗 Directory Structure
- `src/api`: Centralized axios instance and API endpoint definitions.
- `src/pages`: Component-based route definitions (Admin, Patient, Clinician).
- `src/components`: Reusable UI primitives (Buttons, Inputs, Modals).
- `src/styles`: Global theme definitions and utility overrides.

---

## 📦 Installation & Setup

1. **Prerequisites:**
   - Node.js 20+
   - npm or yarn

2. **Dependencies:**
   ```bash
   npm install
   ```

3. **API Configuration:**
   - Go to `src/api/index.js` and update the `baseURL` to point to your running Flask server.

4. **Launch Dev Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔑 Key Components
- **AI Assistant Modal:** A dedicated interface for real-time chatbot interaction using `ReactMarkdown`.
- **Treatment Timeline:** Visualized stages and progress percentages for patients.
- **Progressive Input-OTP:** Seamless 6-digit verification code entry.
- **Dashboard Widgets:** Data-dense clinician views for monitoring total patients and schedules.

---

**OrthoGuide Frontend** - *The Intelligent View of Modern Orthodontics.*
