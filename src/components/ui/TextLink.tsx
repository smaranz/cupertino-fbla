import { TransitionLink } from "@/components/shell/TransitionLink";
import { cn } from "@/lib/cn";

export function TextLink({ href, label, className }: { href: string; label: string; className?: string }) {
  const external = !href.startsWith("/") && !href.startsWith("#");
  const classes = cn("text-link inline-block font-sans font-medium text-[0.9375rem]", className);
  if (external) {
    const web = href.startsWith("http");
    return (
      <a href={href} className={classes} {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={classes}>
      {label}
    </TransitionLink>
  );
}
