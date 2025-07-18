import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/organisms";
import { ThemeProvider } from "@/components/providers";
import { GlobalLoadingProvider } from "@/components/providers/loading-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metro de Santiago",
  description: "Sistema de transporte metropolitano de Santiago de Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black/5 dark:bg-white/5`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalLoadingProvider>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </GlobalLoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
