import { PrismaClient, GarmentSize } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DUSK RIOT database with fresh streetwear imagery...');

  // Clear all data in dependency order
  await prisma.couponUsage.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('  Cleared existing data');

  // ─── CATEGORIES ───
  const catHoodies = await prisma.category.create({
    data: {
      slug: 'hoodies-fleece',
      name: 'Hoodies & Fleece',
      description: 'Heavyweight 480GSM French terry, oversized boxy cuts, double-lined hoods.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    },
  });
  const catOuterwear = await prisma.category.create({
    data: {
      slug: 'outerwear',
      name: 'Outerwear',
      description: 'Matte technical ripstop, storm-tested weatherproof silhouettes, modular hardware.',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    },
  });
  const catTees = await prisma.category.create({
    data: {
      slug: 'tees-tops',
      name: 'Tees & Tops',
      description: '310GSM vintage washed combed cotton, raw-edge seams, dropped shoulders.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    },
  });
  const catPants = await prisma.category.create({
    data: {
      slug: 'pants-bottoms',
      name: 'Pants & Bottoms',
      description: 'Articulated knees, tactical buckle cinch hems, waterproof zipper stash pockets.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    },
  });
  const catAccessories = await prisma.category.create({
    data: {
      slug: 'accessories',
      name: 'Accessories',
      description: 'Tactical chest rigs, distressed balaclavas, industrial webbing belts.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    },
  });
  console.log('  ✓ Categories');

  // ─── COLLECTIONS ───
  const colDrop04 = await prisma.collection.create({
    data: {
      slug: 'drop-04',
      name: 'Drop 04 // Nocturnal Signal',
      code: 'DR-04',
      season: 'FW26',
      description: 'Heavyweight silhouettes built for late-night concrete. Limited edition numbered garment runs.',
      bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      status: 'LIVE',
    },
  });
  const colLookbook = await prisma.collection.create({
    data: {
      slug: 'lookbook',
      name: 'After Hours Lookbook',
      code: 'AH-LB',
      season: '2026 EDITORIAL',
      description: 'Captured at 03:00 across urban underpasses. High-contrast flash and brutalist silhouettes.',
      bannerImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
      status: 'LIVE',
    },
  });
  await prisma.collection.create({
    data: {
      slug: 'archive',
      name: 'Studio Archive',
      code: 'ARCHIVE',
      season: 'VAULT',
      description: 'Previous limited-run silhouettes and experimental prototype garments from DUSK RIOT design lab.',
      bannerImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      status: 'ARCHIVE',
    },
  });
  console.log('  ✓ Collections');

  // ─── PRODUCTS ───
  const products = [
    {
      slug: 'obsidian-heavyweight-hoodie', name: 'Obsidian Heavyweight Hoodie', sku: 'DR-04-HD01',
      categoryId: catHoodies.id, collectionId: colDrop04.id, price: 165, originalPrice: 190,
      description: 'Cut in an oversized boxy silhouette from custom-milled 480GSM loop-back French terry.',
      details: ['480 GSM custom French terry cotton', 'Double-lined hood with no drawstrings', 'Distressed seam finish with reinforced bar-tacks', 'Boxy drop-shoulder cut', 'Tonal silicone gel puff print on upper spine'],
      materials: '100% Organic Heavyweight Combed Cotton', gsm: '480 GSM',
      fit: 'Relaxed oversized boxy cut', care: 'Cold wash inside out. Hang dry only.',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true, isNewArrival: true, status: 'PUBLISHED' as const,
      tags: ['hoodie', 'french terry', 'drop 04', 'heavyweight', 'black'],
      variants: [
        { sku: 'DR-04-HD01-BLK-S', size: 'S' as GarmentSize, color: 'Washed Obsidian', colorHex: '#141414', stock: 12, price: 165 },
        { sku: 'DR-04-HD01-BLK-M', size: 'M' as GarmentSize, color: 'Washed Obsidian', colorHex: '#141414', stock: 18, price: 165 },
        { sku: 'DR-04-HD01-BLK-L', size: 'L' as GarmentSize, color: 'Washed Obsidian', colorHex: '#141414', stock: 14, price: 165 },
        { sku: 'DR-04-HD01-BLK-XL', size: 'XL' as GarmentSize, color: 'Washed Obsidian', colorHex: '#141414', stock: 8, price: 165 },
      ],
    },
    {
      slug: 'static-boxy-tee', name: 'Static Boxy Graphic Tee', sku: 'DR-04-TS02',
      categoryId: catTees.id, collectionId: colDrop04.id, price: 75,
      description: 'Heavyweight 310GSM combed cotton jersey tee with dropped shoulders and raw-edge hems.',
      details: ['310 GSM premium combed cotton jersey', 'Thick 1.25" bound collar ribbed neckband', 'Dropped shoulders with wide sleeve', 'High-density cracked ink graphic print'],
      materials: '100% Combed Cotton', gsm: '310 GSM',
      fit: 'Boxy streetwear silhouette', care: 'Machine wash cold. Tumble dry low.',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true, isNewArrival: true, status: 'PUBLISHED' as const,
      tags: ['tee', 'graphic', 'charcoal', 'drop 04'],
      variants: [
        { sku: 'DR-04-TS02-CHR-S', size: 'S' as GarmentSize, color: 'Faded Charcoal', colorHex: '#222222', stock: 25, price: 75 },
        { sku: 'DR-04-TS02-CHR-M', size: 'M' as GarmentSize, color: 'Faded Charcoal', colorHex: '#222222', stock: 30, price: 75 },
        { sku: 'DR-04-TS02-CHR-L', size: 'L' as GarmentSize, color: 'Faded Charcoal', colorHex: '#222222', stock: 22, price: 75 },
        { sku: 'DR-04-TS02-CHR-XL', size: 'XL' as GarmentSize, color: 'Faded Charcoal', colorHex: '#222222', stock: 15, price: 75 },
      ],
    },
    {
      slug: 'acid-wash-heavy-fleece', name: 'Acid Wash Heavy Fleece', sku: 'DR-04-FL03',
      categoryId: catHoodies.id, collectionId: colDrop04.id, price: 185, originalPrice: 210,
      description: 'Subtle acid-dusted finish on custom 500GSM brushed back fleece.',
      details: ['500 GSM brushed fleece interior', 'Artisanal hand-applied acid spray wash', 'Dual kangaroo front pouch with hidden zipper', 'Heavy-gauge knit cuffs'],
      materials: '95% Cotton, 5% Poly Fleece', gsm: '500 GSM',
      fit: 'True oversized vintage cut', care: 'Gentle cycle cold. Lay flat to dry.',
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true, isNewArrival: true, status: 'PUBLISHED' as const,
      tags: ['fleece', 'acid wash', 'hoodie', 'drop 04'],
      variants: [
        { sku: 'DR-04-FL03-ACD-S', size: 'S' as GarmentSize, color: 'Mineral Dust', colorHex: '#383838', stock: 8, price: 185 },
        { sku: 'DR-04-FL03-ACD-M', size: 'M' as GarmentSize, color: 'Mineral Dust', colorHex: '#383838', stock: 12, price: 185 },
        { sku: 'DR-04-FL03-ACD-L', size: 'L' as GarmentSize, color: 'Mineral Dust', colorHex: '#383838', stock: 10, price: 185 },
        { sku: 'DR-04-FL03-ACD-XL', size: 'XL' as GarmentSize, color: 'Mineral Dust', colorHex: '#383838', stock: 4, price: 185 },
      ],
    },
    {
      slug: 'tactical-parachute-cargo', name: 'Tactical Parachute Cargo', sku: 'DR-04-CR04',
      categoryId: catPants.id, collectionId: colDrop04.id, price: 195,
      description: 'Engineered with articulated knees, double-layer knee darts, and water-repellent matte parachute weave.',
      details: ['High-tensile parachute nylon blend', '8 pocket tactical modular architecture', 'Drawstring cinch ankle cuffs', 'YKK AquaGuard weather-resistant zips'],
      materials: '70% Cotton, 30% Cordura Ripstop Nylon',
      fit: 'Wide leg with adjustable tapered cinch hem', care: 'Machine wash cold. Air dry.',
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false, isNewArrival: true, status: 'PUBLISHED' as const,
      tags: ['cargo', 'tactical', 'parachute', 'pants'],
      variants: [
        { sku: 'DR-04-CR04-S', size: 'S' as GarmentSize, color: 'Matte Asphalt', colorHex: '#1d1d1d', stock: 10, price: 195 },
        { sku: 'DR-04-CR04-M', size: 'M' as GarmentSize, color: 'Matte Asphalt', colorHex: '#1d1d1d', stock: 15, price: 195 },
        { sku: 'DR-04-CR04-L', size: 'L' as GarmentSize, color: 'Matte Asphalt', colorHex: '#1d1d1d', stock: 12, price: 195 },
        { sku: 'DR-04-CR04-XL', size: 'XL' as GarmentSize, color: 'Matte Asphalt', colorHex: '#1d1d1d', stock: 6, price: 195 },
      ],
    },
    {
      slug: 'sub-zero-ripstop-parka', name: 'Sub-Zero Ripstop Parka', sku: 'DR-04-PK05',
      categoryId: catOuterwear.id, collectionId: colDrop04.id, price: 290, originalPrice: 340,
      description: 'Heavy insulated technical parka crafted from triple-layer ripstop membrane.',
      details: ['Triple-layer DWR treated ripstop outer shell', 'Internal backpack carry harness webbing', 'Fleece-lined warming chest welt pockets', 'Storm flap with two-way heavy industrial zipper'],
      materials: '100% Technical Ripstop with Thermal Fill',
      fit: 'Cocoon protective oversized cut', care: 'Dry clean only.',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true, isNewArrival: false, status: 'PUBLISHED' as const,
      tags: ['parka', 'outerwear', 'jacket', 'ripstop'],
      variants: [
        { sku: 'DR-04-PK05-S', size: 'S' as GarmentSize, color: 'Obsidian Black', colorHex: '#0c0c0c', stock: 5, price: 290 },
        { sku: 'DR-04-PK05-M', size: 'M' as GarmentSize, color: 'Obsidian Black', colorHex: '#0c0c0c', stock: 7, price: 290 },
        { sku: 'DR-04-PK05-L', size: 'L' as GarmentSize, color: 'Obsidian Black', colorHex: '#0c0c0c', stock: 4, price: 290 },
        { sku: 'DR-04-PK05-XL', size: 'XL' as GarmentSize, color: 'Obsidian Black', colorHex: '#0c0c0c', stock: 2, price: 290 },
      ],
    },
    {
      slug: 'distressed-oversized-crewneck', name: 'Distressed Oversized Crewneck', sku: 'DR-04-CR06',
      categoryId: catHoodies.id, collectionId: colDrop04.id, price: 145,
      description: 'Heavyweight loopback crew with hand-grinded distressing at collar and hems.',
      details: ['440 GSM heavyweight French terry', 'Hand-abraded collar, cuff, and waist ribbing', 'Wide boxy torso silhouette', 'Inverted chest stitch detailing'],
      materials: '100% Ring-Spun Cotton', gsm: '440 GSM',
      fit: 'Slouchy relaxed streetwear fit', care: 'Cold wash separately. Dry flat.',
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false, isNewArrival: false, status: 'PUBLISHED' as const,
      tags: ['crewneck', 'sweatshirt', 'distressed', 'hoodies-fleece'],
      variants: [
        { sku: 'DR-04-CR06-S', size: 'S' as GarmentSize, color: 'Smoked Slate', colorHex: '#2f2f2f', stock: 14, price: 145 },
        { sku: 'DR-04-CR06-M', size: 'M' as GarmentSize, color: 'Smoked Slate', colorHex: '#2f2f2f', stock: 20, price: 145 },
        { sku: 'DR-04-CR06-L', size: 'L' as GarmentSize, color: 'Smoked Slate', colorHex: '#2f2f2f', stock: 18, price: 145 },
        { sku: 'DR-04-CR06-XL', size: 'XL' as GarmentSize, color: 'Smoked Slate', colorHex: '#2f2f2f', stock: 11, price: 145 },
      ],
    },
    {
      slug: 'dusk-balaclava-beanie-set', name: 'Dusk Balaclava & Beanie Set', sku: 'DR-04-AC07',
      categoryId: catAccessories.id, collectionId: colDrop04.id, price: 55,
      description: 'Two-piece modular knit system. Wear as full face balaclava or fold down into skull cap.',
      details: ['Thermal ribbed acrylic/wool blend knit', 'Contoured eye port with reinforced edging', 'Subtle woven DUSK RIOT rubber label at hem'],
      materials: '70% Acrylic, 30% Merino Wool',
      fit: 'One size fits all stretch contour', care: 'Hand wash cold. Dry flat.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false, isNewArrival: false, status: 'PUBLISHED' as const,
      tags: ['balaclava', 'beanie', 'knit', 'accessories'],
      variants: [
        { sku: 'DR-04-AC07-OS', size: 'M' as GarmentSize, color: 'Obsidian Black', colorHex: '#111111', stock: 35, price: 55 },
      ],
    },
    {
      slug: 'modular-chest-rig', name: 'Modular Utility Chest Rig', sku: 'DR-04-AC08',
      categoryId: catAccessories.id, collectionId: colDrop04.id, price: 110,
      description: 'Front-carry tactical pack with quick-release sternum and waist buckles.',
      details: ['1000D ballistic nylon body', 'Dual magnetic Fidlock snap buckle closures', 'Internal RFID-blocking security pouch', 'Breathable 3D spacer mesh rear panel'],
      materials: '1000D Cordura Ballistic Nylon',
      fit: 'Fully adjustable cross-back 4-point harness', care: 'Spot clean with damp cloth.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true, isNewArrival: false, status: 'PUBLISHED' as const,
      tags: ['chest rig', 'bag', 'tactical', 'accessories'],
      variants: [
        { sku: 'DR-04-AC08-OS', size: 'M' as GarmentSize, color: 'Tactical Black', colorHex: '#121212', stock: 16, price: 110 },
      ],
    },
  ];

  const createdProducts = [];
  for (const p of products) {
    const { variants, ...productData } = p;
    const created = await prisma.product.create({
      data: { ...productData, variants: { create: variants } },
      include: { variants: true },
    });
    createdProducts.push(created);
  }
  console.log('  ✓ Products & Variants');

  // ─── USERS ───
  const hash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@duskriot.com',
      name: 'DUSK RIOT ADMIN',
      passwordHash: adminHash,
      role: 'ADMIN',
      memberId: 'DR-ADMIN',
      tier: 'OPERATOR // SYS',
    },
  });

  const kai = await prisma.user.create({
    data: {
      email: 'kai.vance@duskriot.club',
      name: 'KAI VANCE',
      passwordHash: hash,
      role: 'CUSTOMER',
      memberId: 'DR-0492',
      tier: 'SYNDICATE // TIER 03',
      phone: '+1 (212) 555-0194',
      addresses: {
        create: [
          { fullName: 'Kai Vance', addressLine: '418 Mercer Street, Apt 4B', city: 'New York', state: 'NY', postalCode: '10013', phone: '+1 (212) 555-0194', isDefault: true },
          { fullName: 'Kai Vance (Studio)', addressLine: '124 Wooster Street, Studio 3', city: 'New York', state: 'NY', postalCode: '10012', phone: '+1 (212) 555-0194' },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'devon.grey@subrealm.net',
      name: 'DEVON GREY',
      passwordHash: hash,
      role: 'CUSTOMER',
      memberId: 'DR-0311',
      tier: 'VANGUARD // TIER 02',
      phone: '+1 (323) 555-9012',
      addresses: {
        create: [{ fullName: 'Devon Grey', addressLine: '820 S Santa Fe Ave', city: 'Los Angeles', state: 'CA', postalCode: '90021', phone: '+1 (323) 555-9012', isDefault: true }],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'maya@concretegrid.io',
      name: 'MAYA LIN',
      passwordHash: hash,
      role: 'CUSTOMER',
      memberId: 'DR-0188',
      tier: 'CORE // TIER 01',
      phone: '+1 (415) 555-3341',
      addresses: {
        create: [{ fullName: 'Maya Lin', addressLine: '550 Mission St', city: 'San Francisco', state: 'CA', postalCode: '94105', phone: '+1 (415) 555-3341', isDefault: true }],
      },
    },
  });
  console.log('  ✓ Users');

  // ─── DEMO ORDERS ───
  const hoodieProduct = createdProducts[0];
  const teeProduct = createdProducts[1];
  const parkaProduct = createdProducts[4];

  await prisma.order.create({
    data: {
      orderNumber: 'DR-90482',
      userId: kai.id,
      customerName: 'Kai Vance',
      customerEmail: 'kai.vance@duskriot.club',
      shippingAddress: { fullName: 'Kai Vance', addressLine: '418 Mercer Street, Apt 4B', city: 'New York', state: 'NY', postalCode: '10013', country: 'United States', phone: '+1 (212) 555-0194' },
      subtotal: 240, discount: 0, shippingFee: 0, total: 240,
      status: 'SHIPPED', carrier: 'DHL Express', trackingNumber: 'DRX-7749201', estimatedDelivery: 'Nov 22, 2026',
      items: {
        create: [
          { productId: hoodieProduct.id, variantId: hoodieProduct.variants[1].id, productName: hoodieProduct.name, productImage: hoodieProduct.images[0], variantSku: hoodieProduct.variants[1].sku, size: 'M', color: 'Washed Obsidian', quantity: 1, unitPrice: 165, totalPrice: 165 },
          { productId: teeProduct.id, variantId: teeProduct.variants[2].id, productName: teeProduct.name, productImage: teeProduct.images[0], variantSku: teeProduct.variants[2].sku, size: 'L', color: 'Faded Charcoal', quantity: 1, unitPrice: 75, totalPrice: 75 },
        ],
      },
      timeline: {
        create: [
          { step: 1, title: 'Order Logged', location: 'Dispatch System', timestamp: 'Nov 18, 21:04 EST', completed: true },
          { step: 2, title: 'Garments Packed & Sealed', location: 'NYC Studio', timestamp: 'Nov 19, 09:15 EST', completed: true },
          { step: 3, title: 'In Transit', location: 'Regional Hub JFK', timestamp: 'Nov 20, 14:40 EST', completed: true },
          { step: 4, title: 'Out For Delivery', location: 'Local Courier', timestamp: 'Nov 22 (Estimated)', completed: false },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'DR-88204',
      userId: kai.id,
      customerName: 'Kai Vance',
      customerEmail: 'kai.vance@duskriot.club',
      shippingAddress: { fullName: 'Kai Vance', addressLine: '418 Mercer Street, Apt 4B', city: 'New York', state: 'NY', postalCode: '10013', country: 'United States', phone: '+1 (212) 555-0194' },
      subtotal: 290, discount: 0, shippingFee: 0, total: 290,
      status: 'DELIVERED', carrier: 'FedEx Express', trackingNumber: 'FDX-9941028', estimatedDelivery: 'Nov 12, 2026',
      items: {
        create: [
          { productId: parkaProduct.id, variantId: parkaProduct.variants[1].id, productName: parkaProduct.name, productImage: parkaProduct.images[0], variantSku: parkaProduct.variants[1].sku, size: 'M', color: 'Obsidian Black', quantity: 1, unitPrice: 290, totalPrice: 290 },
        ],
      },
      timeline: {
        create: [
          { step: 1, title: 'Order Logged', location: 'Dispatch System', timestamp: 'Nov 09, 14:30 EST', completed: true },
          { step: 2, title: 'Packed', location: 'NYC Studio', timestamp: 'Nov 10, 10:00 EST', completed: true },
          { step: 3, title: 'In Transit', location: 'Newark Hub', timestamp: 'Nov 11, 08:20 EST', completed: true },
          { step: 4, title: 'Delivered — Signed by K. Vance', location: 'Doorstep', timestamp: 'Nov 12, 16:15 EST', completed: true },
        ],
      },
    },
  });
  console.log('  ✓ Orders');

  // ─── COUPONS ───
  await prisma.coupon.createMany({
    data: [
      { code: 'DUSK20', type: 'PERCENTAGE', value: 20, minOrder: 100, expiry: new Date('2027-12-31'), usageLimit: 500, usedCount: 84, active: true, description: '20% off orders over $100' },
      { code: 'RIOT10', type: 'FIXED', value: 10, minOrder: 50, expiry: new Date('2027-12-31'), usageLimit: 1000, usedCount: 219, active: true, description: '$10 off orders over $50' },
      { code: 'FREESHIP', type: 'FREE_SHIPPING', value: 0, minOrder: 0, expiry: new Date('2027-12-31'), usageLimit: 2000, usedCount: 512, active: true, description: 'Complimentary Express Courier on any order' },
      { code: 'BREAKORDINARY', type: 'PERCENTAGE', value: 15, minOrder: 75, expiry: new Date('2027-12-31'), usageLimit: 300, usedCount: 42, active: true, description: '15% off member drop discount' },
    ],
  });
  console.log('  ✓ Coupons');

  // ─── WISHLIST ───
  await prisma.wishlistItem.createMany({
    data: [
      { userId: kai.id, productId: createdProducts[0].id },
      { userId: kai.id, productId: createdProducts[1].id },
      { userId: kai.id, productId: createdProducts[4].id },
    ],
  });
  console.log('  ✓ Wishlist');

  console.log('\n✅ DUSK RIOT database seeded successfully with high-resolution imagery!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
