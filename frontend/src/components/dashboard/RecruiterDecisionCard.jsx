import GlassCard from '../ui/GlassCard';
import GlowingBadge from '../ui/GlowingBadge';

const RecruiterDecisionCard = ({ decision, score, feedback }) => {
  const decisionStyles = {
    Shortlist: { color: "green", text: "SHORTLISTED", glow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]" },
    Reject: { color: "red", text: "NEEDS IMPROVEMENT", glow: "shadow-[0_0_40px_rgba(239,68,68,0.3)]" },
  };

  const style = decisionStyles[decision] || decisionStyles.Reject;

  return (
    <GlassCard className={`text-center ${style.glow}`}>
      <GlowingBadge text={style.text} color={style.color} className="text-lg px-6 py-2 mb-4" />
      <p className="text-5xl font-mono font-bold text-white my-4">{score}%</p>
      <p className="text-white/60 text-sm max-w-md mx-auto">{feedback}</p>
    </GlassCard>
  );
};

export default RecruiterDecisionCard;