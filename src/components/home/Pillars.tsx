"use client";

import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Bezel } from "@/components/ui/Bezel";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { RichText } from "@/components/ui/RichText";
import { home } from "@/content/site";
import { cn } from "@/lib/cn";
import { DESKTOP_MOTION, gsap, REDUCED_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const p = home.pillars;

export function Pillars() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const build = el.querySelector<HTMLElement>("[data-build-card]");
        const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
        if (build && slides.length > 1) {
          const tl = gsap.timeline({ repeat: -1, paused: true });
          const step = 4;
          const n = slides.length;
          const cycle = n * step;
          slides.forEach((slide, i) => {
            tl.fromTo(slide, { scale: 1.08 }, { scale: 1, duration: step + 1.2, ease: "none", immediateRender: false }, i * step);
            if (i === 0) return;
            tl.fromTo(slide, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "none", immediateRender: false }, i * step - 1.2);
            if (i >= 2) tl.set(slides[i - 1], { opacity: 0 }, i * step);
          });
          tl.set(slides[n - 1], { opacity: 0 }, cycle);
          ScrollTrigger.create({
            trigger: build,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
          });
        }
      });
      mm.add(DESKTOP_MOTION, () => {
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-pillar-card]"));
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const shell = card.querySelector<HTMLElement>("[data-pillar-shell]");
          const shade = card.querySelector<HTMLElement>("[data-stack-shade]");
          if (!shell || !shade) return;
          gsap.timeline({
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top 96px",
              scrub: true,
            },
          })
            .fromTo(shell, { scale: 1 }, { scale: 0.93, transformOrigin: "50% 0%", ease: "none" }, 0)
            .fromTo(shade, { opacity: 0 }, { opacity: 0.45, ease: "none" }, 0);
        });
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-paper px-5 pb-28 md:px-10 md:pb-40 lg:px-14">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 pb-16 lg:grid-cols-12 lg:pb-24">
          <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink lg:col-span-7">
            <RichText runs={p.heading} accentClassName="text-maroon" />
          </SplitHeading>
          <p className="max-w-[46ch] text-[1.1875rem] leading-[1.55] text-ink/80 lg:col-span-4 lg:col-start-9 lg:self-end">
            {p.intro}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:gap-0">
          <PillarCard
            index={0}
            id={p.compete.id}
            tone="ink"
            photoSide="right"
            title={p.compete.title}
            line={p.compete.line}
            body={p.compete.body}
          >
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {p.compete.formats.map((format) => (
                <div key={format.name}>
                  <h4 className="text-sm font-semibold text-gold">{format.name}</h4>
                  <ul className="mt-2 flex flex-col gap-0.5 text-[0.95rem] text-paper/80">
                    {format.events.map((event) => (
                      <li key={event}>{event}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </PillarCard>

          <PillarCard
            index={1}
            tone="maroon"
            photoSide="left"
            title={p.build.title}
            line={p.build.line}
            body={p.build.body}
            cardAttr="build"
          >
            <Magnetic>
              <Button href={p.build.cta.href} label={p.build.cta.label} variant="light" />
            </Magnetic>
          </PillarCard>

          <PillarCard
            index={2}
            tone="paper2"
            photoSide="right"
            title={p.lead.title}
            line={p.lead.line}
            body={p.lead.body}
          >
            <Magnetic>
              <Button href={p.lead.cta.href} label={p.lead.cta.label} variant="dark" />
            </Magnetic>
          </PillarCard>
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  index: number;
  id?: string;
  tone: "ink" | "maroon" | "paper2";
  photoSide: "left" | "right";
  title: string;
  line: string;
  body: string;
  cardAttr?: string;
  children: ReactNode;
};

function PillarCard({ index, id, tone, photoSide, title, line, body, cardAttr, children }: CardProps) {
  const photoSlide = tone === "maroon";
  const coreTone = {
    ink: "bg-ink text-paper",
    maroon: "bg-maroon text-paper",
    paper2: "bg-paper-2 text-ink",
  }[tone];
  const lineTone = tone === "ink" ? "text-gold" : tone === "maroon" ? "text-gold" : "text-maroon";
  const bodyTone = tone === "paper2" ? "text-muted" : tone === "ink" ? "text-paper/75" : "text-paper/80";
  const photo = (
    <div className="relative min-h-[16rem] overflow-hidden rounded-[1.25rem] lg:absolute lg:inset-0 lg:min-h-0">
      {photoSlide ? (
        <div data-build-card className="absolute inset-0 overflow-hidden rounded-[1.25rem]">
          {home.pillars.build.photos.map((slug, i) => (
            <div key={slug} data-slide className={cn("absolute inset-0", i === 0 ? "opacity-100" : "opacity-0")}>
              <Photo slug={slug} sizes="(min-width: 1024px) 58vw, 100vw" className="absolute inset-0" />
            </div>
          ))}
        </div>
      ) : (
        <Photo
          slug={tone === "ink" ? home.pillars.compete.photo : home.pillars.lead.photo}
          sizes="(min-width: 1024px) 58vw, 100vw"
          objectPosition={tone === "paper2" ? "center 30%" : "center"}
          className="absolute inset-0 h-full"
        />
      )}
    </div>
  );
  const text = (
    <div className="flex flex-col justify-between gap-10 p-8 md:p-12 lg:col-span-5">
      <div>
        <h3 className="font-display text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[1] font-bold tracking-[-0.03em]">
          {title}
        </h3>
        <p className={cn("mt-5 text-[1.375rem] font-medium tracking-[-0.01em]", lineTone)}>{line}</p>
        <p className={cn("mt-6 max-w-[40ch] text-[1.0625rem] leading-[1.65]", bodyTone)}>{body}</p>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <article
      id={id}
      data-pillar-card
      data-card={cardAttr}
      style={{ top: `calc(6rem + ${index * 1.375}rem)` }}
      className={cn("relative scroll-mt-[6.875rem] lg:sticky", index < 2 && "lg:mb-[30svh]")}
    >
      <div data-pillar-shell className="origin-top">
        <Bezel
          tone={tone === "paper2" ? "light" : "dark"}
          coreClassName={cn("relative flex flex-col overflow-hidden lg:min-h-[min(82svh,48.75rem)]", coreTone)}
        >
          <div className="relative grid flex-1 gap-6 p-3 lg:grid-cols-12 lg:gap-0 lg:p-3">
            {photoSide === "left" ? (
              <>
                <div className="relative lg:col-span-7">{photo}</div>
                {text}
              </>
            ) : (
              <>
                {text}
                <div className="relative lg:col-span-7">{photo}</div>
              </>
            )}
          </div>
          <div data-stack-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
        </Bezel>
      </div>
    </article>
  );
}
