import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#722F3D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Pakhi's Collection — Elegance in Every Thread | Sarees & Kurtas",
  description: "Exquisite Indian women's ethnic fashion. Handcrafted Banarasi sarees, pure silk drapes, designer anarkali kurtas, and festive collections. Enjoy free shipping on orders above ₹999.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  keywords: ["Pakhi's Collection", "Indian ethnic wear", "Sarees", "Kurtas", "Banarasi Saree", "Silk Sarees", "Anarkali Kurta", "Festive fashion"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816] selection:bg-[#722F3D] selection:text-[#F8F3EC]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
