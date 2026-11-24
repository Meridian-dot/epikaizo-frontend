// Temporary page body used until each page is built from the designs.
// Delete it from a page once that page has real content.

type Props = {
  title: string;
  purpose: string;
  children?: React.ReactNode;
};

export function PagePlaceholder({ title, purpose, children }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p>{purpose}</p>
      <p className="text-sm opacity-70">
        Placeholder. Design and content to come.
      </p>
      {children}
    </div>
  );
}
