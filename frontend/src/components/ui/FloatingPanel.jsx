const FloatingPanel = ({ children, className = "" }) => {
  return (
    <div className={`bg-[rgba(5,8,22,0.8)] border border-[rgba(255,255,255,0.1)] backdrop-blur-xl rounded-3xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

export default FloatingPanel;