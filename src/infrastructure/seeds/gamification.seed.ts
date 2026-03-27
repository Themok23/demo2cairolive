import { getDatabase } from '../db/client';
import { membershipLevels, rewards } from '../db/schema';
import { eq } from 'drizzle-orm';

const MEMBERSHIP_LEVELS = [
  {
    name: 'Explorer',
    nameAr: 'مستكشف',
    slug: 'explorer',
    minReviews: 0,
    icon: 'compass',
    color: '#6B6B7B',
    perksJson: JSON.stringify([
      { id: 'profile', name: 'Public Profile', nameAr: 'ملف شخصي عام' },
      { id: 'reviews', name: 'Write Reviews', nameAr: 'كتابة التقييمات' },
    ]),
    discountPercent: 0,
  },
  {
    name: 'Contributor',
    nameAr: 'مساهم',
    slug: 'contributor',
    minReviews: 5,
    icon: 'pencil',
    color: '#4CAF88',
    perksJson: JSON.stringify([
      { id: 'profile', name: 'Featured Profile', nameAr: 'ملف مميز' },
      { id: 'badge', name: 'Badge Display', nameAr: 'عرض الوسام' },
      { id: 'rewards', name: 'Unlock Rewards', nameAr: 'فتح المكافآت' },
    ]),
    discountPercent: 5,
  },
  {
    name: 'Insider',
    nameAr: 'من الداخل',
    slug: 'insider',
    minReviews: 15,
    icon: 'star',
    color: '#F5C542',
    perksJson: JSON.stringify([
      { id: 'profile', name: 'Premium Profile', nameAr: 'ملف متميز' },
      { id: 'priority', name: 'Priority Support', nameAr: 'الدعم الأولوي' },
      { id: 'deals', name: 'Exclusive Deals', nameAr: 'صفقات حصرية' },
    ]),
    discountPercent: 10,
  },
  {
    name: 'Expert',
    nameAr: 'خبير',
    slug: 'expert',
    minReviews: 30,
    icon: 'rocket',
    color: '#E8572A',
    perksJson: JSON.stringify([
      { id: 'profile', name: 'Elite Profile', nameAr: 'ملف نخبة' },
      { id: 'editor', name: 'Editor Features', nameAr: 'ميزات المحرر' },
      { id: 'premium', name: 'Premium Rewards', nameAr: 'مكافآت متميزة' },
    ]),
    discountPercent: 15,
  },
  {
    name: 'Ambassador',
    nameAr: 'سفير',
    slug: 'ambassador',
    minReviews: 50,
    icon: 'crown',
    color: '#1A1A2E',
    perksJson: JSON.stringify([
      { id: 'profile', name: 'Ambassador Status', nameAr: 'حالة السفير' },
      { id: 'moderator', name: 'Moderation Rights', nameAr: 'حقوق الإشراف' },
      { id: 'vip', name: 'VIP Rewards', nameAr: 'مكافآت VIP' },
    ]),
    discountPercent: 25,
  },
];

