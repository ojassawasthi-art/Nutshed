import { IMAGES, type ImageKey } from './images';

export type WeightOption = '250 g' | '500 g' | '1 kg' | 'Gift Box';

export type NutIconKind =
  | 'almond'
  | 'cashew'
  | 'pistachio'
  | 'walnut'
  | 'date'
  | 'fig'
  | 'apricot'
  | 'raisins';

export interface Category {
  slug: string;
  name: string;
  navGroup: 'Dry Fruits' | 'Nuts' | 'Dates & Figs' | 'Mixes' | 'Gift Hampers';
  tagline: string;
  imageKey: ImageKey;
}

export interface NeedItem {
  slug: string;
  title: string;
  shortTag: string;
  description: string;
  imageKey: ImageKey;
  recommendedSlugs: string[];
}

export interface ProductVariant {
  weight: WeightOption;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  origin: string;
  categorySlug: string;
  navGroup: 'Dry Fruits' | 'Nuts' | 'Dates & Figs' | 'Mixes' | 'Gift Hampers';
  needSlugs: string[];
  isBestSeller?: boolean;
  isHamper?: boolean;
  badge?: string;
  shortCopy: string;
  description: string;
  storageTip: string;
  deliveryInfo: string;
  imageKey: ImageKey;
  galleryKeys: ImageKey[];
  variants: ProductVariant[];
}

export interface ReviewItem {
  id: string;
  author: string;
  city: string;
  productName: string;
  rating: number;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BoxIngredient {
  id: string;
  name: string;
  nutKind: NutIconKind;
  origin: string;
  price250g: number;
  price500g: number;
  imageKey: ImageKey;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'almonds',
    name: 'Almonds',
    navGroup: 'Nuts',
    tagline: 'California & Kashmir Mamra, sorted whole.',
    imageKey: 'californiaAlmonds',
  },
  {
    slug: 'cashews',
    name: 'Cashews',
    navGroup: 'Nuts',
    tagline: 'Plump W240 ivory kernels with a clean snap.',
    imageKey: 'wholeCashews',
  },
  {
    slug: 'pistachios',
    name: 'Pistachios',
    navGroup: 'Nuts',
    tagline: 'Lightly roasted, easy-open shells.',
    imageKey: 'roastedPistachios',
  },
  {
    slug: 'walnuts',
    name: 'Walnuts',
    navGroup: 'Nuts',
    tagline: 'Snow-white light halves without the bitter film.',
    imageKey: 'walnutHalves',
  },
  {
    slug: 'raisins',
    name: 'Raisins',
    navGroup: 'Dry Fruits',
    tagline: 'Sun-dried seedless black & golden clusters.',
    imageKey: 'blackRaisins',
  },
  {
    slug: 'dates',
    name: 'Dates',
    navGroup: 'Dates & Figs',
    tagline: 'Soft, caramel-rich Medjool dates.',
    imageKey: 'medjoolDates',
  },
  {
    slug: 'figs',
    name: 'Figs',
    navGroup: 'Dates & Figs',
    tagline: 'Tender Afghan dried anjeer, naturally sweet.',
    imageKey: 'driedFigs',
  },
  {
    slug: 'apricots',
    name: 'Apricots',
    navGroup: 'Dry Fruits',
    tagline: 'Plump, chewy golden apricots with gentle tartness.',
    imageKey: 'driedApricots',
  },
  {
    slug: 'mixes',
    name: 'Mixes and Trail Mixes',
    navGroup: 'Mixes',
    tagline: 'Pure nuts and fruit. Zero candy or sev filler.',
    imageKey: 'everydayTrailMix',
  },
  {
    slug: 'seeds-berries',
    name: 'Seeds and Berries',
    navGroup: 'Dry Fruits',
    tagline: 'Pumpkin, sunflower, and tart cranberries.',
    imageKey: 'seedsAndBerries',
  },
  {
    slug: 'gift-hampers',
    name: 'Gift Hampers',
    navGroup: 'Gift Hampers',
    tagline: 'Jaipur-packed hampers for Diwali, weddings & teams.',
    imageKey: 'festiveGiftHamper',
  },
];

