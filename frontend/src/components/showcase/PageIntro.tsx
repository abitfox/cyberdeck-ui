/* PageIntro · header block at the top of each demo page */

interface PageIntroProps {
  title: string;
  description?: string;
}

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <header className="mb-8 border-b border-[var(--edex-line)] pb-4">
      <h1 className="edex-glow text-xl tracking-[0.3em] text-[var(--edex-fg-bright)]">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-[var(--edex-fg-dim)]">
          {description}
        </p>
      )}
    </header>
  );
}
