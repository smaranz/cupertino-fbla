"use client";

import { useRef, type ReactNode } from "react";
import { gsap, REDUCED_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Fades up every [data-reveal] element inside, once, as it enters the viewport.
export function RevealRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
        if (targets.length === 0) return;
        ScrollTrigger.batch(targets, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.9, ease: "tino", stagger: 0.08, overwrite: true },
            ),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
