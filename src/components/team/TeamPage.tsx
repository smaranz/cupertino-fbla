"use client";

import { useRef, type MouseEvent } from "react";
import { useMotion } from "@/components/shell/Motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Photo } from "@/components/ui/Photo";
import { RichText } from "@/components/ui/RichText";
import { TextLink } from "@/components/ui/TextLink";
import { coPresidents, departmentMembers, departments } from "@/content/officers";
import { photos } from "@/content/media";
import { site, team } from "@/content/site";
import { cn } from "@/lib/cn";
import { padMasks } from "@/components/ui/splitMask";
import { DESKTOP_MOTION, gsap, REDUCED_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

export function TeamPage() {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const { onIntro, scrollTo } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      const h = heading.current;
      if (!el || !h) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const split = SplitText.create(h, { type: "lines", mask: "lines", autoSplit: true, onSplit: padMasks });
        const off = onIntro(() => {
          gsap.fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "tino", stagger: 0.07 });
        });
        const photo = el.querySelector<HTMLElement>("[data-team-photo]");
        const img = el.querySelector<HTMLElement>("[data-team-img]");
        if (photo) {
          onIntro(() => {
            gsap.fromTo(
              photo,
              { clipPath: "inset(0 48% 0 48% round 2rem)" },
              { clipPath: "inset(0 0% 0% 0% round 2rem)", duration: 1.2, ease: "power4.inOut" },
            );
          });
        }
        if (img) {
          onIntro(() => {
            gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "power4.inOut" });
          });
        }
        return () => off();
      });
      mm.add(DESKTOP_MOTION, () => {
        const img = el.querySelector<HTMLElement>("[data-team-img]");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            { yPercent: 6, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
      });
      mm.add(REDUCED_OK, () => {
        el.querySelectorAll<HTMLElement>("[data-name-line]").forEach((line) => {
          gsap.from(line, {
            yPercent: 110,
            duration: 1,
            ease: "tino",
            stagger: 0.08,
            scrollTrigger: { trigger: line.parentElement, start: "top 85%", once: true },
          });
        });
      });

      const index = el.querySelector<HTMLElement>("[data-dept-index]");
      const dot = el.querySelector<HTMLElement>("[data-index-dot]");
      const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-dept]"));
      const hairlines = Array.from(el.querySelectorAll<HTMLElement>("[data-dept-hairline]"));
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (!self.isActive || !index || !dot) return;
            const link = index.querySelector<HTMLElement>(`[data-index-link="${section.id}"]`);
            if (!link) return;
            gsap.to(dot, { y: link.offsetTop + link.offsetHeight / 2 - dot.offsetHeight / 2, duration: 0.45, ease: "tino" });
            index.querySelectorAll<HTMLElement>("[data-index-link]").forEach((node) => {
              node.dataset.active = node === link ? "true" : "false";
            });
          },
        });
      });
      mm.add(REDUCED_OK, () => {
        hairlines.forEach((line) => {
          gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "tino", scrollTrigger: { trigger: line, start: "top 90%", once: true } });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const jumpTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) scrollTo(target, { offset: -96 });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div ref={root}>
      <section className="px-5 pt-40 pb-16 md:px-10 md:pt-44 lg:px-14">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
            <h1
              ref={heading}
              className="font-display text-[clamp(2.4rem,5.6vw,6.5rem)] leading-[1] font-bold tracking-[-0.03em] text-ink lg:col-span-8"
            >
              <RichText runs={team.heading} accentClassName="text-maroon" />
            </h1>
            <p className="max-w-[40ch] text-[1.1875rem] leading-[1.55] text-ink/80 lg:col-span-4 lg:col-start-9">{team.intro}</p>
          </div>

          <figure className="mt-16">
            <div data-team-photo className="relative aspect-[16/10] overflow-hidden rounded-[2rem] md:aspect-[21/9]">
              <div data-team-img className="absolute inset-0 scale-[1.04]">
                <Photo slug={team.photo} sizes="(min-width: 768px) 90vw, 100vw" objectPosition="center 40%" className="absolute inset-0" />
              </div>
            </div>
            {photos[team.photo].caption ? (
              <figcaption className="mt-4 text-sm font-medium text-muted">{photos[team.photo].caption}</figcaption>
            ) : null}
          </figure>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] gap-12 md:grid-cols-2 md:gap-0">
          {coPresidents.map((person, i) => {
            const [first, ...rest] = person.name.split(" ");
            return (
              <div
                key={person.name}
                className={cn("flex flex-col gap-4 md:px-12", i === 0 ? "md:pl-0" : "md:border-l md:border-ink/12 md:pr-0")}
              >
                <h3 className="font-display text-[clamp(3rem,7.5vw,8rem)] leading-[1] font-extrabold tracking-[-0.04em] text-ink">
                  <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                    <span data-name-line className="block">
                      {first}
                    </span>
                  </span>
                  <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                    <span data-name-line className="block">
                      {rest.join(" ")}
                    </span>
                  </span>
                </h3>
                <p className="text-[1.25rem] font-medium text-maroon">{person.role}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-28 md:px-10 md:pb-40 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12 lg:gap-10">
          <nav aria-label={team.departmentsLabel} className="hidden lg:col-span-3 lg:block">
            <div data-dept-index className="sticky top-[7.5rem] relative flex flex-col gap-1">
              <span
                data-index-dot
                aria-hidden="true"
                className="absolute top-0 left-0 size-2 rounded-full bg-maroon"
              />
              {departments.map((d) => (
                <a
                  key={d.id}
                  href={`#${d.id}`}
                  data-index-link={d.id}
                  data-active="false"
                  onClick={jumpTo(d.id)}
                  className="relative py-2 pl-5 text-[1rem] font-medium text-muted transition-colors duration-250 ease-tino data-[active=true]:text-ink hover:text-ink"
                >
                  {d.name}
                </a>
              ))}
            </div>
          </nav>

          <div className="flex flex-col lg:col-span-8 lg:col-start-5">
            {departments.map((d) => {
              const count = departmentMembers(d).length;
              return (
                <section key={d.id} id={d.id} data-dept className="relative scroll-mt-[7rem] border-t border-ink/12 py-16 first:border-t-0 first:pt-0">
                  <span data-dept-hairline aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-ink/12" />
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <h2 className="font-display text-[clamp(2rem,3.2vw,3.25rem)] leading-none font-bold tracking-[-0.025em] text-ink">
                      {d.name}
                    </h2>
                    <span className="text-sm font-medium text-muted">{team.officersInDepartment(count)}</span>
                  </div>
                  <div className="mt-8">
                    <p className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.02em] text-ink">
                      {d.vp.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">{d.vp.role}</p>
                  </div>
                  <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                    {d.groups.map((group) => (
                      <div key={group.lead.name} className="flex flex-col gap-4">
                        <div className="group" data-reveal>
                          <p className="text-[1.25rem] leading-[1.25] font-semibold text-ink transition-transform duration-250 ease-tino group-hover:translate-x-1">
                            {group.lead.name}
                          </p>
                          <p className="mt-1 text-sm text-muted">{group.lead.role}</p>
                        </div>
                        {group.deputies?.length ? (
                          <div className="flex flex-col gap-4 border-l border-ink/12 pl-5">
                            {group.deputies.map((deputy) => (
                              <div key={deputy.name} className="group" data-reveal>
                                <p className="text-[1.0625rem] leading-[1.35] font-medium text-ink/85 transition-transform duration-250 ease-tino group-hover:translate-x-1">
                                  {deputy.name}
                                </p>
                                <p className="mt-0.5 text-sm text-muted">{deputy.role}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper-2 px-5 py-28 md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <h2 className="font-display text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.01em] text-ink">{team.advisorLabel}</h2>
            <p className="font-display text-[clamp(2rem,3vw,3rem)] leading-[1.05] font-bold tracking-[-0.025em] text-ink">{site.advisor.name}</p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:col-span-6 lg:col-start-7">
            <p className="text-[1.0625rem] text-muted">{site.advisor.teaches}</p>
            <TextLink href={`mailto:${site.advisor.email}`} label={site.advisor.email} className="text-ink" />
          </div>
        </div>
      </section>

      <section data-nav-theme="dark" className="bg-maroon px-5 py-28 text-paper md:px-10 md:py-36 lg:px-14">
        <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <ApplyHeading heading={team.apply.heading} />
          </div>
          <div className="flex max-w-[40ch] flex-col items-start gap-8 lg:col-span-4 lg:col-start-9">
            <p className="text-[1.1875rem] leading-[1.55] text-paper/80">{team.apply.body}</p>
            <Magnetic>
              <Button href={team.apply.cta.href} label={team.apply.cta.label} variant="light" />
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplyHeading({ heading }: { heading: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        SplitText.create(el, {
          type: "words,chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: 1.1,
              ease: "tino",
              stagger: 0.025,
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} className="font-display text-[clamp(2.4rem,4.4vw,4.75rem)] leading-[1] font-extrabold tracking-[-0.03em] pb-[0.12em] text-paper [clip-path:inset(-0.5em_-0.5em_-0.3em_-0.5em)]">
      {heading}
    </h2>
  );
}
