"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { RichText } from "@/components/ui/RichText";
import { home } from "@/content/site";
import { DESKTOP_MOTION, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const p = home.projects;

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const pin = el.querySelector<HTMLElement>("[data-projects-pin]");
        const track = el.querySelector<HTMLElement>("[data-track]");
        const bar = el.querySelector<HTMLElement>("[data-progress]");
        if (!pin || !track || !bar) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance(), ease: "none", duration: 1 }, 0).fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: 1 },
          0,
        );

        el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((node) => {
          gsap.fromTo(
            node,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                containerAnimation: tl,
                trigger: node,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={p.id} className="relative bg-paper-2 scroll-mt-[6rem]">
      <div
        data-projects-pin
        className="flex flex-col justify-center py-28 md:py-40 lg:h-svh lg:overflow-hidden lg:py-0"
      >
        <div
          data-track
          className="flex flex-col gap-12 px-5 md:px-10 lg:w-max lg:flex-row lg:items-center lg:gap-[3vw] lg:pr-[10vw] lg:pl-[max(3.5rem,calc(50%_-_45rem))]"
        >
          <div className="flex w-full flex-col gap-8 lg:w-[34vw] lg:shrink-0">
            <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink">
              <RichText runs={p.heading} accentClassName="text-maroon" />
            </SplitHeading>
            <p data-reveal className="max-w-[46ch] text-[1.1875rem] leading-[1.55] text-ink/80">{p.intro}</p>
            <div className="hidden flex-col gap-4 lg:flex">
              <span className="flex items-center gap-2 text-sm font-medium text-muted">
                {home.hero.scrollCue}
                <ArrowRight size={16} weight="regular" aria-hidden="true" />
              </span>
              <span className="relative block h-px w-full overflow-hidden bg-ink/14" aria-hidden="true">
                <span data-progress className="absolute inset-0 origin-left bg-maroon" />
              </span>
            </div>
          </div>

          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:contents">
            {p.items.map((item) => (
              <article
                key={item.name}
                className="group flex w-[82vw] shrink-0 snap-start flex-col gap-6 lg:w-[30vw]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                  <div data-parallax className="absolute inset-y-0 left-[-8%] w-[116%]">
                    <div className="absolute inset-0 transition-transform duration-700 ease-tino group-hover:scale-[1.04]">
                      <Photo
                        slug={item.photo}
                        sizes="(min-width: 1024px) 30vw, 82vw"
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-[2.1rem] leading-[1] font-bold tracking-[-0.028em] text-ink">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium tabular-nums text-muted">{item.year}</span>
                    <span className="bg-ink px-2.5 py-1 text-sm font-medium text-gold">{item.result}</span>
                  </div>
                  <p className="max-w-[36ch] text-[1rem] leading-[1.6] text-muted">{item.body}</p>
                </div>
              </article>
            ))}

            <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-between gap-10 lg:w-[30vw]">
              <h3 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[1] font-bold tracking-[-0.028em] text-ink">
                {p.endLine}
              </h3>
              <Magnetic>
                <Button href={p.endCta.href} label={p.endCta.label} variant="dark" />
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
