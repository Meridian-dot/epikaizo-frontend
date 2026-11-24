import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      intro="The simple rules for staying, dining and ordering with us."
      sections={[
        {
          heading: "Requests, not instant bookings",
          body: [
            "Room, table and event requests made on this website are not confirmed until we contact you. A request does not hold a room.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "There is no deposit and nothing is paid online. You pay for your stay in full on arrival, by cash, card or EFT. Food orders are paid on delivery or collection, by cash or card.",
          ],
        },
        {
          heading: "Cancelling",
          body: [
            "You can cancel a room or table booking at any time, free of charge. Please let us know as early as you can so we can offer the space to someone else.",
          ],
        },
        {
          heading: "Your stay",
          body: [
            "Check-in is from 12 pm and check-out is by 10 am. A late check-out fee of N$ 50 per hour applies after 10 am.",
            "Children 12 and under stay free. Older children are charged as guests.",
            "No pets, and no smoking inside the rooms.",
          ],
        },
        {
          heading: "Prices",
          body: [
            "Prices on this website are in Namibian dollars (N$) and may change. The price shown when you send a request is the one we use for it.",
          ],
        },
      ]}
    />
  );
}
