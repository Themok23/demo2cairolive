# demo2cairolive — Full-Stack Build Prompt

## Project Identity

**Platform name:** demo2cairolive  
**Tagline:** "Rate anything in Egypt."  
**Concept:** A community-driven rating and review platform focused entirely on Egypt. Users can discover, add, and rate anything — restaurants, cosmetics, street food carts, university faculties, gyms, apps, beaches, local brands, hotels, clinics, and more. Everything is treated as a "listable item" with a unified rating system. No marketplace, no prices shown by default, but an optional price tag / price range field for context (EGP). Think Yelp × Product Hunt × Letterboxd, built for Egypt.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | GSAP + ScrollTrigger |
| Backend API | Next.js Route Handlers (clean architecture) |
| Database | Neon (PostgreSQL serverless) via `@neondatabase/serverless` |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 (email/password + Google OAuth) |
| Image hosting | Cloudinary (free tier) or Next.js Image with placeholder |
| Deployment | Vercel |

---

## Architecture: Clean Architecture in Next.js

```
src/
  domain/                    # Pure business logic, zero framework deps
    entities/
      Item.ts                # Core entity: anything that can be rated
      Review.ts
      User.ts
      Category.ts
    value-objects/
      Rating.ts              # 1-5, validates itself
      PriceTag.ts            # Optional: range + currency EGP
      Location.ts            # governorate + area + coordinates
    repositories/
      IItemRepository.ts
      IReviewRepository.ts
      IUserRepository.ts
    services/
      RatingService.ts       # Aggregate score computation
      ModerationService.ts   # Auto-allow logic

  application/               # Use cases (one class = one action)
    usecases/
      items/
        GetFeaturedItems.ts
        GetItemBySlug.ts
        CreateItem.ts
        SearchItems.ts
        GetItemsByCategory.ts
      reviews/
        SubmitReview.ts
        ApproveReview.ts
        GetReviewsByItem.ts
      users/
        RegisterUser.ts
        GetUserProfile.ts
    dtos/
      ItemDTO.ts
      ReviewDTO.ts
      CreateItemDTO.ts
      SubmitReviewDTO.ts

  infrastructure/             # All I/O: DB, external APIs
    db/
      schema.ts              # Drizzle schema definitions
      client.ts              # Neon connection
    repositories/
      DrizzleItemRepository.ts
      DrizzleReviewRepository.ts
      DrizzleUserRepository.ts
    seeds/
      items.seed.ts          # Egypt data

  presentation/               # Next.js layer: pages, components, API routes
    app/
      (marketing)/
        page.tsx             # Homepage
        layout.tsx
      explore/
        page.tsx             # Browse all items
        [category]/
          page.tsx
      items/
        [slug]/
          page.tsx           # Item detail page
      submit/
        page.tsx             # Add new item form
      admin/
        page.tsx             # Admin dashboard
        reviews/
          page.tsx
      api/
        items/
          route.ts
          [slug]/
            route.ts
          featured/
            route.ts
        reviews/
          route.ts
          [id]/
            approve/
              route.ts
        categories/
          route.ts
        search/
          route.ts
        auth/
          [...nextauth]/
            route.ts
    components/
      ui/                    # Design system atoms
      items/                 # Item card, item grid, item hero
      reviews/               # Review form, review card, review list
      layout/                # Navbar, footer, sidebar
      animations/            # GSAP wrapper components
```

---

## Database Schema (Drizzle + Neon PostgreSQL)

