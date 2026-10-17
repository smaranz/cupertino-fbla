"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { nav, site, transitions } from "@/content/site";
import { cn } from "@/lib/cn";
import { gsap, REDUCED_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { TransitionLink } from "./TransitionLink";
import { useMotion } from "./Motion";

const HIDE_AFTER = 160;

export function Nav() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const darkSections = useRef(new Set<string>());
  const [darkSection, setDark] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const dark = darkSection || menuOpen;

  useGSAP(
    () => {
      const el = header.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const trigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (menuOpen) {
              gsap.to(el, { yPercent: 0, duration: 0.5, ease: "tino" });
              return;
            }
            const hide = self.direction === 1 && self.scroll() > HIDE_AFTER;
            gsap.to(el, { yPercent: hide ? -200 : 0, duration: 0.5, ease: "tino", overwrite: true });
          },
        });
        return () => trigger.kill();
      });
      return () => mm.revert();
    },
    { scope: header, dependencies: [menuOpen] },
  );

  useGSAP(
    () => {
      const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')).map((section, i) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 48px",
          end: "bottom 48px",
          id: `nav-dark-${i}`,
          onToggle: (self) => {
            const key = `nav-dark-${i}`;
            if (self.isActive) darkSections.current.add(key);
            else darkSections.current.delete(key);
            setDark(darkSections.current.size > 0);
          },
        }),
      );
      return () => {
        triggers.forEach((t) => t.kill());
        darkSections.current.clear();
      };
    },
    { dependencies: [pathname] },
  );

  function highlight(target: HTMLElement) {
    const list = linksRef.current;
    const p = pill.current;
    if (!list || !p) return;
    const rect = target.getBoundingClientRect();
    const base = list.getBoundingClientRect();
    p.style.width = `${rect.width}px`;
    gsap.to(p, { x: rect.left - base.left, scaleX: 1, opacity: 1, duration: 0.45, ease: "tino", overwrite: true });
  }

  function clearHighlight() {
    if (pill.current) gsap.to(pill.current, { opacity: 0, scaleX: 0.85, duration: 0.25, overwrite: true });
  }

  const glass = dark
    ? "bg-ink/55 text-paper ring-1 ring-paper/14 shadow-[inset_0_0.0625rem_0_rgb(244_239_231/0.12),0_1.25rem_2.5rem_-1.5rem_rgb(22_17_15/0.45)]"
    : "bg-paper/75 text-ink ring-1 ring-ink/8 shadow-[inset_0_0.0625rem_0_rgb(255_255_255/0.6),0_1.25rem_2.5rem_-1.5rem_rgb(22_17_15/0.25)]";

  return (
    <>
      <header
        ref={header}
        data-dark={dark ? "" : undefined}
        className="fixed inset-x-0 top-4 z-(--z-nav) flex justify-center px-4"
      >
        <div
          className={cn(
            "flex h-16 w-[min(75rem,calc(100%-2rem))] items-center justify-between rounded-full pr-2 pl-3 backdrop-blur-xl transition-[background-color,color,box-shadow] duration-300",
            glass,
          )}
        >
          <TransitionLink href="/" aria-label={site.name} className="flex items-center rounded-full pl-2">
            <Logo variant={dark ? "light" : "color"} className="h-8.5 w-auto transition-opacity duration-300" />
          </TransitionLink>

          <ul
            ref={linksRef}
            className="relative hidden items-center lg:flex"
            onPointerLeave={clearHighlight}
          >
            <span
              ref={pill}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1/2 left-0 h-10 origin-left -translate-y-1/2 scale-x-0 rounded-full opacity-0",
                dark ? "bg-paper/12" : "bg-ink/6",
              )}
            />
            {nav.links.map((link) => {
              const current = link.href === pathname;
              return (
                <li key={link.href} className="relative">
                  <TransitionLink
                    href={link.href}
                    onPointerEnter={(e: PointerEvent<HTMLAnchorElement>) => highlight(e.currentTarget)}
                    onFocus={(e) => highlight(e.currentTarget)}
                    onBlur={clearHighlight}
                    className="relative z-10 flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium"
                  >
                    {link.label}
                    {current ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full",
                          dark ? "bg-gold" : "bg-maroon",
                        )}
                      />
                    ) : null}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button href={nav.cta.href} label={nav.cta.label} variant="maroon" size="sm" className="hidden lg:inline-flex" />
            <MenuButton open={menuOpen} onToggle={() => setMenuPath(menuOpen ? null : pathname)} />
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuPath(null)} />
    </>
  );
}

