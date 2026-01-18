"use client";

import { type Easing, motion, type Transition } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const sentenceSplitRegex = /(?<=[.!?])\s+/u;

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters" | "sentences";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Record<string, string | number>[];
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Record<string, string | number>[]
): Record<string, (string | number)[]> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);

  const keyframes: Record<string, (string | number)[]> = {};

  for (const key of keys) {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  }

  return keyframes;
};

const BlurText = (props: BlurTextProps) => {
  const text = props.text ?? "";
  const delay = props.delay ?? 200;
  const className = props.className ?? "";
  const animateBy = props.animateBy ?? "words";
  const direction = props.direction ?? "top";
  const threshold = props.threshold ?? 0.1;
  const rootMargin = props.rootMargin ?? "0px";
  const animationFrom = props.animationFrom;
  const animationTo = props.animationTo;
  const easing = props.easing ?? ((time: number) => time);
  const onAnimationComplete = props.onAnimationComplete;
  const stepDuration = props.stepDuration ?? 0.35;

  const elements = useMemo(() => {
    if (animateBy === "sentences") {
      const parts = text.split(sentenceSplitRegex);
      return parts.length > 0 ? parts : [text];
    }
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [animateBy, text]);

  const elementKeys = useMemo(
    () => elements.map((_, index) => `${animateBy}-${index}`),
    [animateBy, elements]
  );

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, index) =>
    stepCount === 1 ? 0 : index / (stepCount - 1)
  );

  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [fromSnapshot, toSnapshots]
  );

  return (
    <p className={`flex flex-wrap blur-text ${className}`} ref={ref}>
      {elements.map((segment, index) => {
        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            animate={inView ? animateKeyframes : fromSnapshot}
            initial={fromSnapshot}
            key={elementKeys[index]}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
            transition={spanTransition}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