```typescript
// infrastructure/db/schema.ts

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 50 }),           // lucide icon name
  color: varchar('color', { length: 20 }),          // tailwind color class
  description: text('description'),
  itemCount: integer('item_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  nameAr: varchar('name_ar', { length: 200 }),     // Arabic name if applicable
  categoryId: integer('category_id').references(() => categories.id),
  description: text('description').notNull(),
  descriptionAr: text('description_ar'),
  imageUrl: varchar('image_url', { length: 500 }),
  imageAlt: varchar('image_alt', { length: 200 }),

  // Location (optional — applicable to restaurants, gyms, etc.)
  governorate: varchar('governorate', { length: 100 }),  // e.g. "Cairo", "Giza", "Alexandria"
  area: varchar('area', { length: 100 }),                 // e.g. "Zamalek", "Maadi", "Heliopolis"
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  googleMapsUrl: varchar('google_maps_url', { length: 500 }),

  // Price tag (optional, informational only, NOT a marketplace)
  priceMin: integer('price_min'),                   // in EGP
  priceMax: integer('price_max'),                   // in EGP
  priceLabel: varchar('price_label', { length: 50 }), // e.g. "Budget", "Mid-range", "Premium"
  priceCurrency: varchar('price_currency', { length: 5 }).default('EGP'),

  // Contact & social
  website: varchar('website', { length: 300 }),
  instagram: varchar('instagram', { length: 150 }),
  phone: varchar('phone', { length: 30 }),

  // Metadata
  tags: text('tags').array(),                        // e.g. ["vegan", "family-friendly", "outdoor"]
  isVerified: boolean('is_verified').default(false), // admin verified
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),

  // Aggregated (denormalized for performance)
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }).default('0.00'),
  totalReviews: integer('total_reviews').default(0),

  submittedBy: integer('submitted_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),

  rating: integer('rating').notNull(),              // 1-5
  title: varchar('title', { length: 200 }),
  body: text('body').notNull(),
  pros: text('pros'),
  cons: text('cons'),
  visitedAt: date('visited_at'),                    // when did you experience this?

  // Status
  status: varchar('status', { length: 20 }).default('pending'), // pending | approved | rejected
  autoApproved: boolean('auto_approved').default(false),
  adminNote: text('admin_note'),

  // Helpfulness
  helpfulCount: integer('helpful_count').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 300 }).notNull().unique(),
  emailVerified: timestamp('email_verified'),
  passwordHash: varchar('password_hash', { length: 500 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  role: varchar('role', { length: 20 }).default('user'),  // user | admin
  bio: text('bio'),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const adminSettings = pgTable('admin_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  // Key: "auto_approve_reviews" → "true" | "false"
});
```

---

## Seed Data: Egypt (Populate on First Deploy)

Populate the database with the following real Egyptian items. Use accurate, publicly available information only. All descriptions should be warm, informative, and helpful to Egyptian users. Write seeder as a runnable ts-node script.

### Category 1: Restaurants & Food (Cairo)

| Name | Area | Description | Price Label | Tags |
|------|------|-------------|-------------|------|
| Koshary Abou Tarek | Downtown Cairo, Marouf St | Cairo's most iconic koshari restaurant since 1950. Featured on CNN and Anthony Bourdain's show. A multi-floor institution serving the national dish of Egypt: rice, lentils, pasta, chickpeas, fried onions, and spiced tomato sauce. | Budget (EGP 20-60) | koshari, vegetarian, vegan, iconic, fast-food |
| Zooba | Zamalek + multiple branches | Gourmet Egyptian street food with a modern twist. Whole-grain koshari, chicken liver hawashi, and taameya sandwiches made with fresh local ingredients. Vibrant colorful decor. | Mid-range (EGP 80-200) | street-food, gourmet, local, colorful, casual |
| Felfela Restaurant | Downtown Cairo, near Egyptian Museum | Historic restaurant opened in 1959, family-owned by the Zaghloul family. Award-winning traditional Egyptian cuisine with authentic interiors. Known for falafel, baba ghanoush, and classic mezze. | Mid-range (EGP 100-250) | traditional, historic, family-friendly, downtown |
| Sachi | Korba, Heliopolis + Park St Giza | Award-winning restaurant serving Mediterranean and Japanese fusion cuisine. One of the best restaurants in the region. Try the salmon tataki, truffle pasta, and artisanal cocktails. | Premium (EGP 300-700) | fine-dining, japanese, fusion, award-winning |
| Pier 88 | Zamalek, on a Nile boat | Italian cuisine and pastries on an elegant docked boat on the Nile in Zamalek. Award-winning executive chefs. Stunning river views. | Premium (EGP 350-800) | italian, nile-view, romantic, fine-dining |
| Fasahet Somaya | Downtown Cairo | No-menu home-style Egyptian restaurant run by Chef Somaya. She cooks what she finds at the market each day — written on a board. Opens for only two hours daily. A cult favorite. | Budget (EGP 50-120) | homestyle, authentic, hidden-gem, local |
| Naguib Mahfouz Cafe | Khan El Khalili | Restaurant and cafe in the historic bazaar named after Egypt's Nobel laureate. Traditional Egyptian dishes: mezze, grilled meats, seafood. Atmospheric setting. | Mid-range (EGP 150-350) | historic, khan-el-khalili, traditional, touristy |
| Maison Thomas | Zamalek | Cairo's most beloved pizza restaurant since 1922. Thin-crust Neapolitan-style pizza. A true Cairo institution in the heart of Zamalek. | Mid-range (EGP 120-300) | pizza, italian, institution, zamalek |
| Khufu's Restaurant | Giza Plateau | Upscale Egyptian cuisine with unbeatable Pyramid views. Contemporary takes on Egyptian classics. Requires entrance ticket to Giza Plateau. Breakfast and lunch only. | Premium (EGP 400-900) | pyramid-view, fine-dining, egyptian-cuisine, landmark |
| Abou El Sid | Zamalek | Authentic Egyptian fine dining in a beautiful 1920s setting. Celebrated for traditional dishes like molokhia, kofta, and grilled meats, in an atmospheric, richly decorated space. | Mid-range (EGP 200-500) | traditional, egyptian, zamalek, atmospheric |

