import type { Metadata } from "next";
import { ResultsPage } from "@/components/results/ResultsPage";
import { RevealRoot } from "@/components/ui/RevealRoot";
import { resultsPage } from "@/content/site";

export const metadata: Metadata = {
  title: resultsPage.meta.title,
  description: resultsPage.meta.description,
};

export default function Page() {
  return (
    <RevealRoot>
      <ResultsPage />
    </RevealRoot>
  );
}
