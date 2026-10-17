"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/shell/Motion";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { conferences, conferenceById, ordinal, placements } from "@/content/results";
import { countUp } from "@/components/ui/countUp";
import { photos } from "@/content/media";
import { resultsPage } from "@/content/site";
import { cn } from "@/lib/cn";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { padMasks } from "@/components/ui/splitMask";
import { Flip, FINE_POINTER, gsap, REDUCED_OK, SplitText, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(Draggable, InertiaPlugin);

const ALL = "all";
const order = new Map(conferences.map((c, i) => [c.id, i]));
const sortedPlacements = [...placements].sort(
  (a, b) => (order.get(a.conferenceId) ?? 0) - (order.get(b.conferenceId) ?? 0) || a.place - b.place,
);

export function ResultsPage() {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const { onIntro } = useMotion();
  const [active, setActive] = useState(ALL);
  const [visible, setVisible] = useState(sortedPlacements.length);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const h = heading.current;
      const img = hero.current?.querySelector<HTMLElement>("[data-results-img]");
      if (!el || !h) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const split = SplitText.create(h, { type: "lines", mask: "lines", autoSplit: true, onSplit: padMasks });
        const off = onIntro(() => {
          gsap.fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "tino", stagger: 0.07 });
          if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "tino" });
        });
        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => countUp(node, node, "top 85%"));
        el.querySelectorAll<HTMLElement>("[data-gallery-frame]").forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.1,
              ease: "tino",
              scrollTrigger: { trigger: frame, start: "top 90%", once: true },
            },
          );
        });
        return () => off();
      });
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const inner = hero.current?.querySelector<HTMLElement>("[data-results-parallax]");
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -8 },
            { yPercent: 8, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } },
          );
        }
      });
      mm.add(FINE_POINTER, () => {
        const row = galleryRef.current;
        if (!row) return;
        const drag = Draggable.create(row, {
          type: "scrollLeft",
          inertia: true,
          cursor: "grab",
          activeCursor: "grabbing",
          allowNativeTouchScrolling: false,
        });
        return () => drag.forEach((d) => d.kill());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const activeRef = useRef(ALL);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const reapply = () => {
      const button = buttonRefs.current[activeRef.current];
      if (button) applyPill(button, false);
    };
    reapply();
    const observer = new ResizeObserver(reapply);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  function applyPill(button: HTMLButtonElement, animate: boolean) {
    const layer = pillRef.current;
    const bar = barRef.current;
    if (!layer || !bar) return;
    const r = button.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    const box = { x: r.left - b.left, y: r.top - b.top, width: r.width, height: r.height };
    if (animate) gsap.to(layer, { ...box, duration: 0.5, ease: "tino", overwrite: true });
    else gsap.set(layer, box);
  }

  function choose(next: string) {
    if (next === active) return;
    const rows = rowRefs.current.filter((row): row is HTMLTableRowElement => row !== null);
    const matches = (row: HTMLTableRowElement) => next === ALL || row.dataset.conf === next;
    const reduced = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const state = reduced ? null : Flip.getState(rows);
    rows.forEach((row) => {
      row.hidden = !matches(row);
    });
    activeRef.current = next;
    setActive(next);
    setVisible(rows.filter(matches).length);
    const button = buttonRefs.current[next];
    if (button) applyPill(button, !reduced);
    if (state) {
      Flip.from(state, {
        duration: 0.6,
        ease: "tino",
        onEnter: (elements) =>
          gsap.fromTo(elements, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "tino", stagger: 0.015 }),
        onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.2 }),
      });
    }
  }

  const filters = [
    { id: ALL, label: resultsPage.filterAllLabel, short: resultsPage.filterAllLabel },
    ...conferences.map((c) => ({ id: c.id, label: `${c.name} ${c.year}`, short: c.short })),
  ];

  const galleryRows = resultsPage.gallery;

  return (
    <div ref={root}>
      <section data-nav-theme="dark" className="relative flex min-h-[88svh] items-end overflow-hidden bg-ink text-paper">
        <div ref={hero} className="absolute inset-0">
          <div data-results-img className="absolute inset-0">
            <div data-results-parallax className="absolute inset-x-0 -inset-y-[10%]">
              <Photo
                slug={resultsPage.photo}
                sizes="100vw"
                preload
                quality={85}
                objectPosition="center 42%"
                className="absolute inset-0"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" aria-hidden="true" />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[calc(90rem_+_7rem)] gap-10 px-5 pt-40 pb-16 md:px-10 md:pb-20 lg:grid-cols-12 lg:items-end lg:px-14">
          <h1
            ref={heading}
            className="font-display text-[clamp(2.4rem,5.6vw,6.5rem)] leading-[1] font-bold tracking-[-0.03em] lg:col-span-7"
          >
            <RichText runs={resultsPage.heading} accentClassName="text-gold" />
          </h1>
          <p className="max-w-[40ch] text-[1.1875rem] leading-[1.55] text-paper/80 lg:col-span-4 lg:col-start-9">{resultsPage.intro}</p>
        </div>
      </section>

      <section data-nav-theme="dark" className="bg-ink px-5 py-20 text-paper md:px-10 md:py-28 lg:px-14">
        <dl className="mx-auto grid max-w-[90rem] grid-cols-2 gap-y-12 lg:grid-cols-4">
          {resultsPage.summary.map((item, i) => (
            <div
              key={item.label}
              className={cn("flex flex-col gap-4 px-6 md:px-8", i % 2 === 1 && "border-l border-paper/14", i >= 2 && "lg:border-l")}
            >
              <dt className="order-2 text-[0.875rem] font-medium text-muted-dark">{item.label}</dt>
              <dd className="order-1 numeral text-[clamp(3.5rem,6vw,6rem)] leading-none">
                <span data-count={item.value} className={i === 0 ? "text-gold" : "text-paper"}>
                  {item.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-paper px-5 py-28 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div ref={barRef} role="group" aria-label={resultsPage.filterGroupLabel} className="relative isolate flex flex-wrap gap-2">
              <span
                ref={pillRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 rounded-full bg-ink"
              />
              {filters.map((f) => {
                const pressed = active === f.id;
                return (
                  <button
                    key={f.id}
                    ref={(node) => {
                      buttonRefs.current[f.id] = node;
                    }}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => choose(f.id)}
                    className={cn(
                      "relative z-10 rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-[background-color,color,transform] duration-250 ease-tino active:scale-[0.98]",
                      pressed ? "text-paper" : "bg-paper-2 text-ink hover:bg-ink/8",
                    )}
                  >
                    <span className="hidden lg:inline">{f.label}</span>
                    <span className="lg:hidden">{f.short}</span>
                  </button>
                );
              })}
            </div>
            <p aria-live="polite" className="text-[0.9375rem] font-medium text-muted">
              {resultsPage.showing(visible)}
            </p>
          </div>

          <div className="mt-10 max-h-[70svh] overflow-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{resultsPage.intro}</caption>
              <thead className="sticky top-0 z-10 hidden bg-paper md:table-header-group">
                <tr className="border-b border-ink/12">
                  <th scope="col" className="py-4 pr-6 text-[0.875rem] font-medium text-muted">
                    {resultsPage.tableHeaders.place}
                  </th>
                  <th scope="col" className="py-4 pr-6 text-[0.875rem] font-medium text-muted">
                    {resultsPage.tableHeaders.event}
                  </th>
                  <th scope="col" className="py-4 pr-6 text-[0.875rem] font-medium text-muted">
                    {resultsPage.tableHeaders.members}
                  </th>
                  <th scope="col" className="py-4 text-[0.875rem] font-medium text-muted">
                    {resultsPage.tableHeaders.conference}
                  </th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {sortedPlacements.map((p, i) => {
                  const conference = conferenceById(p.conferenceId);
                  return (
                    <tr
                      key={`${p.conferenceId}-${p.event}-${i}`}
                      ref={(node) => {
                        rowRefs.current[i] = node;
                      }}
                      data-conf={p.conferenceId}
                      className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-ink/12 py-5 transition-colors duration-250 ease-tino hover:bg-paper-2 md:table-row md:py-0 md:hover:bg-paper-2"
                    >
                      <td className="row-span-3 self-start md:table-cell md:row-span-1 md:py-5 md:pr-6">
                        <span
                          className={cn(
                            "numeral text-[2.25rem] leading-none",
                            p.place === 1 ? "text-maroon" : "text-ink",
                          )}
                        >
                          {ordinal(p.place)}
                        </span>
                      </td>
                      <td className="col-start-2 font-semibold text-ink md:table-cell md:py-5 md:pr-6">{p.event}</td>
                      <td className="col-start-2 text-muted md:table-cell md:py-5 md:pr-6">{p.members.join(", ")}</td>
                      <td className="col-start-2 md:table-cell md:py-5">
                        <span className="font-mono text-sm font-medium text-ink">{conference.short}</span>
                        <span className="ml-3 text-sm text-muted">{conference.level}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-paper-2 px-5 py-28 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto max-w-[90rem]">
          <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink">
            <RichText runs={resultsPage.galleryHeading} accentClassName="text-maroon" />
          </SplitHeading>
        </div>
        <div
          ref={galleryRef}
          tabIndex={0}
          role="region"
          aria-label={resultsPage.galleryHeading.map((r) => r.text).join("")}
          className="mt-14 cursor-grab overflow-x-auto pb-6 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-start gap-6 px-5 md:px-10 lg:px-14">
          {galleryRows.map((slug, i) => {
            const tall = i % 2 === 0;
            return (
              <figure
                key={slug}
                className={cn("group shrink-0 snap-start select-none", tall ? "w-[72vw] md:w-[24vw]" : "w-[82vw] md:w-[45vw]")}
              >
                <div
                  data-gallery-frame
                  className={cn("relative overflow-hidden rounded-[1.25rem]", tall ? "aspect-[4/5]" : "aspect-[3/2]")}
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-tino group-hover:scale-[1.04]">
                    <Photo slug={slug} sizes={tall ? "(min-width: 768px) 24vw, 72vw" : "(min-width: 768px) 45vw, 82vw"} className="absolute inset-0" />
                  </div>
                </div>
                {photos[slug].caption ? (
                  <figcaption className="mt-3 text-sm font-medium text-muted">{photos[slug].caption}</figcaption>
                ) : null}
              </figure>
            );
          })}
          </div>
        </div>
      </section>
    </div>
  );
}
