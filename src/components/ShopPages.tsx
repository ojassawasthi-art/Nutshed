import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Search,
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
  Package,
  Star,
  MessageCircle,
} from 'lucide-react';
import {
  CATEGORIES,
  NEEDS,
  PRODUCTS,
  REVIEWS,
  getImageUrl,
  formatINR,
} from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { BoxBuilderWidget } from './BoxBuilderWidget';
import { ImageWithFallback, StickerBadge } from './NutSvgAssets';
import { ConfettiMicroBurst } from './CursorEffects';

export function ShopPage({
  initialCategorySlug,
  initialNeedSlug,
}: {
  initialCategorySlug?: string;
  initialNeedSlug?: string;
}) {
  const { navigate, searchQuery, setSearchQuery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [selectedNeed, setSelectedNeed] = useState<string>(initialNeedSlug || 'all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    setSelectedCategory(initialCategorySlug || 'all');
    setSelectedNeed(initialNeedSlug || 'all');
    const params = new URLSearchParams(window.location.search);
    const groupParam = params.get('group');
    if (groupParam) {
      setSelectedGroup(groupParam);
    } else if (!initialCategorySlug && !initialNeedSlug) {
      setSelectedGroup('all');
    }
  }, [initialCategorySlug, initialNeedSlug]);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const activeNeedObj = NEEDS.find((n) => n.slug === selectedNeed);

  const filtered = PRODUCTS.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
    if (selectedNeed !== 'all' && !p.needSlugs.includes(selectedNeed)) return false;
    if (selectedGroup !== 'all' && p.navGroup !== selectedGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hay = `${p.name} ${p.origin} ${p.shortCopy} ${p.categorySlug}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.variants[0].price - b.variants[0].price;
    if (sortBy === 'price-desc') return b.variants[0].price - a.variants[0].price;
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const headingTitle = activeCategoryObj
    ? activeCategoryObj.name
    : activeNeedObj
      ? activeNeedObj.title
      : selectedGroup !== 'all'
        ? selectedGroup
        : 'All Dry Fruits & Packs';

  const headingSub = activeCategoryObj
    ? activeCategoryObj.tagline
    : activeNeedObj
      ? activeNeedObj.description
      : 'Every pack is weighed and vacuum sealed to order in Jaipur.';

  return (
    <main className="py-10 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      {/* Page Header + Build Your Own Box Shortcut Chip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-ink/10">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond">
              NutStrid Storefront
            </span>
            <button
              type="button"
              onClick={() => navigate('/build-box')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron text-ink font-mono text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-saffron-deep transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build your own box</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-ink leading-tight">
            {headingTitle}
          </h1>
          <p className="text-sm sm:text-base text-ink/75 mt-2 max-w-xl">{headingSub}</p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-ink/45 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search almonds, dates..."
              aria-label="Filter products"
              className="w-full sm:w-60 pl-10 pr-4 py-2.5 rounded-full bg-card border border-ink/15 text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:border-ink"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
            aria-label="Sort products"
            className="px-4 py-2.5 rounded-full bg-card border border-ink/15 text-xs font-mono uppercase tracking-wider text-ink focus:outline-none focus:border-ink cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category & Need Filters */}
      <div className="py-6 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedGroup('all');
            }}
            className={`px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.12em] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all' && selectedGroup === 'all'
                ? 'bg-ink text-oat'
                : 'bg-card border border-ink/15 text-ink hover:border-ink'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                setSelectedGroup('all');
              }}
              className={`px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.12em] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-saffron text-ink font-bold'
                  : 'bg-card border border-ink/15 text-ink hover:border-saffron'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-almond shrink-0 mr-1">
            By Need:
          </span>
          <button
            type="button"
            onClick={() => setSelectedNeed('all')}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] whitespace-nowrap shrink-0 cursor-pointer ${
              selectedNeed === 'all'
                ? 'bg-pistachio text-ink font-bold'
                : 'bg-oat-muted/60 text-ink/75 hover:text-ink'
            }`}
          >
            Any
          </button>
          {NEEDS.map((need) => (
            <button
              key={need.slug}
              type="button"
              onClick={() => setSelectedNeed(need.slug)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] whitespace-nowrap shrink-0 cursor-pointer ${
                selectedNeed === need.slug
                  ? 'bg-pistachio text-ink font-bold'
                  : 'bg-oat-muted/60 text-ink/75 hover:text-ink'
              }`}
            >
              {need.title}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="my-12 p-10 rounded-[28px] bg-card border border-ink/10 text-center max-w-lg mx-auto">
          <h2 className="font-serif text-3xl text-ink mb-2">No packs matched that filter.</h2>
          <p className="text-sm text-ink/70 mb-6">
            Clear your search or filters to see all freshly packed dry fruits.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedNeed('all');
              setSelectedGroup('all');
              setSearchQuery('');
            }}
            className="px-6 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

export function ProductDetailPage({ slug }: { slug: string }) {
  const { addToCart, navigate } = useStore();
  const product = PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedVariantIdx(0);
    setQty(1);
    setAdded(false);
  }, [slug]);

  const variant = product.variants[selectedVariantIdx] ?? product.variants[0];
  const gallery = product.galleryKeys.map((k) => getImageUrl(k));
  const mainImage = gallery[activeImageIdx] ?? gallery[0];

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isBestSeller)
  ).slice(0, 3);

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        weight: variant.weight,
        price: variant.price,
        quantity: qty,
        image: getImageUrl(product.imageKey),
      },
      galleryRef.current
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const whatsappText = encodeURIComponent(
    `Hello NutStrid, I would like to order ${qty}x ${product.name} (${variant.weight} - ${formatINR(variant.price)}).`
  );

  return (
    <main className="py-10 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60 mb-8" aria-label="Breadcrumb">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="hover:text-ink"
        >
          Home
        </a>
        <span>/</span>
        <a
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            navigate('/shop');
          }}
          className="hover:text-ink"
        >
          Shop
        </a>
        <span>/</span>
        <span className="text-ink truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Sticky Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div
            ref={galleryRef}
            className="aspect-square rounded-[32px] overflow-hidden bg-card border border-ink/10 shadow-sm relative"
          >
            <ImageWithFallback
              src={mainImage}
              alt={`${product.name} view ${activeImageIdx + 1}`}
              className="w-full h-full"
              eager
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <StickerBadge label={product.badge} tone="saffron" rotate="-rotate-2" />
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    i === activeImageIdx ? 'border-saffron scale-[0.98]' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-almond">
              {product.origin}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink mt-2 leading-tight">
              {product.name}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold tabular-nums text-ink">
                {formatINR(variant.price)}
              </span>
              <span className="font-mono text-xs text-ink/60">
                / {variant.weight} · Inclusive of taxes
              </span>
            </div>
          </div>

          <p className="text-base text-ink/80 leading-relaxed">{product.description}</p>

          {/* Weight Selector */}
          <div className="space-y-2.5 pt-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-almond block">
              Select Pack Weight
            </span>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v, idx) => {
                const active = idx === selectedVariantIdx;
                return (
                  <button
                    key={v.weight}
                    type="button"
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`relative px-5 py-3 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                      active
                        ? 'bg-saffron text-ink border-saffron shadow-sm'
                        : 'bg-card text-ink border-ink/15 hover:border-ink'
                    }`}
                  >
                    <span>{v.weight}</span>
                    <span className="ml-2 opacity-75 tabular-nums">{formatINR(v.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="inline-flex items-center justify-between px-4 py-2 rounded-full bg-card border border-ink/15 sm:w-36">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 font-mono text-lg cursor-pointer"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-mono text-sm font-bold tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 font-mono text-lg cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`relative flex-1 py-4 px-8 rounded-full font-mono text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                added
                  ? 'bg-pistachio text-ink'
                  : 'btn-shine bg-ink text-oat hover:bg-saffron hover:text-ink'
              }`}
            >
              <ConfettiMicroBurst active={added} />
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added {variant.weight} to Bag</span>
                </>
              ) : (
                <>
                  <span>Add {variant.weight} — {formatINR(variant.price * qty)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <a
            href={`https://wa.me/918000412189?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full border border-ink/20 hover:border-ink text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-almond" />
            <span>Order via WhatsApp</span>
          </a>

          {/* Storage & Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ink/10">
            <div className="p-4 rounded-2xl bg-card border border-ink/10">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-almond mb-1.5">
                <Package className="w-4 h-4" />
                <span>Storage Tip</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">{product.storageTip}</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-ink/10">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-almond mb-1.5">
                <Truck className="w-4 h-4" />
                <span>Jaipur Dispatch</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">{product.deliveryInfo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-ink/70 pt-1">
            <ShieldCheck className="w-4 h-4 text-almond shrink-0" />
            <span>FSSAI Certified · Vacuum sealed the morning your order is packed.</span>
          </div>
        </div>
      </div>

      {/* Product Reviews Snippet */}
      <section className="mt-16 pt-12 border-t border-ink/10">
        <h2 className="font-serif text-3xl text-ink mb-6">Notes from kitchens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.slice(0, 3).map((r) => (
            <div key={r.id} className="p-6 rounded-[24px] bg-card border border-ink/10">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-saffron text-saffron" />
                ))}
              </div>
              <p className="font-serif text-lg text-ink leading-snug mb-4">“{r.quote}”</p>
              <p className="font-mono text-[11px] text-almond">
                {r.author} · {r.city}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section className="mt-16 pt-12 border-t border-ink/10">
        <h2 className="font-serif text-3xl text-ink mb-6">Pair with your pack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function HampersPage() {
  const { navigate, showToast } = useStore();
  const hampers = PRODUCTS.filter((p) => p.isHamper);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('Diwali / Festive');
  const [quantity, setQuantity] = useState('25–50 boxes');
  const [notes, setNotes] = useState('');
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, occasion, quantity, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Could not submit quote.');
      } else {
        setQuoteId(data.quote.id);
        setName('');
        setPhone('');
        setNotes('');
        showToast('Quote request received. We reply from Jaipur shortly.');
      }
    } catch {
      showToast('Network error submitting quote.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-12 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Banner */}
      <section className="rounded-[32px] bg-ink text-oat paper-grain p-8 sm:p-14 border border-saffron/30">
        <div className="max-w-2xl space-y-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron block">
            Jaipur Gift Hampers
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-oat leading-[1.04]">
            Festive boxes, wedding welcome trays &amp; <span className="italic text-saffron">office gifting.</span>
          </h1>
          <p className="text-sm sm:text-base text-oat/80 leading-relaxed">
            Packed in Jaipur with ribbon-tied sleeves, reusable glass jars, and zero filler candy. Order a ready hamper or build your own 4-compartment box.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/build-box')}
              className="btn-shine px-7 py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Build Custom Box</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/918000412189?text=Hello%20NutStrid%2C%20I%20would%20like%20a%20quote%20for%20gift%20hampers."
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full border border-oat/35 text-oat hover:border-saffron hover:text-saffron font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2"
            >
              WhatsApp for Bulk Quote
            </a>
          </div>
        </div>
      </section>

      {/* Ready Hampers Grid */}
      <section>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-6">Ready-to-send hampers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hampers.map((h) => (
            <ProductCard key={h.id} product={h} />
          ))}
        </div>
      </section>

      {/* Bulk & Corporate Quote Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-card rounded-[32px] p-6 sm:p-10 border border-ink/10">
        <div className="lg:col-span-5 space-y-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block">
            15 to 1,000+ Boxes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
            Request a wedding or corporate quote
          </h2>
          <p className="text-sm text-ink/75 leading-relaxed">
            Tell us your approximate box count, delivery city, and preferred nuts. Our Jaipur packing team will send a per-box breakdown with custom card or sleeve options.
          </p>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-ink/10">
            <ImageWithFallback
              src={getImageUrl('jaipurFamilyHamper')}
              alt="Jaipur family dry fruit gift hamper"
              className="w-full h-full"
            />
          </div>
        </div>

        <form onSubmit={handleQuoteSubmit} className="lg:col-span-7 space-y-4">
          {quoteId && (
            <div className="p-4 rounded-2xl bg-pistachio/35 border border-ink/15 text-sm text-ink">
              Quote reference <strong>{quoteId}</strong> saved. Our Jaipur desk will call or WhatsApp you within a few hours.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98290 12345"
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
              >
                <option>Diwali / Festive</option>
                <option>Wedding / Family Visit</option>
                <option>Corporate / Office Gifting</option>
                <option>Other Event</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                Estimated Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
              >
                <option>15–25 boxes</option>
                <option>25–50 boxes</option>
                <option>50–150 boxes</option>
                <option>150+ boxes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
              Notes / Budget per box
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Target ₹1,200/box, delivering to Jaipur & Gurgaon..."
              className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-shine px-8 py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{submitting ? 'Sending...' : 'Request Quote'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>
    </main>
  );
}

export function BuildBoxPage() {
  return (
    <main className="py-12 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
          Jaipur Gift Studio
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-ink leading-tight">
          Build your own <span className="italic text-almond">box</span>
        </h1>
        <p className="text-sm sm:text-base text-ink/75 mt-2">
          Pick four compartments, toggle 250 g or 500 g packs, add a personal gift note, and we will ribbon-tie it in Jaipur.
        </p>
      </div>

      <BoxBuilderWidget standalone />
    </main>
  );
}
