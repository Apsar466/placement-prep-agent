import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import GlowingBadge from '../components/ui/GlowingBadge';
import ShimmerLoader from '../components/ui/ShimmerLoader';
import { analyzeSkills } from '../services/api';
import toast from 'react-hot-toast';

const SkillGapAnalyzer = () => {
  const [targetRole, setTargetRole] = useState("SDE-1");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(["Python", "JavaScript", "Basic SQL"]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAnalyze = async () => {
    if (skills.length < 2) return toast.error("Add at least 2 skills");
    setIsLoading(true);
    try {
      const data = await analyzeSkills({ target_role: targetRole, current_skills: skills });
      setResults(data);
      toast.success("Skill gap analyzed!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Career Intelligence</h1>
        <p className="text-white/40 mb-8">Identify skill gaps and generate a personalized learning path.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard hover={false}>
              <label className="text-white/60 text-sm block mb-2">Target Role</label>
              <input 
                type="text" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
              />
            </GlassCard>

            <GlassCard hover={false}>
              <label className="text-white/60 text-sm block mb-2">Current Skills</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="e.g., React"
                  className="flex-1 bg-white/5 border border-glass-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                />
                <button onClick={addSkill} className="text-accent-blue hover:bg-white/5 p-2 rounded-lg"><Plus size={20} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <motion.span 
                    key={i} 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1 px-3 py-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/30 rounded-full text-xs cursor-pointer"
                    onClick={() => removeSkill(s)}
                  >
                    {s} <X size={12} />
                  </motion.span>
                ))}
              </div>
            </GlassCard>

            <GradientButton onClick={handleAnalyze} className="w-full" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Gap"}
            </GradientButton>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-4">
                <ShimmerLoader className="h-40 w-full" />
                <ShimmerLoader className="h-60 w-full" />
              </div>
            ) : results ? (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Gap Analysis */}
                  <GlassCard hover={false}>
                    <h3 className="text-white font-heading mb-4 flex items-center gap-2">
                      <Target size={20} className="text-accent-purple" /> Identified Gaps
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.skill_gap_analysis.map((item, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                          <span className="text-white text-sm">{item.skill}</span>
                          <GlowingBadge text={item.priority} color={item.priority === 'high' ? 'red' : 'orange'} />
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Roadmap */}
                  <GlassCard hover={false}>
                    <h3 className="text-white font-heading mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-accent-cyan" /> AI Learning Roadmap
                    </h3>
                    <ol className="space-y-3">
                      {results.learning_roadmap.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white/70">
                          <span className="text-accent-blue font-mono font-bold">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="glass-panel h-full min-h-[400px] flex items-center justify-center text-white/20">
                Career roadmap will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SkillGapAnalyzer;