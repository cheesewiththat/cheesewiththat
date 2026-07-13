"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/content/site";
import { BrandHomeLink } from "./BrandHomeLink";
import { CheeseToggle } from "./CheeseToggle";
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const theme = scrolled ? "dark" : "light";
  return (
    <header
      data-theme={theme}
      className={`site-header sticky top-0 z-50 border-b backdrop-blur transition-colors duration-200 ${scrolled ? "border-brass bg-charcoal text-cream" : "border-ink bg-bone text-ink"}`}
    >
      <div className="mx-auto flex max-w-page items-center justify-between px-5 py-3 lg:px-10">
        <BrandHomeLink onClick={() => setOpen(false)} />
        <button
          className={`rounded-full border px-3 py-2 text-sm transition-colors lg:hidden ${scrolled ? "border-cream hover:bg-cream hover:text-ink" : "border-ink hover:bg-ink hover:text-cream"}`}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <nav
          id="site-nav"
          aria-label="Main navigation"
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-4 border-b p-5 transition-colors lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 ${scrolled ? "border-brass bg-charcoal text-cream" : "border-ink bg-bone text-ink"}`}
        >
          {navigation.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-sm text-sm font-medium decoration-2 underline-offset-8 hover:underline ${active ? "underline" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
          <CheeseToggle inverse={scrolled} />
          <Link
            href="/engage"
            className={`button border transition-colors ${scrolled ? "border-cream bg-cream text-ink hover:bg-chartreuse" : "border-ink bg-ink text-cream hover:bg-charcoal"}`}
          >
            Engage Mihir
          </Link>
        </nav>
      </div>
    </header>
  );
}
