import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const occasion = searchParams.get('occasion');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (occasion) {
      where.occasion = occasion;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { fabric: { contains: search } },
        { pattern: { contains: search } },
      ];
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      categoryId,
      description,
      basePrice,
      salePrice,
      fabric,
      pattern,
      fit,
      occasion,
      images,
      variants,
    } = body;

    const product = await db.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId,
        description,
        basePrice: Number(basePrice),
        salePrice: Number(salePrice),
        fabric,
        pattern,
        fit,
        occasion,
        images: {
          create: images?.map((url: string, index: number) => ({
            imageUrl: url,
            position: index + 1,
          })),
        },
        variants: {
          create: variants?.map((v: { sku: string; color: string; size: string; price: number; stock: number }) => ({
            sku: v.sku,
            color: v.color,
            size: v.size,
            price: Number(v.price),
            stock: Number(v.stock),
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
