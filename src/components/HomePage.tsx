import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  Check,
} from 'lucide-react';
import {
  CATEGORIES,
  NEEDS,
  PRODUCTS,
  REVIEWS,
  FAQS,
  getImageUrl,
} from '../data/catalog';
import { useStore } from '../context/StoreContext';
import {
  ImageWithFallback,
  MarigoldPetalSvg,
  NutCutout,
  StickerBadge,
} from './NutSvgAssets';
import { ProductCard } from './ProductCard';
import { FindYourCrunchQuiz } from './FindYourCrunchQuiz';
import { BoxBuilderWidget } from './BoxBuilderWidget';

function KineticMarqueeBand({
  text = 'PACKED FRESH IN JAIPUR · VACUUM SEALED · FREE DELIVERY OVER ₹499 · SAME-DAY JAIPUR DISPATCH BEFORE 2 PM · ',
  dark = false,
}: {
  text?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden py-3 border-y select-none ${
        dark
          ? 'bg-ink-deep text-saffron border-saffron/20'
          : 'bg-saffron text-ink border-ink/15'
      }`}
    >
      <div className="animate-marquee">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap pr-6">
          {text.repeat(4)}
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap pr-6" aria-hidden="true">
          {text.repeat(4)}
        </span>
      </div>
    </div>
  );
}

export function HomePage() {
  const { navigate, showToast, prefersReducedMotion } = useStore();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, 35]);

  // Review carousel state
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);

  useEffect(() => {
    if (reviewPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setReviewIdx((prev) => (prev + 1) % REVIEWS.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [reviewPaused, prefersReducedMotion]);

  // FAQ accordion state (first item open by default)
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);

  // Newsletter CTA state
  const [newsEmail, setNewsEmail] = useState('');
  const [newsJoined, setNewsJoined] = useState(false);

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('nutstrid_newsletter_emails') || '[]');
      if (!saved.includes(newsEmail.trim().toLowerCase())) {
        saved.push(newsEmail.trim().toLowerCase());
        localStorage.setItem('nutstrid_newsletter_emails', JSON.stringify(saved));
      }
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail }),
      });
    } catch {
      // stays stored in browser localStorage
    }
    setNewsJoined(true);
    setNewsEmail('');
    showToast('Added to the NutStrid Jaipur list.');
  };

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <main>
      {/* 5.1 HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-96px)] bg-ink text-oat paper-grain overflow-hidden flex items-center"
      >
        {/* Background gradient & jharokha arch hero artwork on right/bottom */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 bottom-0 top-6 w-full lg:w-[58%] flex justify-end items-end px-4 sm:px-8 lg:pr-12">
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 1.07, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[680px] h-[72vh] sm:h-[82vh] jharokha-mask overflow-hidden shadow-2xl border border-saffron/20"
            >
              <img
                src={getImageUrl('heroBrassBowls')}
                alt="Brass bowls overflowing with almonds, cashews, pistachios, walnuts, raisins, Medjool dates and apricots on ink-green velvet"
                className="w-full h-full object-cover object-right-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent lg:via-ink/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
            </motion.div>
          </div>
          {/* Left-side readability scrim */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-r from-ink via-ink/90 to-transparent" />
        </div>

        {/* Twinkling gold & saffron sparkle particles */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
            {[
              { top: '18%', left: '46%', delay: 0 },
              { top: '34%', left: '84%', delay: 1.1 },
              { top: '68%', left: '54%', delay: 2.2 },
              { top: '24%', left: '66%', delay: 1.6 },
              { top: '76%', left: '90%', delay: 0.6 },
            ].map((sp, i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 3.4, repeat: Infinity, delay: sp.delay }}
                style={{ top: sp.top, left: sp.left }}
                className="absolute w-1.5 h-1.5 rounded-full bg-saffron shadow-[0_0_12px_#F2A93B]"
              />
            ))}
          </div>
        )}

        {/* Drifting parallax nut cutouts (desktop) */}
        {!prefersReducedMotion && (
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10" aria-hidden="true">
            <motion.div
              style={{ y: parallaxY1, rotate: parallaxRotate }}
              className="absolute top-20 right-[43%]"
            >
              <NutCutout kind="almond" className="w-12 h-12 drop-shadow-xl opacity-90" />
            </motion.div>
            <motion.div
              style={{ y: parallaxY2, rotate: -18 }}
              className="absolute bottom-28 right-[45%]"
            >
              <NutCutout kind="pistachio" className="w-11 h-11 drop-shadow-xl opacity-90" />
            </motion.div>
            <motion.div
              style={{ y: parallaxY1, rotate: 22 }}
              className="absolute top-36 right-10"
            >
              <NutCutout kind="cashew" className="w-11 h-11 drop-shadow-xl opacity-85" />
            </motion.div>
          </div>
        )}

        {/* Main Content Container */}
        <div className="relative z-20 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-xl lg:max-w-2xl space-y-6">
            {/* a) Saffron mono eyebrow */}
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-saffron">
              <span>JAIPUR</span>
              <span className="h-[1px] w-10 bg-saffron/60" aria-hidden="true" />
              <span>FSSAI CERTIFIED</span>
            </div>

            {/* b) Huge serif headline with mask reveal */}
            <h1 className="font-serif text-[clamp(3.25rem,8vw,6.25rem)] leading-[0.94] tracking-tight text-balance">
              <span className="block overflow-hidden">
                <motion.span
                  initial={prefersReducedMotion ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-oat"
                >
                  Crunch
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  initial={prefersReducedMotion ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.72, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="block italic saffron-shimmer"
                >
                  Different.
                </motion.span>
              </span>
            </h1>

            {/* c) Subline */}
            <p className="text-base sm:text-lg text-oat/85 leading-relaxed max-w-lg">
              Premium dry fruits, packed fresh in Jaipur. Sold by weight, sealed the day your order is packed, and sent across India.
            </p>

            {/* d) CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="btn-shine w-full sm:w-auto px-8 py-4 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2.5 hover:bg-saffron/90 active:scale-95 transition-all group cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/hampers')}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-oat/40 text-oat hover:border-saffron hover:text-saffron font-mono text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                GIFT HAMPERS
              </button>
            </div>

            {/* e) Rotated Sticker Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <StickerBadge label="Packed on order" tone="saffron" rotate="-rotate-2" />
              <StickerBadge label="Vacuum sealed" tone="pistachio" rotate="rotate-1" />
              <StickerBadge label="Free over ₹499" tone="rose" rotate="-rotate-1" />
            </div>
          </div>

          {/* Two smaller floating mini images */}
          <div className="mt-10 lg:mt-0 lg:absolute lg:right-12 lg:bottom-12 flex items-center gap-3 sm:gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/product/medjool-dates')}
              className="group animate-float-bob w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-saffron/40 shadow-2xl bg-ink-deep cursor-pointer text-left"
              title="Medjool Dates"
            >
              <img
                src={getImageUrl('medjoolDates')}
                alt="Medjool dates in a hammered brass bowl"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <button
              type="button"
              onClick={() => navigate('/hampers')}
              className="group animate-float-bob w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-oat/30 shadow-2xl bg-ink-deep cursor-pointer text-left"
              style={{ animationDelay: '1.2s' }}
              title="Festive Gift Hampers"
            >
              <img
                src={getImageUrl('festiveGiftHamper')}
                alt="Jaipur gift box tied with saffron ribbon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Scroll Cue */}
        <a
          href="#trust-strip"
          aria-label="Scroll down to explore"
          className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex-col items-center text-oat/65 hover:text-saffron transition-colors"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] mb-1">Scroll</span>
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </a>
      </section>

      {/* Kinetic Marquee */}
      <KineticMarqueeBand />

      {/* 5.2 TRUST STRIP */}
      <section id="trust-strip" className="bg-oat border-b border-ink/10 py-10 sm:py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              title: 'FSSAI Certified',
              sub: 'Clean grading & batch hygiene in Jaipur',
              iconPath: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5l-8-3z M9 12l2 2l4-4',
            },
            {
              title: 'Vacuum Sealed',
              sub: 'Pouches sealed before they leave Jaipur',
              iconPath: 'M5 7h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z M8 7V5a4 4 0 0 1 8 0v2 M9 13h6',
            },
            {
              title: 'Packed Fresh',
              sub: 'Packed when you order, not months on a shelf',
              iconPath: 'M12 3v18 M5 8l7-5l7 5 M5 16l7 5l7-5',
            },
            {
              title: 'Free Delivery',
              sub: 'On all orders ₹499 and above across India',
              iconPath: 'M3 7h11v10H3z M14 10h4l3 3v4h-7v-7z M7 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4z M17 19a2 2 0 1 0 0-4a2 2 0 0 0 0 4z',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="flex items-start gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-card border border-ink/10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-almond" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d={item.iconPath}
                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: idx * 0.1 }}
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink leading-snug">{item.title}</h3>
                <p className="text-xs text-ink/70 mt-0.5 leading-relaxed">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5.3 SHOP BY CATEGORY */}
      <section className="py-16 sm:py-22 bg-oat overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
              11 Categories
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Shop by <span className="italic text-almond">category</span>
            </h2>
            <p className="text-sm sm:text-base text-ink/75 mt-2">
              Scroll across the range. Every pack is sold by weight.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="self-start sm:self-auto font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink hover:text-almond inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View all packs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Infinite Pause-on-Hover Marquee of Jharokha-Arched Cards */}
        <div className="pause-on-hover overflow-hidden py-2">
          <div className="animate-marquee-slow flex gap-5 px-4">
            {[...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
              <button
                key={`${cat.slug}-${idx}`}
                type="button"
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="group w-44 sm:w-52 shrink-0 text-left transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-1 cursor-pointer"
              >
                <div className="aspect-[3/4] w-full jharokha-mask overflow-hidden bg-oat-muted border border-ink/10 shadow-xs mb-3 relative">
                  <ImageWithFallback
                    src={getImageUrl(cat.imageKey)}
                    alt={`${cat.name} — NutStrid Jaipur`}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-ink group-hover:text-almond transition-colors leading-snug text-center">
                  {cat.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5.4 SHOP BY NEED */}
      <section id="shop-by-need" className="py-16 sm:py-22 bg-oat-muted/45 border-y border-ink/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
              Shop by Occasion
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Shop by <span className="italic text-almond">need</span>
            </h2>
            <p className="text-sm sm:text-base text-ink/75 mt-2">
              Start from the occasion. The packs are the same honest dry fruit.
            </p>
          </div>

          <div className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar pb-3 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {NEEDS.map((need, idx) => (
              <motion.button
                key={need.slug}
                type="button"
                onClick={() => navigate(`/need/${need.slug}`)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="group relative w-[74vw] sm:w-[44vw] lg:w-auto shrink-0 snap-start aspect-[3/4] rounded-[26px] overflow-hidden text-left cursor-pointer shadow-sm"
              >
                <ImageWithFallback
                  src={getImageUrl(need.imageKey)}
                  alt={`${need.title} — ${need.description}`}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-oat">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-saffron block mb-1">
                    {need.shortTag}
                  </span>
                  <h3 className="font-serif text-2xl leading-tight text-oat">{need.title}</h3>
                  <p className="text-xs text-oat/80 mt-1.5 leading-relaxed line-clamp-3">
                    {need.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-saffron mt-3 transition-transform duration-300 group-hover:translate-x-1.5">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 BEST SELLERS */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
              Kitchen Staples
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Best <span className="italic text-almond">sellers</span>
            </h2>
            <p className="text-sm sm:text-base text-ink/75 mt-2">
              Pick a weight on the card and add it. The cart keeps each pack separate.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="self-start md:self-auto px-6 py-3 rounded-full border border-ink/20 hover:border-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Shop All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5.6 FIND YOUR CRUNCH QUIZ */}
      <FindYourCrunchQuiz />

      {/* 5.7 GIFT HAMPERS BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto pb-16 sm:pb-24">
        <div className="relative rounded-[32px] bg-ink text-oat paper-grain border border-saffron/45 overflow-hidden p-7 sm:p-12 lg:p-14 shadow-xl">
          {/* Soft diya ambient radial glow */}
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(242,169,59,0.28) 0%, rgba(242,169,59,0) 70%)',
            }}
            aria-hidden="true"
          />

          {/* Floating marigold petals */}
          {!prefersReducedMotion && (
            <div className="hidden sm:block absolute inset-0 pointer-events-none" aria-hidden="true">
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [12, 24, 12] }}
                transition={{ duration: 5.5, repeat: Infinity }}
                className="absolute top-6 right-[38%] opacity-75"
              >
                <MarigoldPetalSvg className="w-6 h-6" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [-15, 0, -15] }}
                transition={{ duration: 4.8, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 right-[42%] opacity-65"
              >
                <MarigoldPetalSvg className="w-5 h-5" />
              </motion.div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron block">
                Festive &amp; Corporate Jaipur Boxes
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-oat leading-[1.06] text-balance">
                Gift hampers for Diwali, weddings, and the <span className="italic text-saffron">office.</span>
              </h2>
              <p className="text-sm sm:text-base text-oat/80 leading-relaxed max-w-xl">
                Family boxes and festive boxes, packed in Jaipur. For a wedding lot or a corporate list, ask for a quote before you order.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/hampers')}
                  className="btn-shine px-7 py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>See Hampers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/918000412189?text=Hello%20NutStrid%2C%20I%20would%20like%20a%20quote%20for%20gift%20hampers."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full border border-oat/35 text-oat hover:border-saffron hover:text-saffron font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center transition-colors"
                >
                  Get Quote
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden border border-saffron/30 shadow-2xl">
                <ImageWithFallback
                  src={getImageUrl('festiveGiftHamper')}
                  alt="Festive Jaipur dry fruit gift hamper with saffron ribbon and diya"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.8 WHY NUTSTRID */}
      <section className="py-16 sm:py-22 bg-oat-muted/45 border-y border-ink/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
              How We Pack
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Why <span className="italic text-almond">NutStrid</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: '01',
                title: 'Sourced carefully',
                body: 'We buy named varieties, then sort them in Jaipur before they are packed.',
                accent: 'bg-card',
              },
              {
                num: '02',
                title: 'Packed on order',
                body: 'Your weight is packed for the order, not pulled from a pile that has been sitting open.',
                accent: 'bg-card',
              },
              {
                num: '03',
                title: 'Vacuum sealed',
                body: 'Pouches are sealed so the crunch and the aroma stay in until you open them.',
                accent: 'bg-card',
              },
              {
                num: '04',
                title: 'Delivered fast',
                body: 'Jaipur orders placed before 2 pm go out the same day.',
                accent: 'bg-ink text-oat',
              },
            ].map((card, idx) => {
              const isDark = idx === 3;
              return (
                <motion.div
                  key={card.num}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className={`rounded-[28px] p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-1.5 ${
                    isDark
                      ? 'bg-ink text-oat border-saffron/30'
                      : 'bg-card text-ink border-ink/10 hover:border-saffron'
                  }`}
                >
                  <span
                    className={`font-serif italic text-5xl block mb-8 tabular-nums ${
                      isDark ? 'text-saffron' : 'text-saffron-deep'
                    }`}
                  >
                    {card.num}
                  </span>
                  <h3 className="font-serif text-2xl leading-snug mb-2">{card.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-oat/80' : 'text-ink/70'}`}>
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.9 BUILD YOUR OWN BOX */}
      <BoxBuilderWidget />

      {/* Kinetic Marquee Band 2 */}
      <KineticMarqueeBand
        text="ALMONDS · CASHEWS · PISTACHIOS · WALNUT HALVES · MEDJOOL DATES · ANJEER · TRAIL MIX · PACKED IN JAIPUR · "
        dark
      />

      {/* 5.10 CUSTOMER REVIEWS */}
      <section className="py-16 sm:py-24 bg-oat">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
                Notes From Kitchens
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
                Customer <span className="italic text-almond">reviews</span>
              </h2>
            </div>
            <span className="font-mono text-xs tabular-nums text-almond">
              {reviewIdx + 1} of {REVIEWS.length}
            </span>
          </div>

          <div
            onMouseEnter={() => setReviewPaused(true)}
            onMouseLeave={() => setReviewPaused(false)}
            className="bg-card rounded-[32px] border border-ink/10 p-7 sm:p-12 shadow-sm relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={REVIEWS[reviewIdx].id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -50) {
                    setReviewIdx((prev) => (prev + 1) % REVIEWS.length);
                  } else if (info.offset.x > 50) {
                    setReviewIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
                  }
                }}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-1 text-saffron mb-6" aria-label="5 out of 5 stars">
                  {Array.from({ length: REVIEWS[reviewIdx].rating }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-saffron text-saffron" />
                  ))}
                </div>

                <blockquote className="font-serif text-2xl sm:text-4xl text-ink leading-[1.22] text-balance">
                  “{REVIEWS[reviewIdx].quote}”
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-ink/10">
                  <div>
                    <p className="font-semibold text-ink">
                      {REVIEWS[reviewIdx].author} · <span className="text-almond">{REVIEWS[reviewIdx].city}</span>
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60 mt-0.5">
                      {REVIEWS[reviewIdx].productName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setReviewIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
                      }
                      aria-label="Previous review"
                      className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-oat transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewIdx((prev) => (prev + 1) % REVIEWS.length)}
                      aria-label="Next review"
                      className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-oat transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {REVIEWS.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReviewIdx(i)}
                  aria-label={`Show review ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === reviewIdx ? 'w-7 bg-saffron' : 'w-2 bg-ink/20 hover:bg-ink/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-ink/55 mt-4">
            Note: Seeded sample reviews displayed until a live verified-buyer review feed is connected.
          </p>
        </div>
      </section>

      {/* 5.11 TAG US WALL */}
      <section className="py-16 sm:py-22 bg-oat-muted/45 border-y border-ink/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
                Sample Community Wall
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
                Tag <span className="italic text-almond">@nutstrid</span>
              </h2>
            </div>
            <StickerBadge label="Sample gallery" tone="rose" rotate="rotate-1" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-[24px] overflow-hidden border border-ink/10">
                <ImageWithFallback
                  src={getImageUrl('lifestyleDeepGreen')}
                  alt="Hand reaching into bowl of almonds, pistachios and dates"
                  className="w-full h-full"
                />
              </div>
              <p className="font-mono text-[11px] text-ink/70 px-1">@jaipur.table · Desk jar refill</p>
            </div>
            <div className="space-y-4 sm:pt-8">
              <div className="aspect-square rounded-[24px] overflow-hidden border border-ink/10">
                <ImageWithFallback
                  src={getImageUrl('lifestyleDeskFlatlay')}
                  alt="Smartphone, earbuds, iced matcha and pistachios flatlay"
                  className="w-full h-full"
                />
              </div>
              <p className="font-mono text-[11px] text-ink/70 px-1">@cscheme.club · 4 pm crunch</p>
            </div>
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-[24px] overflow-hidden border border-ink/10">
                <ImageWithFallback
                  src={getImageUrl('lifestyleRooftopShare')}
                  alt="Friends sharing NutStrid trail mix on a Jaipur rooftop at sunset"
                  className="w-full h-full"
                />
              </div>
              <p className="font-mono text-[11px] text-ink/70 px-1">@oldcity.sunset · Rooftop pouch</p>
            </div>
            <div className="space-y-4 sm:pt-8">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden border border-ink/10">
                <ImageWithFallback
                  src={getImageUrl('jaipurFamilyHamper')}
                  alt="Jaipur family hamper with kraft sleeve and saffron ribbon"
                  className="w-full h-full"
                />
              </div>
              <p className="font-mono text-[11px] text-ink/70 px-1">@malviyanagar.home · Sunday box</p>
            </div>
          </div>

          <p className="font-mono text-[11px] text-ink/55 mt-6">
            Sample lifestyle gallery shown as preview content until live social posts are connected.
          </p>
        </div>
      </section>

      {/* 5.12 OUR JAIPUR STORY */}
      <section className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 relative flex justify-center">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[520px] aspect-[4/5] jharokha-mask overflow-hidden border border-ink/15 shadow-lg"
            >
              <ImageWithFallback
                src={getImageUrl('jaipurPackingTable')}
                alt="Hands scooping fresh almonds into a kraft pouch on a Jaipur packing table"
                className="w-full h-full"
              />
            </motion.div>

            {/* Rotating Circular Badge */}
            <div
              className="absolute -bottom-4 right-4 sm:right-10 w-28 h-28 rounded-full bg-ink text-saffron border-2 border-saffron flex items-center justify-center shadow-xl"
              aria-hidden="true"
            >
              <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow p-1">
                <defs>
                  <path
                    id="jaipurCirclePath"
                    d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                  />
                </defs>
                <text fill="#F2A93B" fontSize="11.5" fontWeight="700" letterSpacing="2.4" className="font-mono uppercase">
                  <textPath href="#jaipurCirclePath">
                    PACKED IN JAIPUR · VACUUM SEALED ·
                  </textPath>
                </text>
              </svg>
              <span className="absolute font-serif italic text-xl text-oat">JPR</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block">
              From Our Table to Yours
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-[1.06]">
              Our Jaipur <span className="italic text-almond">story</span>
            </h2>
            <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
              NutStrid packs premium dry fruits in Jaipur for families, offices, and gift boxes across India. Orders are packed in Jaipur, Rajasthan. Jaipur orders placed before 2 pm go out the same day. The rest of India leaves from the same table.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-card border border-ink/10">
                <span className="font-mono text-2xl font-bold text-ink tabular-nums">2 PM</span>
                <p className="text-xs text-ink/70 mt-1">Same-day Jaipur dispatch cutoff</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-ink/10">
                <span className="font-mono text-2xl font-bold text-ink tabular-nums">302001</span>
                <p className="text-xs text-ink/70 mt-1">Packed daily in Jaipur, Rajasthan</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="btn-shine px-7 py-3.5 rounded-full bg-ink text-oat font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 hover:bg-saffron hover:text-ink transition-colors cursor-pointer"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5.13 FAQ */}
      <section className="py-16 sm:py-22 bg-oat-muted/45 border-t border-ink/8">
        <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
              Honest Answers
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Questions, <span className="italic text-almond">answered</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-card rounded-[24px] border border-ink/10 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="font-serif text-xl sm:text-2xl text-ink leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className={`w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 bg-saffron text-ink border-saffron' : 'text-ink'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-sm sm:text-base text-ink/75 leading-relaxed border-t border-ink/8 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5.14 NEWSLETTER CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto">
        <div className="rounded-[32px] bg-ink text-oat paper-grain p-8 sm:p-14 text-center border border-saffron/25">
          <div className="max-w-xl mx-auto space-y-5 relative z-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron block">
              Fresh Batch Alerts
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-oat leading-tight">
              Keep a pouch in the <span className="italic text-saffron">kitchen.</span>
            </h2>
            <p className="text-sm sm:text-base text-oat/80">
              Start with one pack, or send a hamper.
            </p>

            <form
              onSubmit={handleNewsSubmit}
              className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-md mx-auto"
            >
              <input
                type="email"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="you@domain.com"
                aria-label="Email address"
                className="flex-1 px-5 py-3.5 rounded-full bg-oat/10 border border-oat/25 text-oat placeholder:text-oat/45 text-sm focus:outline-none focus:border-saffron"
              />
              <button
                type="submit"
                className="btn-shine px-7 py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                {newsJoined ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Joined</span>
                  </>
                ) : (
                  <span>Join</span>
                )}
              </button>
            </form>

            <div className="pt-1 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-6 py-2.5 rounded-full border border-oat/30 text-oat hover:border-saffron hover:text-saffron font-mono text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="font-mono text-[11px] text-oat/55">
                The list stays on this browser until mail is connected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
