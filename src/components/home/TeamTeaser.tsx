"use client";

import { useRef, type Ref } from "react";
import { LogoTie } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { allOfficers } from "@/content/officers";
import { home } from "@/content/site";
import { gsap, REDUCED_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const t = home.teamTeaser;

function NameRun({ outlined }: { outlined: boolean }) {
  return (
    <>
      {allOfficers.map((officer) => (
        <span key={officer.name} className="flex items-center">
          <span className={outlined ? "cursor-default text-maroon transition-colors duration-250 hover:text-ink" : "cursor-default"}>
            {officer.name}
          </span>
          <LogoTie className="mx-[0.9em] h-[0.72em] w-auto shrink-0 self-center" />
        </span>
      ))}
    </>
  );
}

function MarqueeRow({ outlined, rowRef, trackRef }: { outlined: boolean; rowRef: Ref<HTMLDivElement>; trackRef: Ref<HTMLDivElement> }) {
  return (
    <div ref={rowRef} className="overflow-hidden py-2 whitespace-nowrap motion-reduce:whitespace-normal">
      <div
        ref={trackRef}
        className={`flex w-max items-center font-display text-[clamp(2.75rem,7vw,7.5rem)] leading-[1] font-extrabold tracking-[-0.04em] text-ink uppercase motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-x-10 motion-reduce:gap-y-4 motion-reduce:whitespace-normal`}
      >
        <div className="flex items-center">
          <NameRun outlined={outlined} />
        </div>
        <div className="marquee-dup items-center" aria-hidden="true">
          <NameRun outlined={outlined} />
        </div>
      </div>
    </div>
  );
}

export function TeamTeaser() {
  const root = useRef<HTMLElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);
  const track1 = useRef<HTMLDivElement>(null);
  const track2 = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !track1.current || !track2.current) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const forward = gsap.to(track1.current, { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
        const backward = gsap.fromTo(track2.current, { xPercent: -50 }, { xPercent: 0, duration: 45, ease: "none", repeat: -1 });
        let relax: ReturnType<typeof gsap.delayedCall> | undefined;

        const boost = ScrollTrigger.create({
          trigger: el,
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const speed = Math.min(4, 1 + Math.abs(self.getVelocity()) / 1200);
            const dir = self.direction === -1 ? -1 : 1;
            forward.timeScale(dir * speed);
            backward.timeScale(-dir * speed);
            relax?.kill();
            relax = gsap.delayedCall(0.35, () => {
              gsap.to(forward, { timeScale: 1, duration: 0.8, ease: "tino" });
              gsap.to(backward, { timeScale: -1, duration: 0.8, ease: "tino" });
            });
          },
        });

        const pause = () => {
          forward.pause();
          backward.pause();
        };
        const resume = () => {
          forward.resume();
          backward.resume();
        };
        row1.current?.addEventListener("pointerenter", pause);
        row1.current?.addEventListener("pointerleave", resume);
        row2.current?.addEventListener("pointerenter", pause);
        row2.current?.addEventListener("pointerleave", resume);

        return () => {
          boost.kill();
          row1.current?.removeEventListener("pointerenter", pause);
          row1.current?.removeEventListener("pointerleave", resume);
          row2.current?.removeEventListener("pointerenter", pause);
          row2.current?.removeEventListener("pointerleave", resume);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-paper py-28 md:py-40">
      <div className="mx-auto grid max-w-[calc(90rem_+_7rem)] gap-10 px-5 md:px-10 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-14">
        <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink lg:col-span-7">
          <RichText runs={t.heading} accentClassName="text-maroon" />
        </SplitHeading>
        <div className="flex flex-col items-start gap-8 lg:col-span-4 lg:col-start-9">
          <p className="max-w-[40ch] text-[1.0625rem] leading-[1.65] text-ink/80">{t.body}</p>
          <Magnetic>
            <Button href={t.cta.href} label={t.cta.label} variant="dark" />
          </Magnetic>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-4 md:mt-28">
        <MarqueeRow outlined={false} rowRef={row1} trackRef={track1} />
        <MarqueeRow outlined rowRef={row2} trackRef={track2} />
      </div>
    </section>
  );
}
