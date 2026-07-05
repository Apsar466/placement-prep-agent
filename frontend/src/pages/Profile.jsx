import React, { useState } from 'react';
import { User, Mail, Briefcase, Plus, X, Shield, Save } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import GlowingBadge from '../components/ui/GlowingBadge';
import toast from 'react-hot-toast';

const Profile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@university.edu");
  const [targetRole, setTargetRole] = useState("SDE-1");
  const [skills, setSkills] = useState(["Python", "JavaScript", "React", "Node.js", "Docker", "Algorithms"]);
  const [newSkill, setNewSkill] = useState("");

  const handleSave = () => {
    toast.success("Profile configurations saved successfully!");
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-2">
          <User className="text-accent-blue" /> User Profile
        </h1>
        <p className="text-white/40 mb-8">Manage your target roles, skills, and configuration parameters used by the AI placement agents.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Summary */}
          <div className="md:col-span-1 space-y-6">
            <GlassCard hover={false} className="p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center mx-auto mb-4 glow-blue">
                <User size={36} className="text-accent-blue" />
              </div>
              <h3 className="text-white font-heading font-bold text-base">{name}</h3>
              <p className="text-white/40 text-xs mt-1">{targetRole}</p>
              
              <div className="mt-4 border-t border-glass-border pt-4 text-left">
                <span className="text-[10px] text-white/40 font-bold block uppercase tracking-wider">Target Domain</span>
                <span className="text-white text-xs mt-1 block">Full-Stack Development</span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-6">
              <h4 className="text-white font-heading font-semibold text-xs mb-3 flex items-center gap-1">
                <Shield size={14} className="text-accent-green" /> Placement Readiness
              </h4>
              <p className="text-white/60 text-xs leading-relaxed mb-2">Your profile completeness and mock interview achievements qualify you for high priority referral recommendations.</p>
              <GlowingBadge text="Ready for Referrals" color="green" />
            </GlassCard>
          </div>

          {/* Right Column: Edit Profile */}
          <div className="md:col-span-2 space-y-6">
            <GlassCard hover={false} className="p-6">
              <h3 className="text-white font-heading font-bold text-sm mb-4">Profile Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs block mb-2 font-semibold flex items-center gap-1"><User size={12} /> Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-body"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-2 font-semibold flex items-center gap-1"><Mail size={12} /> Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-xs block mb-2 font-semibold flex items-center gap-1"><Briefcase size={12} /> Target Role</label>
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-blue font-body"
                  />
                </div>

                {/* Skills configuration */}
                <div>
                  <label className="text-white/60 text-xs block mb-2 font-semibold">Verified Skill Inventory</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="e.g. Kubernetes, Golang"
                      className="flex-1 bg-white/5 border border-glass-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue font-body"
                    />
                    <button 
                      onClick={handleAddSkill} 
                      className="px-3.5 bg-accent-blue/15 text-accent-blue border border-accent-blue/30 rounded-xl text-xs font-semibold hover:bg-accent-blue/25 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => (
                      <span 
                        key={index}
                        onClick={() => handleRemoveSkill(skill)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-accent-red/10 hover:text-accent-red hover:border-accent-red/20 border border-glass-border rounded-full text-xs text-white/80 transition cursor-pointer select-none"
                      >
                        {skill} <X size={12} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-glass-border/30">
                  <GradientButton onClick={handleSave} className="w-full sm:w-auto">
                    <span className="flex items-center justify-center gap-1.5">
                      <Save size={16} /> Save Settings
                    </span>
                  </GradientButton>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
