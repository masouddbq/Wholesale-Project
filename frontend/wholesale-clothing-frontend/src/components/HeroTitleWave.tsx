"use client";

type HeroTitleWaveProps = {
  title: string;
  className: string;
};

export default function HeroTitleWave({ title, className }: HeroTitleWaveProps) {
  const letters = Array.from(title || "");
  const letterCount = letters.filter((char) => char.trim() !== "").length;
  const stagger = letterCount > 1 ? 1.6 / (letterCount - 1) : 0;

  let waveIndex = 0;

  return (
    <h1
      dir="auto"
      className={`${className} hero-title-wave`}
      aria-label={title}
    >
      {letters.map((char, index) => {
        if (char.trim() === "") {
          return (
            <span key={`space-${index}`} className="hero-title-wave-space">
              {"\u00a0"}
            </span>
          );
        }

        const i = waveIndex;
        waveIndex += 1;

        return (
          <span
            key={`${char}-${index}`}
            className="hero-title-wave-letter"
            style={{ animationDelay: `${i * stagger}s` }}
            aria-hidden="true"
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
}
