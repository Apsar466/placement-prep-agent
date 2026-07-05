const GlowingBadge = ({ text, color = "blue" }) => {
  const colors = {
    blue: "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
    green: "bg-accent-green/20 text-accent-green border-accent-green/30",
    red: "bg-accent-red/20 text-accent-red border-accent-red/30",
    purple: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
  };

  return (
    <span className={`px-3 py-1 text-xs font-mono rounded-full border ${colors[color]}`}>
      {text}
    </span>
  );
};

export default GlowingBadge;