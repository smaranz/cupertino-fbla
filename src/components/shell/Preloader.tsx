"use client";

import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { preloader } from "@/content/site";
import { gsap, REDUCED_OK, useGSAP } from "@/lib/gsap";
import { useMotion } from "./Motion";

function waitForHeroPhoto(): Promise<void> {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("[data-hero-wall] [data-eager] img"));
  const decoded = Promise.all(imgs.map((img) => img.decode().catch(() => undefined))).then(() => undefined);
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 900));
  return Promise.race([decoded, timeout]);
}

export function Preloader() {
  const scope = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const { openIntro } = useMotion();

  useGSAP(
    () => {
      const root = document.documentElement;
      const el = scope.current;
      if (!el) return;
      if (root.classList.contains("intro-done")) {
        openIntro();
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const part = (name: string) => el.querySelector<SVGElement>(`[data-part="${name}"]`);
        const swoosh = part("swoosh");
        const stem = part("t-stem");
        const n = part("n");
        const tie = part("tie");
        const arrows = el.querySelectorAll<SVGElement>('[data-part^="mark-arrow"]');
        const text = part("mark-text");
        const logo = el.querySelector<HTMLElement>("[data-preloader-logo]");
        const count = { value: 0 };

        const enter = gsap.timeline({
          onComplete: () => {
            waitForHeroPhoto().then(() => exit());
          },
        });

        enter
          .fromTo(swoosh, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.inOut" }, 0)
          .fromTo(
            stem,
            { clipPath: "inset(100% 0 0 0)", y: 14 },
            { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.5, ease: "power3.inOut" },
            0.25,
          )
          .fromTo(
            n,
            { clipPath: "inset(100% 0 0 0)", y: 14 },
            { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.5, ease: "power3.inOut" },
            0.35,
          )
          .fromTo(
            tie,
            { y: -40, rotation: -14, transformOrigin: "50% 0%", opacity: 0 },
            { y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.6)" },
            0.45,
          )
          .to(tie, { opacity: 1, duration: 0.14, ease: "none" }, 0.45)
          .fromTo(
            arrows,
            { rotation: -60, scale: 0.6, opacity: 0, transformOrigin: "50% 50%" },
            { rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: "tino", stagger: 0.06 },
            0.6,
          )
          .fromTo(text, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 1.0)
          .to(
            count,
            {
              value: 100,
              duration: 1.6,
              ease: "power2.inOut",
              onUpdate: () => {
                if (counter.current) counter.current.textContent = String(Math.round(count.value)).padStart(3, "0");
              },
            },
            0,
          );

        function exit() {
          const out = gsap.timeline({
            onComplete: () => {
              root.classList.add("intro-done");
            },
          });
          out
            .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 0)
            .to(logo, { yPercent: -120, duration: 0.9, ease: "power4.inOut" }, 0)
            .call(() => openIntro(), [], 0.3);
        }

        return () => {
          enter.kill();
        };
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      data-preloader
      className="fixed inset-0 z-(--z-preloader) flex flex-col bg-maroon text-paper"
    >
      <div className="flex flex-1 items-center justify-center px-6">
        <div data-preloader-logo className="w-[min(46vw,26.25rem)]">
          <Logo variant="light" className="block h-auto w-full" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-6 px-5 pb-8 md:px-10 lg:px-14">
        <p className="text-sm font-medium text-paper/70">{preloader.left}</p>
        <span
          ref={counter}
          className="font-mono text-sm font-medium tabular-nums text-paper/70"
          aria-hidden="true"
        >
          000
        </span>
      </div>
    </div>
  );
}
