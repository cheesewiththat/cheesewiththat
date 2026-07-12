export function PageIntro({
  eyebrow,
  title,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={`${dark ? "bg-charcoal text-cream" : ""} px-5 py-20 lg:px-10 lg:py-28`}
    >
      <div className="mx-auto max-w-page">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="display max-w-5xl text-6xl sm:text-7xl lg:text-9xl">
          {title}
        </h1>
        <div className="mt-8 max-w-2xl text-lg leading-relaxed opacity-80">
          {children}
        </div>
      </div>
    </section>
  );
}
