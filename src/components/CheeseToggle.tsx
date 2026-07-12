"use client";
import { useEffect, useState } from "react";
const key = "cheesewiththat:view";
export function CheeseToggle({ inverse = false }: { inverse?: boolean }) {
  const [cheese, setCheese] = useState(false);
  useEffect(() => {
    const on = localStorage.getItem(key) === "cheese";
    setCheese(on);
    document.documentElement.dataset.cheese = on ? "on" : "off";
  }, []);
  function toggle() {
    const next = !cheese;
    setCheese(next);
    localStorage.setItem(key, next ? "cheese" : "professional");
    document.documentElement.dataset.cheese = next ? "on" : "off";
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={cheese}
      onClick={toggle}
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${inverse ? "border-cream hover:bg-cream hover:text-ink" : "border-ink hover:bg-ink hover:text-cream"}`}
    >
      <span
        aria-hidden
        className={`h-2.5 w-2.5 rounded-full ${cheese ? "bg-vermilion" : inverse ? "bg-brass" : "bg-charcoal"}`}
      />
      {cheese ? "Cheese added" : "Add the cheese"}
    </button>
  );
}
