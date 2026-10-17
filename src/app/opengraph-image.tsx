import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { logoPaths, logoViewBox } from "@/components/brand/logo-paths";
import { home, site, type TextRun } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

const PAPER = "#F4EFE7";
const GOLD = "#FDC42D";
const INK = "#16110F";
const HERO_PX = 76;

type Word = { text: string; accent: boolean };

function wordsOf(runs: TextRun[]): Word[] {
  return runs.flatMap((run) =>
    run.text
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, accent: Boolean(run.accent) })),
  );
}

export default async function OpengraphImage() {
  const root = process.cwd();
  const [photo, bold, italic] = await Promise.all([
    readFile(path.join(root, "src/assets/photos/chapter-anaheim.jpg")),
    readFile(path.join(root, "src/assets/fonts/og/KaTeX_SansSerif-Bold.ttf")),
    readFile(path.join(root, "src/assets/fonts/og/KaTeX_Main-Italic.ttf")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: INK }}>
        <img src={photoSrc} alt="" style={{ position: "absolute", top: 0, right: 0, width: 600, height: 630, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 630,
            backgroundImage: `linear-gradient(to right, ${INK} 0%, rgba(22,17,15,0.55) 45%, rgba(22,17,15,0) 100%)`,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 660,
            height: 630,
            padding: "72px 0 72px 72px",
            position: "relative",
          }}
        >
          <svg viewBox={logoViewBox} width={260} height={121} fillRule="evenodd">
            <path d={logoPaths.swoosh} fill={PAPER} />
            <path d={logoPaths["t-stem"]} fill={PAPER} />
            <path d={logoPaths.n} fill={PAPER} />
            <path d={logoPaths.tie} fill={GOLD} />
            <path d={logoPaths["mark-arrow-1"]} fill={PAPER} />
            <path d={logoPaths["mark-arrow-2"]} fill={PAPER} />
            <path d={logoPaths["mark-arrow-3"]} fill={GOLD} />
            <path d={logoPaths["mark-text"]} fill={PAPER} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {home.hero.lines.map((line, i) => (
              <div key={i} style={{ display: "flex", flexWrap: "wrap", columnGap: 20, rowGap: 0, width: 560 }}>
                {wordsOf(line).map((word, j) =>
                  word.accent ? (
                    <span
                      key={j}
                      style={{
                        display: "flex",
                        fontFamily: "KaTeX Main",
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: HERO_PX,
                        lineHeight: 1,
                        color: GOLD,
                      }}
                    >
                      {word.text}
                    </span>
                  ) : (
                    <span
                      key={j}
                      style={{
                        display: "flex",
                        fontFamily: "KaTeX Sans",
                        fontWeight: 700,
                        fontSize: HERO_PX,
                        lineHeight: 1,
                        letterSpacing: -2,
                        color: PAPER,
                      }}
                    >
                      {word.text}
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "KaTeX Sans", data: bold, weight: 700, style: "normal" },
        { name: "KaTeX Main", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
