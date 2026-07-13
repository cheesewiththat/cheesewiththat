import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { brandAssets } from "@/lib/brand-assets";

export function BrandHomeLink({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href="/"
      aria-label="Cheesewiththat home"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <span className="ring-ink/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f8f2e5] ring-1">
        <Image
          src={brandAssets.headerMark}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          priority
          className="h-7 w-7"
        />
      </span>
      <span className="font-serif text-2xl leading-none max-[359px]:sr-only">
        Cheesewiththat
      </span>
    </Link>
  );
}
