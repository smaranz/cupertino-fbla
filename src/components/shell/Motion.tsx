"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, REDUCED_OK, ScrollTrigger } from "@/lib/gsap";

type Target = number | string | HTMLElement;
type ScrollOptions = { offset?: number; immediate?: boolean; duration?: number };

type MotionValue = {
  scrollTo: (target: Target, options?: ScrollOptions) => void;
  stop: () => void;
  start: () => void;
  onIntro: (fn: () => void) => () => void;
  openIntro: () => void;
  navigate: (href: string) => void;
};

const MotionContext = createContext<MotionValue | null>(null);

export function useMotion(): MotionValue {
  const value = useContext(MotionContext);
  if (!value) throw new Error("useMotion must be used inside MotionProvider");
  return value;
}

function motionOn() {
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const introOpen = useRef(false);
  const introListeners = useRef(new Set<() => void>());
  const navigatingRef = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(REDUCED_OK, () => {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
      lenisRef.current = lenis;
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("gsap-ready");
      if (panelRef.current) gsap.set(panelRef.current, { yPercent: 100, autoAlpha: 0 });
      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
      };
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, []);

  const openIntro = useCallback(() => {
    introOpen.current = true;
    const listeners = [...introListeners.current];
    introListeners.current.clear();
    listeners.forEach((fn) => fn());
  }, []);

  const onIntro = useCallback((fn: () => void) => {
    if (introOpen.current) {
      fn();
      return () => {};
    }
    introListeners.current.add(fn);
    return () => introListeners.current.delete(fn);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const lenis = lenisRef.current;
    const panel = panelRef.current;
    const hash = window.location.hash;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    const el = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (el) {
      if (lenis) lenis.scrollTo(el, { offset: -96 });
      else window.scrollTo(0, el.offsetTop - 96);
    }
    if (navigatingRef.current && panel) {
      navigatingRef.current = false;
      openIntro();
      gsap.to(panel, {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(panel, { yPercent: 100, autoAlpha: 0 });
        },
      });
    } else {
      openIntro();
    }
  }, [pathname, openIntro]);

  const navigate = useCallback(
    (href: string) => {
      const panel = panelRef.current;
      if (!motionOn() || !panel) {
        router.push(href);
        return;
      }
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      introOpen.current = false;
      gsap
        .timeline({ onComplete: () => router.push(href) })
        .fromTo(
          panel,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power4.inOut" },
        );
    },
    [router],
  );

  const scrollTo = useCallback((target: Target, options?: ScrollOptions) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, options);
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (typeof target === "number") window.scrollTo({ top: target });
    else if (el instanceof HTMLElement) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0) });
    }
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  const value = useMemo<MotionValue>(
    () => ({ scrollTo, stop, start, onIntro, openIntro, navigate }),
    [scrollTo, stop, start, onIntro, openIntro, navigate],
  );

  return (
    <MotionContext.Provider value={value}>
      {children}
      <div
        ref={panelRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-(--z-transition) flex items-center justify-center bg-maroon text-paper"
        style={{ visibility: "hidden" }}
      >
        <Logo variant="light" className="h-14 w-auto" />
      </div>
    </MotionContext.Provider>
  );
}