### Category 2: Skincare & Cosmetics (Egypt)

| Name | Type | Description | Price Label | Tags |
|------|------|-------------|-------------|------|
| Bubblzz | Bath & Body | Cairo-based brand committed to organic and essential oils. All products crafted from scratch with natural ingredients. Range includes soaps, shampoos, body scrubs, and skincare. No harsh chemicals. | Mid-range (EGP 150-600) | organic, natural, vegan, handmade |
| Nefertari | Skincare | Founded by pharmacist Mona Erian. All-natural and handmade products using Egyptian ingredients: black cumin seed oil, chamomile, hibiscus, and goat's milk soaps. Body lotions, face creams, hair products. | Mid-range (EGP 100-500) | natural, handmade, organic, pharaonic-ingredients |
| Eva Skin Care | Skincare & Hair | One of Egypt's first and most established cosmetics brands, with over 50 years in the market. Trusted across Egyptian households for affordable, reliable skincare and haircare basics. | Budget (EGP 30-200) | trusted, affordable, local-brand, household |
| Glazed | Body Care | Egyptian brand with playful candy-inspired packaging. First Egyptian brand to offer shaving products. Known for Glazed Donut Body Oil, brightening gels, and sugar scrubs. | Mid-range (EGP 180-500) | playful, body-care, bright-packaging, innovative |
| Trace Cosmetics | Makeup & Skincare | Wide range of face masks, brow products (brow soap, brush), and skincare essentials. 100% safe formulas. Popular for their Liquid Magic face oil enriched with essential oils. | Mid-range (EGP 100-450) | makeup, skincare, brow-products, safe-formulas |
| Areej Aromatherapy | Aromatherapy & Essential Oils | Family-run Egyptian company aiming to restore Egypt's essential oils heritage. Natural, therapeutic-grade oils sourced locally. | Mid-range (EGP 200-700) | aromatherapy, essential-oils, family-brand, heritage |
| Mothernaked | Skincare-Infused Makeup | Clean, vegan, cruelty-free makeup with built-in skincare. Products contain 30 SPF. Available in three shades for different skin tones. Unique crossover brand. | Mid-range (EGP 250-600) | vegan, cruelty-free, spf, clean-beauty |

### Category 3: Cafes & Coffee (Cairo)

