# NexStep AI – Autonomous Adaptive Learning Platform

> **An intelligent, autonomous, and adaptive learning platform designed to personalize educational journeys through AI-driven content recommendations, interactive quizzes, progress analytics, and real-time AI assistance.**

---

## 🌟 Key Features

- 🧠 **Autonomous Adaptive Learning**: Personalized curriculum and topic sequencing tailored to each student's diagnostic profile and selected skills.
- 🌓 **Comprehensive Design System & Theming**: Complete light and dark theme adaptation across every page, component, modal, dropdown, and chart.
- 🔒 **Multi-User Data Isolation**: Secure profile and skills data isolation across accounts, preventing state bleeding between user sessions.
- 💬 **Integrated AI Learning Assistant**: Non-intrusive floating assistant providing on-demand conceptual clarity, code explanations, and hints without obstructing navigation.
- 📊 **Progress & Analytics Dashboard**: Real-time mastery metrics, skill completion breakdowns, and topic milestones.
- 📝 **Adaptive Assessments & Quizzes**: Timed MCQs, instant evaluation, review explanations, and dynamic difficulty adjustments.
- ⚡ **Production-Ready & Optimized**: Streamlined codebase with zero redundant dependencies and instant Next.js App Router compilation.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- **Database & ORM**: [Prisma](https://www.prisma.io/) with SQLite
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme Management**: Next Themes with custom CSS variables

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ or v20+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SKDev-18/SmartAi-SKills.git
   cd SmartAi-SKills
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed Learning Content (Optional):**
   ```bash
   node prisma/seed-all-learning-content.js
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore NexStep AI.

---

## 📁 Repository Structure

```
SmartAi-SKills/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── seed-all-learning-content.js # Content seeding scripts
├── public/                        # Static assets & icons
├── scripts/                       # Automated test suites & verification
│   ├── test-comprehensive-suite.mjs
│   └── test-demo-flow.mjs
├── src/
│   ├── app/                       # Next.js App Router (43 routes)
│   │   ├── api/                   # API routes (auth, profile, learning, chat)
│   │   ├── dashboard/             # Student dashboard & analytics
│   │   ├── learning/              # Interactive learning pathways
│   │   ├── quiz/                  # Adaptive quiz assessments
│   │   ├── profile/               # User profile setup & settings
│   │   └── page.tsx               # Landing home page
│   ├── components/                # Reusable UI components & layouts
│   └── lib/                       # Prisma client, auth helpers, utilities
├── package.json
└── tailwind.config.ts
```

---

## 🧪 Verification & Testing

Run the automated test suites to verify route health and data isolation:

```bash
node scripts/test-comprehensive-suite.mjs
node scripts/test-demo-flow.mjs
```

---

## 📄 License

This project is licensed under the MIT License.