export const NEEDS: NeedItem[] = [
  {
    slug: 'kids-brain-boost',
    title: 'Kids Brain Boost',
    shortTag: 'Tiffin Ready',
    description: 'Walnuts and almonds for the tiffin. No coating, no added sugar.',
    imageKey: 'needKidsTiffin',
    recommendedSlugs: ['california-almonds', 'walnut-halves', 'black-raisins'],
  },
  {
    slug: 'fitness-and-protein',
    title: 'Fitness and Protein',
    shortTag: 'Post-Workout',
    description: 'Plain nuts when you want a handful after a walk or a workout.',
    imageKey: 'needFitnessProtein',
    recommendedSlugs: ['california-almonds', 'roasted-pistachios', 'seeds-and-berries-mix'],
  },
  {
    slug: 'sugar-free-for-seniors',
    title: 'Sugar-free for Seniors',
    shortTag: 'Zero Added Sweet',
    description: 'Plain nuts only. Dried fruit still has its own natural sugar.',
    imageKey: 'needSeniorsCare',
    recommendedSlugs: ['mamra-almonds', 'whole-cashews', 'walnut-halves'],
  },
  {
    slug: 'daily-snacking',
    title: 'Daily Snacking',
    shortTag: 'Desk & Dabba',
    description: 'A mix without sev or chocolate, for the desk and the dabba.',
    imageKey: 'needDailySnacking',
    recommendedSlugs: ['everyday-trail-mix', 'roasted-pistachios', 'whole-cashews'],
  },
  {
    slug: 'festive-gifting',
    title: 'Festive Gifting',
    shortTag: 'Jaipur Boxes',
    description: 'Hampers packed in Jaipur for Diwali, weddings, and family visits.',
    imageKey: 'needFestiveGifting',
    recommendedSlugs: ['jaipur-festive-hamper', 'jaipur-family-hamper', 'medjool-dates'],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-cal-almonds',
    slug: 'california-almonds',
    name: 'California Almonds',
    origin: 'Nonpareil Grade · Packed in Jaipur',
    categorySlug: 'almonds',
    navGroup: 'Nuts',
    needSlugs: ['kids-brain-boost', 'fitness-and-protein', 'sugar-free-for-seniors', 'daily-snacking'],
    isBestSeller: true,
    badge: 'Best seller',
    shortCopy: 'Crisp, uniform Nonpareil almonds with a clean, sweet snap.',
    description:
      'Sorted by hand in Jaipur so broken chips stay out of your pouch. Clean, unroasted, and vacuum sealed the morning your order is packed—whether they are going into a school tiffin, soaking overnight, or staying beside your desk.',
    storageTip: 'Keep the sealed pouch in a cool, dry cupboard away from sun. After opening, move to an airtight steel or glass jar.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. All-India delivery in 2–5 business days. Free shipping ₹499+.',
    imageKey: 'californiaAlmonds',
    galleryKeys: ['californiaAlmonds', 'productCloseupAlmonds', 'packagingPouchMockup', 'lifestyleDeskFlatlay'],
    variants: [
      { weight: '250 g', price: 349 },
      { weight: '500 g', price: 649 },
      { weight: '1 kg', price: 1249 },
    ],
  },
  {
    id: 'prod-mamra-almonds',
    slug: 'mamra-almonds',
    name: 'Mamra Almonds',
    origin: 'Heritage Oil-Rich · Packed in Jaipur',
    categorySlug: 'almonds',
    navGroup: 'Nuts',
    needSlugs: ['sugar-free-for-seniors', 'kids-brain-boost', 'fitness-and-protein'],
    isBestSeller: true,
    badge: 'Heritage pick',
    shortCopy: 'Curved, richly aromatic Mamra kernels packed with natural almond oils.',
    description:
      'Small-batch Mamra almonds prized in Indian kitchens for generations. Deeply nutty with an unmistakable crunch and concentrated natural oil content—best soaked overnight or eaten straight by the handful.',
    storageTip: 'Store airtight in a cool pantry or refrigerate in humid monsoon months to preserve natural oils.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'mamraAlmonds',
    galleryKeys: ['mamraAlmonds', 'productCloseupAlmonds', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 799 },
      { weight: '500 g', price: 1549 },
      { weight: '1 kg', price: 2899 },
    ],
  },
  {
    id: 'prod-whole-cashews',
    slug: 'whole-cashews',
    name: 'Whole Cashews',
    origin: 'W240 Ivory Grade · Packed in Jaipur',
    categorySlug: 'cashews',
    navGroup: 'Nuts',
    needSlugs: ['daily-snacking', 'sugar-free-for-seniors', 'festive-gifting'],
    isBestSeller: true,
    badge: 'Best seller',
    shortCopy: 'Creamy, whole W240 cashews with zero splits or dusty crumbs.',
    description:
      'Big, creamy-white whole cashews that hold their gentle sweetness without any frying or glazing. Graded for clean edges and crunch, then vacuum sealed before leaving our Jaipur table.',
    storageTip: 'Cashews absorb kitchen humidity quickly—seal tightly inside an airtight tin after opening.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'wholeCashews',
    galleryKeys: ['wholeCashews', 'packagingPouchMockup', 'lifestyleDeepGreen'],
    variants: [
      { weight: '250 g', price: 449 },
      { weight: '500 g', price: 849 },
      { weight: '1 kg', price: 1649 },
    ],
  },
  {
    id: 'prod-roasted-pistachios',
    slug: 'roasted-pistachios',
    name: 'Roasted Pistachios',
    origin: 'Lightly Salted · Packed in Jaipur',
    categorySlug: 'pistachios',
    navGroup: 'Nuts',
    needSlugs: ['daily-snacking', 'fitness-and-protein', 'festive-gifting'],
    isBestSeller: true,
    badge: 'Crunch favourite',
    shortCopy: 'Slow-roasted in small batches with a light sea-salt kiss.',
    description:
      'Vibrant green kernels inside naturally split shells, slow-roasted for crunch without overpowering salt. Built for 4 pm chai breaks, late-night study sessions, and rooftop hangs.',
    storageTip: 'Keep the resealable pouch zipped tight or decant into a dry jar so the shell roast stays crisp.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'roastedPistachios',
    galleryKeys: ['roastedPistachios', 'lifestyleDeskFlatlay', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 579 },
      { weight: '500 g', price: 1129 },
      { weight: '1 kg', price: 2199 },
    ],
  },
  {
    id: 'prod-medjool-dates',
    slug: 'medjool-dates',
    name: 'Medjool Dates',
    origin: 'Large Jumbo Soft · Packed in Jaipur',
    categorySlug: 'dates',
    navGroup: 'Dates & Figs',
    needSlugs: ['fitness-and-protein', 'festive-gifting', 'daily-snacking'],
    isBestSeller: true,
    badge: 'Caramel soft',
    shortCopy: 'Plump, dark caramel dates—soft enough to stuff with an almond.',
    description:
      'Hand-selected jumbo Medjool dates with rich, brown-sugar depth and zero glucose syrup glazing. Sweet on their own after meals or paired with a walnut half for pre-workout fuel.',
    storageTip: 'Store in a cool cupboard for 3 months, or keep chilled to preserve their soft caramel chew longer.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'medjoolDates',
    galleryKeys: ['medjoolDates', 'lifestyleDeepGreen', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 629 },
      { weight: '500 g', price: 1219 },
      { weight: '1 kg', price: 2399 },
    ],
  },
  {
    id: 'prod-everyday-trail-mix',
    slug: 'everyday-trail-mix',
    name: 'Everyday Trail Mix',
    origin: 'Jaipur Table Blend · No Chocolate',
    categorySlug: 'mixes',
    navGroup: 'Mixes',
    needSlugs: ['daily-snacking', 'fitness-and-protein', 'kids-brain-boost'],
    isBestSeller: true,
    badge: 'Desk staple',
    shortCopy: 'Almonds, cashews, walnuts, pistachios, cranberries & black raisins.',
    description:
      'Our clean everyday mix—no melted chocolate, no fried sev, no dusty peanuts. Just honest roasted and raw nuts balanced with tart cranberries and sweet black raisins for the desk or backpack.',
    storageTip: 'Shake gently before scooping and store in a dry tin away from direct sunlight.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'everydayTrailMix',
    galleryKeys: ['everydayTrailMix', 'lifestyleRooftopShare', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 349 },
      { weight: '500 g', price: 679 },
      { weight: '1 kg', price: 1279 },
    ],
  },
  {
    id: 'prod-walnut-halves',
    slug: 'walnut-halves',
    name: 'Kashmir Walnut Halves',
    origin: 'Light Half Kernels · Packed in Jaipur',
    categorySlug: 'walnuts',
    navGroup: 'Nuts',
    needSlugs: ['kids-brain-boost', 'sugar-free-for-seniors', 'fitness-and-protein'],
    badge: 'Tiffin pick',
    shortCopy: 'Clean golden-ivory halves with zero bitterness and crisp snap.',
    description:
      'Your tiffin called. It wants walnuts. Carefully shelled light halves with mild, buttery flavour and minimal breakage—never stale or rancid.',
    storageTip: 'Walnuts love cool temperatures. Store airtight or refrigerate after opening for peak crunch.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'walnutHalves',
    galleryKeys: ['walnutHalves', 'needKidsTiffin', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 479 },
      { weight: '500 g', price: 919 },
      { weight: '1 kg', price: 1799 },
    ],
  },
  {
    id: 'prod-dried-figs',
    slug: 'dried-figs',
    name: 'Afghan Dried Figs',
    origin: 'Whole Golden Anjeer · Packed in Jaipur',
    categorySlug: 'figs',
    navGroup: 'Dates & Figs',
    needSlugs: ['daily-snacking', 'festive-gifting'],
    shortCopy: 'Soft, honey-textured whole dried figs threaded naturally.',
    description:
      'Sun-cured golden anjeer with delicate seed crunch and warm honeyed sweetness. Ideal for morning soaking or chopping into warm oats and kheer.',
    storageTip: 'Store in a cool, dry jar away from kitchen steam.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'driedFigs',
    galleryKeys: ['driedFigs', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 499 },
      { weight: '500 g', price: 969 },
      { weight: '1 kg', price: 1899 },
    ],
  },
  {
    id: 'prod-dried-apricots',
    slug: 'dried-apricots',
    name: 'Sun-Dried Apricots',
    origin: 'Whole Pitted · Packed in Jaipur',
    categorySlug: 'apricots',
    navGroup: 'Dry Fruits',
    needSlugs: ['daily-snacking', 'kids-brain-boost'],
    shortCopy: 'Tender, tangy-sweet whole dried apricots without artificial gloss.',
    description:
      'Plump, chewy apricots with bright orchard flavour that cut through rich nut mixes cleanly.',
    storageTip: 'Keep sealed in a dry cupboard or chilled jar.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'driedApricots',
    galleryKeys: ['driedApricots', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 379 },
      { weight: '500 g', price: 729 },
      { weight: '1 kg', price: 1419 },
    ],
  },
  {
    id: 'prod-black-raisins',
    slug: 'black-raisins',
    name: 'Seedless Black Raisins',
    origin: 'Sun-Dried · Packed in Jaipur',
    categorySlug: 'raisins',
    navGroup: 'Dry Fruits',
    needSlugs: ['kids-brain-boost', 'daily-snacking'],
    shortCopy: 'Juicy, seedless dark raisins—naturally sweet with zero added sugar.',
    description:
      'Plump black raisins sorted clean of stems. Soak 5–6 overnight or toss straight into your afternoon bowl.',
    storageTip: 'Store in an airtight jar in a cool cupboard.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'blackRaisins',
    galleryKeys: ['blackRaisins', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 249 },
      { weight: '500 g', price: 479 },
      { weight: '1 kg', price: 929 },
    ],
  },
  {
    id: 'prod-seeds-berries',
    slug: 'seeds-and-berries-mix',
    name: 'Seeds & Cranberry Trio',
    origin: 'Roasted Seeds & Tart Berries · Jaipur',
    categorySlug: 'seeds-berries',
    navGroup: 'Dry Fruits',
    needSlugs: ['fitness-and-protein', 'daily-snacking'],
    badge: 'New',
    shortCopy: 'Pumpkin seeds, sunflower kernels, and ruby dried cranberries.',
    description:
      'Lightly toasted green pumpkin seeds and sunflower kernels tossed with whole dried cranberries. Great on yogurt bowls or straight out of the jar.',
    storageTip: 'Store sealed in a dry cupboard.',
    deliveryInfo: 'Jaipur orders before 2 pm dispatch same day. Free shipping ₹499+.',
    imageKey: 'seedsAndBerries',
    galleryKeys: ['seedsAndBerries', 'packagingPouchMockup'],
    variants: [
      { weight: '250 g', price: 329 },
      { weight: '500 g', price: 629 },
      { weight: '1 kg', price: 1199 },
    ],
  },
  {
    id: 'prod-festive-hamper',
    slug: 'jaipur-festive-hamper',
    name: 'Jaipur Royal Festive Hamper',
    origin: '4 Glass Jars · 1 kg Net · Saffron Ribbon',
    categorySlug: 'gift-hampers',
    navGroup: 'Gift Hampers',
    needSlugs: ['festive-gifting'],
    isHamper: true,
    badge: 'Festive Pick',
    shortCopy: 'Four reusable glass jars of California Almonds, W240 Cashews, Roasted Pistachios & Medjool Dates.',
    description:
      'Our flagship Jaipur festive gift box dressed in an ink-green velvet tray and saffron silk ribbon. Includes 250 g each of California Almonds, Whole Cashews, Roasted Pistachios, and Jumbo Medjool Dates with a custom gift note card.',
    storageTip: 'Glass jars keep contents crisp on display; reseal lids tightly after serving.',
    deliveryInfo: 'Packed to order in Jaipur. Custom bulk branding available for 15+ boxes.',
    imageKey: 'festiveGiftHamper',
    galleryKeys: ['festiveGiftHamper', 'needFestiveGifting'],
    variants: [{ weight: 'Gift Box', price: 2199 }],
  },
  {
    id: 'prod-family-hamper',
    slug: 'jaipur-family-hamper',
    name: 'Jaipur Family Tasting Box',
    origin: 'Kraft Sleeve · 1.2 kg Net · Ribbon Tied',
    categorySlug: 'gift-hampers',
    navGroup: 'Gift Hampers',
    needSlugs: ['festive-gifting', 'daily-snacking'],
    isHamper: true,
    badge: 'Family favourite',
    shortCopy: 'Generous 6-part family hamper with almonds, cashews, pistachios, figs, apricots & dates.',
    description:
      'Wrapped in an embossed kraft sleeve and saffron ribbon—built for family visits, housewarmings, and wedding welcome baskets.',
    storageTip: 'Keep box flat in a cool room until gifting; transfer opened pouches into airtight tins.',
    deliveryInfo: 'Dispatches same day in Jaipur before 2 pm. Pan-India courier protected.',
    imageKey: 'jaipurFamilyHamper',
    galleryKeys: ['jaipurFamilyHamper', 'festiveGiftHamper'],
    variants: [{ weight: 'Gift Box', price: 2499 }],
  },
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Anjali M.',
    city: 'Jaipur',
    productName: 'California Almonds',
    rating: 5,
    quote: 'The 250 g pack is the one I keep in the tiffin tin. Crunch stays after a week in a jar.',
  },
  {
    id: 'rev-2',
    author: 'Rohan S.',
    city: 'Bengaluru',
    productName: 'Everyday Trail Mix',
    rating: 5,
    quote: 'Finally a trail mix that is not 40% melted chocolate chips and salt dust. Clean desk fuel.',
  },
  {
    id: 'rev-3',
    author: 'Meera K.',
    city: 'Delhi',
    productName: 'Mamra Almonds',
    rating: 5,
    quote: 'Ordered for my parents—every almond was whole and smelled genuinely fresh when we broke the vacuum seal.',
  },
  {
    id: 'rev-4',
    author: 'Kabir V.',
    city: 'Mumbai',
    productName: 'Roasted Pistachios',
    rating: 5,
    quote: 'Not overly salty, zero closed shells, and arrived in Mumbai in three days flat.',
  },
  {
    id: 'rev-5',
    author: 'Devika R.',
    city: 'Pune',
    productName: 'Medjool Dates',
    rating: 5,
    quote: 'So soft you can split them with your thumb and tuck a walnut inside. Replaced my post-dinner dessert.',
  },
  {
    id: 'rev-6',
    author: 'Siddharth P.',
    city: 'Jaipur',
    productName: 'Jaipur Royal Festive Hamper',
    rating: 5,
    quote: 'Ordered at 11 am in C-Scheme and the box reached my client’s office before evening chai.',
  },
  {
    id: 'rev-7',
    author: 'Nandini G.',
    city: 'Hyderabad',
    productName: 'Whole Cashews',
    rating: 5,
    quote: 'Big ivory W240s with zero broken bits at the bottom of the pouch. Worth switching from supermarket tubs.',
  },
  {
    id: 'rev-8',
    author: 'Arjun T.',
    city: 'Chandigarh',
    productName: 'Custom Gift Box',
    rating: 5,
    quote: 'Built a 1 kg box for my sister’s housewarming—the saffron ribbon and kraft dividers looked sharp right out of the mailer.',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How should I store a pack?',
    answer:
      'Keep the sealed pouch in a cool, dry cupboard, away from the sun. After you open it, move the nuts or fruit into an airtight tin.',
  },
  {
    id: 'faq-2',
    question: 'What is the shelf life?',
    answer:
      'Unopened vacuum-sealed pouches stay crisp for 6 months from the packing date stamped on the back. Once opened, finish nuts within 6 to 8 weeks for peak crunch.',
  },
  {
    id: 'faq-3',
    question: 'How does delivery work?',
    answer:
      'Jaipur orders placed before 2 pm dispatch the same day. Across India, orders pack in 24 hours and arrive in 2 to 5 business days. Shipping is free at ₹499 and above.',
  },
  {
    id: 'faq-4',
    question: 'What if something arrives damaged?',
    answer:
      'Send a quick photo of the seal or box on WhatsApp (+91 80004 12189) within 48 hours of delivery and we replace the pack or refund you—no long forms.',
  },
  {
    id: 'faq-5',
    question: 'Can I place a bulk or corporate order?',
    answer:
      'Yes. We pack custom wedding hampers, Diwali boxes, and office pantry refills in Jaipur for 15 boxes up to 1,000+. Tap Get Quote to share your count and budget.',
  },
];

