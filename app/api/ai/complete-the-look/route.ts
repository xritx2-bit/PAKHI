import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, slug, category, fabric, occasion, color } = body;

    const currentProduct = PRODUCTS.find((p) => p.id === productId || p.slug === slug);

    // Curate ensemble pairings based on category and occasion
    let ensembleRecommendations: Array<{
      id: string;
      name: string;
      category: string;
      image: string;
      price: number;
      curationNote: string;
      type: 'CATALOG_ITEM' | 'ACCESSORY';
      actionSlug?: string;
    }> = [];

    let stylistTip = '';

    if (category === 'sarees' || currentProduct?.category === 'sarees') {
      stylistTip =
        'Pair this handloom drape with antique 22K gold-finish temple jewellery. Drape the pallu in crisp pleats over the left shoulder to accentuate the intricate zari work.';

      // Suggest Kundan jewellery from catalog
      const jewelleryItem = PRODUCTS.find((p) => p.category === 'jewellery');
      if (jewelleryItem) {
        ensembleRecommendations.push({
          id: jewelleryItem.id,
          name: jewelleryItem.name,
          category: 'Ethnic Jewellery',
          image: jewelleryItem.image,
          price: jewelleryItem.price,
          curationNote: 'Handcrafted kundan stones echo the royal zari border of your saree.',
          type: 'CATALOG_ITEM',
          actionSlug: jewelleryItem.slug,
        });
      }

      // Add designer unstitched raw silk blouse piece accessory
      ensembleRecommendations.push({
        id: 'acc-blouse-contrast',
        name: 'Contrast Raw Silk Embroidered Blouse Fabric (1m)',
        category: 'Designer Blouse',
        image: '/images/banarasi-blue.jpg',
        price: 899,
        curationNote: 'Contrasting deep jewel tone cutwork to elevate your grand saree silhouette.',
        type: 'ACCESSORY',
      });

      // Add artisanal velvet potli bag
      ensembleRecommendations.push({
        id: 'acc-potli-gold',
        name: 'Artisanal Zari Embroidered Velvet Potli Bag',
        category: 'Festive Accessories',
        image: '/images/occasion-wedding.jpg',
        price: 1199,
        curationNote: 'Hand-tasseled drawstring clutch tailored for royal weddings and gala evenings.',
        type: 'ACCESSORY',
      });
    } else if (category === 'kurtas' || currentProduct?.category === 'kurtas') {
      stylistTip =
        'For an effortless daytime elegance, pair this kurta with straight-cut ivory cigarette pants, silver oxidised jhumkas, and embellished leather juttis.';

      // Suggest jewellery
      const jewelleryItem = PRODUCTS.find((p) => p.category === 'jewellery');
      if (jewelleryItem) {
        ensembleRecommendations.push({
          id: jewelleryItem.id,
          name: 'Handcrafted Filigree Jhumka Earrings',
          category: 'Ethnic Jewellery',
          image: jewelleryItem.image,
          price: 1299,
          curationNote: 'Lightweight heritage accents to frame the neckline gracefully.',
          type: 'CATALOG_ITEM',
          actionSlug: jewelleryItem.slug,
        });
      }

      // Add silk organza dupatta accessory
      ensembleRecommendations.push({
        id: 'acc-organza-dupatta',
        name: 'Gossamer Silk Organza Dupatta with Gold Mukaish',
        category: 'Heirloom Dupatta',
        image: '/images/category-kurta.jpg',
        price: 1499,
        curationNote: 'Adds a soft, airy dimension and regal drape to any straight or anarkali kurta.',
        type: 'ACCESSORY',
      });
    } else {
      // General ethnic styling
      stylistTip =
        'Balance this statement ethnic ensemble with understated polki or kundan accents and sleek hair styling.';
      ensembleRecommendations.push({
        id: 'acc-jewel-1',
        name: 'Heritage Kundan Choker & Jhumka Set',
        category: 'Ethnic Jewellery',
        image: '/images/occasion-wedding.jpg',
        price: 2499,
        curationNote: '22K gold-plated regal jewellery handcrafted in Jaipur.',
        type: 'CATALOG_ITEM',
      });
    }

    return NextResponse.json({
      success: true,
      stylistTip,
      ensemble: ensembleRecommendations,
    });
  } catch (error) {
    console.error('Error in complete-the-look AI engine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate styling ensemble' },
      { status: 500 }
    );
  }
}
