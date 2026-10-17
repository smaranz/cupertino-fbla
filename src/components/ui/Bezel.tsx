import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Double bezel: an outer tray with a hairline ring, and an inner core with its own surface and top highlight.
export function Bezel({
  children,
  coreClassName,
  className,
  tone = "light",
}: {
  children: ReactNode;
  coreClassName?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] p-2",
        tone === "light" ? "bg-ink/5 ring-1 ring-ink/12" : "bg-paper/5 ring-1 ring-paper/14",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[calc(2rem-0.5rem)] shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]",
          tone === "dark" ? "shadow-[inset_0_1px_0_rgb(244_239_231/0.1)]" : "",
          coreClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
