import type { Metadata } from "next";
import { NotFoundView } from "@/components/shell/NotFoundView";
import { notFound } from "@/content/site";

export const metadata: Metadata = {
  title: notFound.heading,
};

export default function NotFound() {
  return <NotFoundView />;
}
