"use client";

import { gsap } from "gsap";
import { useEffect } from "react";

export function HomeAnimations() {
  useEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>(
      "[data-animate='fade-up']"
    );

    if (elements.length === 0) {
      return;
    }

    const animation = gsap.from(elements, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.08,
    });

    return () => {
      animation.kill();
    };
  }, []);

  return null;
}
