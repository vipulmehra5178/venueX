import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/common/Navbar";
import ClientOnly from "@/components/common/ClientOnly";

export const metadata = {
  title: "VenueX | Discover Amazing Events",
  description: "Discover, attend, and host experiences your city loves with VenueX.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200`}>
        <ClientOnly>
          <div className="sticky top-0 z-50 w-full">
            <Navbar />
          </div>
        </ClientOnly>
        
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}