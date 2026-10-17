"use client";

import Image from "next/image";
import { useRef } from "react";
import { useMotion } from "@/components/shell/Motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { RichText } from "@/components/ui/RichText";
import { TextLink } from "@/components/ui/TextLink";
import { photos } from "@/content/media";
import type { PhotoSlug } from "@/content/photos";
import { home } from "@/content/site";
import { cn } from "@/lib/cn";
import { FINE_POINTER, gsap, REDUCED_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const hero = home.hero;

// Each column repeats its tiles so the drift loops seamlessly on every viewport height.
const COPIES = 4;
const LOOP = 100 / COPIES;
// Seconds per loop and starting offset (fraction of one loop) for each column.
const DRIFT = [66, 54, 74, 60, 70];
const OFFSET = [0.1, 0.55, 0.3, 0.7, 0.45];
const MOBILE_COLUMNS = new Set([0, 2, 4]);

function WallTile({ slug, eager }: { slug: PhotoSlug; eager: boolean }) {
  const { src } = photos[slug];
  return (
    <div
      data-eager={eager ? "" : undefined}
      className="relative mb-3 overflow-hidden rounded-[0.875rem] bg-ink-2 md:mb-4 md:rounded-[1.125rem]"
      style={{ aspectRatio: `${src.width} / ${src.height}` }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 21vw, 36vw"
        quality={85}
        placeholder="blur"
        loading={eager ? "eager" : "lazy"}
        className="object-cover"
      />
    </div>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { onIntro } = useMotion();

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
      const stage = root.querySelector<HTMLElement>("[data-hero-stage]");
      const inner = root.querySelector<HTMLElement>("[data-wall-inner]");
      const shade = root.querySelector<HTMLElement>("[data-hero-shade]");
      const sheet = root.parentElement?.querySelector<HTMLElement>("[data-hero-sheet]") ?? null;
      const cols = q("[data-hero-col]");
      const tracks = q("[data-wall-track]");
      const lines = q("[data-hero-line-inner]");
      const rule = root.querySelector<HTMLElement>("[data-hero-rule]");
      const fades = q("[data-hero-fade]");
      const mm = gsap.matchMedia();

      mm.add(REDUCED_OK, () => {
        const drift = tracks.map((track, i) => {
          const start = -OFFSET[i] * LOOP;
          const up = i % 2 === 0;
          return gsap.fromTo(
            track,
            { yPercent: up ? start : start - LOOP },
            { yPercent: up ? start - LOOP : start, duration: DRIFT[i], ease: "none", repeat: -1 },
          );
        });

        let relax: ReturnType<typeof gsap.delayedCall> | undefined;
        const boost = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const speed = Math.min(3, 1 + Math.abs(self.getVelocity()) / 1500);
            const dir = self.direction === -1 ? -1 : 1;
            drift.forEach((tween) => tween.timeScale(dir * speed));
            relax?.kill();
            relax = gsap.delayedCall(0.3, () => {
              drift.forEach((tween) => gsap.to(tween, { timeScale: 1, duration: 0.9, ease: "tino" }));
            });
          },
        });

        const cleanups: Array<() => void> = [() => boost.kill(), () => relax?.kill()];

        if (sheet && stage && shade) {
          gsap
            .timeline({ scrollTrigger: { trigger: sheet, start: "top bottom", end: "top top", scrub: true } })
            .fromTo(stage, { scale: 1, yPercent: 0 }, { scale: 0.92, yPercent: -4, ease: "none" }, 0)
            .fromTo(shade, { opacity: 0 }, { opacity: 0.75, ease: "none" }, 0);
          const covered = ScrollTrigger.create({
            trigger: sheet,
            start: "top top",
            onEnter: () => drift.forEach((tween) => tween.pause()),
            onLeaveBack: () => drift.forEach((tween) => tween.resume()),
          });
          cleanups.push(() => covered.kill());
        }

        const offIntro = onIntro(() => {
          gsap.fromTo(
            cols,
            { y: () => window.innerHeight * 0.16, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.6, ease: "tino", stagger: { each: 0.08, from: "center" } },
          );
          gsap.fromTo(
            lines,
            { yPercent: 110, opacity: 1 },
            { yPercent: 0, duration: 1.1, ease: "tino", stagger: 0.08, delay: 0.2 },
          );
          if (rule) gsap.fromTo(rule, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 1.2, ease: "tino", delay: 0.45 });
          gsap.fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "tino", delay: 0.6 });
        });
        cleanups.push(offIntro);

        return () => cleanups.forEach((fn) => fn());
      });

      mm.add(`${FINE_POINTER} and (min-width: 1024px)`, () => {
        if (!inner) return;
        const xTo = gsap.quickTo(inner, "x", { duration: 1.4, ease: "power3.out" });
        const yTo = gsap.quickTo(inner, "y", { duration: 1.4, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          xTo(((event.clientX - rect.left) / rect.width - 0.5) * -28);
          yTo(((event.clientY - rect.top) / rect.height - 0.5) * -18);
        };
        root.addEventListener("pointermove", onMove);
        return () => root.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <>
      <div data-nav-theme="dark" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-svh" />
      <section
        ref={section}
        data-dark
        aria-labelledby="hero-title"
        className="sticky top-0 h-svh min-h-[34rem] overflow-hidden bg-ink"
      >
        <div data-hero-stage className="absolute inset-0 origin-top">
          <div data-hero-wall aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <div
              data-wall-inner
              className="absolute -inset-x-[3vw] -inset-y-[8svh] grid grid-cols-3 gap-3 md:gap-4 lg:grid-cols-5"
            >
              {hero.wall.map((column, i) => (
                <div
                  key={i}
                  data-hero-col
                  className={cn("relative min-w-0", !MOBILE_COLUMNS.has(i) && "hidden lg:block")}
                >
                  <div data-wall-track className="will-change-transform">
                    {Array.from({ length: COPIES }, (_, copy) =>
                      column.map((slug, j) => (
                        <WallTile key={`${copy}-${slug}`} slug={slug} eager={copy === 0 && j < 2} />
                      )),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgb(26_10_13/0.3)]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(22 17 15 / 0.97) 0%, rgb(22 17 15 / 0.86) 28%, rgb(22 17 15 / 0.2) 62%, rgb(22 17 15 / 0.5) 100%)",
            }}
          />

          <div className="relative flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14 lg:px-14 lg:pb-16">
            <div className="mx-auto w-full max-w-[90rem]">
              <h1
                id="hero-title"
                className="font-display text-[clamp(2.25rem,min(calc((100vw_-_7rem)_/_15.6),10.5svh),5.75rem)] leading-[1] font-bold tracking-[-0.03em] text-paper"
              >
                {hero.lines.map((line, i) => (
                  <span key={i} className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                    <span data-hero-line-inner className="block">
                      <RichText runs={line} accentClassName="text-gold" />
                    </span>
                  </span>
                ))}
              </h1>

              <div data-hero-rule aria-hidden="true" className="mt-8 h-px w-full origin-left bg-paper/20 md:mt-10" />

              <div
                data-hero-fade
                className="mt-6 flex flex-col gap-6 md:mt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
              >
                <p className="max-w-[44ch] text-[1.0625rem] leading-[1.55] text-paper/80 md:text-[1.1875rem]">{hero.sub}</p>
                <div className="flex flex-wrap items-center gap-6">
                  <Magnetic>
                    <Button href={hero.primaryCta.href} label={hero.primaryCta.label} variant="light" />
                  </Magnetic>
                  <TextLink href={hero.secondaryCta.href} label={hero.secondaryCta.label} className="text-paper" />
                </div>
              </div>
            </div>
          </div>

          <div data-hero-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
        </div>
      </section>
    </>
  );
}
