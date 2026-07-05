import { useTilt } from '../../hooks/useTilt';
import GlowingBadge from '../ui/GlowingBadge';

const FloatingMetricCard = ({ title, value, badge, icon: Icon }) => {
  const { transform, handleMouseMove, handleMouseLeave } = useTilt(15);

  return (
    <div
      className="glass-panel p-6 cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-start mb-4">
        <Icon className="text-accent-blue" size={24} />
        {badge && <GlowingBadge text={badge} />}
      </div>
      <h3 className="text-white/50 text-sm font-body mb-1">{title}</h3>
      <p className="text-3xl font-heading font-bold text-white">{value}</p>
    </div>
  );
};

export default FloatingMetricCard;