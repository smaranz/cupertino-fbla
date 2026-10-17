import type { Metadata } from "next";
import { Alumni } from "@/components/home/Alumni";
import { DarkChapter } from "@/components/home/DarkChapter";
import { Hero } from "@/components/home/Hero";
import { JoinCta } from "@/components/home/JoinCta";
import { Manifesto } from "@/components/home/Manifesto";
import { Pillars } from "@/components/home/Pillars";
import { Projects } from "@/components/home/Projects";
import { Stats } from "@/components/home/Stats";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { RevealRoot } from "@/components/ui/RevealRoot";
import { home } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
};

export default function HomePage() {
  return (
    <RevealRoot>
      <div className="relative">
        <Hero />
        <Manifesto />
      </div>
      <Stats />
      <Pillars />
      <Projects />
      <DarkChapter />
      <TeamTeaser />
      <Alumni />
      <JoinCta />
    </RevealRoot>
  );
}
