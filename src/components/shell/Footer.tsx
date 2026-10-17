"use client";

import { ArrowUp, ArrowUpRight, InstagramLogo, TiktokLogo } from "@phosphor-icons/react";
import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { footer, site, type LinkItem } from "@/content/site";
import { gsap, REDUCED_OK, useGSAP } from "@/lib/gsap";
import { TextLink } from "@/components/ui/TextLink";
import { useMotion } from "./Motion";

// Order in which the logo pieces rise into place, matching the intro animation.
const PART_ORDER = ["swoosh", "t-stem", "tie", "n", "mark-arrow-1", "mark-arrow-2", "mark-arrow-3", "mark-text"];

function FooterLink({ link }: { link: LinkItem }) {
  if (link.external) {
    const Icon = link.label === site.instagram.label ? InstagramLogo : link.label === site.tiktok.label ? TiktokLogo : null;
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link inline-flex items-center gap-2 text-[0.9375rem] text-paper"
      >
        {Icon ? <Icon size={16} weight="regular" aria-hidden="true" /> : null}
        {link.label}
        <ArrowUpRight size={14} weight="regular" aria-hidden="true" />
      </a>
    );
  }
  return <TextLink href={link.href} label={link.label} className="text-[0.9375rem] text-paper" />;
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const { scrollTo } = useMotion();

  useGSAP(
    () => {
      const el = root.current;
      const logo = mark.current;
      if (!el || !logo) return;
      const parts = PART_ORDER.map((name) => logo.querySelector<SVGPathElement>(`[data-part="${name}"]`)).filter(
        (part): part is SVGPathElement => part !== null,
      );
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        gsap.fromTo(
          parts,
          { yPercent: 70, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} data-nav-theme="dark" className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[calc(90rem_+_7rem)] px-5 pt-28 pb-10 md:px-10 md:pt-36 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <p className="max-w-[24rem] text-[1.125rem] leading-[1.45] text-paper/80 lg:col-span-5">{footer.blurb}</p>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-7">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-medium text-muted-dark">{column.title}</h2>
                <ul className="mt-4 flex flex-col items-start gap-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[calc(90rem_+_7rem)] px-5 pt-6 md:px-10 md:pt-10 lg:px-14">
        <div ref={mark} aria-hidden="true" className="[clip-path:inset(0)]">
          <Logo variant="light" title={site.name} className="block h-auto w-[min(100%,calc(62svh*2.144))]" />
        </div>
      </div>

      <div className="mx-auto flex max-w-[calc(90rem_+_7rem)] flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
        <p className="text-sm text-muted-dark">{footer.legal}</p>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="group inline-flex w-fit items-center gap-2 rounded-full bg-paper/8 py-2.5 pr-2.5 pl-5 text-[0.9375rem] font-medium text-paper ring-1 ring-paper/14 transition-[background-color,transform] duration-250 ease-tino hover:bg-paper/14 active:scale-[0.98]"
        >
          {footer.backToTop}
          <span className="grid size-9 place-items-center rounded-full bg-paper text-ink transition-transform duration-250 ease-tino group-hover:-translate-y-0.5 group-hover:scale-[1.06]">
            <ArrowUp size={16} weight="regular" aria-hidden="true" />
          </span>
        </button>
      </div>
    </footer>
  );
}
