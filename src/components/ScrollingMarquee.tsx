const phrases = [
  "No vendor theatre",
  "No decks",
  "No demos",
  "Just decisions",
  "Real systems, not strategy slides",
  "Mind Set \u2192 Mind Map \u2192 Mind Make",
  "No vendor theatre",
  "No decks",
  "No demos",
  "Just decisions",
  "Real systems, not strategy slides",
  "Mind Set \u2192 Mind Map \u2192 Mind Make",
];

const ScrollingMarquee = () => {
  return (
    <div className="bg-ink py-4 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent z-10" />
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: "marquee-scroll 30s linear infinite",
        }}
      >
        {phrases.map((phrase, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-medium text-mint/80 uppercase tracking-widest"
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMarquee;
