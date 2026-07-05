import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hover = true, onClick }) => {
  return (
    <motion.div
      className={`glass-panel p-6 ${className}`}
      whileHover={hover ? { y: -5, borderColor: 'rgba(255,255,255,0.2)' } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;