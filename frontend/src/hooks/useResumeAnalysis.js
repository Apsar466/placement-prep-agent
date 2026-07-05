import { useState } from 'react';
import { analyzeResume } from '../services/api';
import toast from 'react-hot-toast';

export const useResumeAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const uploadAndAnalyze = async (file) => {
    if (!file.name.endsWith('.pdf')) {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      const data = await analyzeResume(file);
      setReport(data);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { isAnalyzing, report, uploadAndAnalyze };
};