| Name | Area | Description | Price Label | Tags |
|------|------|-------------|-------------|------|
| Granita | Zamalek, All Saints Cathedral | Colorful, beloved cafe on cathedral grounds in Zamalek. Egyptian and international food, all-day breakfast, fresh desserts daily. A Zamalek institution. | Mid-range (EGP 100-250) | cafe, breakfast, zamalek, colorful, relaxed |
| Cilantro Cafe | Multiple branches | Egypt's most popular specialty coffee chain. Multiple Cairo and Alexandria branches. Reliable espresso, sandwiches, and a space beloved by students and professionals. | Mid-range (EGP 80-200) | coffee, chain, reliable, multiple-branches |
| Sequoia | Zamalek, Nile corniche | Iconic Nile-view outdoor cafe and restaurant in Abu El Feda Garden. Perfect for evenings with shisha, cocktails, and light food. | Mid-range (EGP 200-500) | nile-view, outdoor, shisha, iconic, evening |

### Category 4: Gyms & Fitness (Cairo)

| Name | Area | Description | Price Label | Tags |
|------|------|-------------|-------------|------|
| Gold's Gym Egypt | Multiple (Maadi, Heliopolis, New Cairo) | International gym franchise with strong presence in Cairo. Full equipment, classes, PT sessions. | Premium (EGP 600-1500/month) | gym, international-brand, full-equipment, classes |
| Fit Club Egypt | New Cairo | Popular local fitness center in New Cairo offering group classes, cardio, and weights. | Mid-range (EGP 400-900/month) | gym, local, new-cairo, group-classes |
| The Studio by Move | Zamalek | Boutique wellness studio in Zamalek offering pilates, yoga, and barre classes in a peaceful, design-forward setting. | Premium (EGP 500-1200/month) | boutique, yoga, pilates, barre, wellness |

### Category 5: Beaches & Resorts (Egypt)

| Name | Location | Description | Price Label | Tags |
|------|----------|-------------|-------------|------|
| Sahel North Coast | North Coast, Marsa Matrouh road | Egypt's most popular summer destination. Hundreds of compounds and resorts along pristine Mediterranean beaches. Peak season July-August. | Premium (EGP 5000+/week) | beach, mediterranean, summer, compound |
| Soma Bay | Red Sea, Hurghada | Upscale Red Sea peninsula resort with world-class kite surfing, golf, and multiple luxury hotels. | Premium (USD 100+/night) | red-sea, resort, kite-surfing, luxury |
| Ain Sokhna | Suez Governorate, 130km from Cairo | The closest beach to Cairo. Numerous resorts on the Red Sea coast. Weekend escape for Cairenes. | Mid-range (EGP 1500-5000/night) | red-sea, weekend-getaway, close-to-cairo, resort |

### Category 6: Street Food (Cairo)

| Name | Area | Description | Price Label | Tags |
|------|------|-------------|-------------|------|
| Ful & Taameya | Citywide | Egypt's quintessential breakfast. Slow-cooked fava beans with olive oil and spices, served with deep-fried falafel (taameya made with fava beans, not chickpeas). | Budget (EGP 10-30) | breakfast, vegan, street-food, classic |
| Hawawshi | Downtown / Boulaq | Spiced minced meat stuffed in bread and baked. Street food staple. Most famous from Downtown Cairo vendors and local bakeries. | Budget (EGP 20-50) | meat, bread, street-food, filling |
| Feteer Meshaltet | Citywide bakeries | Egyptian layered pastry made with butter or ghee. Can be sweet (with honey, jam, Nutella) or savory (cheese, meat). A comfort food favorite. | Budget (EGP 20-60) | pastry, breakfast, sweet, savory |

---

## Admin System

### Admin Settings Panel
- Toggle: **Auto-approve reviews** ON/OFF (stored in `admin_settings` table, key: `auto_approve_reviews`)
- If ON: submitted reviews are instantly set to `status = 'approved'`
- If OFF: submitted reviews sit in a `pending` queue for manual review

### Admin Dashboard Pages
- `/admin` — Stats overview: total items, total reviews pending, total users, avg rating
- `/admin/reviews` — Review moderation queue with approve/reject/admin-note controls
- `/admin/items` — Item management: toggle featured, toggle verified, deactivate items
- `/admin/settings` — Toggle auto-approve, add/edit categories

