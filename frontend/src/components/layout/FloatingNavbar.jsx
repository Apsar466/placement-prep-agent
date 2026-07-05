import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Brain, Building2, Mic, Map, BarChart3, User, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume', path: '/resume', icon: FileText },
  { name: 'Skills', path: '/skills', icon: Brain },
  { name: 'Companies', path: '/companies', icon: Building2 },
  { name: 'Interview', path: '/interview', icon: Mic },
  { name: 'Roadmap', path: '/roadmap', icon: Map },
  { name: 'Insights', path: '/insights', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: User },
];

const FloatingNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      <div className="glass-nav px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-white">
          <div className="w-8 h-8 rounded-lg bg-accent-blue glow-blue flex items-center justify-center">
            <Brain size={18} />
          </div>
          <span className="hidden sm:block">Placement OS</span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-white/10 text-accent-blue glow-blue' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <link.icon size={16} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-nav mt-2 p-4 lg:hidden flex flex-col gap-2"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-white/10 text-accent-blue' : 'text-white/60 hover:text-white'}
              `}
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default FloatingNavbar;