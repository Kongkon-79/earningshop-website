"use client";

import { LazyMotion, domAnimation, m, type Transition } from "motion/react";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const tags = { div: m.div, header: m.header, li: m.li };
const reveal = { opacity: [0.82, 1], y: [12, 0] };
const easing: Transition["ease"] = [0.22, 1, 0.36, 1];
const motionPreference = "(prefers-reduced-motion: reduce)";
const ReducedMotionContext = createContext(true);

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionPreference);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(motionPreference).matches;
}

export function WebsiteMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, () => true);

  return (
    <LazyMotion features={domAnimation}>
      <ReducedMotionContext.Provider value={reduceMotion}>{children}</ReducedMotionContext.Provider>
    </LazyMotion>
  );
}

export function useWebsiteReducedMotion() {
  return useContext(ReducedMotionContext);
}

export function Reveal({ as = "div", children, className, delay = 0 }: {
  as?: keyof typeof tags;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useWebsiteReducedMotion();
  const Element = tags[as];

  return (
    <Element
      className={className}
      initial={false}
      animate={reduceMotion ? { opacity: 1, y: 0, transition: { duration: 0 } } : undefined}
      whileInView={reduceMotion ? undefined : reveal}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.45, delay, ease: easing }}
    >
      {children}
    </Element>
  );
}