### Admin Authentication
- Role check middleware: `role === 'admin'` required for all `/admin` routes
- First admin user seeded via migration (email: `admin@demo2cairolive.com`, password: `Admin@2024`)

---

## Design System

### Identity
- **Font Display:** Clash Display or DM Serif Display (bold, editorial)
- **Font Body:** Plus Jakarta Sans (clean, modern, readable)
- **Palette:**
  - Background: `#FAFAF8` (warm off-white)
  - Surface: `#FFFFFF`
  - Primary: `#E8572A` (Cairo sunset orange)
  - Secondary: `#1A1A2E` (deep navy)
  - Accent 1: `#F5C542` (golden yellow — pharaonic gold)
  - Accent 2: `#4CAF88` (Nile green)
  - Muted: `#E8E8E4`
  - Text Primary: `#1A1A2E`
  - Text Muted: `#6B6B7B`
- **Border radius:** 16px cards, 12px inputs, 8px buttons
- **Shadow:** soft, layered (`0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)`)

### Aesthetic Direction
Warm Egyptian editorial. Think the precision of a modern magazine crossed with the warmth of Cairo's golden light. Light mode only. Generous white space. Cards with subtle hover lift. Clean grids. Colorful category pills. Star ratings animated on hover. Not dark, not heavy. Light, airy, colorful, and distinctly Egyptian without being clichéd.

### GSAP Animations Required
1. **Homepage hero text:** Staggered word/line reveal on mount using `gsap.fromTo` with `y: 40, opacity: 0`
2. **Item cards on scroll:** `ScrollTrigger` stagger fade-up as cards enter viewport
3. **Category pills:** Horizontal scroll with smooth drag (GSAP Draggable or CSS scroll-snap)
4. **Star rating:** On hover, stars scale up sequentially left to right (GSAP timeline)
5. **Page transitions:** Fade-in/out between routes using GSAP on `layout.tsx`
6. **Featured section:** Number counter animation for stats (total reviews, items, etc.)
7. **Review submit button:** Subtle pulse when form is valid and ready to submit

### Hover Effects
- Item cards: `transform: translateY(-4px)` + shadow deepen on hover, smooth 200ms ease
- Category pills: Background fill animation from left on hover
- Nav links: Underline slide-in from left
- Submit button: Background color shifts + slight scale on hover
- Star rating input: Interactive fill on hover with GSAP

---

## Pages Specification

### 1. Homepage `/`

**Sections (top to bottom):**
1. **Hero** — Tagline: "Rate anything in Egypt." + subtext + two CTAs (Explore / Add Something). Animated headline with GSAP stagger. Background: abstract geometric pattern in warm neutrals.
2. **Category Grid** — 6-8 category cards in a responsive grid with icon, name, item count, accent color. Scroll-triggered entrance.
3. **Featured Items** — "What's Hot Right Now" — 6 curated items with image, name, category badge, star rating, review count. Horizontal scroll on mobile.
4. **Platform Stats** — Animated counters: X items rated, X reviews, X categories. Scroll-triggered.
5. **Recent Reviews** — Latest 4 approved reviews with reviewer avatar, stars, snippet, item link.
6. **CTA Banner** — "Found something worth rating? Add it." with a prominent submit CTA.

### 2. Explore Page `/explore`

- Filter bar: Category tabs (horizontal scroll), Governorate dropdown, Rating filter (4+, 3+), Price filter (Budget / Mid / Premium), Sort (Most Reviewed / Highest Rated / Newest)
- Grid of item cards (3 cols desktop, 2 cols tablet, 1 col mobile)
- Lazy loading / infinite scroll or pagination
- Empty state: illustrated empty state with CTA to add first item

### 3. Item Detail Page `/items/[slug]`

- **Hero:** Large image, item name, category badge, governorate/area pill, avg star rating (large, animated), total review count
- **Info bar:** Price tag, website link, Instagram, phone, Google Maps link (if applicable)
- **Description:** Full description
- **Tags:** Tag pills
- **Reviews section:**
  - Rating breakdown bar chart (5 stars → 1 star distribution)
  - Review cards: avatar, name, stars, date, title, body, pros/cons
  - "Write a Review" CTA — opens inline form or modal
