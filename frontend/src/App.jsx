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
    <div className="relative bg-void min-h-screen overflow-x-hidden font-body">
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