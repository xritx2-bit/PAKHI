import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const variants = await db.productVariant.findMany({
      include: {
        product: {
          include: {
            category: true,
            images: { take: 1, orderBy: { position: 'asc' } },
          },
        },
        inventoryTransactions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { stock: 'asc' }, // Lowest stock first to highlight alerts
    });

    const formatted = variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      productName: v.product.name,
      category: v.product.category.name,
      categorySlug: v.product.category.slug,
      image: v.product.images[0]?.imageUrl || '/images/hero-saree.jpg',
      sku: v.sku,
      color: v.color || 'Standard',
      size: v.size || 'Free Size',
      price: v.price,
      stock: v.stock,
      isCritical: v.stock <= 5,
      isLow: v.stock > 5 && v.stock <= 10,
      recentTransactions: v.inventoryTransactions,
    }));

    // Summary counts
    const criticalCount = formatted.filter((v) => v.isCritical).length;
    const lowCount = formatted.filter((v) => v.isLow).length;
    const totalUnits = formatted.reduce((sum, v) => sum + v.stock, 0);

    return NextResponse.json({
      success: true,
      data: formatted,
      summary: {
        totalVariants: formatted.length,
        totalUnits,
        criticalCount,
        lowCount,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve inventory records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, quantity, type, reference } = body;

    if (!variantId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing variantId or quantity' },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    const txType = type || 'STOCK_IN'; // STOCK_IN | ADJUSTMENT | RETURN_RESTOCK

    const existingVariant = await db.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { success: false, error: 'Product variant not found' },
        { status: 404 }
      );
    }

    // Atomic update of stock and creation of transaction log
    const updated = await db.$transaction(async (tx) => {
      const newStock = Math.max(0, existingVariant.stock + qty);

      const variant = await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });

      const transaction = await tx.inventoryTransaction.create({
        data: {
          variantId,
          type: txType,
          quantity: qty,
          reference: reference || `Admin Batch Restock (${new Date().toLocaleDateString('en-IN')})`,
        },
      });

      return { variant, transaction };
    });

    return NextResponse.json({
      success: true,
      data: {
        variantId: updated.variant.id,
        sku: updated.variant.sku,
        newStock: updated.variant.stock,
        transactionId: updated.transaction.id,
      },
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record inventory adjustment' },
      { status: 500 }
    );
  }
}
