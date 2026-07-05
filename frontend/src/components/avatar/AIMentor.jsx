import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

const AIMentor = () => {
  const aiStatus = useStore((state) => state.aiStatus);

  return (
    <AnimatePresence mode="wait">
      {aiStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          className="glass-panel px-4 py-3 max-w-xs text-right text-sm text-white/80 font-body mb-2"
        >
          {aiStatus === 'thinking' ? 'Analyzing data...' : 'Here is my assessment...'}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIMentor;