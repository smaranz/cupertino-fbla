"use client";

import { SpeakerHigh } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Bezel } from "@/components/ui/Bezel";
import { Photo } from "@/components/ui/Photo";
import { home, site, type ManifestoSegment } from "@/content/site";
import { gsap, REDUCED_OK, useGSAP } from "@/lib/gsap";

const m = home.manifesto;

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const paragraph = el.querySelector<HTMLElement>("[data-manifesto]");
        if (!paragraph) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: paragraph,
            start: "top 78%",
            end: "bottom 60%",
            scrub: true,
          },
        });
        const order = Array.from(paragraph.querySelectorAll<HTMLElement>("[data-word], [data-pill]"));
        order.forEach((node, i) => {
          if (node.hasAttribute("data-pill")) {
            tl.fromTo(node, { scale: 0 }, { scale: 1, duration: 1, ease: "tino" }, i);
          } else {
            tl.fromTo(node, { opacity: 0.12 }, { opacity: 1, duration: 1, ease: "none" }, i);
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-hero-sheet
      className="relative z-(--z-sticky) rounded-t-[2rem] bg-paper py-28 shadow-[0_-2rem_4rem_-2rem_rgb(22_17_15/0.5)] md:rounded-t-[2.5rem] md:py-40"
    >
      <div className="mx-auto grid max-w-[calc(90rem_+_7rem)] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-14">
        <p
          data-manifesto
          className="text-[clamp(1.75rem,2.45vw,2.6rem)] leading-[1.2] font-medium tracking-[-0.02em] text-ink lg:col-span-7"
        >
          {m.segments.map((segment, i) => (
            <Segment key={i} segment={segment} />
          ))}
        </p>

        <div data-reveal className="lg:col-span-5">
          <ChapterVideo />
        </div>
      </div>
    </section>
  );
}

function Segment({ segment }: { segment: ManifestoSegment }) {
  if ("pill" in segment) {
    return (
      <span
        data-pill
        className="relative mx-[0.12em] inline-block h-[1em] w-[2.3em] overflow-hidden rounded-full align-middle"
      >
        <Photo slug={segment.pill} sizes="20vw" className="absolute inset-0" as="span" />
      </span>
    );
  }
  return (
    <>
      {segment.text.split(" ").map((word, j, arr) => (
        <span key={j} data-word className="inline-block">
          {word}
          {j < arr.length - 1 ? "\u00A0" : " "}
        </span>
      ))}
    </>
  );
}

// Plays muted on loop while on screen. "Play with sound" restarts it with audio and native controls.
function ChapterVideo() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(false);
  const inView = useRef(false);

  useEffect(() => {
    const el = frame.current;
    const player = video.current;
    if (!el || !player) return;
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (!player.muted) return;
        if (entry.isIntersecting && motionOk.matches) player.play().catch(() => undefined);
        else player.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function playWithSound() {
    const player = video.current;
    if (!player) return;
    player.muted = false;
    player.loop = false;
    player.currentTime = 0;
    setWithSound(true);
    player.play().catch(() => undefined);
  }

  function backToPreview() {
    const player = video.current;
    if (!player) return;
    player.muted = true;
    player.loop = true;
    setWithSound(false);
    if (inView.current && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      player.play().catch(() => undefined);
    }
  }

  return (
    <figure>
      <Bezel coreClassName="overflow-hidden bg-ink">
        <div ref={frame} className="relative aspect-video overflow-hidden rounded-[calc(2rem-0.5rem)]">
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            poster={site.video.poster}
            muted
            loop
            playsInline
            preload="none"
            controls={withSound}
            onEnded={backToPreview}
            aria-label={m.videoTitle}
          >
            <source src={site.video.src} type="video/mp4" />
            <source src={site.video.webm} type="video/webm" />
          </video>

          {withSound ? null : (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
              />
              <button
                type="button"
                onClick={playWithSound}
                className="group absolute bottom-4 left-4 inline-flex items-center gap-3 rounded-full bg-paper py-2 pr-5 pl-2 text-[0.9375rem] font-medium text-ink transition-[background-color,transform] duration-250 ease-tino hover:bg-gold active:scale-[0.98] md:bottom-5 md:left-5"
              >
                <span className="grid size-9 place-items-center rounded-full bg-maroon text-paper transition-transform duration-250 ease-tino group-hover:scale-[1.06]">
                  <SpeakerHigh size={18} weight="fill" aria-hidden="true" />
                </span>
                {m.videoLabel}
              </button>
            </>
          )}
        </div>
      </Bezel>
      <figcaption className="mt-4 flex items-center justify-between gap-4 px-2 text-sm font-medium text-muted">
        <span>{m.videoCaption}</span>
        <span className="font-mono tabular-nums">{m.videoDuration}</span>
      </figcaption>
    </figure>
  );
}
