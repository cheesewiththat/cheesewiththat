"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { notFound } from "next/navigation";
import { photographs, prints } from "@/content/site";
import { EnquiryForm } from "@/components/EnquiryForm";
import { resolveMediaPath } from "@/lib/media";
export default function PrintDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = prints.find((p) => p.slug === slug);
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  if (!product) notFound();
  const photo = photographs.find((p) => p.id === product.photograph)!;
  return (
    <article className="mx-auto grid max-w-page gap-10 px-5 py-16 lg:grid-cols-2 lg:px-10">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink">
        <Image
          src={resolveMediaPath(photo.image)}
          alt={photo.alt}
          fill
          priority
          sizes="50vw"
          className="object-contain"
        />
      </div>
      <div>
        <p className="eyebrow">Print preview · {product.collection}</p>
        <h1 className="display mt-5 text-7xl">{product.title}</h1>
        <p className="mt-6 text-lg">{product.story}</p>
        <fieldset className="mt-8">
          <legend className="font-semibold">Preferred size</legend>
          <div className="mt-3 flex gap-2">
            {product.sizes.map((s) => (
              <button
                type="button"
                aria-pressed={size === s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-4 py-2 ${size === s ? "bg-ink text-white" : ""}`}
                key={s}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="bg-vermilion/10 mt-6 rounded-lg p-4 text-sm">
          Checkout is not active. Sizes, framing, pricing and shipping will be
          confirmed before any order is accepted.
        </p>
        <div className="mt-8">
          <EnquiryForm
            kind="print"
            context={{ product: product.title, preferredSize: size }}
          />
        </div>
      </div>
    </article>
  );
}
