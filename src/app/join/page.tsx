import type { Metadata } from "next";
import { JoinPage } from "@/components/join/JoinPage";
import { RevealRoot } from "@/components/ui/RevealRoot";
import { joinPage } from "@/content/site";

export const metadata: Metadata = {
  title: joinPage.meta.title,
  description: joinPage.meta.description,
};

export default function Page() {
  return (
    <RevealRoot>
      <JoinPage />
    </RevealRoot>
  );
}