const REWARDS = [
  {
    title: '20% Off at Cilantro',
    titleAr: 'خصم 20% في Cilantro',
    description: 'Enjoy 20% discount on all food and beverages at Cilantro restaurants',
    descriptionAr: 'استمتع بخصم 20% على جميع الأطعمة والمشروبات في مطاعم Cilantro',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    partnerName: 'Cilantro Restaurant',
    partnerLogo: null,
    discountPercent: 20,
    discountCode: 'CILANTRO20',
    minLevel: 'contributor',
    category: 'food',
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Free Dessert at Edita',
    titleAr: 'حلوى مجانية في إديتا',
    description: 'Get a free dessert with any main course purchase at Edita Bakery',
    descriptionAr: 'احصل على حلوى مجانية مع أي شراء وجبة رئيسية في مخبز إديتا',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    partnerName: 'Edita Bakery',
    partnerLogo: null,
    discountPercent: 15,
    discountCode: 'EDITA_FREE',
    minLevel: 'explorer',
    category: 'food',
    isActive: true,
    expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
  },
  {
    title: '15% Off at Ace Store',
    titleAr: 'خصم 15% في Ace Store',
    description: 'Save 15% on fashion, electronics, and home goods at Ace Store',
    descriptionAr: 'وفر 15% على الملابس والإلكترونيات والسلع المنزلية في Ace Store',
    imageUrl: 'https://images.unsplash.com/photo-1552062407-c551eeda4bae?w=400&h=300&fit=crop',
    partnerName: 'Ace Store',
    partnerLogo: null,
    discountPercent: 15,
    discountCode: 'ACE15',
    minLevel: 'insider',
    category: 'shopping',
    isActive: true,
    expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
  },
  {
    title: '25% Off Massage at Oasis Spa',
    titleAr: 'خصم 25% على التدليك في Oasis Spa',
    description: 'Relax with 25% discount on all massage and spa services at Oasis Spa',
    descriptionAr: 'استرخ بخصم 25% على جميع خدمات التدليك والمنتجع في Oasis Spa',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop',
    partnerName: 'Oasis Spa',
    partnerLogo: null,
    discountPercent: 25,
    discountCode: 'OASIS25',
    minLevel: 'expert',
    category: 'wellness',
    isActive: true,
    expiresAt: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Free Coffee at Nile Coffee',
    titleAr: 'قهوة مجانية في Nile Coffee',
    description: 'Enjoy a free coffee of your choice with any pastry purchase',
    descriptionAr: 'استمتع بقهوة مجانية من اختيارك مع أي شراء معجنات',
    imageUrl: 'https://images.unsplash.com/photo-1511537190424-de228add9b3b?w=400&h=300&fit=crop',
    partnerName: 'Nile Coffee',
    partnerLogo: null,
    discountPercent: 10,
    discountCode: 'NILECF',
    minLevel: 'contributor',
    category: 'food',
    isActive: true,
    expiresAt: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
  },
  {
    title: '30% Off Weekend Stay at Sands Resort',
    titleAr: 'خصم 30% على الإقامة في Sands Resort',
    description: '30% discount on weekend stays at Sands Resort North Coast',
    descriptionAr: 'خصم 30% على الإقامة في نهاية الأسبوع في منتجع Sands بالساحل الشمالي',
    imageUrl: 'https://images.unsplash.com/photo-1551524164-0fcb4171a757?w=400&h=300&fit=crop',
    partnerName: 'Sands Resort',
    partnerLogo: null,
    discountPercent: 30,
    discountCode: 'SANDS30',
    minLevel: 'ambassador',
    category: 'travel',
    isActive: true,
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
  {
    title: '18% Off at Zara Egypt',
    titleAr: '18% خصم في Zara Egypt',
    description: 'Shop the latest fashion collection with 18% discount at Zara',
    descriptionAr: 'تسوق آخر مجموعة أزياء بخصم 18% في Zara',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1921b902?w=400&h=300&fit=crop',
    partnerName: 'Zara Egypt',
    partnerLogo: null,
    discountPercent: 18,
    discountCode: 'ZARA18',
    minLevel: 'insider',
    category: 'shopping',
    isActive: true,
    expiresAt: new Date(Date.now() + 110 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Free Yoga Class at Zen Studio',
    titleAr: 'درس يوجا مجاني في Zen Studio',
    description: 'Complimentary yoga class at Zen Studio wellness center',
    descriptionAr: 'درس يوجا مجاني في مركز Zen Studio للعافية',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    partnerName: 'Zen Studio',
    partnerLogo: null,
    discountPercent: 100,
    discountCode: 'ZENYOGA',
    minLevel: 'contributor',
    category: 'wellness',
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    title: '12% Off at Carrefour',
    titleAr: '12% خصم في Carrefour',
    description: 'Get 12% discount on grocery and household items at Carrefour',
    descriptionAr: 'احصل على خصم 12% على البقالة والسلع المنزلية في Carrefour',
    imageUrl: 'https://images.unsplash.com/photo-1555632238-f7cd0e5c3fc9?w=400&h=300&fit=crop',
    partnerName: 'Carrefour Egypt',
    partnerLogo: null,
    discountPercent: 12,
    discountCode: 'CARRF12',
    minLevel: 'explorer',
    category: 'shopping',
    isActive: true,
    expiresAt: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000),
  },
  {
    title: '20% Off Flight Bookings at EgyptAir',
    titleAr: 'خصم 20% على حجوزات الرحلات في EgyptAir',
    description: 'Save 20% on domestic and international flights with EgyptAir',
    descriptionAr: 'وفر 20% على الرحلات المحلية والدولية مع EgyptAir',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    partnerName: 'EgyptAir',
    partnerLogo: null,
    discountPercent: 20,
    discountCode: 'EGAIR20',
    minLevel: 'expert',
    category: 'travel',
    isActive: true,
    expiresAt: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
  },
];

export async function seedGamification() {
  const db = getDatabase();
  
  console.log('Seeding membership levels...');

  for (const level of MEMBERSHIP_LEVELS) {
    const existing = await db
      .select()
      .from(membershipLevels)
      .where(eq(membershipLevels.slug, level.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(membershipLevels).values(level as any);
      console.log(`Created level: ${level.name}`);
    } else {
      console.log(`Level already exists: ${level.name}`);
    }
  }

  console.log('Seeding rewards...');

  for (const reward of REWARDS) {
    const existing = await db
      .select()
      .from(rewards)
      .where(eq(rewards.title, reward.title))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(rewards).values(reward as any);
      console.log(`Created reward: ${reward.title}`);
    } else {
      console.log(`Reward already exists: ${reward.title}`);
    }
  }

  console.log('Gamification seeding complete!');
}

seedGamification().catch(console.error);
