import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pakhi's Collection | Admin Portal",
  description: "Enterprise operational console for Pakhi's Collection. Inventory transactions, live orders, fulfillment dispatch, and revenue metrics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-[#DFC394] selection:text-[#090D16] font-sans">
      {children}
    </div>
  );
}
