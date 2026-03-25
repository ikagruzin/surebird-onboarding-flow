import { useState, useEffect } from "react";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface TacoMessageProps {
  message: string;
  animate?: boolean;
  /** Delay in ms between each character (default 20) */
  charDelay?: number;
  variant?: "plain" | "bubble";
  onAnimationComplete?: () => void;
}

const TacoMessage = ({
  message,
  animate = false,
  charDelay = 20,
  variant = "plain",
  onAnimationComplete,
}: TacoMessageProps) => {
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : message.length);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(message.length);
      return;
    }

    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= message.length) {
        clearInterval(interval);
        onAnimationComplete?.();
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [animate, message, charDelay, onAnimationComplete]);

  const visibleText = message.slice(0, visibleCount);
  const hasCursor = animate && visibleCount < message.length;

  const textContent = (
    <>
      {visibleText}
      {hasCursor && <span className="inline-block w-[2px] h-[1em] bg-foreground/60 align-text-bottom animate-pulse ml-px" />}
    </>
  );

  if (variant === "bubble") {
    return (
      <div className="flex items-center gap-3">
        <img
          src={tacoAvatar}
          alt="Taco"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">{textContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6">
      <img
        src={tacoAvatar}
        alt="Taco"
        className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
      />
      <p className="text-base font-semibold text-foreground">{textContent}</p>
    </div>
  );
};

export default TacoMessage;
