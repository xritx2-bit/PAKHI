import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const q = query.toLowerCase().trim();

    let answer = '';
    let category = 'GENERAL';

    // 1. Saree Care & Storage
    if (
      q.includes('care') ||
      q.includes('wash') ||
      q.includes('clean') ||
      q.includes('store') ||
      q.includes('iron') ||
      q.includes('silk care')
    ) {
      category = 'FABRIC_CARE';
      answer =
        'For our pure Banarasi silk and handloom sarees, we recommend strictly dry cleaning only. Store your sarees wrapped in a soft, breathable pure muslin or unbleached cotton cloth to protect the gold zari from oxidisation. Never hang heavy silk sarees on metal hangers as the weight can stress the weave; fold them neatly and change the fold creases every 3 months to prevent permanent fold lines.';
    }
    // 2. Shipping & Delivery
    else if (
      q.includes('shipping') ||
      q.includes('delivery') ||
      q.includes('dispatch') ||
      q.includes('time') ||
      q.includes('track') ||
      q.includes('courier')
    ) {
      category = 'SHIPPING';
      answer =
        'We offer Free Shipping on all orders above ₹999 across India (a nominal fee of ₹49 applies for orders below ₹999). Every order is inspected at our Varanasi/Delhi atelier and dispatched within 24–48 hours via Blue Dart Express Air. Deliveries typically arrive within 3 to 5 business days. You can track your shipment live using your order number on our Track Order page.';
    }
    // 3. Cash on Delivery (COD) Rules
    else if (
      q.includes('cod') ||
      q.includes('cash on delivery') ||
      q.includes('pay on delivery')
    ) {
      category = 'PAYMENTS_COD';
      answer =
        'Yes, Cash on Delivery (COD) is gladly accepted across 25,000+ Indian pincodes for orders up to ₹5,000. To ensure the safety of our high-value bridal handlooms and prevent transit mishandling, orders exceeding ₹5,000 require prepayment via our secure UPI or Debit/Credit card gateway.';
    }
    // 4. Returns & Exchanges
    else if (
      q.includes('return') ||
      q.includes('exchange') ||
      q.includes('refund') ||
      q.includes('damaged')
    ) {
      category = 'RETURNS';
      answer =
        "Pakhi's Collection offers a hassle-free 7-day doorstep return and exchange window from the date of delivery. The item must be in its original, unworn condition with the authentic boutique security tag intact and packaging preserved. Doorstep reverse pickup is arranged free of charge, and refunds are initiated immediately upon quality verification.";
    }
    // 5. Blouse & Saree Measurements
    else if (
      q.includes('blouse') ||
      q.includes('length') ||
      q.includes('meter') ||
      q.includes('unstitched')
    ) {
      category = 'PRODUCT_SPECS';
      answer =
        "All our sarees come with a standard royal length of 5.5 meters, along with an additional 0.8-meter unstitched blouse piece in matching or curated contrast raw silk/brocade fabric, giving your tailor ample material to customize according to your desired neckline and sleeve styling.";
    }
    // 6. Authenticity & Craftsmanship
    else if (
      q.includes('authentic') ||
      q.includes('pure') ||
      q.includes('real') ||
      q.includes('silk mark')
    ) {
      category = 'AUTHENTICITY';
      answer =
        "Every piece at Pakhi's Collection is an authentic, certified artisan handloom. Our pure silk sarees are woven on traditional pit looms in Varanasi and Chanderi, featuring tested zari and certified pure natural silk threads carrying verified heirloom quality.";
    }
    // Default Fallback
    else {
      category = 'CONCIERGE_ADVICE';
      answer =
        "Namaste! As your Pakhi's Collection concierge, I am here to help you select the perfect handloom drape, advise on sizing and drape care, or clarify our shipping (free above ₹999) and 7-day return policies. Feel free to ask about our Banarasi sarees, designer kurtas, or styling tips!";
    }

    return NextResponse.json({
      success: true,
      answer,
      category,
      quickLinks: [
        { label: 'Track Order', href: '/track-order' },
        { label: 'Explore Sarees', href: '/category/sarees' },
        { label: 'Explore Kurtas', href: '/category/kurtas' },
      ],
    });
  } catch (error) {
    console.error('Error in customer concierge API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
