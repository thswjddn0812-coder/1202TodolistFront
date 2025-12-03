interface StarryBackgroundProps {
  isDarkMode: boolean;
}

export default function StarryBackground({ isDarkMode }: StarryBackgroundProps) {
  if (!isDarkMode) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-40 w-2 h-2 bg-cyan-400 rounded-full opacity-50 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse delay-150"></div>
    </div>
  );
}
