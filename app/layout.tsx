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
  metadataBase: new URL('https://pakhiscollection.com'),
  title: {
    default: "Pakhi's Collection | Sarees and Kurtas",
    template: "%s | Pakhi's Collection",
  },
  description: "Exquisite Indian women's ethnic fashion. Handcrafted Banarasi sarees, pure silk drapes, designer anarkali kurtas, and festive collections. Enjoy free shipping on orders above ₹999.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.jpg",
  },
  keywords: [
    "Pakhi's Collection",
    "Indian ethnic wear",
    "Sarees",
    "Kurtas",
    "Banarasi Saree",
    "Silk Sarees",
    "Anarkali Kurta",
    "Festive fashion",
    "Handloom sarees",
    "Ethnic fashion India"
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Pakhi's Collection | Sarees and Kurtas",
    description: "Indian women's ethnic fashion. Handcrafted Banarasi sarees, pure silk drapes, and designer kurtas. Free shipping on orders above Rs.999.",
    url: 'https://pakhiscollection.com',
    siteName: "Pakhi's Collection",
    images: [
      {
        url: '/hero_banner_artisan.png',
        width: 1200,
        height: 630,
        alt: "Pakhi's Collection Luxury Ethnic Wear",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pakhi's Collection | Sarees and Kurtas",
    description: "Handcrafted Banarasi sarees, pure silk drapes, and designer kurtas with doorstep delivery across India.",
    images: ['/hero_banner_artisan.png'],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "name": "Pakhi's Collection",
  "alternateName": "Pakhi's Ethnic Atelier",
  "description": "Exquisite Indian women's ethnic fashion specializing in handwoven Sarees and designer Kurtas.",
  "url": "https://pakhiscollection.com",
  "logo": "https://pakhiscollection.com/logo.jpg",
  "telephone": "+91-98765-43210",
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, Credit Card, Debit Card, UPI",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Ghat Atelier, Dashashwamedh Road",
    "addressLocality": "Varanasi",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "221001",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "10:00",
    "closes": "20:00"
  },
  "sameAs": [
    "https://instagram.com/pakhiscollection",
    "https://facebook.com/pakhiscollection"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F3EC] text-[#241816] selection:bg-[#722F3D] selection:text-[#F8F3EC]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
