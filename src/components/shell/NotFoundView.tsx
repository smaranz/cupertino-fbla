"use client";

import { useRef } from "react";
import { LogoTie } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { notFound } from "@/content/site";
import { gsap, REDUCED_OK, useGSAP } from "@/lib/gsap";

export function NotFoundView() {
  const tie = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = tie.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        gsap.fromTo(
          el,
          { rotation: -6 },
          { rotation: 6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" },
        );
      });
      return () => mm.revert();
    },
    { scope: tie },
  );

  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center gap-10 px-5 pt-40 pb-24 text-center md:px-10 lg:px-14">
      <div ref={tie} className="h-16 w-auto">
        <LogoTie className="h-full w-auto" />
      </div>
      <div className="flex w-full max-w-[60rem] flex-col items-center gap-6">
        <h1 className="font-display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1] font-bold tracking-[-0.03em] text-ink">
          {notFound.heading}
        </h1>
        <p className="max-w-[34ch] text-[1.0625rem] leading-[1.65] text-muted">{notFound.body}</p>
      </div>
      <Button href={notFound.cta.href} label={notFound.cta.label} variant="dark" />
    </section>
  );
}
