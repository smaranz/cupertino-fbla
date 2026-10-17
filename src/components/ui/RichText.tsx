import type { TextRun } from "@/content/site";

export function RichText({ runs, accentClassName }: { runs: TextRun[]; accentClassName?: string }) {
  return (
    <>
      {runs.map((run, i) =>
        run.accent ? (
          <span key={i} className={accentClassName}>
            {run.text}
          </span>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}