function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? transitions.menuClose : transitions.menuOpen}
      className="relative flex h-11 items-center gap-2.5 rounded-full bg-ink/6 pr-4 pl-3.5 text-[0.9375rem] font-medium text-current transition-colors duration-250 ease-tino hover:bg-ink/10 active:scale-[0.98] lg:hidden"
    >
      <span className="relative block h-3.5 w-5" aria-hidden="true">
        <span
          className={cn(
            "absolute top-1/2 left-0 h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-450 ease-tino",
            open ? "translate-y-0 rotate-45" : "-translate-y-1",
          )}
        />
        <span
          className={cn(
            "absolute top-1/2 left-0 h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-450 ease-tino",
            open ? "translate-y-0 -rotate-45" : "translate-y-1",
          )}
        />
      </span>
      <span>Menu</span>
    </button>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const overlay = useRef<HTMLDivElement>(null);
  const { stop, start } = useMotion();
  const wasOpen = useRef(false);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(REDUCED_OK, () => {
        const items = el.querySelectorAll<HTMLElement>("[data-menu-item]");
        if (open) {
          gsap.set(el, { visibility: "visible" });
          gsap.fromTo(el, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.7, ease: "power4.inOut" });
          gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "tino", stagger: 0.06, delay: 0.3 });
        } else if (wasOpen.current) {
          gsap.to(el, {
            clipPath: "circle(0% at 100% 0%)",
            duration: 0.6,
            ease: "power4.inOut",
            onComplete: () => {
              gsap.set(el, { visibility: "hidden" });
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: overlay, dependencies: [open] },
  );

  useEffect(() => {
    if (open) {
      stop();
      wasOpen.current = true;
      const first = overlay.current?.querySelector<HTMLElement>("a");
      first?.focus();
    } else if (wasOpen.current) {
      start();
    }
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !overlay.current) return;
    const focusable = Array.from(overlay.current.querySelectorAll<HTMLElement>("a, button"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      id="mobile-menu"
      ref={overlay}
      onKeyDown={trapFocus}
      aria-hidden={!open}
      style={{ visibility: "hidden", clipPath: "circle(0% at 100% 0%)" }}
      className="fixed inset-0 z-(--z-menu) flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
    >
      <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-5 pt-28 pb-10">
        {nav.links.map((link) => (
          <div key={link.href} className="overflow-hidden pb-[0.18em] -mb-[0.18em]">
            <TransitionLink
              href={link.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              aria-current={link.href === pathname ? "page" : undefined}
              className="block font-display text-[13vw] leading-[1] font-bold tracking-[-0.03em]"
            >
              <span data-menu-item className="flex items-center gap-4">
                {link.label}
                {link.href === pathname ? <span aria-hidden="true" className="size-2.5 rounded-full bg-gold" /> : null}
              </span>
            </TransitionLink>
          </div>
        ))}
        <div className="mt-8 overflow-hidden pb-[0.18em] -mb-[0.18em]">
          <div data-menu-item>
            <Button href={nav.cta.href} label={nav.cta.label} variant="maroon" />
          </div>
        </div>
      </nav>
      <div className="flex flex-wrap gap-x-6 gap-y-3 px-5 pb-10 text-[0.9375rem] text-paper/80">
        <a href={`mailto:${site.email}`} className="text-link" tabIndex={open ? 0 : -1}>
          {site.email}
        </a>
        <a href={site.instagram.href} target="_blank" rel="noopener noreferrer" className="text-link" tabIndex={open ? 0 : -1}>
          {site.instagram.label}
        </a>
        <a href={site.tiktok.href} target="_blank" rel="noopener noreferrer" className="text-link" tabIndex={open ? 0 : -1}>
          {site.tiktok.label}
        </a>
      </div>
    </div>
  );
}
