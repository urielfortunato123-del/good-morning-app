const MysticBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cosmic to-background" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mystic-purple/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mystic-blue/5 rounded-full blur-3xl" />

      {/* Star field */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/60 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Sacred geometry overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gold" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gold" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gold" />
          <polygon points="50,20 80,70 20,70" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gold" />
          <polygon points="50,80 80,30 20,30" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gold" />
        </svg>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
    </div>
  );
};

export default MysticBackground;
