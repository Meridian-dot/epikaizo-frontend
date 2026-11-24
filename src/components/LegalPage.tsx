import { PageHero } from "@/components/PageHero";

// Layout for the privacy and terms pages. The wording is a draft that
// Ms Tina (the manager) still needs to approve.
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <PageHero eyebrow="The small print" title={title} body={intro} />
      <article className="mx-auto max-w-3xl px-5 py-14">
        <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-muted">
          Draft wording, awaiting approval by Epikaizo Guesthouse.
        </p>
        {sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-3xl">{s.heading}</h2>
            <div className="mt-3 space-y-3 text-lg text-muted">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </>
  );
}
