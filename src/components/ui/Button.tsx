import { ArrowUpRight } from "@phosphor-icons/react";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { cn } from "@/lib/cn";

type Variant = "dark" | "light" | "maroon";

const variants: Record<Variant, { root: string; circle: string }> = {
  dark: {
    root: "bg-ink text-paper hover:bg-maroon",
    circle: "bg-paper text-ink",
  },
  light: {
    root: "bg-paper text-ink hover:bg-gold",
    circle: "bg-ink text-paper",
  },
  maroon: {
    root: "bg-maroon text-paper hover:bg-maroon-deep",
    circle: "bg-paper text-maroon",
  },
};

type Props = {
  href: string;
  label: string;
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
};

export function Button({ href, label, variant = "dark", size = "md", className }: Props) {
  const v = variants[variant];
  const external = !href.startsWith("/") && !href.startsWith("#");
  const classes = cn(
    "group inline-flex items-center rounded-full font-sans font-medium leading-none whitespace-nowrap",
    "transition-[background-color,transform] duration-250 ease-tino active:scale-[0.98]",
    "focus-visible:outline-offset-[0.1875rem]",
    size === "md" ? "gap-3 py-2.5 pr-2.5 pl-[1.375rem] text-[0.9375rem]" : "gap-2 py-1.5 pr-1.5 pl-4 text-sm",
    v.root,
    className,
  );
  const circleClasses = cn(
    "grid shrink-0 place-items-center rounded-full transition-transform duration-250 ease-tino",
    "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-[1.06]",
    size === "md" ? "size-9" : "size-7",
    v.circle,
  );
  const icon = (
    <span className={circleClasses} aria-hidden="true">
      <ArrowUpRight size={size === "md" ? 16 : 14} weight="regular" />
    </span>
  );

  if (external) {
    const isWeb = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
        {icon}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={classes}>
      {label}
      {icon}
    </TransitionLink>
  );
}
