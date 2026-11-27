// Splits page text from the dashboard into the hero's intro and the sections
// shown under it.
//
// The dashboard saves a title, a subtitle ("Line under the heading") and a
// list of sections, each with an optional heading. The rule here:
// - A subtitle, when set, is the hero intro, and every section shows below.
// - With no subtitle, a first section without a heading becomes the intro
//   (this is how text typed before sections existed is stored).
// - Content with no sections at all (mock data) uses `body` as the intro.

import type { PageContent, PageSection, Photo } from "@/lib/types";

export function splitPageContent(content: PageContent): {
  intro: string;
  sections: PageSection[];
} {
  const sections = (content.sections ?? []).filter(
    (s) => s.heading.trim() || s.body.trim(),
  );
  const subtitle = content.subtitle?.trim() ?? "";

  if (sections.length === 0) {
    return { intro: subtitle || content.body, sections: [] };
  }
  if (subtitle) return { intro: subtitle, sections };

  const [first, ...rest] = sections;
  if (!first.heading.trim()) return { intro: first.body, sections: rest };
  return { intro: "", sections };
}

/** The page's photo for a fixed spot (0 = first), or null for a placeholder. */
export function pagePhoto(content: PageContent, index: number): Photo | null {
  const photos = [...(content.photos ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
  return photos[index] ?? null;
}
