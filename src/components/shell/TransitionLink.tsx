"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useMotion } from "./Motion";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function TransitionLink({ href, onClick, onMouseEnter, children, ...rest }: Props) {
  const router = useRouter();
  const { navigate, scrollTo } = useMotion();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (!isInternal(href)) return;
    const target = new URL(href, window.location.href);
    const samePage = target.pathname === window.location.pathname;
    if (samePage) {
      event.preventDefault();
      if (target.hash) {
        const el = document.querySelector<HTMLElement>(target.hash);
        if (el) {
          scrollTo(el, { offset: -96 });
          window.history.pushState(null, "", target.hash);
        }
      } else {
        scrollTo(0);
        window.history.replaceState(null, "", target.pathname);
      }
      return;
    }
    event.preventDefault();
    navigate(target.pathname + target.search + target.hash);
  }

  function handleMouseEnter(event: MouseEvent<HTMLAnchorElement>) {
    onMouseEnter?.(event);
    if (isInternal(href)) router.prefetch(href);
  }

  return (
    <Link href={href} onClick={handleClick} onMouseEnter={handleMouseEnter} {...rest}>
      {children}
    </Link>
  );
}
