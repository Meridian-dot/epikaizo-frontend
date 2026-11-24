import type { Metadata } from "next";
import { BunkerPlan } from "@/components/BunkerPlan";
import { Baobab } from "@/components/Landscape";
import { PageHero } from "@/components/PageHero";
import { BeadRow } from "@/components/Patterns";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { eyebrow } from "@/components/ui";
import { getPageContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Since 2011, a guesthouse built on a historic cross-shaped bunker beside the Ombalantu Baobab Tree in Outapi.",
};

const values = [
  "Historic",
  "Welcoming",
  "Authentic",
  "Convenient",
  "Culturally connected",
  "Adaptable",
];

export default async function AboutPage() {
  const content = await getPageContent("about");

  return (
    <>
      <PageHero
        eyebrow="Our story"
        title={content.title}
        body={content.body}
        note={{
          title: "Since 2011",
          body: "Our doors have been open to travellers, locals and business visitors for well over a decade.",
        }}
      />

      <section
        id="bunker"
        aria-labelledby="bunker-title"
        className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16 sm:py-24"
      >
        <Reveal className="max-w-2xl">
          <p className={eyebrow}>Beneath the guesthouse</p>
          <h2 id="bunker-title" className="mt-3 text-4xl sm:text-5xl">
            A story preserved in time
          </h2>
          <BeadRow className="mt-5" />
          <p className="mt-5 text-lg text-muted">
            Today the bunker houses some of our smaller rooms, a comfortable
            air-conditioned sitting room with a television, and a small
            historical display of memorabilia, political clothing and other
            artefacts. It is a reminder that buildings, much like people, carry
            stories worth preserving.
          </p>
        </Reveal>
        <div className="mt-12">
          <BunkerPlan />
        </div>
      </section>

      <section
        id="outapi"
        aria-labelledby="outapi-title"
        className="relative scroll-mt-32 overflow-hidden bg-brown text-white"
      >
        <Baobab className="pointer-events-none absolute -right-24 bottom-0 w-[36rem] opacity-25 [&_path]:stroke-gold [&_path[fill]]:fill-gold" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal className="max-w-2xl">
            <p className={`${eyebrow} text-gold-light`}>
              In the heart of Outapi
            </p>
            <h2
              id="outapi-title"
              className="mt-3 text-4xl text-white sm:text-5xl"
            >
              Neighbours with the Tree of Life
            </h2>
            <div className="mt-5 space-y-4 text-lg text-white/85">
              <p>
                Outapi is the administrative capital of the Omusati Region, and
                a place to experience the culture, history and hospitality of
                northern Namibia.
              </p>
              <p>
                We are right beside the famous Ombalantu Baobab Tree, known as
                the Tree of Life. With a history spanning centuries, it has
                served as a place of refuge, worship and communication, and is
                one of the region&apos;s most remarkable heritage landmarks.
              </p>
              <p>
                Our location makes us a convenient base for exploring Outapi,
                doing business in the region or travelling on towards Ruacana.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-24 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className={eyebrow}>What we believe</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Hospitality without complication
          </h2>
          <div className="mt-5 space-y-4 text-lg text-muted">
            <p>
              A good guesthouse should offer more than a bed and a roof. It
              should be a place where visitors feel welcome, where good food is
              shared, where people can gather, and where every guest is treated
              with genuine warmth.
            </p>
            <p>
              We take pride in being adaptable. Whether it&apos;s a traveller
              looking for a quiet evening, a group needing a substantial meal or
              an organisation that needs a space for training, we make it work.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {values.map((v) => (
              <li
                key={v}
                className="rounded-full border-2 border-gold/60 px-4 py-1.5 font-bold text-brown"
              >
                {v}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120} className="grid grid-cols-2 gap-4">
          <Photo
            label="Historical display"
            className="aspect-[3/4] rounded-[2rem]"
          />
          <Photo
            label="The sitting room"
            className="mt-10 aspect-[3/4] rounded-[2rem]"
          />
        </Reveal>
      </section>
    </>
  );
}
