"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { TextLink } from "@/components/ui/TextLink";
import { home } from "@/content/site";
import { gsap, REDUCED_OK, SplitText, useGSAP } from "@/lib/gsap";

const j = home.joinCta;

export function JoinCta() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const h = heading.current;
      if (!el || !h) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        SplitText.create(h, {
          type: "words,chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: 1.1,
              ease: "tino",
              stagger: 0.025,
              scrollTrigger: { trigger: el, start: "top 70%", once: true },
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav-theme="dark"
      className="relative flex min-h-[90svh] items-end overflow-hidden bg-maroon text-paper"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-maroon to-maroon-deep" aria-hidden="true" />
      <Photo
        slug={j.photo}
        sizes="100vw"
        className="absolute inset-0"
        imgClassName="grayscale opacity-[0.22]"
        objectPosition="center 40%"
      />
      <div className="relative z-10 mx-auto w-full max-w-[calc(90rem_+_7rem)] px-5 pt-40 pb-20 md:px-10 md:pb-28 lg:px-14">
        <h2
          ref={heading}
          className="font-display text-[clamp(3.5rem,11vw,11.5rem)] leading-[1] font-extrabold tracking-[-0.04em] pb-[0.12em] text-paper [clip-path:inset(-0.5em_-0.5em_-0.3em_-0.5em)]"
        >
          {j.heading}
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[40ch] text-[1.1875rem] leading-[1.55] text-paper/80">{j.body}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Magnetic>
              <Button href={j.primaryCta.href} label={j.primaryCta.label} variant="light" />
            </Magnetic>
            <TextLink href={j.secondaryCta.href} label={j.secondaryCta.label} className="text-paper" />
          </div>
        </div>
      </div>
    </section>
  );
}
