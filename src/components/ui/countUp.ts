import { gsap, ScrollTrigger } from "@/lib/gsap";

// The HTML already holds the final value. The count-up only starts from 0 inside onEnter,
// so a missed trigger (jump scroll, anchor, refresh) leaves the final number on screen.
export function countUp(node: HTMLElement, trigger: string | Element, start: string) {
  const target = Number(node.dataset.count ?? node.dataset.tally);
  const final = String(target);
  const state = { value: 0 };
  const tween = gsap.to(state, {
    value: target,
    duration: 1.6,
    ease: "power3.out",
    paused: true,
    snap: { value: 1 },
    onUpdate: () => {
      node.textContent = String(Math.round(state.value));
    },
    onComplete: () => {
      node.textContent = final;
    },
  });
  ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: () => {
      node.textContent = "0";
      tween.restart(true);
    },
    onRefresh: (self) => {
      if (!self.isActive && !tween.isActive()) node.textContent = final;
    },
  });
  return () => {
    tween.kill();
    node.textContent = final;
  };
}
