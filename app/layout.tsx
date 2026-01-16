import "./globals.css";

export const metadata = {
  title: "Apryse WebViewer",
  description: "Next.js + TailwindCSS Apryse WebViewer demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
