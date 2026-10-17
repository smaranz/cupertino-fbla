import { gsap, type SplitText } from "@/lib/gsap";

// Gives each line mask descender room without moving the layout: the padding is cancelled by a negative margin.
export function padMasks(self: SplitText) {
  gsap.set(self.masks, { paddingBottom: "0.18em", marginBottom: "-0.18em" });
}
