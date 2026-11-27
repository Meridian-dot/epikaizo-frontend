import type { Metadata } from "next";
import { EventEnquiryForm } from "@/components/forms/EventEnquiryForm";
import { NoSsr } from "@/components/NoSsr";
import { PageHero } from "@/components/PageHero";
import { PageSections } from "@/components/PageSections";
import { BeadRow } from "@/components/Patterns";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { eyebrow } from "@/components/ui";
import { getPageContent, getSettings } from "@/lib/api";
import { pagePhoto, splitPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meetings & Events",
  description:
    "A hall for about 60 people in Outapi, for meetings, trainings and workshops.",
};

export default async function EventsPage() {
  const [content, settings] = await Promise.all([
    getPageContent("events"),
    getSettings(),
  ]);
  const { intro, sections } = splitPageContent(content);

  return (
    <>
      <PageHero
        eyebrow="Meetings & Events"
        title={content.title}
        body={intro}
        note={{
          title: "A place to gather",
          body: "For centuries the Ombalantu baobab next door has been a place of refuge, worship and communication. A few steps away, our hall keeps that spirit of people coming together.",
        }}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
        <Reveal>
          <Photo
            photo={pagePhoto(content, 0)}
            label="The hall"
            className="aspect-[4/3] rounded-[2rem]"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className={eyebrow}>The hall</p>
          <h2 className="mt-3 text-4xl">
            Room for about {settings.hallCapacity} people
          </h2>
          <BeadRow className="mt-5" />
          <ul className="mt-6 space-y-3 text-lg text-muted">
            {[
              "Corporate meetings and planning sessions",
              "Training courses and workshops",
              "Community gatherings",
              "Meals for the whole group from our kitchen, including platters for 8 to 10",
              "Rooms for delegates who stay over",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-2.5 shrink-0 rotate-45 bg-gold"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Ask us about equipment such as a projector or sound system.
          </p>
        </Reveal>
      </section>

      <PageSections sections={sections} className="pt-0 sm:pt-0" />

      <section aria-labelledby="enquiry-title" className="bg-sand">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 id="enquiry-title" className="text-4xl">
            Tell us about your event
          </h2>
          <p className="mt-3 text-lg text-muted">
            Send us the details and we&apos;ll get back to you to plan it
            together.
          </p>
          <div className="mt-8">
            <NoSsr fallback={<p className="text-muted">Loading the form…</p>}>
              <EventEnquiryForm />
            </NoSsr>
          </div>
        </div>
      </section>
    </>
  );
}
