import { db } from '../db/client';
import { categories, items, users, adminSettings, reviews } from '../db/schema';
import bcrypt from 'bcryptjs';

interface SeedItem {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  categorySlug: string;
  governorate?: string;
  area?: string;
  address?: string;
  priceMin?: number;
  priceMax?: number;
  priceLabel?: string;
  priceCurrency?: string;
  website?: string;
  instagram?: string;
  phone?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
}

interface SeedCategory {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

const seedCategories: SeedCategory[] = [
  {
    name: 'Restaurants & Food',
    slug: 'restaurants-food',
    icon: 'UtensilsCrossed',
    color: 'text-primary',
    description: 'Discover fine dining, casual restaurants, and unique culinary experiences across Egypt.',
  },
  {
    name: 'Skincare & Cosmetics',
    slug: 'skincare-cosmetics',
    icon: 'Sparkles',
    color: 'text-accent-gold',
    description: 'Premium skincare brands, cosmetics, and beauty products for your glow-up.',
  },
  {
    name: 'Cafes & Coffee',
    slug: 'cafes-coffee',
    icon: 'Coffee',
    color: 'text-accent-green',
    description: 'Cozy cafes, artisanal coffee, and the perfect spots to relax with a hot beverage.',
  },
  {
    name: 'Gyms & Fitness',
    slug: 'gyms-fitness',
    icon: 'Dumbbell',
    color: 'text-primary',
    description: 'World-class fitness facilities, personal training, and wellness programs.',
  },
  {
    name: 'Beaches & Resorts',
    slug: 'beaches-resorts',
    icon: 'Waves',
    color: 'text-blue-500',
    description: 'Stunning coastal destinations, luxury resorts, and beach getaways.',
  },
  {
    name: 'Street Food',
    slug: 'street-food',
    icon: 'Flame',
    color: 'text-primary',
    description: 'Authentic Egyptian street food, affordable eats, and local flavors.',
  },
];

const seedItems: SeedItem[] = [
  {
    name: 'Koshary Abou Tarek',
    nameAr: 'كشري أبو طارق',
    description: 'A legendary institution for authentic Egyptian koshary in the heart of Downtown Cairo. Known for generous portions and affordable prices, Koshary Abou Tarek has been satisfying hungry Egyptians since 1984. The iconic dish combines rice, lentils, pasta, and a tangy tomato sauce with a crispy chickpea layer on top.',
    descriptionAr: 'مؤسسة أسطورية للكشري المصري الأصيل في قلب وسط البلد. معروفة بالحصص الضخمة والأسعار المعقولة، ظلت كشري أبو طارق تشبع جوع المصريين منذ عام 1984. الطبق الأيقوني يجمع بين الأرز والعدس والمعكرونة وصلصة الطماطم اللاذعة مع طبقة من الحمص المقرمشة في الأعلى.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Downtown',
    address: 'Marouf Street, Downtown Cairo',
    priceMin: 20,
    priceMax: 60,
    priceCurrency: 'EGP',
    tags: ['koshary', 'street-food', 'budget-friendly', 'traditional'],
  },
  {
    name: 'Zooba',
    nameAr: 'زوبة',
    description: 'A modern take on traditional Egyptian cuisine with a trendy vibe. Zooba celebrates authentic Egyptian flavors with signature dishes like Egyptian liver, falafel, and creamy eggplant dip. Multiple branches across Cairo, making it easily accessible. Perfect for a quick, delicious meal that captures Egypt\'s culinary soul.',
    descriptionAr: 'نسخة حديثة من الطعام المصري التقليدي مع أجواء عصرية. تحتفل زوبة بنكهات مصرية أصيلة مع أطباق مميزة مثل الكبدة المصرية والفلافل والباذنجان الكريمي. فروع متعددة عبر القاهرة، مما يجعلها في متناول الجميع. مثالية لوجبة سريعة وشهية تلتقط روح المطبخ المصري.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    priceMin: 80,
    priceMax: 200,
    priceCurrency: 'EGP',
    tags: ['egyptian', 'casual-dining', 'mid-range', 'modern'],
  },
  {
    name: 'Felfela Restaurant',
    nameAr: 'مطعم فلفلة',
    description: 'An iconic red-walled restaurant serving traditional Egyptian cuisine since the 1950s. Felfela offers an authentic culinary journey through Egypt with classic dishes prepared using time-honored recipes. The warm atmosphere and heritage recipes make it a must-visit for those seeking genuine Egyptian dining.',
    descriptionAr: 'مطعم أيقوني بجدران حمراء يقدم المطبخ المصري التقليدي منذ الخمسينات. توفر فلفلة رحلة طهي أصيلة عبر مصر مع الأطباق الكلاسيكية المحضرة باستخدام وصفات معروقة. الأجواء الدافئة والوصفات التراثية تجعلها وجهة لا بد منها لمن يسعى إلى تناول طعام مصري حقيقي.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Downtown',
    priceMin: 100,
    priceMax: 250,
    priceCurrency: 'EGP',
    tags: ['egyptian', 'heritage', 'traditional', 'mid-range'],
  },
  {
    name: 'Sachi',
    nameAr: 'ساشي',
    description: 'A contemporary fine dining establishment offering a fusion of Asian cuisines with a modern Egyptian touch. Sachi boasts an elegant ambiance and creative presentation of dishes that elevate dining to an art form. Ideal for special occasions and those seeking a sophisticated culinary experience.',
    descriptionAr: 'مؤسسة فاخرة معاصرة تقدم مزيجاً من المأكولات الآسيوية مع لمسة مصرية حديثة. تتباهى ساشي بأجواء أنيقة وتقديم إبداعي للأطباق يرفع تناول الطعام إلى فن. مثالية للمناسبات الخاصة ولمن يسعى إلى تجربة طهي متطورة.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Korba, Heliopolis',
    priceMin: 300,
    priceMax: 700,
    priceCurrency: 'EGP',
    tags: ['fine-dining', 'fusion', 'asian', 'upscale'],
  },
  {
    name: 'Pier 88',
    nameAr: 'بير 88',
    description: 'An exclusive waterfront dining venue on a Nile boat offering spectacular views of Cairo\'s cityscape. Pier 88 combines international cuisine with romantic river ambiance, making it the perfect spot for celebrations and romantic dinners. The experience is as memorable as the food itself.',
    descriptionAr: 'مكان طعام فاخر على ضفاف النيل على زورق يقدم مناظر رائعة لأفق القاهرة. توحد بير 88 بين المأكولات الدولية وأجواء رومانسية على النهر، مما يجعلها المكان المثالي للاحتفالات والعشاء الرومانسي. التجربة نفسها لا تنسى مثل الطعام نفسه.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Zamalek',
    priceMin: 350,
    priceMax: 800,
    priceCurrency: 'EGP',
    tags: ['fine-dining', 'nile-cruise', 'international', 'romantic'],
  },
  {
    name: 'Fasahet Somaya',
    nameAr: 'فسحة سومية',
    description: 'A charming basement restaurant specializing in traditional Egyptian home cooking. Fasahet Somaya serves hearty dishes like molokhia, koshari variants, and rich meat stews in a cozy, intimate setting. The perfect spot for tasting authentic homestyle Egyptian cuisine without the fancy frills.',
    descriptionAr: 'مطعم ساحر في الطابق السفلي متخصص في الطهي المصري التقليدي. تقدم فسحة سومية أطباقاً غنية مثل الملوخية وأشكال مختلفة من الكشري والطواجن اللحمية الغنية في محيط مريح وحميمي. المكان المثالي لتذوق الطعام المصري الأصيل بدون الزينة الفاخرة.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Downtown',
    priceMin: 50,
    priceMax: 120,
    priceCurrency: 'EGP',
    tags: ['egyptian', 'home-cooking', 'cozy', 'budget-friendly'],
  },
  {
    name: 'Naguib Mahfouz Cafe',
    nameAr: 'مقهى نجيب محفوظ',
    description: 'Located in the historic Khan El-Khalili bazaar, this cafe blends literary heritage with culinary traditions. Named after Egypt\'s Nobel Prize-winning author, it offers traditional Egyptian cuisine in an atmosphere steeped in history and culture. A must-visit for history enthusiasts and culture lovers.',
    descriptionAr: 'الموجود في سوق خان الخليلي التاريخي، هذا المقهى يمزج التراث الأدبي مع التقاليد الطهية. سميت باسم الكاتب المصري الحائز على جائزة نوبل، وتقدم المأكولات المصرية التقليدية في أجواء مشبعة بالتاريخ والثقافة. وجهة لا بد منها لمحبي التاريخ والثقافة.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Islamic Cairo',
    address: 'Khan El-Khalili Bazaar',
    priceMin: 150,
    priceMax: 350,
    priceCurrency: 'EGP',
    tags: ['egyptian', 'heritage', 'bazaar', 'cultural'],
  },
  {
    name: 'Maison Thomas',
    nameAr: 'ميزون توماس',
    description: 'A beloved institution serving authentic French-Italian cuisine with a contemporary twist. Maison Thomas is known for its elegant presentation, exceptional service, and carefully curated wine selection. Perfect for romantic dinners and special celebrations in the heart of Zamalek.',
    descriptionAr: 'مؤسسة محبوبة تقدم المأكولات الفرنسية الإيطالية الأصيلة مع لمسة معاصرة. تشتهر ميزون توماس بتقديمها الأنيق والخدمة الاستثنائية واختيار النبيذ المدروس بعناية. مثالية للعشاء الرومانسي والاحتفالات الخاصة في قلب الزمالك.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Zamalek',
    priceMin: 120,
    priceMax: 300,
    priceCurrency: 'EGP',
    tags: ['french-italian', 'fine-dining', 'elegant', 'romantic'],
  },
  {
    name: 'Khufu\'s Restaurant',
    nameAr: 'مطعم خوفو',
    description: 'Perched with breathtaking views of the Giza Plateau and the majestic pyramids, Khufu\'s Restaurant combines excellent cuisine with one of the world\'s most iconic backdrops. Experience fine dining while gazing upon ancient wonders. An unforgettable experience for history lovers and gourmands alike.',
    descriptionAr: 'يطل على مناظر خلابة لهضبة الجيزة والأهرامات الفخمة، يجمع مطعم خوفو بين الطعام الممتاز وأحد أيقوني المناظر الخلفية في العالم. تجربة تناول طعام راقي بينما تحدق بالعجائب القديمة. تجربة لا تنسى لمحبي التاريخ والفنانين الطهويين على حد سواء.',
    categorySlug: 'restaurants-food',
    governorate: 'Giza',
    area: 'Giza Plateau',
    priceMin: 400,
    priceMax: 900,
    priceCurrency: 'EGP',
    tags: ['fine-dining', 'pyramid-views', 'egyptian', 'historic'],
  },
  {
    name: 'Abou El Sid',
    nameAr: 'أبو الصيد',
    description: 'A sophisticated restaurant specializing in traditional Egyptian cuisine with a gourmet presentation. Abou El Sid elevates humble Egyptian dishes to fine dining status while maintaining their authentic essence. Located in the upscale Zamalek area, it\'s perfect for those seeking refined Egyptian flavors.',
    descriptionAr: 'مطعم راقي متخصص في الطعام المصري التقليدي مع التقديم الفني الرفيع. يرفع أبو الصيد الأطباق المصرية المتواضعة إلى مستوى تناول الطعام الراقي مع الحفاظ على جوهرها الأصيل. الموجود في منطقة الزمالك الراقية، مثالي لمن يبحثون عن نكهات مصرية متطورة.',
    categorySlug: 'restaurants-food',
    governorate: 'Cairo',
    area: 'Zamalek',
    priceMin: 200,
    priceMax: 500,
    priceCurrency: 'EGP',
    tags: ['egyptian', 'gourmet', 'upscale', 'traditional'],
  },
  {
    name: 'Bubblzz',
    nameAr: 'بابليز',
    description: 'A vibrant skincare and beauty brand with a playful approach to self-care. Bubblzz offers a curated selection of skincare products, bath bombs, and wellness items designed to make your routine fun and indulgent. Known for their natural ingredients and Instagram-worthy products.',
    descriptionAr: 'علامة تجارية نابضة بالحياة للعناية بالبشرة والجمال مع نهج مرح للعناية بالنفس. توفر بابليز مجموعة منتقاة من منتجات العناية بالبشرة وقنابل الحمام ومواد العافية المصممة لجعل روتينك ممتعاً ومترفاً. معروفة بمكوناتها الطبيعية ومنتجاتها التي تستحق الظهور على إنستغرام.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 150,
    priceMax: 600,
    priceCurrency: 'EGP',
    tags: ['skincare', 'wellness', 'natural-ingredients', 'beauty'],
  },
  {
    name: 'Nefertari',
    nameAr: 'نفرتاري',
    description: 'Named after the famous Egyptian queen, Nefertari brand honors Egypt\'s beauty heritage with luxury skincare products. They focus on natural, oriental-inspired ingredients combined with modern skincare science. Perfect for those seeking products rooted in Egyptian tradition with contemporary efficacy.',
    descriptionAr: 'سميت باسم الملكة المصرية الشهيرة، تكرم علامة نفرتاري التراث الجمالي المصري مع منتجات العناية بالبشرة الفاخرة. يركزون على المكونات الطبيعية والمستوحاة من الشرق مدمجة مع علم العناية بالبشرة الحديث. مثالية لمن يسعى إلى منتجات متجذرة في التقليد المصري مع الفعالية المعاصرة.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 100,
    priceMax: 500,
    priceCurrency: 'EGP',
    tags: ['luxury-skincare', 'egyptian-heritage', 'natural', 'cosmetics'],
  },
  {
    name: 'Eva Skin Care',
    nameAr: 'إيفا للعناية بالبشرة',
    description: 'An affordable skincare line focused on addressing common skin concerns with effective, accessible products. Eva Skin Care makes quality skincare attainable for everyone. Known for acne treatments, moisturizers, and serums that deliver real results without breaking the bank.',
    descriptionAr: 'خط عناية بالبشرة معقول التكلفة يركز على معالجة مشاكل الجلد الشائعة بمنتجات فعالة وسهلة الوصول إليها. تجعل إيفا للعناية بالبشرة العناية الجلدية الجيدة متاحة للجميع. معروفة بعلاجات حب الشباب والمرطبات والأمصال التي تحقق نتائج حقيقية بدون تكسير البنك.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 30,
    priceMax: 200,
    priceCurrency: 'EGP',
    tags: ['affordable-skincare', 'acne-treatment', 'effective', 'accessible'],
  },
  {
    name: 'Glazed',
    nameAr: 'جليزد',
    description: 'A premium cosmetics brand offering a refined range of makeup and skincare products. Glazed is known for high-quality formulations, stunning packaging, and products that deliver professional-grade results. Perfect for makeup enthusiasts and those seeking luxury beauty products.',
    descriptionAr: 'علامة تجارية مستحضرات تجميل فاخرة تقدم مجموعة منتقاة من منتجات المكياج والعناية بالبشرة. تشتهر جليزد بالصيغ عالية الجودة والتغليف المذهل والمنتجات التي تحقق نتائج بمستوى احترافي. مثالية لمتحمسي المكياج ولمن يسعى إلى منتجات جمالية فاخرة.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 180,
    priceMax: 500,
    priceCurrency: 'EGP',
    tags: ['premium-cosmetics', 'makeup', 'luxury', 'professional-grade'],
  },
  {
    name: 'Trace Cosmetics',
    nameAr: 'ترايس كوزميتكس',
    description: 'A cosmetics brand emphasizing clean, ethical beauty products. Trace offers makeup and skincare free from harmful chemicals, cruelty-free and sustainably sourced. Ideal for conscious consumers who want beauty without compromise on their values.',
    descriptionAr: 'علامة تجارية لمستحضرات التجميل تؤكد على منتجات جمالية نظيفة وأخلاقية. توفر ترايس مكياج وعناية بالبشرة خالية من المواد الكيميائية الضارة، خالية من الاختبار على الحيوانات ومستدامة الحصول عليها. مثالية للمستهلكين الواعين الذين يريدون جمالاً بدون تنازل عن قيمهم.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 100,
    priceMax: 450,
    priceCurrency: 'EGP',
    tags: ['clean-beauty', 'ethical', 'cruelty-free', 'sustainable'],
  },
  {
    name: 'Areej Aromatherapy',
    nameAr: 'أريج أروما ثيرابي',
    description: 'A specialized aromatherapy and essential oils brand bringing therapeutic benefits to daily self-care. Areej offers pure, authentic essential oils and aromatherapy products sourced from quality suppliers. Perfect for creating a wellness sanctuary at home.',
    descriptionAr: 'علامة تجارية متخصصة في العلاج بالروائح والزيوت العطرية تجلب فوائد علاجية إلى العناية بالنفس اليومية. توفر أريج زيوت عطرية نقية وحقيقية ومنتجات العلاج بالروائح المستقاة من موردي جودة. مثالية لإنشاء ملاذ عافية في المنزل.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 200,
    priceMax: 700,
    priceCurrency: 'EGP',
    tags: ['aromatherapy', 'essential-oils', 'wellness', 'therapeutic'],
  },
  {
    name: 'Mothernaked',
    nameAr: 'مذرنيكد',
    description: 'A natural skincare brand celebrating motherhood and self-care with clean, plant-based products. Mothernaked combines effectiveness with natural ingredients, catering to sensitive skin and those seeking toxin-free beauty. Great for postpartum care and everyday skin nourishment.',
    descriptionAr: 'علامة تجارية للعناية بالبشرة الطبيعية تحتفل بالأمومة والعناية بالنفس بمنتجات نظيفة ومستندة إلى النباتات. تجمع مذرنيكد بين الفعالية والمكونات الطبيعية، موجهة للبشرة الحساسة ولمن يسعى إلى الجمال الخالي من السموم. رائعة للعناية بفترة ما بعد الولادة والتغذية اليومية للجلد.',
    categorySlug: 'skincare-cosmetics',
    priceMin: 250,
    priceMax: 600,
    priceCurrency: 'EGP',
    tags: ['natural-skincare', 'plant-based', 'motherhood', 'sensitive-skin'],
  },
  {
    name: 'Granita',
    nameAr: 'جرانيتا',
    description: 'A cozy cafe nestled in Zamalek offering artisanal coffee and premium pastries. Granita is a perfect retreat for coffee lovers seeking quality brews and a comfortable atmosphere for work, reading, or simply unwinding. Known for their carefully sourced beans and creative coffee preparations.',
    descriptionAr: 'مقهى مريح يقع في الزمالك يقدم القهوة الحرفية والمعجنات الفاخرة. تعتبر جرانيتا ملاذاً مثالياً لمحبي القهوة الذين يسعون إلى حساء جودة وأجواء مريحة للعمل أو القراءة أو مجرد الاسترخاء. معروفة بفولها المنتقى بعناية والتحضيرات الخلاقة للقهوة.',
    categorySlug: 'cafes-coffee',
    governorate: 'Cairo',
    area: 'Zamalek',
    priceMin: 100,
    priceMax: 250,
    priceCurrency: 'EGP',
    tags: ['artisanal-coffee', 'cafe', 'pastries', 'cozy-atmosphere'],
  },
  {
    name: 'Cilantro Cafe',
    nameAr: 'كيلانترو كافيه',
    description: 'A multi-location cafe chain serving quality coffee, fresh juices, and light meals. Cilantro Cafe is known for its warm hospitality, convenient locations, and consistent quality across all branches. A reliable choice for a quick coffee fix or leisurely brunch throughout Cairo.',
    descriptionAr: 'سلسلة مقاهي متعددة المواقع تقدم قهوة جودة وعصائر طازجة ووجبات خفيفة. تشتهر كيلانترو كافيه بحفاوتها الدافئة والمواقع المريحة والجودة المتسقة عبر جميع الفروع. اختيار موثوق لاستنشاق القهوة السريعة أو الإفطار الهادئ عبر القاهرة.',
    categorySlug: 'cafes-coffee',
    priceMin: 80,
    priceMax: 200,
    priceCurrency: 'EGP',
    tags: ['coffee', 'multi-location', 'juices', 'light-meals'],
  },
  {
    name: 'Sequoia',
    nameAr: 'سيكويا',
    description: 'An upscale waterfront cafe and lounge in Zamalek offering premium coffee, international cuisine, and panoramic Nile views. Sequoia combines exceptional service with a sophisticated ambiance, making it ideal for business meetings, romantic getaways, and special occasions.',
    descriptionAr: 'مقهى وصالة فاخرة على الواجهة المائية في الزمالك توفر قهوة فاخرة ومأكولات دولية ومناظر بانورامية للنيل. تجمع سيكويا بين الخدمة الاستثنائية والأجواء الراقية، مما يجعلها مثالية للاجتماعات التجارية والهروب الرومانسي والمناسبات الخاصة.',
    categorySlug: 'cafes-coffee',
    governorate: 'Cairo',
    area: 'Zamalek',
    priceMin: 200,
    priceMax: 500,
    priceCurrency: 'EGP',
    tags: ['upscale-cafe', 'nile-views', 'premium-coffee', 'international-cuisine'],
  },
  {
    name: 'Gold\'s Gym Egypt',
    nameAr: 'جولدز جيم مصر',
    description: 'A world-class fitness facility with multiple locations across Cairo offering state-of-the-art equipment and professional training programs. Gold\'s Gym is a trusted name in fitness with experienced trainers, group classes, and comprehensive wellness programs designed for all fitness levels.',
    descriptionAr: 'مركز لياقة بدنية من الدرجة الأولى مع مواقع متعددة عبر القاهرة توفر معدات متطورة وبرامج تدريب احترافية. تعتبر جولدز جيم اسماً موثوقاً في اللياقة البدنية مع مدربين ذوي خبرة وفئات جماعية وبرامج عافية شاملة مصممة لجميع مستويات اللياقة البدنية.',
    categorySlug: 'gyms-fitness',
    priceMin: 600,
    priceMax: 1500,
    priceCurrency: 'EGP',
    tags: ['world-class', 'gym', 'fitness', 'training', 'multi-location'],
  },
  {
    name: 'Fit Club Egypt',
    nameAr: 'فيت كلب مصر',
    description: 'A contemporary fitness club in New Cairo combining modern equipment with personalized training services. Fit Club Egypt offers group classes, personal training, and nutritional guidance in a welcoming environment. Perfect for fitness enthusiasts looking for a community-focused approach to health.',
    descriptionAr: 'نادي لياقة بدنية معاصر في مدينة نصر يجمع بين المعدات الحديثة وخدمات التدريب الشخصي. توفر فيت كلب مصر فئات جماعية وتدريب شخصي وتوجيه غذائي في بيئة ترحيبية. مثالية لمتحمسي اللياقة البدنية الذين يبحثون عن نهج موجه للمجتمع نحو الصحة.',
    categorySlug: 'gyms-fitness',
    governorate: 'Cairo',
    area: 'New Cairo',
    priceMin: 400,
    priceMax: 900,
    priceCurrency: 'EGP',
    tags: ['gym', 'fitness', 'personal-training', 'group-classes'],
  },
  {
    name: 'The Studio by Move',
    nameAr: 'ذا ستوديو باي موف',
    description: 'A premium boutique fitness studio in Zamalek specializing in specialized workout classes like yoga, pilates, and dance fitness. The Studio by Move offers a personalized, high-energy experience in an intimate setting with expert instructors dedicated to transforming fitness journeys.',
    descriptionAr: 'استوديو لياقة بدنية فاخر متخصص في الزمالك يتخصص في فئات تمارين متخصصة مثل اليوغا والبيلاتس واللياقة البدنية الراقصة. يوفر The Studio by Move تجربة شخصية عالية الطاقة في محيط حميمي مع مدربين خبراء مكرسين لتحويل رحلات اللياقة البدنية.',
    categorySlug: 'gyms-fitness',
    governorate: 'Cairo',
    area: 'Zamalek',
    priceMin: 500,
    priceMax: 1200,
    priceCurrency: 'EGP',
    tags: ['boutique-fitness', 'yoga', 'pilates', 'dance-fitness', 'premium'],
  },
  {
    name: 'Sahel North Coast',
    nameAr: 'ساحل الشمال',
    description: 'A serene coastal destination north of Cairo offering pristine beaches and luxurious resort amenities. Sahel North Coast is perfect for weekend escapes with crystalline waters, watersports facilities, and upscale accommodations. Ideal for families and those seeking a peaceful coastal retreat.',
    descriptionAr: 'وجهة ساحلية هادئة شمال القاهرة توفر شواطئ معذبة ومرافق منتجع فاخرة. يعتبر ساحل الشمال مثالياً للهروب في نهاية الأسبوع مع المياه الصافية ومرافق الرياضات المائية والإقامات الراقية. مثالي للعائلات ولمن يسعى إلى ملاذ ساحلي سلمي.',
    categorySlug: 'beaches-resorts',
    governorate: 'Alexandria',
    priceMin: 5000,
    priceMax: 9999,
    priceCurrency: 'EGP',
    tags: ['beach', 'resort', 'coastal', 'luxury', 'family-friendly'],
  },
  {
    name: 'Soma Bay',
    nameAr: 'سوما باي',
    description: 'A world-renowned luxury resort destination on the Red Sea coast offering all-inclusive experiences. Soma Bay is famous for pristine diving spots, championship golf courses, and five-star accommodations. Perfect for adventure seekers and those wanting an unforgettable Red Sea experience.',
    descriptionAr: 'وجهة منتجع فاخرة مشهورة عالمياً على ساحل البحر الأحمر توفر تجارب شاملة. تشتهر سوما باي بمواقع الغوص الخالية والملاعب الذهبية الحائزة على بطولات والإقامات الخمس نجوم. مثالية لباحثي المغامرة ولمن يريد تجربة البحر الأحمر التي لا تنسى.',
    categorySlug: 'beaches-resorts',
    governorate: 'Red Sea',
    priceMin: 6000,
    priceMax: 9999,
    priceCurrency: 'USD',
    priceLabel: 'per-night',
    tags: ['red-sea', 'luxury-resort', 'all-inclusive', 'diving', 'golf'],
  },
  {
    name: 'Ain Sokhna',
    nameAr: 'عين سخنة',
    description: 'A popular coastal destination just south of Cairo offering affordable beach getaways with natural hot springs. Ain Sokhna is perfect for quick weekend trips, water activities, and family outings. Known for its accessible pricing and relaxed seaside atmosphere.',
    descriptionAr: 'وجهة ساحلية شهيرة جنوب القاهرة مباشرة توفر عطلات شاطئية معقولة التكلفة مع ينابيع ساخنة طبيعية. تعتبر عين سخنة مثالية لرحلات نهاية الأسبوع السريعة والأنشطة المائية والرحلات العائلية. معروفة بأسعارها المعقولة وأجواء الساحل المسترخية.',
    categorySlug: 'beaches-resorts',
    governorate: 'Suez',
    priceMin: 1500,
    priceMax: 5000,
    priceCurrency: 'EGP',
    tags: ['beach', 'affordable', 'hot-springs', 'family-friendly', 'weekend-getaway'],
  },
  {
    name: 'Ful & Taameya',
    nameAr: 'فول و طعمية',
    description: 'The quintessential Egyptian street food experience offering authentic, made-to-order fava beans (ful) and falafel (taameya). Ful & Taameya represents the heart of Egyptian culinary culture, serving generations with simple, flavorful, and incredibly affordable fare. A must-try for authentic Egypt.',
    descriptionAr: 'تجربة الطعام المصري الشارعي الأساسية تقدم الفول والعدس الأصيل المصنوع حسب الطلب والفلافل. يمثل الفول والطعمية قلب الثقافة الطهوية المصرية، حيث يخدم الأجيال بالطعام البسيط والشهي والميسور جداً. وجهة يجب تجربتها للمصر الأصيل.',
    categorySlug: 'street-food',
    governorate: 'Cairo',
    priceMin: 10,
    priceMax: 30,
    priceCurrency: 'EGP',
    tags: ['street-food', 'ful-taameya', 'traditional', 'budget-friendly', 'authentic'],
  },
  {
    name: 'Hawawshi',
    nameAr: 'هاوشي',
    description: 'A beloved Egyptian sandwich of thin bread generously filled with seasoned meat and herbs. Hawawshi is a street food staple that captures the essence of Egyptian flavors in every bite. Found in local neighborhoods, it\'s affordable, delicious, and an unmissable taste of street-level Egypt.',
    descriptionAr: 'شطيرة مصرية محبوبة من خبز رقيق مليء بسخاء باللحم المتبل والأعشاب. يعتبر الهاوشي طعاماً شارعياً أساسياً يلتقط جوهر النكهات المصرية في كل لقمة. توجد في الأحياء المحلية، وهي معقولة التكلفة وشهية وذوق لا يفوت من الشارع المصري.',
    categorySlug: 'street-food',
    governorate: 'Cairo',
    area: 'Downtown, Boulaq',
    priceMin: 20,
    priceMax: 50,
    priceCurrency: 'EGP',
    tags: ['street-food', 'sandwich', 'meat', 'traditional', 'budget-friendly'],
  },
  {
    name: 'Feteer Meshaltet',
    nameAr: 'فطير مشللت',
    description: 'Crispy, flaky pastry layered with butter and filled with various savory or sweet options. Feteer Meshaltet is an Egyptian pastry favorite that can be enjoyed any time of day. From spinach and cheese to honey and nuts, every variation is a delightful treat. Affordable street food at its finest.',
    descriptionAr: 'معجنات مقرمشة وفلافل مطبقة بالزبدة ومليئة بخيارات مختلفة حلوة أو مالحة. يعتبر فطير مشللت طعماً مصرياً مفضلاً يمكن الاستمتاع به في أي وقت من اليوم. من السبانخ والجبن إلى العسل والمكسرات، كل نسخة متغيرة ملذة. طعام شارعي معقول بأفضل صوره.',
    categorySlug: 'street-food',
    governorate: 'Cairo',
    priceMin: 20,
    priceMax: 60,
    priceCurrency: 'EGP',
    tags: ['street-food', 'pastry', 'sweet-savory', 'traditional', 'affordable'],
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

async function seed() {
  try {
    console.log('Starting seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(adminSettings);
    await db.delete(reviews);
    await db.delete(items);
    await db.delete(users);
    await db.delete(categories);

    // Seed categories
    console.log('Seeding categories...');
    const categoryMap: Record<string, number> = {};
    for (const cat of seedCategories) {
      const result = await db
        .insert(categories)
        .values({
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color,
          description: cat.description,
        })
        .returning();
      if (result[0]) {
        categoryMap[cat.slug] = result[0].id;
      }
    }
    console.log(`✓ Seeded ${seedCategories.length} categories`);

    // Seed admin user
    console.log('Seeding admin user...');
    const adminPasswordHash = await bcrypt.hash('Admin@2024', 10);
    const adminResult = await db
      .insert(users)
      .values({
        name: 'Admin',
        email: 'admin@demo2cairolive.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        emailVerified: new Date(),
      })
      .returning();
    console.log('✓ Seeded admin user');

    // Seed items
    console.log('Seeding items...');
    let successCount = 0;
    for (const item of seedItems) {
      const categoryId = categoryMap[item.categorySlug];
      if (!categoryId) {
        console.warn(`Category not found for ${item.categorySlug}, skipping ${item.name}`);
        continue;
      }

      const slug = generateSlug(item.name);
      await db.insert(items).values({
        slug,
        name: item.name,
        nameAr: item.nameAr || null,
        categoryId,
        description: item.description,
        descriptionAr: item.descriptionAr || null,
        governorate: item.governorate || null,
        area: item.area || null,
        address: item.address || null,
        priceMin: item.priceMin || null,
        priceMax: item.priceMax || null,
        priceLabel: item.priceLabel || 'per-item',
        priceCurrency: item.priceCurrency || 'EGP',
        website: item.website || null,
        instagram: item.instagram || null,
        phone: item.phone || null,
        tags: item.tags || [],
        imageUrl: item.imageUrl || null,
        imageAlt: item.imageAlt || null,
        isVerified: true,
        isFeatured: true,
        isActive: true,
        avgRating: '0.00',
        totalReviews: 0,
        submittedBy: adminResult[0]?.id || null,
      } as any);
      successCount++;
    }
    console.log(`✓ Seeded ${successCount} items`);

    // Seed admin settings
    console.log('Seeding admin settings...');
    await db
      .insert(adminSettings)
      .values({
        key: 'auto_approve_reviews',
        value: 'false',
      })
      .returning();
    console.log('✓ Seeded admin settings');

    console.log('\n✓ Seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

seed();
