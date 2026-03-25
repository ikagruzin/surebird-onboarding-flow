import { useState, useEffect, useMemo } from "react";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface TacoMessageProps {
  /** The message content — can include line breaks via \n */
  message: string;
  /** Whether to animate word-by-word (false = render instantly) */
  animate?: boolean;
  /** Delay in ms between each word (default 50) */
  wordDelay?: number;
  /** Called when animation completes */
  onAnimationComplete?: () => void;
}

const TacoMessage = ({
  message,
  animate = false,
  wordDelay = 50,
  onAnimationComplete,
}: TacoMessageProps) => {
  const words = useMemo(() => {
    // Split by spaces but preserve line breaks as separate tokens
    return message.split(/(\s+)/).filter(Boolean);
  }, [message]);

  const [visibleCount, setVisibleCount] = useState(animate ? 0 : words.length);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(words.length);
      return;
    }

    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= words.length) {
        clearInterval(interval);
        onAnimationComplete?.();
      }
    }, wordDelay);

    return () => clearInterval(interval);
  }, [animate, words, wordDelay, onAnimationComplete]);

  return (
    <div className="flex items-start gap-3 mb-6">
      <img
        src={tacoAvatar}
        alt="Taco"
        className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
      />
      <p className="text-base font-semibold text-foreground">
        {words.map((word, index) => {
          if (index >= visibleCount) return null;
          const isNewlyRevealed = animate && index >= visibleCount - 1;
          return (
            <span
              key={index}
              className={isNewlyRevealed ? "animate-fade-in-word" : ""}
              style={isNewlyRevealed ? { animationDuration: "0.2s" } : undefined}
            >
              {word}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default TacoMessage;
