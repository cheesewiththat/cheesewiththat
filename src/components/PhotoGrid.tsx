import Image from "next/image";
import Link from "next/link";
import { photographs } from "@/content/site";
import { resolveMediaPath } from "@/lib/media";
export function PhotoGrid({ limit }: { limit?: number }) {
  const items = limit ? photographs.slice(0, limit) : photographs;
  return (
    <div className="grid auto-rows-[12rem] gap-4 md:grid-cols-3">
      {items.map((photo, i) => (
        <Link
          key={photo.id}
          href={`/photography/${photo.slug}`}
          className={`group relative overflow-hidden rounded-xl ${i === 0 ? "md:row-span-2" : ""}`}
        >
          <Image
            src={resolveMediaPath(photo.thumbnail)}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-14 text-white">
            <p className="font-serif text-2xl">{photo.title}</p>
            <p className="text-xs">
              {photo.location}
              {photo.availableAsPrint ? " · Available as a print" : ""}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
