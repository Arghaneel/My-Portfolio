import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FluidBackground from "@/components/fluid-background";
import { siteUrl } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Arghaneel Das – Computer Science student at Atria Institute of Technology (CGPA 9.28), Applied AI Intern at DeepAgentLabs and Vice-President of OSCode. Projects in IoT, Java and applied AI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arghaneel Das — CS Student & Applied AI Intern",
    template: "%s — Arghaneel Das",
  },
  description,
  keywords: [
    "Arghaneel Das",
    "portfolio",
    "Computer Science student",
    "Applied AI intern",
    "Atria Institute of Technology",
    "OSCode",
    "Bangalore",
  ],
  authors: [{ name: "Arghaneel Das", url: "https://github.com/Arghaneel" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Arghaneel Das",
    title: "Arghaneel Das — CS Student & Applied AI Intern",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Arghaneel Das — CS Student & Applied AI Intern",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FluidBackground />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
