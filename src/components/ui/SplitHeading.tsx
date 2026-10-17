"use client";

import { useRef, type ReactNode } from "react";
import { padMasks } from "@/components/ui/splitMask";
import { gsap, REDUCED_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

export function SplitHeading({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            padMasks(self);
            return gsap.from(self.lines, {
              yPercent: 105,
              duration: 1,
              ease: "tino",
              stagger: 0.07,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          },
        });
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} id={id} className={className}>
      {children}
    </h2>
  );
}
