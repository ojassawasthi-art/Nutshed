import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { BOX_INGREDIENTS, type BoxIngredient, getImageUrl, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { NutCutout } from './NutSvgAssets';
import { ConfettiMicroBurst } from './CursorEffects';

interface SlotSelection {
  ingredient: BoxIngredient;
  weight: '250 g' | '500 g';
}

const DEFAULT_SLOTS: (SlotSelection | null)[] = [
  { ingredient: BOX_INGREDIENTS[0], weight: '250 g' },
  { ingredient: BOX_INGREDIENTS[1], weight: '250 g' },
  { ingredient: BOX_INGREDIENTS[2], weight: '250 g' },
  null,
];

function AnimatedTotal({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (shown === value) return;
    const start = shown;
    const diff = value - start;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 280);
      setShown(Math.round(start + diff * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-ink">{formatINR(shown)}</span>;
}

export function BoxBuilderWidget({ standalone = false }: { standalone?: boolean }) {
  const { addToCart, navigate } = useStore();
  const [slots, setSlots] = useState<(SlotSelection | null)[]>(DEFAULT_SLOTS);
  const [activeSlot, setActiveSlot] = useState<number>(3);
  const [giftNote, setGiftNote] = useState('');
  const [added, setAdded] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const filledSlots = slots.filter((s): s is SlotSelection => s !== null);
  const boxPackagingFee = 120; // Rigid kraft box + saffron ribbon
  const itemsTotal = filledSlots.reduce(
    (sum, s) => sum + (s.weight === '500 g' ? s.ingredient.price500g : s.ingredient.price250g),
    0
  );
  const grandTotal = filledSlots.length > 0 ? itemsTotal + boxPackagingFee : 0;

  const assignIngredient = (ingredient: BoxIngredient) => {
    setSlots((prev) => {
      const next = [...prev];
      const targetIdx = next[activeSlot] === null ? activeSlot : activeSlot;
      next[targetIdx] = {
        ingredient,
        weight: next[targetIdx]?.weight ?? '250 g',
      };
      return next;
    });
    const nextEmpty = slots.findIndex((s, i) => i !== activeSlot && s === null);
    if (nextEmpty !== -1) {
      setActiveSlot(nextEmpty);
    }
  };

  const toggleSlotWeight = (idx: number) => {
    setSlots((prev) =>
      prev.map((s, i) => {
        if (i !== idx || !s) return s;
        return { ...s, weight: s.weight === '250 g' ? '500 g' : '250 g' };
      })
    );
  };

  const clearSlot = (idx: number) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? null : s)));
    setActiveSlot(idx);
  };

  const handleAddBox = () => {
    if (filledSlots.length < 4) {
      const firstEmpty = slots.findIndex((s) => s === null);
      if (firstEmpty !== -1) setActiveSlot(firstEmpty);
      return;
    }

    const totalGrams = filledSlots.reduce((sum, s) => sum + (s.weight === '500 g' ? 500 : 250), 0);
    const weightLabel = totalGrams >= 1000 ? `${(totalGrams / 1000).toFixed(2).replace(/\.00$/, '')} kg Box` : `${totalGrams} g Box`;

    const details = filledSlots.map((s) => `${s.ingredient.name} (${s.weight})`);
    if (giftNote.trim()) {
      details.push(`Gift note: "${giftNote.trim()}"`);
    }

    addToCart(
      {
        productId: 'custom-jaipur-box',
        slug: 'build-box',
        name: 'Custom 4-Part Jaipur Gift Box',
        weight: weightLabel,
        price: grandTotal,
        quantity: 1,
        image: getImageUrl('boxBuilderOpen'),
        customBoxDetails: details,
      },
      boxRef.current
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className={standalone ? '' : 'py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto'}>
      {!standalone && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
              Custom Gift Studio
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Build your own <span className="italic text-almond">box</span>
            </h2>
            <p className="text-sm sm:text-base text-ink/75 mt-2 max-w-xl">
              Pick the nuts and dried fruit, choose the weights, and we will pack them as one gift.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/build-box')}
            className="btn-shine self-start md:self-auto px-6 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start a Box</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live 4-Compartment Visual Box Preview */}
        <div className="lg:col-span-6 bg-card rounded-[32px] p-5 sm:p-7 border border-ink/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-almond">
              Live Box Preview ({filledSlots.length}/4 filled)
            </span>
            <span className="font-mono text-[11px] text-ink/60">Tap a compartment</span>
          </div>

          <div
            ref={boxRef}
            className="relative aspect-square rounded-[24px] overflow-hidden bg-oat-muted border border-ink/10"
          >
            <img
              src={getImageUrl('boxBuilderOpen')}
              alt="Empty open 4-compartment kraft gift box"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Interactive 2x2 Compartment Overlay aligned cleanly inside the box */}
            <div className="absolute inset-0 p-[12%] pr-[26%] grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              {slots.map((slot, idx) => {
                const isSelected = activeSlot === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveSlot(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveSlot(idx);
                    }}
                    className={`relative rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-saffron bg-oat/90 shadow-md'
                        : slot
                          ? 'bg-card/90 hover:bg-card'
                          : 'bg-oat/65 border border-dashed border-ink/30 hover:border-saffron'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {slot ? (
                        <motion.div
                          key={`${slot.ingredient.id}-${idx}`}
                          initial={{ scale: 0.4, y: -18, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                          className="flex flex-col items-center w-full"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearSlot(idx);
                            }}
                            aria-label={`Clear compartment ${idx + 1}`}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-ink/10 hover:bg-rose hover:text-oat flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          <div className="flex -space-x-2 mb-1">
                            <NutCutout kind={slot.ingredient.nutKind} className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm -rotate-12" />
                            <NutCutout kind={slot.ingredient.nutKind} className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm rotate-12" />
                          </div>
                          <span className="font-serif text-xs sm:text-sm text-ink leading-tight line-clamp-1">
                            {slot.ingredient.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSlotWeight(idx);
                            }}
                            className="mt-1 px-2 py-0.5 rounded-full bg-saffron text-ink font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:bg-saffron-deep"
                          >
                            {slot.weight} · ↻
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`empty-${idx}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-almond font-bold">
                            Slot 0{idx + 1}
                          </span>
                          <span className="text-[11px] text-ink/60 mt-0.5">Pick nut →</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-ink/65 mt-3">
            Includes rigid kraft 4-compartment tray, saffron silk ribbon, and gift card (₹{boxPackagingFee}).
          </p>
        </div>

        {/* Right: Ingredient Picker & Total */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-card rounded-[28px] p-5 sm:p-6 border border-ink/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl text-ink">
                Filling Slot 0{activeSlot + 1}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-almond">
                Tap to drop in
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BOX_INGREDIENTS.map((ing) => {
                const isUsedHere = slots[activeSlot]?.ingredient.id === ing.id;
                return (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => assignIngredient(ing)}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col items-center text-center ${
                      isUsedHere
                        ? 'bg-saffron/20 border-saffron shadow-xs'
                        : 'bg-oat/70 border-ink/10 hover:border-saffron hover:bg-card'
                    }`}
                  >
                    <NutCutout kind={ing.nutKind} className="w-10 h-10 mb-1.5" />
                    <span className="font-serif text-sm text-ink leading-tight">{ing.name}</span>
                    <span className="font-mono text-[10px] text-almond mt-1 tabular-nums">
                      from {formatINR(ing.price250g)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gift Note & Checkout Strip */}
          <div className="bg-card rounded-[28px] p-5 sm:p-6 border border-ink/10 space-y-4">
            <div>
              <label htmlFor="box-gift-note" className="block font-mono text-[10px] uppercase tracking-[0.16em] text-almond mb-1.5">
                Optional Jaipur Gift Card Note
              </label>
              <input
                id="box-gift-note"
                type="text"
                maxLength={120}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="e.g. Happy Diwali from Jaipur!"
                className="w-full px-4 py-2.5 rounded-full bg-oat border border-ink/15 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-ink/10">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-almond block">
                  Box Total
                </span>
                <AnimatedTotal value={grandTotal} />
              </div>

              <button
                type="button"
                onClick={handleAddBox}
                className={`relative px-7 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  added
                    ? 'bg-pistachio text-ink'
                    : filledSlots.length < 4
                      ? 'bg-ink text-oat hover:bg-ink-deep'
                      : 'btn-shine bg-saffron text-ink hover:bg-saffron/90'
                }`}
              >
                <ConfettiMicroBurst active={added} />
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Box Added to Bag</span>
                  </>
                ) : filledSlots.length < 4 ? (
                  <>
                    <Sparkles className="w-4 h-4 text-saffron" />
                    <span>Fill Slot 0{slots.findIndex((s) => s === null) + 1} First</span>
                  </>
                ) : (
                  <>
                    <span>Add Box to Cart</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