- **Review Form (authenticated):**
  - Star picker (interactive GSAP hover)
  - Title (optional), Body (required, min 30 chars), Pros, Cons, Visit date
  - Submit button with loading state
  - If not logged in: "Sign in to leave a review" prompt

### 4. Submit Item Page `/submit`

- Form: Name, Arabic Name (optional), Category (dropdown), Description, Image URL, Governorate, Area, Address, Google Maps URL, Price Min/Max, Price Label, Website, Instagram, Phone, Tags (multi-input)
- Authenticated only
- After submit: "Your item has been submitted. It will appear after review." (or immediately if admin has auto-approve on for items — note: by default items need admin approval, reviews have their own toggle)

### 5. Admin Dashboard `/admin`

- Protected route (admin role only)
- Stats cards: pending reviews, total items, total users, avg platform rating
- Pending reviews table: item name, reviewer, rating, body snippet, approve/reject actions
- Settings: Auto-approve toggle with live save

### 6. Auth Pages
- `/auth/signin` — Email + password form, Google OAuth button
- `/auth/signup` — Name, email, password, confirm password
- Clean, centered, minimal card design

---

## API Routes (Clean Architecture)

All route handlers call use cases; use cases call repositories; repositories use Drizzle.

```
GET  /api/items                    → GetItemsByCategory use case (with filters)
GET  /api/items/featured           → GetFeaturedItems use case
GET  /api/items/[slug]             → GetItemBySlug use case
POST /api/items                    → CreateItem use case (auth required)

GET  /api/reviews?itemId=X         → GetReviewsByItem use case (approved only for public)
POST /api/reviews                  → SubmitReview use case (auth required, respects auto-approve setting)
POST /api/reviews/[id]/approve     → ApproveReview use case (admin only)
POST /api/reviews/[id]/reject      → RejectReview use case (admin only)

GET  /api/categories               → All active categories
GET  /api/search?q=X               → Full text search on items

GET  /api/admin/settings           → Get admin settings (admin only)
POST /api/admin/settings           → Update admin settings (admin only)
```

---

## Environment Variables (.env.local)

```
DATABASE_URL=              # Neon PostgreSQL connection string
NEXTAUTH_SECRET=           # Random 32-char string
NEXTAUTH_URL=              # https://demo2cairolive.vercel.app
GOOGLE_CLIENT_ID=          # OAuth
GOOGLE_CLIENT_SECRET=      # OAuth
NEXT_PUBLIC_APP_URL=       # https://demo2cairolive.vercel.app
```

---

## Deployment Steps

1. Create Neon project → copy `DATABASE_URL`
2. Run `drizzle-kit push` to apply schema
3. Run seed script: `npx tsx src/infrastructure/db/seeds/items.seed.ts`
4. Push to GitHub
5. Connect to Vercel, add all env vars
6. Deploy → get production URL

---

## Key Non-Negotiables

- All business logic lives in `domain/` and `application/` — zero Drizzle or Next.js imports there
- Route handlers are max 20 lines — they instantiate the use case and return the result
- All repository interfaces are in `domain/repositories/` — implementations in `infrastructure/`
- Reviews have hard status gate: only `status = 'approved'` reviews are shown publicly
- Admin `auto_approve_reviews` setting is checked in `SubmitReview` use case at runtime
- GSAP is loaded client-side only (`'use client'` components) — never in server components
- All Egyptian seed data must use real, accurate information (names, areas, descriptions)
- Price fields are informational only — never "buy now" or cart functionality
- Mobile-first responsive design throughout
- Lighthouse score target: Performance 90+, Accessibility 95+

---

## Deliverable

A live Vercel URL for demo2cairolive — a fully functional, beautifully designed Egyptian rating platform with:
- Seeded data from real Egyptian restaurants, cosmetics brands, cafes, beaches
- Working review system with admin approval toggle
- Clean architecture throughout
- GSAP animations on hero, cards, stars, and page transitions
- Admin panel at `/admin`
- Full auth (signup/login/Google OAuth)
