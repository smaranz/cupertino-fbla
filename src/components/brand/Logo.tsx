import { logoPaths, logoViewBox, type LogoPart } from "./logo-paths";

type Variant = "color" | "light" | "mono";

type Props = {
  variant?: Variant;
  className?: string;
  title?: string;
};

const palette: Record<Exclude<Variant, "mono">, Record<LogoPart, string>> = {
  color: {
    swoosh: "#9E000C",
    "t-stem": "#9E000C",
    n: "#9E000C",
    tie: "#FDC42D",
    "mark-arrow-1": "#073EBB",
    "mark-arrow-2": "#073EBB",
    "mark-arrow-3": "#FDC42D",
    "mark-text": "#073EBB",
  },
  light: {
    swoosh: "#F4EFE7",
    "t-stem": "#F4EFE7",
    n: "#F4EFE7",
    tie: "#FDC42D",
    "mark-arrow-1": "#F4EFE7",
    "mark-arrow-2": "#F4EFE7",
    "mark-arrow-3": "#FDC42D",
    "mark-text": "#F4EFE7",
  },
};

export function Logo({ variant = "color", className, title = "Cupertino FBLA" }: Props) {
  const parts = Object.keys(logoPaths) as LogoPart[];
  return (
    <svg viewBox={logoViewBox} role="img" aria-label={title} className={className} fillRule="evenodd">
      <title>{title}</title>
      {parts.map((part) => (
        <path
          key={part}
          data-part={part}
          d={logoPaths[part]}
          fill={variant === "mono" ? "currentColor" : palette[variant][part]}
        />
      ))}
    </svg>
  );
}

export function LogoTie({ className }: { className?: string }) {
  return (
    <svg viewBox="133 26 41 116" aria-hidden="true" className={className}>
      <path d={logoPaths.tie} fill="#FDC42D" fillRule="evenodd" />
    </svg>
  );
}
