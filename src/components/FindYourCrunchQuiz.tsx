import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw, Check } from 'lucide-react';
import { PRODUCTS, getImageUrl, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { ImageWithFallback, StickerBadge } from './NutSvgAssets';
import { ConfettiMicroBurst } from './CursorEffects';

type Occasion = 'desk' | 'gym' | 'tiffin' | 'festive';
type Texture = 'crunchy' | 'chewy';
type Style = 'plain' | 'mixed';

interface Answers {
  occasion?: Occasion;
  texture?: Texture;
  style?: Style;
}

function pickRecommendation(a: Answers) {
  if (a.occasion === 'festive') {
    return {
      slug: 'jaipur-festive-hamper',
      quip: 'Main character gifting energy. Four glass jars, zero filler.',
    };
  }
  if (a.texture === 'chewy') {
    if (a.occasion === 'gym') {
      return {
        slug: 'medjool-dates',
        quip: 'Nature’s caramel pre-workout. Split one open, tuck an almond inside.',
      };
    }
    return {
      slug: 'dried-figs',
      quip: 'Soft, honey-rich golden anjeer for slow mornings and warm chai.',
    };
  }
  if (a.style === 'mixed') {
    return {
      slug: 'everyday-trail-mix',
      quip: 'Clean desk fuel. Zero melted chocolate, zero sev, 100% crunch.',
    };
  }
  if (a.occasion === 'tiffin') {
    return {
      slug: 'california-almonds',
      quip: 'Your tiffin called. It wants crisp Nonpareil almonds every morning.',
    };
  }
  if (a.occasion === 'gym') {
    return {
      slug: 'mamra-almonds',
      quip: 'Small-batch, oil-rich Mamra. Quiet flex for your gym bag.',
    };
  }
  return {
    slug: 'roasted-pistachios',
    quip: '4 pm scroll companion. Light sea salt, clean shell snap.',
  };
}

export function FindYourCrunchQuiz() {
  const { addToCart, navigate } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [added, setAdded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  const isDone = step >= 3;
  const rec = pickRecommendation(answers);
  const product = PRODUCTS.find((p) => p.slug === rec.slug) ?? PRODUCTS[0];
  const variant = product.variants[0];

  const reset = () => {
    setAnswers({});
    setStep(0);
    setAdded(false);
  };

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        weight: variant.weight,
        price: variant.price,
        quantity: 1,
        image: getImageUrl(product.imageKey),
      },
      imgRef.current
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto">
      <div className="rounded-[32px] bg-ink text-oat paper-grain p-6 sm:p-10 lg:p-14 border border-saffron/20 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Copy */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron block">
              3-Tap Match
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-oat leading-[1.02] tracking-tight">
              Find your <span className="italic text-saffron">crunch.</span>
            </h2>
            <p className="text-sm sm:text-base text-oat/75 leading-relaxed max-w-md">
              Answer three quick questions and we will pull the right Jaipur pouch for your desk, gym bag, or tiffin.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step > i ? 'w-10 bg-pistachio' : step === i ? 'w-12 bg-saffron' : 'w-6 bg-oat/20'
                  }`}
                />
              ))}
              <span className="font-mono text-[11px] text-oat/60 ml-2 tabular-nums">
                {Math.min(step + 1, 3)} / 3
              </span>
            </div>
          </div>

          {/* Right Interactive Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isDone ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                  className="bg-oat text-ink rounded-[26px] p-6 sm:p-8 shadow-xl"
                >
                  {step === 0 && (
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-almond mb-2">
                        Question 01
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-6">
                        When do you snack?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(
                          [
                            { id: 'desk', label: 'At my desk', sub: 'Mid-meeting focus' },
                            { id: 'gym', label: 'Post-workout', sub: 'Clean protein handful' },
                            { id: 'tiffin', label: 'In the tiffin', sub: 'Morning commute / school' },
                            { id: 'festive', label: 'Festive hosting', sub: 'Guests & gifting' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => ({ ...prev, occasion: opt.id }));
                              setStep(1);
                            }}
                            className="text-left p-4 rounded-2xl bg-card border border-ink/12 hover:border-saffron hover:bg-saffron/15 transition-all active:scale-[0.98] cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-xl text-ink">{opt.label}</span>
                              <ArrowRight className="w-4 h-4 text-almond opacity-60 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span className="text-xs text-ink/65 mt-0.5 block">{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-almond mb-2">
                        Question 02
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-6">
                        Crunchy or chewy?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(
                          [
                            { id: 'crunchy', label: 'Crunchy snap', sub: 'Roasted pistachios, almonds, walnuts' },
                            { id: 'chewy', label: 'Caramel soft', sub: 'Medjool dates, figs, apricots' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => ({ ...prev, texture: opt.id }));
                              setStep(2);
                            }}
                            className="text-left p-5 rounded-2xl bg-card border border-ink/12 hover:border-saffron hover:bg-saffron/15 transition-all active:scale-[0.98] cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-xl text-ink">{opt.label}</span>
                              <ArrowRight className="w-4 h-4 text-almond opacity-60 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span className="text-xs text-ink/65 mt-1 block">{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60 hover:text-ink cursor-pointer"
                      >
                        ← Back
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-almond mb-2">
                        Question 03
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-6">
                        Plain single-nut or mixed?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(
                          [
                            { id: 'plain', label: 'Keep it plain', sub: 'One honest variety by weight' },
                            { id: 'mixed', label: 'Mix it up', sub: 'Nuts + tart berries together' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => ({ ...prev, style: opt.id }));
                              setStep(3);
                            }}
                            className="text-left p-5 rounded-2xl bg-card border border-ink/12 hover:border-saffron hover:bg-saffron/15 transition-all active:scale-[0.98] cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-xl text-ink">{opt.label}</span>
                              <ArrowRight className="w-4 h-4 text-almond opacity-60 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span className="text-xs text-ink/65 mt-1 block">{opt.sub}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60 hover:text-ink cursor-pointer"
                      >
                        ← Back
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="quiz-result"
                  initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: -0.5 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="bg-card text-ink rounded-[28px] p-6 sm:p-8 border-2 border-saffron shadow-2xl relative"
                >
                  <div className="absolute -top-3.5 right-6">
                    <StickerBadge label="Your Jaipur Match" tone="pistachio" rotate="rotate-2" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div
                      ref={imgRef}
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 cursor-pointer border border-ink/10"
                    >
                      <ImageWithFallback
                        src={getImageUrl(product.imageKey)}
                        alt={product.name}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-almond">
                        {product.origin}
                      </p>
                      <h3 className="font-serif text-3xl text-ink mt-1">{product.name}</h3>
                      <p className="text-sm text-ink/75 mt-2 leading-relaxed">{rec.quip}</p>

                      <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <span className="font-mono text-lg font-bold tabular-nums text-ink">
                          {formatINR(variant.price)}{' '}
                          <span className="text-xs font-normal text-ink/60">/ {variant.weight}</span>
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <button
                          type="button"
                          onClick={handleAdd}
                          className={`relative px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                            added
                              ? 'bg-pistachio text-ink'
                              : 'btn-shine bg-saffron text-ink hover:bg-saffron/90'
                          }`}
                        >
                          <ConfettiMicroBurst active={added} />
                          {added ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <span>Add to Cart</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={reset}
                          className="px-4 py-3 rounded-full border border-ink/20 text-ink/75 hover:text-ink hover:border-ink font-mono text-[11px] uppercase tracking-[0.12em] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
