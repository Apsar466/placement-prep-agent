import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

const AIOrb = () => {
  const aiStatus = useStore((state) => state.aiStatus);

  // Dynamic colors based on AI state
  const getColor = () => {
    switch(aiStatus) {
      case 'thinking': return 'bg-accent-purple shadow-[0_0_40px_rgba(124,58,237,0.6)]';
      case 'speaking': return 'bg-accent-cyan shadow-[0_0_40px_rgba(6,182,212,0.6)]';
      default: return 'bg-accent-blue shadow-[0_0_30px_rgba(59,130,246,0.4)]';
    }
  };

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-3"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    >
      {/* Mentor Text Bubble */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="glass-panel px-4 py-2 max-w-xs text-right text-sm text-white/80 font-body hidden md:block"
      >
        Welcome back. How can I assist your preparation today?
      </motion.div>

      {/* The Orb */}
      <motion.div 
        className={`w-16 h-16 rounded-full ${getColor()} cursor-pointer flex items-center justify-center`}
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
      </motion.div>
    </motion.div>
  );
};

export default AIOrb;