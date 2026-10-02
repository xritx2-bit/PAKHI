import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Pakhi\'s Collection database...');

  // Clean existing records in reverse dependency order
  await prisma.inventoryTransaction.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.return.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Pakhi Administration',
      email: 'admin@pakhiscollection.com',
      phone: '+91 99999 88888',
      role: 'ADMIN',
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      role: 'CUSTOMER',
    },
  });

  // Create Saved Address
  await prisma.address.create({
    data: {
      userId: demoCustomer.id,
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      address: '123, Green Park, Hauz Khas Enclave',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
    },
  });

  // 2. Create Categories
  const sareesCategory = await prisma.category.create({
    data: {
      name: 'Sarees',
      slug: 'sarees',
      image: '/images/category-saree.jpg',
      sortOrder: 1,
      status: 'ACTIVE',
    },
  });

  const kurtasCategory = await prisma.category.create({
    data: {
      name: 'Women\'s Kurtas',
      slug: 'kurtas',
      image: '/images/category-kurta.jpg',
      sortOrder: 2,
      status: 'ACTIVE',
    },
  });

  // 3. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'ELEGANCE10',
        type: 'PERCENTAGE',
        value: 10,
        minimumOrder: 1999,
        maximumDiscount: 500,
        usageLimit: 500,
      },
      {
        code: 'FESTIVE200',
        type: 'FIXED',
        value: 200,
        minimumOrder: 2000,
        maximumDiscount: 200,
        usageLimit: 1000,
      },
      {
        code: 'ROYAL500',
        type: 'FIXED',
        value: 500,
        minimumOrder: 4999,
        maximumDiscount: 500,
        usageLimit: 250,
      },
    ],
  });

  // 4. Products & Variants Seeding

  // Product 1: Banarasi Silk Saree
  const banarasiSaree = await prisma.product.create({
    data: {
      categoryId: sareesCategory.id,
      name: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      description: 'Handwoven in Varanasi using pure katan silk and antique gold zari. Features intricate floral jaal motifs and grand pallu.',
      basePrice: 3199,
      salePrice: 2499,
      fabric: 'Pure Silk',
      pattern: 'Zari Floral Brocade',
      occasion: 'Wedding',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: '/images/hero-saree.jpg', position: 1 },
          { imageUrl: '/images/banarasi-blue.jpg', position: 2 },
          { imageUrl: '/images/festive-editorial.jpg', position: 3 },
        ],
      },
      variants: {
        create: [
          { sku: 'SAR-BAN-WINE', color: 'Wine Red', size: 'Free Size (5.5m + 0.8m)', price: 2499, stock: 14 },
          { sku: 'SAR-BAN-BLUE', color: 'Royal Blue', size: 'Free Size (5.5m + 0.8m)', price: 2499, stock: 12 },
          { sku: 'SAR-BAN-EMR', color: 'Emerald Green', size: 'Free Size (5.5m + 0.8m)', price: 2499, stock: 8 },
        ],
      },
    },
    include: { variants: true },
  });

  // Initial inventory transactions
  for (const variant of banarasiSaree.variants) {
    await prisma.inventoryTransaction.create({
      data: {
        variantId: variant.id,
        type: 'STOCK_IN',
        quantity: variant.stock,
        reference: 'INITIAL_LOOM_BATCH_2026',
      },
    });
  }

  // Product 2: Cotton Printed Kurta
  const cottonKurta = await prisma.product.create({
    data: {
      categoryId: kurtasCategory.id,
      name: 'Cotton Printed Kurta',
      slug: 'cotton-printed-kurta',
      description: 'Crafted from 100% fine long-staple cotton with hand-block botanical prints. Breathable, comfortable, and tailored for everyday elegance.',
      basePrice: 1699,
      salePrice: 1299,
      fabric: '100% Breathable Cotton',
      pattern: 'Hand-block Botanical Print',
      fit: 'Relaxed Straight',
      occasion: 'Casual',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: '/images/cotton-printed-kurta.jpg', position: 1 },
          { imageUrl: '/images/category-kurta.jpg', position: 2 },
        ],
      },
      variants: {
        create: [
          { sku: 'KUR-COT-BLU-S', color: 'Slate Blue', size: 'S', price: 1299, stock: 12 },
          { sku: 'KUR-COT-BLU-M', color: 'Slate Blue', size: 'M', price: 1299, stock: 18 },
          { sku: 'KUR-COT-BLU-L', color: 'Slate Blue', size: 'L', price: 1299, stock: 14 },
          { sku: 'KUR-COT-BLU-XL', color: 'Slate Blue', size: 'XL', price: 1299, stock: 7 },
        ],
      },
    },
    include: { variants: true },
  });

  for (const variant of cottonKurta.variants) {
    await prisma.inventoryTransaction.create({
      data: {
        variantId: variant.id,
        type: 'STOCK_IN',
        quantity: variant.stock,
        reference: 'BATCH_COTTON_SPRING_26',
      },
    });
  }

  // Product 3: Georgette Saree
  await prisma.product.create({
    data: {
      categoryId: sareesCategory.id,
      name: 'Georgette Saree',
      slug: 'georgette-saree',
      description: 'Featherlight micro-georgette in rich wine tones, bordered with scalloped hand-finished cutwork and subtle micro-sequins.',
      basePrice: 2599,
      salePrice: 1999,
      fabric: 'Micro Georgette',
      pattern: 'Embroidered Scallop Border',
      occasion: 'Party',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: '/images/georgette-saree.jpg', position: 1 },
        ],
      },
      variants: {
        create: [
          { sku: 'SAR-GEO-WINE', color: 'Wine Berry', size: 'Free Size', price: 1999, stock: 18 },
          { sku: 'SAR-GEO-TEAL', color: 'Teal Blue', size: 'Free Size', price: 1999, stock: 10 },
        ],
      },
    },
  });

  // Product 4: Embroidered Kurta
  await prisma.product.create({
    data: {
      categoryId: kurtasCategory.id,
      name: 'Embroidered Kurta',
      slug: 'embroidered-kurta',
      description: 'Pastel blush Chanderi silk kurta embellished with tonal resham threads, seed pearls, and gota highlights.',
      basePrice: 1999,
      salePrice: 1499,
      fabric: 'Chanderi Silk Blend',
      pattern: 'Resham Neckline Embroidery',
      fit: 'Straight',
      occasion: 'Festive',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: '/images/embroidered-kurta.jpg', position: 1 },
        ],
      },
      variants: {
        create: [
          { sku: 'KUR-EMB-PNK-S', color: 'Blush Pink', size: 'S', price: 1499, stock: 10 },
          { sku: 'KUR-EMB-PNK-M', color: 'Blush Pink', size: 'M', price: 1499, stock: 15 },
          { sku: 'KUR-EMB-PNK-L', color: 'Blush Pink', size: 'L', price: 1499, stock: 12 },
        ],
      },
    },
  });

  // Product 5: Royal Blue Banarasi Silk Saree (From the PDP mockup)
  await prisma.product.create({
    data: {
      categoryId: sareesCategory.id,
      name: 'Royal Blue Banarasi Silk Saree',
      slug: 'royal-blue-banarasi-silk-saree',
      description: 'The crowning jewel of traditional festive celebrations. Drenched in majestic sapphire blue with antique golden paisleys.',
      basePrice: 2499,
      salePrice: 1999,
      fabric: 'Banarasi Katan Silk',
      pattern: 'Kalka & Paisley Zari Motif',
      occasion: 'Wedding',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: '/images/banarasi-blue.jpg', position: 1 },
          { imageUrl: '/images/hero-saree.jpg', position: 2 },
        ],
      },
      variants: {
        create: [
          { sku: 'SAR-ROYAL-BLU', color: 'Royal Blue', size: 'Free Size', price: 1999, stock: 15 },
          { sku: 'SAR-ROYAL-WINE', color: 'Wine Red', size: 'Free Size', price: 1999, stock: 11 },
        ],
      },
    },
  });

  // Product 6: Ivory Anarkali Kurta Set
  await prisma.product.create({
    data: {
      categoryId: kurtasCategory.id,
      name: 'Ivory Anarkali Kurta Set',
      slug: 'ivory-anarkali-kurta-set',
      description: 'Grand 24-kali flared Anarkali silhouette in pure Chanderi silk with woven zari border and embroidered organza dupatta.',
      basePrice: 3599,
      salePrice: 2899,
      fabric: 'Pure Chanderi Silk & Organza',
      pattern: 'Zari Border & Kali Flare',
      fit: 'Anarkali',
      occasion: 'Festive',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: '/images/category-kurta.jpg', position: 1 },
        ],
      },
      variants: {
        create: [
          { sku: 'KUR-ANAR-IVY-S', color: 'Warm Ivory', size: 'S', price: 2899, stock: 8 },
          { sku: 'KUR-ANAR-IVY-M', color: 'Warm Ivory', size: 'M', price: 2899, stock: 12 },
          { sku: 'KUR-ANAR-IVY-L', color: 'Warm Ivory', size: 'L', price: 2899, stock: 10 },
        ],
      },
    },
  });

  // Seed Sample Completed Order for demo tracking
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'PK-842913',
      userId: demoCustomer.id,
      subtotal: 2898,
      discount: 200,
      shippingFee: 0,
      tax: 0,
      total: 2698,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      addressSnapshot: JSON.stringify({
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        address: '123, Green Park, Hauz Khas Enclave',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
      }),
      statusHistory: {
        create: [
          { oldStatus: 'PENDING', newStatus: 'CONFIRMED', changedBy: 'Razorpay UPI Webhook' },
        ],
      },
    },
  });

  console.log('Database seeded successfully with Categories, Products, Variants, Users, and Sample Order!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
