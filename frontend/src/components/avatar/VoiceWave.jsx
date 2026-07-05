import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

const VoiceWave = () => {
  const aiStatus = useStore((state) => state.aiStatus);
  const isActive = aiStatus === 'thinking' || aiStatus === 'speaking';

  return (
    <div className="flex items-end gap-1 h-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-accent-cyan rounded-full"
          animate={isActive ? {
            height: [8, 24, 8],
            opacity: [0.5, 1, 0.5]
          } : {
            height: 4,
            opacity: 0.3
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWave;