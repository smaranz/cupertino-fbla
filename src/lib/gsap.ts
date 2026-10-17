import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin, Flip);
CustomEase.create("tino", "0.16,1,0.3,1");

export const REDUCED_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 1024px)";
export const FINE_POINTER = "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";

export { gsap, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin, Flip, useGSAP };
