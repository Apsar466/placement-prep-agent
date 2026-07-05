import { motion } from 'framer-motion';

const GradientButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseClasses = "relative px-8 py-3 rounded-xl font-heading font-semibold text-sm overflow-hidden transition-colors";
  const variants = {
    primary: "bg-accent-blue text-white glow-blue hover:bg-blue-600",
    outline: "border border-accent-blue text-accent-blue hover:bg-accent-blue/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;