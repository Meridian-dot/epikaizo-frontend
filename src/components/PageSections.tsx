import { BeadRow } from "@/components/Patterns";
import { Reveal } from "@/components/Reveal";
import { paragraphs } from "@/lib/format";
import type { PageSection } from "@/lib/types";

// Text sections the owner adds on the dashboard's "Website text" screen,
// shown under a page's hero. Renders nothing when there are none.
export function PageSections({
  sections,
  className = "",
}: {
  sections: PageSection[];
  className?: string;
}) {
  if (sections.length === 0) return null;
  return (
    <section
      aria-label="About this page"
      className={`mx-auto max-w-3xl space-y-12 px-5 py-14 sm:py-16 ${className}`}
    >
      {sections.map((s, i) => (
        <Reveal key={`${i}-${s.heading}`}>
          {s.heading.trim() && (
            <>
              <h2 className="text-3xl sm:text-4xl">{s.heading}</h2>
              <BeadRow className="mt-4" />
            </>
          )}
          <div
            className={`space-y-4 text-lg text-muted ${s.heading.trim() ? "mt-5" : ""}`}
          >
            {paragraphs(s.body).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      ))}
    </section>
  );
}
