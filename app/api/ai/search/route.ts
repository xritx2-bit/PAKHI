import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products-data';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local-client';
    const rateLimit = checkRateLimit(`ai_search_${ip}`, 30, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many search requests. Please slow down.' },
        { status: 429 }
      );
    }

    const { query } = await request.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter a search query' },
        { status: 400 }
      );
    }

    const q = query.toLowerCase().trim();

    // Natural Language Intent Parsing
    const intents = {
      isSaree: q.includes('saree') || q.includes('sari') || q.includes('pallu') || q.includes('drape'),
      isKurta: q.includes('kurta') || q.includes('suit') || q.includes('anarkali') || q.includes('tunic'),
      occasions: [] as string[],
      fabrics: [] as string[],
      colors: [] as string[],
      maxPrice: null as number | null,
    };

    // Detect occasions
    ['wedding', 'festive', 'casual', 'party', 'office'].forEach((occ) => {
      if (q.includes(occ)) intents.occasions.push(occ);
    });

    // Detect fabrics
    ['silk', 'banarasi', 'georgette', 'chanderi', 'cotton'].forEach((fab) => {
      if (q.includes(fab)) intents.fabrics.push(fab);
    });

    // Detect colors
    ['blue', 'red', 'wine', 'pink', 'emerald', 'green', 'gold', 'ivory'].forEach((col) => {
      if (q.includes(col)) intents.colors.push(col);
    });

    // Detect price constraint (e.g. "under 2000", "below 2500", "< 3000")
    const priceMatch = q.match(/(?:under|below|less than|within|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                       q.match(/(?:rs\.?|inr|₹)\s*(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      intents.maxPrice = parseInt(priceMatch[1], 10);
    }

    // Score products based on verified catalog attributes
    const scored = PRODUCTS.map((product) => {
      let score = 0;
      const prodText = `${product.name} ${product.description} ${product.fabric} ${product.occasion} ${product.subcategory}`.toLowerCase();

      // Category match
      if (intents.isSaree && product.category === 'sarees') score += 10;
      if (intents.isKurta && product.category === 'kurtas') score += 10;

      // Occasion match
      intents.occasions.forEach((occ) => {
        if (product.occasion.toLowerCase() === occ) score += 8;
      });

      // Fabric match
      intents.fabrics.forEach((fab) => {
        if (product.fabric.toLowerCase().includes(fab)) score += 7;
      });

      // Color match
      intents.colors.forEach((col) => {
        const hasColor = product.colors.some((c) => c.name.toLowerCase().includes(col));
        if (hasColor || prodText.includes(col)) score += 6;
      });

      // Price limit check
      if (intents.maxPrice !== null) {
        if (product.price <= intents.maxPrice) {
          score += 5;
        } else {
          score -= 15; // Heavily penalize over-budget items
        }
      }

      // Keyword token fallback
      const tokens = q.split(/\s+/).filter((t) => t.length > 2);
      tokens.forEach((token) => {
        if (prodText.includes(token)) score += 2;
      });

      return { product, score };
    });

    // Sort by score and filter relevant items
    const results = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    // Fallback if strict search has 0 results
    const finalResults = results.length > 0 ? results : PRODUCTS.slice(0, 2);

    let reasoning = `Curated ${finalResults.length} authentic handcrafted design${finalResults.length > 1 ? 's' : ''}`;
    if (intents.fabrics.length > 0 || intents.occasions.length > 0) {
      reasoning += ` matching ${[...intents.fabrics, ...intents.occasions].join(' & ')}`;
    }
    if (intents.maxPrice) {
      reasoning += ` under ₹${intents.maxPrice.toLocaleString('en-IN')}`;
    }

    return NextResponse.json({
      success: true,
      data: finalResults,
      reasoning,
      parsedIntent: intents,
    });
  } catch (error) {
    console.error('Error in AI search:', error);
    return NextResponse.json(
      { success: false, error: 'AI Search assistant momentarily unavailable.' },
      { status: 500 }
    );
  }
}
