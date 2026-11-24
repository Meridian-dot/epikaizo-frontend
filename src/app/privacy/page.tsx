import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      intro="How we look after the details you give us when you request a room, book a table, order food or send an enquiry."
      sections={[
        {
          heading: "What we collect",
          body: [
            "Your name, phone number and email address, the dates and details of your request, and any notes you add.",
            "We do not take payments on this website, so we never ask for card or bank details here.",
          ],
        },
        {
          heading: "Why we use it",
          body: [
            "Only to deal with your request: to confirm or decline it, to contact you about your stay, table, order or event, and to welcome you when you arrive.",
            "We do not sell your details or share them with anyone for marketing.",
          ],
        },
        {
          heading: "Who sees it",
          body: [
            "Our own staff, and the companies that host this website and its database for us, who may only use it to run the service.",
          ],
        },
        {
          heading: "How long we keep it",
          body: [
            "We keep your details for as long as we need them for your booking and our records, and then delete them.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            "You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Call us or email epikaizoguesthouse@gmail.com.",
          ],
        },
      ]}
    />
  );
}
