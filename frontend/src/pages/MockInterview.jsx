import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Send, Sparkles, ChevronRight, HelpCircle, Award, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';
import GlowingBadge from '../components/ui/GlowingBadge';
import { startInterview, evaluateInterview } from '../services/api';
import toast from 'react-hot-toast';

const MockInterview = () => {
  // Config state
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('SDE-1');
  const [interviewType, setInterviewType] = useState('TECHNICAL_DSA');
  
  // Session state
  const [isStarting, setIsStarting] = useState(false);
  const [session, setSession] = useState(null); // { session_id, question, difficulty, hints }
  const [history, setHistory] = useState([]);
  
  // Q&A state
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  // Finish state
  const [finalReport, setFinalReport] = useState(null);

  const handleStart = async () => {
    if (!company.trim() || !role.trim()) {
      return toast.error("Please fill in company name and target role.");
    }
    
    setIsStarting(true);
    setFinalReport(null);
    setHistory([]);
    try {
      const data = await startInterview(company, role, interviewType);
      setSession(data);
      toast.success("Interview session started!");
    } catch (error) {
      toast.error(error.message || "Failed to start interview.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendAnswer = async (finishNow = false) => {
    if (!answerInput.trim() && !finishNow) {
      return toast.error("Please type your answer before submitting.");
    }

    setIsSubmitting(true);
    try {
      const data = await evaluateInterview(session.session_id, answerInput, finishNow);
      
      // Update history list with previous Q&A
      const prevQ = session.question;
      const prevAns = answerInput;
      setHistory(prev => [...prev, { question: prevQ, answer: prevAns }]);
      
      if (data.is_finished) {
        setFinalReport(data.final_report);
        setSession(null);
        toast.success("Interview completed! Generating report...");
      } else {
        setSession(data);
        setAnswerInput('');
        setShowHints(false);
        toast.success("Answer received. Moving to next question.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Interview Intelligence</h1>
        <p className="text-white/40 mb-8">Participate in immersive, adaptive technical mock interviews tailored to top tech companies.</p>

        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="wait">
            
            {/* Phase 1: Configure & Start */}
            {!session && !finalReport && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard hover={false} className="max-w-xl mx-auto p-8">
                  <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="text-accent-blue" /> Set Up Interview Session
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-white/60 text-sm block mb-2">Target Company</label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Google, Amazon"
                        className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/60 text-sm block mb-2">Target Role</label>
                      <input 
                        type="text" 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. SDE-1, Frontend Engineer"
                        className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                      />
                    </div>

                    <div>
                      <label className="text-white/60 text-sm block mb-2">Interview Focus Type</label>
                      <select 
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value)}
                        className="w-full bg-[#12162b] border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                      >
                        <option value="TECHNICAL_DSA">Technical DSA & Problem Solving</option>
                        <option value="SYSTEM_DESIGN">System Design & Architecture</option>
                        <option value="CS_FUNDAMENTALS">Computer Science Fundamentals (OS, DBMS, Networks)</option>
                        <option value="BEHAVIORAL">Behavioral & Leadership Round</option>
                      </select>
                    </div>

                    <GradientButton 
                      onClick={handleStart} 
                      className="w-full py-4 mt-4" 
                      disabled={isStarting}
                    >
                      {isStarting ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="animate-spin" size={18} /> Preparing Interview...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Play size={18} /> Begin Mock Interview
                        </span>
                      )}
                    </GradientButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Phase 2: Active Session Q&A */}
            {session && !finalReport && (
              <motion.div
                key="session"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left: Active Question and Interface */}
                <div className="lg:col-span-2 space-y-6">
                  <GlassCard hover={false} className="p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <GlowingBadge text={`Question ${history.length + 1}`} color="blue" />
                        <GlowingBadge text={session.difficulty} color={session.difficulty === 'HARD' ? 'red' : session.difficulty === 'MEDIUM' ? 'orange' : 'green'} />
                      </div>
                      <p className="text-white/40 text-xs">Session ID: {session.session_id.substring(0, 8)}...</p>
                    </div>

                    <h3 className="text-white font-heading text-lg leading-relaxed mb-6 font-semibold">
                      {session.question}
                    </h3>

                    {/* Hints Drawer */}
                    {session.hints && session.hints.length > 0 && (
                      <div className="mb-6">
                        <button 
                          onClick={() => setShowHints(!showHints)}
                          className="text-accent-blue/80 hover:text-accent-blue text-xs font-semibold flex items-center gap-1 focus:outline-none"
                        >
                          <HelpCircle size={14} /> {showHints ? "Hide hints" : "Reveal hints"}
                        </button>
                        <AnimatePresence>
                          {showHints && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 p-4 bg-white/5 border border-glass-border rounded-xl space-y-2">
                                {session.hints.map((hint, idx) => (
                                  <p key={idx} className="text-white/60 text-xs leading-relaxed">
                                    <span className="text-accent-cyan font-semibold">Hint {idx + 1}:</span> {hint}
                                  </p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Answer Area */}
                    <div className="space-y-4">
                      <label className="text-white/60 text-xs block font-semibold">YOUR RESPONSE</label>
                      <textarea
                        rows={6}
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        placeholder="Write your explanation or code implementation here. Be detailed to score higher."
                        className="w-full bg-white/5 border border-glass-border rounded-xl p-4 text-white focus:outline-none focus:border-accent-blue text-sm font-mono leading-relaxed"
                      />
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <GradientButton 
                          onClick={() => handleSendAnswer(false)} 
                          className="flex-1" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Evaluating..." : (
                            <span className="flex items-center justify-center gap-1">
                              Submit Answer <ChevronRight size={16} />
                            </span>
                          )}
                        </GradientButton>
                        <button 
                          onClick={() => handleSendAnswer(true)} 
                          className="px-6 py-3 bg-accent-red/20 text-accent-red hover:bg-accent-red/35 border border-accent-red/30 rounded-xl text-sm font-semibold transition"
                          disabled={isSubmitting}
                        >
                          Finish & Generate Report
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Right: Progress Tracker */}
                <div className="lg:col-span-1 space-y-6">
                  <GlassCard hover={false} className="p-6">
                    <h4 className="text-white font-heading font-semibold mb-4">Interview Progress</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Status</span>
                        <span className="text-accent-blue font-semibold">Active Session</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Company</span>
                        <span className="text-white font-medium">{company}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Role</span>
                        <span className="text-white font-medium">{role}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mt-2">
                        <div 
                          className="bg-accent-blue h-full rounded-full transition-all duration-300"
                          style={{ width: `${(history.length / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-right text-xs text-white/40 mt-1">{history.length}/5 Questions Completed</p>
                    </div>
                  </GlassCard>

                  {history.length > 0 && (
                    <GlassCard hover={false} className="p-6">
                      <h4 className="text-white font-heading font-semibold mb-3">Completed Questions</h4>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {history.map((h, i) => (
                          <div key={i} className="p-3 bg-white/5 rounded-xl border border-glass-border flex gap-2 items-start">
                            <CheckCircle2 size={16} className="text-accent-green mt-0.5 shrink-0" />
                            <div>
                              <p className="text-white text-xs font-semibold">Question {i + 1}</p>
                              <p className="text-white/40 text-[10px] line-clamp-1 mt-0.5">{h.question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}
                </div>
              </motion.div>
            )}

            {/* Phase 3: Final Performance Report */}
            {finalReport && (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <GlassCard hover={false} className="p-8 border-accent-blue/30 glow-blue text-center">
                  <Award size={48} className="text-accent-cyan mx-auto mb-3" />
                  <h2 className="text-2xl font-heading font-bold text-white mb-2">Performance Report</h2>
                  <p className="text-white/40 text-sm">Feedback and analysis generated by Career Intelligence Agent.</p>
                  
                  <div className="flex flex-col items-center justify-center my-6">
                    <div className="w-28 h-28 rounded-full border-4 border-dashed border-accent-cyan flex items-center justify-center mb-2">
                      <span className="text-3xl font-mono font-bold text-white">{finalReport.overall_score}%</span>
                    </div>
                    <GlowingBadge text={finalReport.verdict} color={finalReport.verdict === 'Highly Recommended' ? 'green' : finalReport.verdict === 'Recommended' ? 'blue' : 'orange'} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left border-t border-glass-border pt-6 mt-6">
                    <div>
                      <h4 className="text-accent-cyan text-sm font-semibold mb-2">Technical Feedback</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{finalReport.technical_feedback}</p>
                    </div>
                    <div>
                      <h4 className="text-accent-cyan text-sm font-semibold mb-2">Communication Feedback</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{finalReport.communication_feedback}</p>
                    </div>
                  </div>
                </GlassCard>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-accent-green font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                      <CheckCircle2 size={16} /> Strengths Demonstrated
                    </h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      {finalReport.strengths && finalReport.strengths.map((str, i) => (
                        <li key={i} className="flex gap-2"><span className="text-white/30">•</span>{str}</li>
                      ))}
                    </ul>
                  </GlassCard>

                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-accent-orange font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} /> Areas of Improvement
                    </h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      {finalReport.weaknesses && finalReport.weaknesses.map((weak, i) => (
                        <li key={i} className="flex gap-2"><span className="text-white/30">•</span>{weak}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>

                {/* Actionable Tips */}
                {finalReport.actionable_tips && finalReport.actionable_tips.length > 0 && (
                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-accent-cyan font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                      <AlertCircle size={16} /> Recommended Action Steps
                    </h3>
                    <div className="space-y-2">
                      {finalReport.actionable_tips.map((tip, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-glass-border text-sm text-white/80 leading-relaxed">
                          <span className="font-semibold text-accent-cyan font-mono">{idx + 1}. </span>{tip}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                <div className="text-center pt-4">
                  <GradientButton onClick={() => setFinalReport(null)}>
                    Practice Again
                  </GradientButton>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default MockInterview;
