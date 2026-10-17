"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { home } from "@/content/site";
import { cn } from "@/lib/cn";
import { padMasks } from "@/components/ui/splitMask";
import { gsap, REDUCED_OK, SplitText, useGSAP } from "@/lib/gsap";

const a = home.alumni;

export function Alumni() {
  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const split = useRef<SplitText | null>(null);

  useGSAP(
    () => {
      const el = quoteRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        split.current = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            padMasks(self);
            return gsap.from(self.lines, { yPercent: 110, duration: 1, ease: "tino", stagger: 0.07 });
          },
        });
      });
      return () => {
        split.current?.revert();
        mm.revert();
      };
    },
    { scope: quoteRef, dependencies: [index] },
  );

  useGSAP(
    () => {
      if (pending === null) return;
      const lines = split.current?.lines ?? [];
      if (lines.length === 0) {
        setIndex(pending);
        setPending(null);
        return;
      }
      gsap.to(lines, {
        yPercent: -110,
        duration: 0.45,
        ease: "power3.in",
        stagger: 0.03,
        onComplete: () => {
          setIndex(pending);
          setPending(null);
        },
      });
    },
    { dependencies: [pending] },
  );

  function select(next: number) {
    if (next === index || pending !== null) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      setIndex(next);
      return;
    }
    setPending(next);
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (i + 1) % a.quotes.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (i - 1 + a.quotes.length) % a.quotes.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = a.quotes.length - 1;
    if (next === null) return;
    event.preventDefault();
    tabs.current[next]?.focus();
    select(next);
  }

  const active = a.quotes[index];

  return (
    <section className="bg-paper-2 px-5 py-28 md:px-10 md:py-40 lg:px-14">
      <div className="mx-auto max-w-[90rem]">
        <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink">
          <RichText runs={a.heading} accentClassName="text-maroon" />
        </SplitHeading>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div role="tablist" aria-label="Alumni" aria-orientation="vertical" className="flex flex-col gap-2 lg:col-span-4">
            {a.quotes.map((person, i) => {
              const selected = i === index;
              return (
                <button
                  key={person.name}
                  ref={(node) => {
                    tabs.current[i] = node;
                  }}
                  id={`alumni-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="alumni-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(event) => onKey(event, i)}
                  className="group flex flex-col items-start rounded-[1rem] px-4 py-4 text-left transition-colors duration-250 ease-tino hover:bg-ink/4"
                >
                  <span className={cn("flex items-center gap-3 text-[1.1rem] font-semibold transition-colors duration-250", selected ? "text-ink" : "text-muted")}>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2 shrink-0 scale-0 rounded-full bg-maroon transition-transform duration-500 ease-tino",
                        selected && "scale-100",
                      )}
                    />
                    {person.name}
                  </span>
                  <span className={cn("mt-1.5 pl-5 text-[0.95rem] transition-colors duration-250", selected ? "text-ink/80" : "text-muted")}>
                    {person.school}
                  </span>
                  <span className="mt-0.5 pl-5 text-[0.875rem] text-muted">{person.classYear}</span>
                </button>
              );
            })}
          </div>

          <div id="alumni-panel" role="tabpanel" aria-labelledby={`alumni-tab-${index}`} className="lg:col-span-7 lg:col-start-6">
            <span aria-hidden="true" className="block font-serif text-[7rem] leading-[0.6] text-maroon">
              &ldquo;
            </span>
            <p
              key={index}
              ref={quoteRef}
              className="mt-6 font-serif text-[clamp(1.6rem,2.5vw,2.6rem)] leading-[1.22] text-ink"
            >
              {active.quote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
