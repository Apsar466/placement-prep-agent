import PageTransition from '../components/layout/PageTransition';
import LandingBrain from '../components/canvas/LandingBrain';
import GradientButton from '../components/ui/GradientButton';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { FileText, Brain, Mic, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: "Students Prepared", value: 10000, suffix: "+" },
  { label: "Resume Analyses", value: 25000, suffix: "+" },
  { label: "Mock Interviews", value: 50000, suffix: "+" },
  { label: "Companies Supported", value: 100, suffix: "+" }
];

const features = [
  { icon: FileText, title: "Resume Intelligence", desc: "ATS optimization & critique", path: "/resume", color: "text-accent-blue" },
  { icon: Brain, title: "Career Intelligence", desc: "Skill gap analysis", path: "/skills", color: "text-accent-purple" },
  { icon: Mic, title: "Interview Intelligence", desc: "Adaptive mock interviews", path: "/interview", color: "text-accent-cyan" },
  { icon: Map, title: "Placement Strategy", desc: "Personalized roadmaps", path: "/roadmap", color: "text-accent-green" }
];

const CommandCenter = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center relative">
        {/* 3D Brain Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <LandingBrain />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 tracking-tight">
            Placement Preparation <span className="text-gradient">Agent</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-body mb-10 max-w-2xl mx-auto">
            AI-Powered Multi-Agent Placement Mentor. Navigate your campus placements with an enterprise-grade AI Operating System.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard">
              <GradientButton>Start Preparing</GradientButton>
            </Link>
            <Link to="/resume">
              <GradientButton variant="outline">Analyze Resume</GradientButton>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-mono font-bold text-accent-blue">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <Link to={feat.path} key={i} className="block transition duration-300 hover:scale-[1.03]">
                <GlassCard className="text-left h-full cursor-pointer">
                  <feat.icon className={`${feat.color} mb-3`} size={24} />
                  <h3 className="text-white font-heading font-semibold mb-1">{feat.title}</h3>
                  <p className="text-white/50 text-sm">{feat.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CommandCenter;