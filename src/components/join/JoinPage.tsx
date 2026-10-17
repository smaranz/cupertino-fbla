"use client";

import { useRef } from "react";
import { useMotion } from "@/components/shell/Motion";
import { Bezel } from "@/components/ui/Bezel";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { TextLink } from "@/components/ui/TextLink";
import { joinPage, site } from "@/content/site";
import { padMasks } from "@/components/ui/splitMask";
import { gsap, REDUCED_OK, SplitText, useGSAP } from "@/lib/gsap";

export function JoinPage() {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const { onIntro } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      const h = heading.current;
      if (!el || !h) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const split = SplitText.create(h, { type: "lines", mask: "lines", autoSplit: true, reduceWhiteSpace: false, onSplit: padMasks });
        const off = onIntro(() => {
          gsap.fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "tino", stagger: 0.07 });
        });
        const clip = el.querySelector<HTMLElement>("[data-join-photo]");
        const img = el.querySelector<HTMLElement>("[data-join-img]");
        if (clip) {
          onIntro(() => {
            gsap.fromTo(clip, { clipPath: "inset(100% 0 0 0 round 1.5rem)" }, { clipPath: "inset(0% 0 0 0 round 1.5rem)", duration: 1.2, ease: "power4.inOut" });
          });
        }
        if (img) {
          onIntro(() => {
            gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.4, ease: "tino" });
          });
        }
        return () => off();
      });
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const img = el.querySelector<HTMLElement>("[data-join-img]");
        if (img) {
          gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
        }
      });
      mm.add(REDUCED_OK, () => {
        const line = el.querySelector<HTMLElement>("[data-steps-line]");
        if (line) {
          gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: line, start: "top 80%", end: "bottom 50%", scrub: true } });
        }
        el.querySelectorAll<HTMLElement>("[data-hairline]").forEach((rule) => {
          gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "tino", scrollTrigger: { trigger: rule, start: "top 90%", once: true } });
        });
        el.querySelectorAll<HTMLElement>("[data-speakers]").forEach((node) => {
          const split = SplitText.create(node, { type: "lines", mask: "lines", autoSplit: true, onSplit: padMasks });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1,
            ease: "tino",
            stagger: 0.07,
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="px-5 pt-40 pb-24 md:px-10 md:pt-44 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] items-start gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-start gap-10 lg:col-span-5">
            <h1
              ref={heading}
              className="font-display text-[clamp(2.4rem,5.6vw,6.5rem)] leading-[1] font-bold tracking-[-0.03em] text-ink"
            >
              <RichText runs={joinPage.heading} accentClassName="text-maroon" />
            </h1>
            <p className="max-w-[46ch] text-[1.1875rem] leading-[1.55] text-ink/80">{joinPage.intro}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Magnetic>
                <Button href={joinPage.primaryCta.href} label={joinPage.primaryCta.label} variant="dark" />
              </Magnetic>
              <TextLink href={joinPage.secondaryCta.href} label={joinPage.secondaryCta.label} className="text-ink" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Bezel className="rounded-[2rem]">
              <div data-join-photo className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.5rem)]">
                <div data-join-img className="absolute inset-0 scale-[1.05]">
                  <Photo slug={joinPage.photo} sizes="(min-width: 1024px) 33vw, 100vw" className="absolute inset-0" />
                </div>
              </div>
            </Bezel>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 md:px-10 md:pb-36 lg:px-14">
        <div className="mx-auto max-w-[90rem]">
          <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink">
            <RichText runs={joinPage.stepsHeading} accentClassName="text-maroon" />
          </SplitHeading>

          <div className="relative mt-16 grid gap-12 lg:grid-cols-3 lg:gap-10">
            <span
              data-steps-line
              aria-hidden="true"
              className="absolute top-[0.5rem] left-0 hidden h-px w-full origin-left bg-ink/25 lg:block"
            />
            {joinPage.steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-col gap-5 pt-12 lg:pt-16">
                <span data-hairline aria-hidden="true" className="absolute top-0 left-0 block h-px w-full origin-left bg-ink/12 lg:hidden" />
                <span className="numeral text-[clamp(4rem,7vw,7rem)] leading-none text-maroon">{i + 1}</span>
                <h3 className="font-display text-[1.75rem] leading-[1.1] font-bold tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="max-w-[34ch] text-[1.0625rem] leading-[1.6] text-muted">{step.body}</p>
              </div>
            ))}
          </div>

          <p
            data-speakers
            className="mt-20 max-w-[44ch] text-[clamp(1.375rem,1.9vw,1.875rem)] leading-[1.35] font-medium tracking-[-0.01em] text-ink"
          >
            {joinPage.speakersLine}
          </p>
        </div>
      </section>

      <section className="bg-paper-2 px-5 py-28 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto max-w-[90rem]">
          <SplitHeading className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-bold tracking-[-0.028em] text-ink">
            <RichText runs={joinPage.faqHeading} accentClassName="text-maroon" />
          </SplitHeading>
          <div className="mt-16 flex flex-col">
            {joinPage.faqs.map((faq) => (
              <div key={faq.q} className="relative grid gap-4 py-10 lg:grid-cols-12 lg:gap-8">
                <span data-hairline aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-ink/12" />
                <h3 className="font-display text-[1.35rem] leading-[1.2] font-semibold tracking-[-0.01em] text-ink lg:col-span-5">{faq.q}</h3>
                <p className="text-[1.0625rem] leading-[1.65] text-muted lg:col-span-6 lg:col-start-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] gap-6 md:grid-cols-2 md:gap-8">
          <Bezel className="flex h-full flex-col" coreClassName="flex h-full flex-col gap-6 bg-paper-2 p-8 md:p-10">
            <h2 className="font-display text-[clamp(2rem,3.2vw,3rem)] leading-[1.02] font-bold tracking-[-0.028em] text-ink">
              {joinPage.contact.heading}
            </h2>
            <p className="text-[1.0625rem] leading-[1.65] text-muted">{joinPage.contact.body}</p>
            <div className="mt-auto flex flex-col items-start gap-6 pt-6">
              <Magnetic>
                <Button href={joinPage.contact.emailCta.href} label={joinPage.contact.emailCta.label} variant="dark" />
              </Magnetic>
              <TextLink href={site.instagram.href} label={`${site.instagram.label} ${site.instagram.handle}`} className="text-ink" />
              <p className="text-sm text-muted">
                {site.advisor.title}: {site.advisor.name}, <TextLink href={`mailto:${site.advisor.email}`} label={site.advisor.email} className="text-ink" />
              </p>
            </div>
          </Bezel>

          <Bezel className="flex h-full flex-col" tone="dark" coreClassName="flex h-full flex-col gap-6 bg-maroon p-8 text-paper md:p-10">
            <h2 className="font-display text-[clamp(2rem,3.2vw,3rem)] leading-[1.02] font-bold tracking-[-0.028em] text-paper">
              {joinPage.support.heading}
            </h2>
            <p className="text-[1.0625rem] leading-[1.65] text-paper/80">{joinPage.support.body}</p>
            <div className="mt-auto pt-6">
              <Magnetic>
                <Button href={joinPage.support.cta.href} label={joinPage.support.cta.label} variant="light" />
              </Magnetic>
            </div>
          </Bezel>
        </div>
      </section>
    </div>
  );
}
