import GlassCard from '../ui/GlassCard';
import { Sparkles } from 'lucide-react';

const InsightCard = ({ title, content }) => {
  return (
    <GlassCard hover={false} className="relative overflow-hidden">
      <div className="absolute top-3 right-3 text-accent-purple">
        <Sparkles size={16} />
      </div>
      <h4 className="text-white font-heading font-semibold mb-2 pr-6">{title}</h4>
      <p className="text-white/60 text-sm leading-relaxed">{content}</p>
    </GlassCard>
  );
};

export default InsightCard;