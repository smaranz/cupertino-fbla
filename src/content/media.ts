import type { StaticImageData } from "next/image";
import chapterAnaheim from "@/assets/photos/chapter-anaheim.jpg";
import slcAwardsStage from "@/assets/photos/slc-awards-stage.jpg";
import candidProfile from "@/assets/photos/candid-profile.jpg";
import candidFocus from "@/assets/photos/candid-focus.jpg";
import nlcSanAntonio from "@/assets/photos/nlc-san-antonio.jpg";
import nlcLineup from "@/assets/photos/nlc-lineup.jpg";
import nlcApplause from "@/assets/photos/nlc-applause.jpg";
import nlcTrophies from "@/assets/photos/nlc-trophies.jpg";
import nlcTrophiesKneel from "@/assets/photos/nlc-trophies-kneel.jpg";
import nlcStageTrophy from "@/assets/photos/nlc-stage-trophy.jpg";
import nlcHandshake from "@/assets/photos/nlc-handshake.jpg";
import nlcAwardLine from "@/assets/photos/nlc-award-line.jpg";
import projectPinkLemonade from "@/assets/photos/project-pink-lemonade.jpg";
import projectForged from "@/assets/photos/project-forged.jpg";
import projectUnlocked from "@/assets/photos/project-unlocked.jpg";
import projectSliced from "@/assets/photos/project-sliced.jpg";
import bslcHomestead from "@/assets/photos/bslc-homestead.jpg";
import chapterMaroonBlazers from "@/assets/photos/chapter-maroon-blazers.jpg";
import nlcWebsiteDesignStage from "@/assets/photos/nlc-website-design-stage.jpg";
import nlcWebsiteDesignTrophies from "@/assets/photos/nlc-website-design-trophies.jpg";
import { photoMeta, type PhotoMeta, type PhotoSlug } from "./photos";

export type PhotoEntry = PhotoMeta & { src: StaticImageData };

const sources: Record<PhotoSlug, StaticImageData> = {
  "chapter-anaheim": chapterAnaheim,
  "slc-awards-stage": slcAwardsStage,
  "candid-profile": candidProfile,
  "candid-focus": candidFocus,
  "nlc-san-antonio": nlcSanAntonio,
  "nlc-lineup": nlcLineup,
  "nlc-applause": nlcApplause,
  "nlc-trophies": nlcTrophies,
  "nlc-trophies-kneel": nlcTrophiesKneel,
  "nlc-stage-trophy": nlcStageTrophy,
  "nlc-handshake": nlcHandshake,
  "nlc-award-line": nlcAwardLine,
  "project-pink-lemonade": projectPinkLemonade,
  "project-forged": projectForged,
  "project-unlocked": projectUnlocked,
  "project-sliced": projectSliced,
  "bslc-homestead": bslcHomestead,
  "chapter-maroon-blazers": chapterMaroonBlazers,
  "nlc-website-design-stage": nlcWebsiteDesignStage,
  "nlc-website-design-trophies": nlcWebsiteDesignTrophies,
};

export const photos = Object.fromEntries(
  (Object.keys(sources) as PhotoSlug[]).map((slug) => [slug, { src: sources[slug], ...photoMeta[slug] }]),
) as Record<PhotoSlug, PhotoEntry>;
