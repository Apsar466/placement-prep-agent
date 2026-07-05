import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & Global
import FloatingNavbar from './components/layout/FloatingNavbar';
import AIOrb from './components/avatar/AIOrb';
import GlobalScene from './components/canvas/GlobalScene';

// Pages
import CommandCenter from './pages/CommandCenter';
import DashboardOS from './pages/DashboardOS';
import AIInsights from './pages/AIInsights';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import CompanyPrep from './pages/CompanyPrep';
import Roadmap from './pages/Roadmap';
import History from './pages/History';
import Profile from './pages/Profile';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';

// Remove PageTransition from here, it's now inside each page for better encapsulation

const App = () => {
  return (
    <div className="relative bg-void min-h-screen overflow-x-hidden font-body text-white">
      {/* Dynamic Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-accent-purple/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] bg-accent-blue/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] bg-accent-red/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Z-Layer 1: 3D Environment */}
      <Suspense fallback={null}>
        <GlobalScene />
      </Suspense>

      {/* Z-Layer 2 & 3: DOM Workspace & AI Entity */}
      <div className="relative z-10">
        <FloatingNavbar />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/dashboard" element={<DashboardOS />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/skills" element={<SkillGapAnalyzer />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/companies" element={<CompanyPrep />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>

        <AIOrb />
      </div>
    </div>
  );
};

export default App;