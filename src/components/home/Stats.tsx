"use client";

import { useRef } from "react";
import { home } from "@/content/site";
import { countUp } from "@/components/ui/countUp";
import { gsap, REDUCED_OK, useGSAP } from "@/lib/gsap";

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const counters = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
        counters.forEach((node) => countUp(node, node, "top 70%"));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-paper pb-28 md:pb-40">
      <ul className="mx-auto grid max-w-[calc(90rem_+_7rem)] grid-cols-2 gap-y-12 px-5 md:px-10 lg:grid-cols-4 lg:px-14">
        {home.stats.map((stat, i) => (
          <li
            key={stat.label}
            className={
              "border-t border-ink/12 pt-8 pr-6 lg:border-t-0 lg:border-l lg:pt-0 lg:px-8 " +
              (i % 2 === 0 ? "" : "pl-6 md:pl-6 ") +
              (i === 0 ? "lg:pl-0 lg:border-l-0 " : "")
            }
          >
            <p className="flex items-baseline numeral text-[clamp(3.75rem,6.5vw,6.5rem)] leading-none text-ink">
              <span data-count={stat.value}>{stat.value}</span>
              {stat.suffix ? <span className="text-maroon">{stat.suffix}</span> : null}
            </p>
            <p className="mt-4 max-w-[24ch] text-[0.95rem] leading-[1.5] text-muted">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
