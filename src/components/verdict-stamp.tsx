export function VerdictStamp({ word }: { word: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-3 -right-1 animate-stamp border-4 border-primary/80 px-4 py-0.5 font-display text-2xl text-primary/80 uppercase tracking-widest md:top-5 md:right-2 md:text-4xl lg:top-6 lg:right-5 lg:text-5xl"
    >
      {word}
    </div>
  );
}
