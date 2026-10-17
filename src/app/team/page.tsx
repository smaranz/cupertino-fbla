import type { Metadata } from "next";
import { TeamPage } from "@/components/team/TeamPage";
import { RevealRoot } from "@/components/ui/RevealRoot";
import { team } from "@/content/site";

export const metadata: Metadata = {
  title: team.meta.title,
  description: team.meta.description,
};

export default function Page() {
  return (
    <RevealRoot>
      <TeamPage />
    </RevealRoot>
  );
}
