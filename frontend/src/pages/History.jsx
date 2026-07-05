import React from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Clock, CheckCircle2, ChevronRight, Award, FileText, Calendar } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GlowingBadge from '../components/ui/GlowingBadge';

const History = () => {
  const previousInterviews = [
    {
      company: "Google",
      role: "SDE-1",
      date: "July 04, 2026",
      score: 82,
      type: "TECHNICAL_DSA",
      verdict: "Recommended"
    },
    {
      company: "Amazon",
      role: "SDE-1",
      date: "July 02, 2026",
      score: 75,
      type: "SYSTEM_DESIGN",
      verdict: "Recommended"
    },
    {
      company: "Microsoft",
      role: "Intern",
      date: "June 28, 2026",
      score: 58,
      type: "BEHAVIORAL",
      verdict: "Needs Improvement"
    }
  ];

  const previousResumes = [
    {
      filename: "SDE_Resume_v3.pdf",
      date: "July 03, 2026",
      score: 84,
      keywords: ["System Design", "Docker", "FastAPI"]
    },
    {
      filename: "SDE_Resume_v2.pdf",
      date: "June 25, 2026",
      score: 71,
      keywords: ["Microservices", "CI/CD", "Redis"]
    }
  ];

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-2">
          <HistoryIcon className="text-accent-blue" /> Session History
        </h1>
        <p className="text-white/40 mb-8">View logs of past mock interviews, resume analyses, and placement readiness tracking.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Interview History */}
          <div className="space-y-6">
            <h2 className="text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
              <Award className="text-accent-cyan" size={18} /> Mock Interviews
            </h2>
            
            <div className="space-y-4">
              {previousInterviews.map((item, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-heading font-bold text-sm">{item.company}</h3>
                      <p className="text-white/40 text-[10px] uppercase font-semibold mt-0.5">{item.role} • {item.type}</p>
                    </div>
                    <GlowingBadge text={`${item.score}%`} color={item.score >= 80 ? "green" : item.score >= 60 ? "blue" : "orange"} />
                  </div>

                  <p className="text-white/60 text-xs mb-4">
                    Verdict: <span className={`font-semibold ${item.verdict === 'Recommended' ? 'text-accent-blue' : item.verdict === 'Needs Improvement' ? 'text-accent-orange' : 'text-accent-green'}`}>{item.verdict}</span>
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-glass-border/30 pt-3">
                    <span className="flex items-center gap-1"><Clock size={10} /> Completed {item.date}</span>
                    <button className="text-accent-blue font-semibold hover:underline flex items-center gap-0.5">View details <ChevronRight size={10} /></button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right: Resume History */}
          <div className="space-y-6">
            <h2 className="text-lg font-heading font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="text-accent-purple" size={18} /> Resume Reviews
            </h2>

            <div className="space-y-4">
              {previousResumes.map((item, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-heading font-bold text-sm">{item.filename}</h3>
                      <p className="text-white/40 text-[10px] uppercase font-semibold mt-0.5">ATS Review</p>
                    </div>
                    <GlowingBadge text={`${item.score}/100`} color={item.score >= 80 ? "green" : item.score >= 60 ? "blue" : "orange"} />
                  </div>

                  <div className="mb-4">
                    <p className="text-white/40 text-[10px] font-semibold mb-1 uppercase">MISSING KEYWORDS DETECTED</p>
                    <div className="flex flex-wrap gap-1">
                      {item.keywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-accent-red/10 text-accent-red border border-accent-red/20 rounded text-[9px] font-mono">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-glass-border/30 pt-3">
                    <span className="flex items-center gap-1"><Calendar size={10} /> Analyzed {item.date}</span>
                    <button className="text-accent-blue font-semibold hover:underline flex items-center gap-0.5">View report <ChevronRight size={10} /></button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default History;
