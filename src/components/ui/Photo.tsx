import Image from "next/image";
import type { ComponentProps } from "react";
import { photos } from "@/content/media";
import type { PhotoSlug } from "@/content/photos";
import { cn } from "@/lib/cn";

type Props = Omit<ComponentProps<"div">, "children"> & {
  slug: PhotoSlug;
  sizes: string;
  preload?: boolean;
  quality?: 75 | 85;
  objectPosition?: string;
  imgClassName?: string;
  as?: "div" | "span";
};

export function Photo({
  slug,
  sizes,
  preload,
  quality,
  objectPosition = "center",
  className,
  imgClassName,
  as: Root = "div",
  ...rest
}: Props) {
  const photo = photos[slug];
  const positioned = className?.split(" ").includes("absolute");
  return (
    <Root className={cn("overflow-hidden", !positioned && "relative", className)} {...rest}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        preload={preload}
        quality={quality}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition }}
      />
    </Root>
  );
}
