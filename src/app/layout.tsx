import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/organisms";
import { BreadcrumbNavigation } from "@/components/molecules";
import { ThemeProvider, MetroProviderWrapper, GlobalLoadingProvider } from "@/components/providers";
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
          <MetroProviderWrapper>
            <GlobalLoadingProvider>
              <Header />
              
              {/* Breadcrumb Navigation */}
              <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
                <div className="container mx-auto px-4 py-3">
                  <BreadcrumbNavigation 
                    showHomeIcon={true}
                    maxItems={4}
                    collapsible={true}
                  />
                </div>
              </div>
              
              <main>
                {children}
              </main>
              <Footer />
            </GlobalLoadingProvider>
          </MetroProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
