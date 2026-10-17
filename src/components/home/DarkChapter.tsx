"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { countUp } from "@/components/ui/countUp";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { home } from "@/content/site";
import { conferenceById, nationalPlacements, ordinal, placements } from "@/content/results";
import { DESKTOP_MOTION, gsap, REDUCED_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export function DarkChapter() {
  return (
    <div data-nav-theme="dark" className="bg-ink text-paper">
      <Season />
      <Scoreboard />
    </div>
  );
}

const COLLAPSED = "inset(50% 50% 50% 50% round 2rem)";
const OPEN = "inset(0% 0% 0% 0% round 2rem)";

// Desktop: the section pins and plays the four seasons as a zooming photo sequence.
// Mobile and reduced motion: a plain list of seasons, each with its own photo.
function Season() {
  const root = useRef<HTMLElement>(null);
  const s = home.season;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const pin = el.querySelector<HTMLElement>("[data-season-pin]");
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
      const texts = q("[data-stop-text]");
      const words = q("[data-season-word]");
      const details = q("[data-season-details]");
      const slides = q("[data-stage-slide]");
      const imgs = q("[data-stage-img]");
      const shades = q("[data-stage-shade]");
      const fills = q("[data-rail-fill]");
      const labels = q("[data-rail-label]");
      const n = slides.length;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        if (!pin || n === 0) return;
        gsap.set([...texts, ...slides], { opacity: 1 });
        gsap.set(slides.slice(1), { clipPath: COLLAPSED });
        gsap.set(slides[0], { clipPath: OPEN });
        gsap.set(imgs[0], { scale: 1.14 });
        gsap.set(imgs.slice(1), { scale: 1.45 });
        gsap.set(words.slice(1), { yPercent: 110 });
        gsap.set(details.slice(1), { opacity: 0, y: 24 });
        gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(labels.slice(1), { opacity: 0.45 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${window.innerHeight * n * 0.9}`,
            pin,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 0; i < n; i++) {
          // Hold on each season while its photo slowly zooms out and its rail segment fills.
          tl.to(imgs[i], { scale: 1, duration: 0.62 }, i).to(fills[i], { scaleX: 1, duration: 1 }, i);
          if (i === n - 1) break;
          const t = i + 0.62;
          tl.to(imgs[i], { scale: 1.22, duration: 0.38 }, t)
            .to(shades[i], { opacity: 0.65, duration: 0.38 }, t)
            .fromTo(slides[i + 1], { clipPath: COLLAPSED }, { clipPath: OPEN, duration: 0.38, ease: "power2.inOut" }, t)
            .to(imgs[i + 1], { scale: 1.14, duration: 0.38, ease: "power2.out" }, t)
            .to(words[i], { yPercent: -110, duration: 0.22, ease: "power2.in" }, t)
            .to(details[i], { opacity: 0, y: -16, duration: 0.18 }, t)
            .to(labels[i], { opacity: 0.45, duration: 0.2 }, t)
            .to(words[i + 1], { yPercent: 0, duration: 0.26, ease: "power3.out" }, t + 0.14)
            .to(details[i + 1], { opacity: 1, y: 0, duration: 0.22 }, t + 0.2)
            .to(labels[i + 1], { opacity: 1, duration: 0.2 }, t + 0.14);
        }
      });

      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
        slides.forEach((slide, i) => {
          gsap.fromTo(
            slide,
            { clipPath: "inset(10% 10% 10% 10% round 1.5rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
              ease: "none",
              scrollTrigger: { trigger: slide, start: "top bottom", end: "top 35%", scrub: true },
            },
          );
          gsap.fromTo(
            imgs[i],
            { scale: 1.35 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: slide, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
        texts.forEach((text, i) => {
          const trigger = { trigger: text, start: "top 85%", once: true };
          gsap.fromTo(words[i], { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "tino", scrollTrigger: trigger });
          gsap.fromTo(details[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "tino", delay: 0.15, scrollTrigger: trigger });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="season-title" className="relative">
      <div
        data-season-pin
        className="px-5 py-28 md:px-10 md:py-40 lg:px-14 motion-safe:lg:flex motion-safe:lg:h-svh motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:py-0"
      >
        <div className="mx-auto w-full max-w-[90rem]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <SplitHeading
              id="season-title"
              className="max-w-[18ch] font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em]"
            >
              <RichText runs={s.heading} accentClassName="text-gold" />
            </SplitHeading>
            <ol aria-hidden="true" className="hidden w-[min(34rem,46%)] grid-cols-4 gap-3 motion-safe:lg:grid">
              {s.stops.map((stop) => (
                <li key={stop.when} className="flex flex-col gap-3">
                  <span data-rail-label className="text-sm font-medium text-paper">
                    {stop.when}
                  </span>
                  <span className="relative block h-0.5 overflow-hidden rounded-full bg-paper/15">
                    <span data-rail-fill className="absolute inset-0 block bg-gold" />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 grid gap-20 motion-safe:lg:mt-[clamp(2.5rem,6svh,4rem)] motion-safe:lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] motion-safe:lg:gap-x-[clamp(2rem,4vw,5rem)] motion-safe:lg:gap-y-0">
            {s.stops.map((stop, i) => (
              <div
                key={stop.title}
                className="grid gap-8 motion-reduce:lg:grid-cols-12 motion-reduce:lg:items-center motion-reduce:lg:gap-8 motion-safe:lg:contents"
              >
                <div
                  data-stop-text
                  data-first={i === 0 ? "" : undefined}
                  className="motion-reduce:lg:col-span-5 motion-safe:lg:col-start-1 motion-safe:lg:row-start-1 motion-safe:lg:self-center"
                >
                  <div className="overflow-hidden pb-[0.16em] -mb-[0.16em]">
                    <h3
                      data-season-word
                      className="font-display text-[clamp(4rem,8.6vw,9rem)] leading-[0.95] font-bold tracking-[-0.045em] text-paper"
                    >
                      {stop.when}
                    </h3>
                  </div>
                  <div data-season-details className="mt-6 md:mt-8">
                    <p className="text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.01em] text-paper">{stop.title}</p>
                    <p className="mt-3 max-w-[36ch] text-[1.0625rem] leading-[1.6] text-muted-dark">{stop.body}</p>
                  </div>
                </div>

                <div
                  data-stage-slide
                  data-first={i === 0 ? "" : undefined}
                  className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink-2 md:rounded-[2rem] motion-reduce:lg:col-span-7 motion-safe:lg:col-start-2 motion-safe:lg:row-start-1 motion-safe:lg:aspect-auto motion-safe:lg:h-[min(58svh,36rem)]"
                >
                  <div data-stage-img className="absolute inset-0 will-change-transform">
                    <Photo
                      slug={stop.photo}
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      objectPosition={stop.photo === "candid-focus" ? "center 35%" : "center"}
                      className="absolute inset-0"
                    />
                  </div>
                  <div data-stage-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Scoreboard() {
  const root = useRef<HTMLElement>(null);
  const sb = home.scoreboard;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        el.querySelectorAll<HTMLElement>("[data-tally]").forEach((node) => countUp(node, node, "top 85%"));

        el.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
          const hairline = row.querySelector<HTMLElement>("[data-hairline]");
          const content = row.querySelector<HTMLElement>("[data-row-content]");
          const trigger = { trigger: row, start: "top 88%", once: true };
          if (hairline) gsap.fromTo(hairline, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "tino", scrollTrigger: trigger });
          if (content)
            gsap.fromTo(content, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "tino", delay: 0.1, scrollTrigger: trigger });
        });
      });
      mm.add(DESKTOP_MOTION, () => {
        const frame = el.querySelector<HTMLElement>("[data-sb-clip]");
        const img = el.querySelector<HTMLElement>("[data-sb-img]");
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "tino", scrollTrigger: { trigger: frame, start: "top 80%", once: true } },
          );
        }
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.15 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-5 pb-28 md:px-10 md:pb-40 lg:px-14">
      <div className="mx-auto grid max-w-[90rem] gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-8 lg:sticky lg:top-[7.5rem] lg:col-span-5 lg:self-start">
          <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em]">
            <RichText runs={sb.heading} accentClassName="text-gold" />
          </SplitHeading>
          <p data-reveal className="max-w-[44ch] text-[1.1875rem] leading-[1.55] text-muted-dark">
            {sb.intro}
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {sb.tallies.map((tally) => {
              const count = placements.filter((p) => tally.conferenceIds.includes(p.conferenceId)).length;
              return (
                <div key={tally.label} className="border-t border-paper/14 pt-6">
                  <p className="numeral text-[4rem] leading-none text-paper">
                    <span data-tally={count}>{count}</span>
                  </p>
                  <p className="mt-3 text-[0.95rem] text-muted-dark">{tally.label}</p>
                </div>
              );
            })}
          </div>
          <Magnetic>
            <Button href={sb.cta.href} label={sb.cta.label} variant="light" className="w-fit" />
          </Magnetic>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
          <div data-sb-clip className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <div data-sb-img className="absolute inset-0">
              <Photo slug={sb.photo} sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" />
            </div>
          </div>
          <h3 className="font-display text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.01em] text-paper">
            {sb.nationalLabel}
          </h3>
          <ol className="flex flex-col">
            {nationalPlacements.map((placement, i) => {
              const conference = conferenceById(placement.conferenceId);
              const first = placement.place === 1;
              return (
                <li key={`${placement.conferenceId}-${placement.event}-${i}`} data-row className="relative py-6">
                  <span data-hairline className="absolute inset-x-0 top-0 block h-px origin-left bg-paper/14" />
                  <div data-row-content className="grid grid-cols-[4.75rem_1fr_auto] items-start gap-4 md:grid-cols-[6rem_1fr_auto]">
                    <span
                      className={cn(
                        "numeral text-[2.6rem] leading-none md:text-[3.25rem]",
                        first ? "text-gold" : "text-paper",
                      )}
                    >
                      {ordinal(placement.place)}
                    </span>
                    <div>
                      <p className="text-[1.15rem] leading-[1.3] font-semibold text-paper">{placement.event}</p>
                      <p className="mt-1.5 text-[0.95rem] text-muted-dark">{placement.members.join(", ")}</p>
                    </div>
                    <span className="pt-1 font-mono text-sm font-medium whitespace-nowrap text-muted-dark">{conference.short}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
