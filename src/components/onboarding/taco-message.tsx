import { useEffect, useMemo, useRef, useState } from "react";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import { useT } from "@/i18n/LanguageContext";

interface TacoMessageProps {
  /** The message — supports JSX for rich content */
  message: string;
  /** Whether to animate word-by-word (false = render instantly) */
  animate?: boolean;
  /** Delay in ms between each word (default 35) */
  wordDelay?: number;
  /** Visual variant: "plain" (semibold text) */
  variant?: "plain";
  /** Called when animation completes */
  onAnimationComplete?: () => void;
  /** Optional: step id used to look up a translated message under the `taco.<stepId>` key. */
  stepId?: string;
  /** Variables for `{var}` interpolation inside the translated string. */
  vars?: Record<string, string | number>;
}

export const TacoMessage = ({
  message,
  animate = false,
  wordDelay = 35,
  variant = "plain",
  onAnimationComplete,
  stepId,
  vars,
}: TacoMessageProps) => {
  const t = useT();

  const resolvedMessage = useMemo(() => {
    if (!stepId) return message;
    return t(`taco.${stepId}`, vars, message);
  }, [t, stepId, vars, message]);

  const words = useMemo(() => {
    return resolvedMessage.split(/(\s+)/).filter(Boolean);
  }, [resolvedMessage]);

  const [visibleCount, setVisibleCount] = useState(animate ? 0 : words.length);
  const onCompleteRef = useRef(onAnimationComplete);
  onCompleteRef.current = onAnimationComplete;

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
        onCompleteRef.current?.();
      }
    }, wordDelay);

    return () => clearInterval(interval);
  }, [animate, words, wordDelay]);

  const textContent = (
    <>
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
    </>
  );

  return (
    <div className="flex items-center gap-3 mb-6">
      <img
        src={tacoAvatar}
        alt="Taco"
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <p className="text-base font-semibold text-foreground">{textContent}</p>
    </div>
  );
};
