import "@workspace/ui/globals.css";
import { fontSans } from "@/lib/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.className} font-sans antialiased `}>
        {children}
      </body>
    </html>
  );
}
