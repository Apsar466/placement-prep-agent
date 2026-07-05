import GlassCard from './GlassCard';

const MetricCard = ({ title, value, icon: Icon, color = "text-accent-blue" }) => {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/50 text-sm font-body mb-1">{title}</p>
          <p className={`text-2xl font-heading font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </GlassCard>
  );
};

export default MetricCard;