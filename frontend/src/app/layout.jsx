import { Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ScrollHandler from "@/Components/ScrollHandler";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "AHM Fragrance",
  description:
    "Discover the essence of elegance with AHM Fragrance. Our collection of luxurious scents is crafted to captivate your senses and elevate your style. Explore our range of perfumes, each designed to leave a lasting impression. Experience the art of fragrance with AHM Fragrance today.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <ScrollHandler />
          {children}
        </Providers>
      </body>
    </html>
  );
}