export const BOX_INGREDIENTS: BoxIngredient[] = [
  {
    id: 'box-cal-almonds',
    name: 'California Almonds',
    nutKind: 'almond',
    origin: 'Crisp Nonpareil',
    price250g: 349,
    price500g: 649,
    imageKey: 'californiaAlmonds',
  },
  {
    id: 'box-cashews',
    name: 'Whole Cashews',
    nutKind: 'cashew',
    origin: 'W240 Ivory',
    price250g: 449,
    price500g: 849,
    imageKey: 'wholeCashews',
  },
  {
    id: 'box-pistachios',
    name: 'Roasted Pistachios',
    nutKind: 'pistachio',
    origin: 'Light Sea Salt',
    price250g: 579,
    price500g: 1129,
    imageKey: 'roastedPistachios',
  },
  {
    id: 'box-walnuts',
    name: 'Walnut Halves',
    nutKind: 'walnut',
    origin: 'Kashmir Light',
    price250g: 479,
    price500g: 919,
    imageKey: 'walnutHalves',
  },
  {
    id: 'box-dates',
    name: 'Medjool Dates',
    nutKind: 'date',
    origin: 'Jumbo Soft',
    price250g: 629,
    price500g: 1219,
    imageKey: 'medjoolDates',
  },
  {
    id: 'box-figs',
    name: 'Dried Figs',
    nutKind: 'fig',
    origin: 'Golden Anjeer',
    price250g: 499,
    price500g: 969,
    imageKey: 'driedFigs',
  },
  {
    id: 'box-apricots',
    name: 'Dried Apricots',
    nutKind: 'apricot',
    origin: 'Orchard Chewy',
    price250g: 379,
    price500g: 729,
    imageKey: 'driedApricots',
  },
  {
    id: 'box-raisins',
    name: 'Black Raisins',
    nutKind: 'raisins',
    origin: 'Seedless Sun-Dried',
    price250g: 249,
    price500g: 479,
    imageKey: 'blackRaisins',
  },
];

export function getImageUrl(key: ImageKey): string {
  return IMAGES[key];
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
