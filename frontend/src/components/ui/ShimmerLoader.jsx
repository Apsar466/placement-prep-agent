const ShimmerLoader = ({ className = "h-4 w-full" }) => {
  return (
    <div className={`shimmer-bg rounded-lg ${className}`}></div>
  );
};

export default ShimmerLoader;