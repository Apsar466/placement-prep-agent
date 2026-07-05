import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Calendar, Clock, Plus, X, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';
import GlowingBadge from '../components/ui/GlowingBadge';
import { generateRoadmap } from '../services/api';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const [companies, setCompanies] = useState(["Google", "Microsoft"]);
  const [companyInput, setCompanyInput] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [focusAreas, setFocusAreas] = useState(["DSA", "System Design"]);
  const [focusInput, setFocusInput] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const removeCompany = (name) => {
    setCompanies(companies.filter(c => c !== name));
  };

  const addFocus = () => {
    if (focusInput.trim() && !focusAreas.includes(focusInput.trim())) {
      setFocusAreas([...focusAreas, focusInput.trim()]);
      setFocusInput("");
    }
  };

  const removeFocus = (name) => {
    setFocusAreas(focusAreas.filter(f => f !== name));
  };

  const handleGenerate = async () => {
    if (companies.length === 0) {
      return toast.error("Please add at least one target company.");
    }
    
    setIsLoading(true);
    setResults(null);
    try {
      const data = await generateRoadmap(companies, hoursPerDay, focusAreas);
      setResults(data);
      toast.success("Roadmap generated!");
    } catch (error) {
      toast.error(error.message || "Failed to generate roadmap.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Placement Strategy</h1>
        <p className="text-white/40 mb-8">Generate a custom 30-day timeline outlining daily tasks based on target companies and study schedule.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Form */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard hover={false} className="p-6">
              <h2 className="text-white font-heading font-bold text-sm mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-accent-blue" /> Planning Variables
              </h2>
              
              <div className="space-y-4">
                {/* Companies tag lists */}
                <div>
                  <label className="text-white/60 text-xs block mb-2 font-semibold">TARGET COMPANIES</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCompany()}
                      placeholder="Add e.g. Amazon"
                      className="flex-1 bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
                    />
                    <button onClick={addCompany} className="text-accent-blue hover:bg-white/5 p-1 rounded-lg"><Plus size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {companies.map((c, i) => (
                      <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/30 rounded-full text-[10px] font-semibold cursor-pointer" onClick={() => removeCompany(c)}>
                        {c} <X size={10} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Focus Areas tag lists */}
                <div>
                  <label className="text-white/60 text-xs block mb-2 font-semibold">FOCUS AREAS</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={focusInput}
                      onChange={(e) => setFocusInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addFocus()}
                      placeholder="Add e.g. Graphs, OOP"
                      className="flex-1 bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
                    />
                    <button onClick={addFocus} className="text-accent-blue hover:bg-white/5 p-1 rounded-lg"><Plus size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {focusAreas.map((f, i) => (
                      <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-accent-purple/10 text-accent-purple border border-accent-purple/30 rounded-full text-[10px] font-semibold cursor-pointer" onClick={() => removeFocus(f)}>
                        {f} <X size={10} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hours Range Slider */}
                <div>
                  <div className="flex justify-between text-white/60 text-xs mb-2 font-semibold">
                    <span>HOURS / DAY STUDYING</span>
                    <span className="text-accent-cyan font-bold">{hoursPerDay} hrs</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                    className="w-full accent-accent-cyan cursor-pointer"
                  />
                </div>

                <GradientButton 
                  onClick={handleGenerate} 
                  className="w-full py-3.5 mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={16} /> Coding Roadmap...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={16} /> Generate Roadmap
                    </span>
                  )}
                </GradientButton>
              </div>
            </GlassCard>
          </div>

          {/* Results Timeline Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loader" className="space-y-4">
                  <ShimmerLoader className="h-32 w-full" />
                  <ShimmerLoader className="h-60 w-full" />
                </motion.div>
              ) : results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Plan Overview */}
                  <GlassCard hover={false} className="p-6 border-accent-blue/20">
                    <h2 className="text-xl font-heading font-bold text-white mb-2 flex items-center gap-2">
                      <Map className="text-accent-blue" size={20} /> {results.plan_title}
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed mt-2">
                      {results.overall_strategy}
                    </p>
                  </GlassCard>

                  {/* Weekly Timeline Breakdown */}
                  <div className="space-y-4">
                    {results.weeks.map((week) => (
                      <GlassCard 
                        hover={false} 
                        key={week.week_number} 
                        className={`p-6 transition-all duration-300 border ${expandedWeek === week.week_number ? 'border-accent-cyan/30' : 'border-glass-border'}`}
                      >
                        <div 
                          className="flex justify-between items-center cursor-pointer select-none"
                          onClick={() => setExpandedWeek(expandedWeek === week.week_number ? null : week.week_number)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan font-bold font-mono">
                              W{week.week_number}
                            </div>
                            <div>
                              <h3 className="text-white font-heading font-bold text-sm">Week {week.week_number}</h3>
                              <p className="text-white/40 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">{week.focus}</p>
                            </div>
                          </div>
                          <button className="text-white/50">
                            {expandedWeek === week.week_number ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>

                        <AnimatePresence>
                          {expandedWeek === week.week_number && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-glass-border/40 mt-4 pt-4 space-y-2">
                                {week.daily_tasks.map((task, idx) => (
                                  <div key={idx} className="p-3 bg-white/5 border border-glass-border/40 rounded-xl flex gap-3 text-xs text-white/80 leading-relaxed font-body">
                                    <Clock size={14} className="text-accent-cyan mt-0.5 shrink-0" />
                                    <span>{task}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="glass-panel h-full min-h-[400px] flex flex-col items-center justify-center text-white/20 p-8">
                  <Map size={48} className="mb-3 opacity-30" />
                  <p className="text-sm">Configure target variables to compute your 30-day study plan</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Roadmap;
