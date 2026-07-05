import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';
import GlowingBadge from '../components/ui/GlowingBadge';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';

const ResumeAnalyzer = () => {
  const { isAnalyzing, report, uploadAndAnalyze } = useResumeAnalysis();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = () => {
    if (file) uploadAndAnalyze(file);
  };

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Resume Intelligence</h1>
        <p className="text-white/40 mb-8">Upload your resume for deep ATS analysis and AI-driven improvements.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Zone */}
          <div>
            <div 
              className={`glass-panel p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[400px] ${dragActive ? 'border-accent-blue glow-blue' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isAnalyzing ? (
                <div className="w-full space-y-4">
                  <div className="animate-pulse text-accent-blue"><FileText size={64} className="mx-auto" /></div>
                  <p className="text-white font-heading">Analyzing with AI...</p>
                  <ShimmerLoader className="h-4 w-3/4 mx-auto" />
                  <ShimmerLoader className="h-4 w-1/2 mx-auto" />
                </div>
              ) : (
                <>
                  <Upload size={48} className="text-white/30 mb-4" />
                  <p className="text-white font-heading mb-2">{file ? file.name : "Drag & Drop your PDF here"}</p>
                  <p className="text-white/40 text-sm mb-6">or click to browse files</p>
                  <input type="file" accept=".pdf" onChange={handleChange} className="hidden" id="pdf-upload" />
                  <label htmlFor="pdf-upload" className="text-accent-blue cursor-pointer hover:underline">
                    Choose File
                  </label>
                </>
              )}
            </div>
            
            {file && !isAnalyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <GradientButton onClick={onSubmit} className="w-full">
                  Analyze Resume
                </GradientButton>
              </motion.div>
            )}
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {report ? (
              <>
                {/* ATS Score */}
                <GlassCard hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-heading text-xl">ATS Compatibility</h3>
                    <GlowingBadge 
                      text={report.ats_score >= 80 ? "Excellent" : report.ats_score >= 60 ? "Good" : "Needs Work"} 
                      color={report.ats_score >= 80 ? "green" : report.ats_score >= 60 ? "blue" : "orange"} 
                    />
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${report.ats_score >= 80 ? 'bg-accent-green' : report.ats_score >= 60 ? 'bg-accent-blue' : 'bg-accent-orange'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${report.ats_score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-right text-2xl font-mono font-bold text-white mt-2">{report.ats_score}/100</p>
                </GlassCard>

                {/* Keywords Missing */}
                <GlassCard hover={false}>
                  <h3 className="text-white font-heading mb-3 flex items-center gap-2">
                    <XCircle size={18} className="text-accent-red" /> Missing Critical Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-accent-red/10 text-accent-red border border-accent-red/30 rounded-full text-xs font-mono">{kw}</span>
                    ))}
                  </div>
                </GlassCard>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <GlassCard hover={false}>
                    <h3 className="text-accent-green font-heading text-sm mb-2 flex items-center gap-2"><CheckCircle size={16} /> Strengths</h3>
                    <ul className="space-y-1 text-sm text-white/70">
                      {report.strengths.map((s, i) => <li key={i} className="flex gap-2"><span className="text-white/30">•</span>{s}</li>)}
                    </ul>
                  </GlassCard>
                  <GlassCard hover={false}>
                    <h3 className="text-accent-orange font-heading text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Weaknesses</h3>
                    <ul className="space-y-1 text-sm text-white/70">
                      {report.weaknesses.map((w, i) => <li key={i} className="flex gap-2"><span className="text-white/30">•</span>{w}</li>)}
                    </ul>
                  </GlassCard>
                </div>
              </>
            ) : (
              <div className="glass-panel min-h-[400px] flex items-center justify-center text-white/20">
                Analysis results will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResumeAnalyzer;