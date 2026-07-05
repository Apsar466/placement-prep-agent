import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Sparkles, BookOpen, HelpCircle, CheckSquare, ShieldCheck, HelpCircle as HelpIcon, RefreshCw } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';
import GlowingBadge from '../components/ui/GlowingBadge';
import { getCompanyPrep } from '../services/api';
import toast from 'react-hot-toast';

const CompanyPrep = () => {
  const [companyName, setCompanyName] = useState('Google');
  const [role, setRole] = useState('SDE-1');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!companyName.trim()) {
      return toast.error("Please enter a company name.");
    }
    
    setIsLoading(true);
    setResults(null);
    try {
      const data = await getCompanyPrep(companyName, role);
      setResults(data);
      toast.success("Company DNA generated!");
    } catch (error) {
      toast.error(error.message || "Failed to fetch company prep guide.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Company DNA Agent</h1>
        <p className="text-white/40 mb-8">Generate hyper-personalized preparation sheets using historical company interview logs and RAG-based search.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard hover={false} className="p-6">
              <h2 className="text-white font-heading font-bold text-sm mb-4 flex items-center gap-2">
                <Search size={16} className="text-accent-blue" /> Search Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs block mb-2 font-semibold">COMPANY NAME</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Amazon, Microsoft"
                    className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-white/60 text-xs block mb-2 font-semibold">TARGET ROLE</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE-1, Intern"
                    className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue text-sm"
                  />
                </div>

                <GradientButton 
                  onClick={handleSearch} 
                  className="w-full py-3.5 mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={16} /> Generating DNA...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={16} /> Get Prep Guide
                    </span>
                  )}
                </GradientButton>
              </div>
            </GlassCard>
            
            {/* Quick Suggestions */}
            <GlassCard hover={false} className="p-6">
              <h3 className="text-white/60 text-xs font-bold mb-3 tracking-wider">POPULAR SEARCHES</h3>
              <div className="flex flex-wrap gap-2">
                {["Google", "Amazon", "Microsoft", "Netflix", "Meta"].map((comp, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setCompanyName(comp); }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 border border-glass-border rounded-lg text-xs font-semibold transition"
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Results Workspace */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loader" className="space-y-4">
                  <ShimmerLoader className="h-28 w-full" />
                  <ShimmerLoader className="h-44 w-full" />
                  <ShimmerLoader className="h-32 w-full" />
                </motion.div>
              ) : results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Hiring Pattern */}
                  <GlassCard hover={false} className="p-6 border-accent-blue/20">
                    <h3 className="text-white font-heading font-bold text-base mb-3 flex items-center gap-2">
                      <Building2 className="text-accent-blue" size={18} /> Hiring Pattern & Interview Loop
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {results.hiring_pattern}
                    </p>
                  </GlassCard>

                  {/* Core Focus Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <GlassCard hover={false} className="p-6">
                      <h4 className="text-accent-cyan font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                        <BookOpen size={16} /> Technical Focus Topics
                      </h4>
                      <ul className="space-y-2 text-sm text-white/70">
                        {results.technical_focus.map((topic, i) => (
                          <li key={i} className="flex gap-2 items-start"><span className="text-white/30">•</span>{topic}</li>
                        ))}
                      </ul>
                    </GlassCard>

                    <GlassCard hover={false} className="p-6">
                      <h4 className="text-accent-purple font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                        <ShieldCheck size={16} /> Behavioral Focus Areas
                      </h4>
                      <ul className="space-y-2 text-sm text-white/70">
                        {results.behavioral_focus.map((beh, i) => (
                          <li key={i} className="flex gap-2 items-start"><span className="text-white/30">•</span>{beh}</li>
                        ))}
                      </ul>
                    </GlassCard>
                  </div>

                  {/* Sample Questions */}
                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-white font-heading font-bold text-base mb-4 flex items-center gap-2">
                      <HelpIcon className="text-accent-purple" size={18} /> Sample Technical Questions
                    </h3>
                    <div className="space-y-3">
                      {results.sample_technical_questions.map((q, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-glass-border rounded-xl text-white/80 text-sm leading-relaxed font-mono">
                          <span className="text-accent-blue font-bold">Q{i + 1}: </span> {q}
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Preparation Strategy */}
                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-white font-heading font-bold text-base mb-3 flex items-center gap-2">
                      <CheckSquare className="text-accent-green" size={18} /> Recommended Preparation Strategy
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {results.preparation_strategy}
                    </p>
                  </GlassCard>
                </motion.div>
              ) : (
                <div className="glass-panel h-full min-h-[400px] flex flex-col items-center justify-center text-white/20 p-8">
                  <Building2 size={48} className="mb-3 opacity-30" />
                  <p className="text-sm">Search for a company to build a preparation plan</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CompanyPrep;
