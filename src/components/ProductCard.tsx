import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { type Product, getImageUrl, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { ImageWithFallback } from './NutSvgAssets';
import { ConfettiMicroBurst } from './CursorEffects';

function RollingPrice({ price }: { price: number }) {
  const [displayed, setDisplayed] = useState(price);

  useEffect(() => {
    if (displayed === price) return;
    const start = displayed;
    const diff = price - start;
    const startTime = performance.now();
    const duration = 260;
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(start + diff * eased));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [price]);

  return <span className="font-mono text-lg font-bold tabular-nums text-ink">{formatINR(displayed)}</span>;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, navigate } = useStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);

  const variant = product.variants[selectedIdx] ?? product.variants[0];
  const imgUrl = getImageUrl(product.imageKey);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        weight: variant.weight,
        price: variant.price,
        quantity: 1,
        image: imgUrl,
      },
      imgWrapRef.current
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article className="group bg-card rounded-[26px] border border-ink/10 p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(242,169,59,0.55)] hover:border-saffron/60">
      <div>
        {/* Product Image */}
        <div
          ref={imgWrapRef}
          onClick={() => navigate(`/product/${product.slug}`)}
          className="relative aspect-square rounded-[20px] overflow-hidden bg-oat cursor-pointer mb-4"
        >
          <ImageWithFallback
            src={imgUrl}
            alt={`${product.name} — packed fresh in Jaipur`}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] font-bold border border-ink/10 -rotate-2 shadow-xs ${
                product.badge === 'New'
                  ? 'bg-pistachio text-ink'
                  : product.badge === 'Festive Pick'
                    ? 'bg-rose text-oat'
                    : 'bg-saffron text-ink'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Meta & Title */}
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-almond/80 truncate">
          {product.origin}
        </p>
        <h3 className="mt-1">
          <a
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product.slug}`);
            }}
            className="font-serif text-xl text-ink group-hover:text-almond transition-colors leading-snug block"
          >
            {product.name}
          </a>
        </h3>
        <p className="text-xs text-ink/70 mt-1 line-clamp-2 leading-relaxed">
          {product.shortCopy}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/8 space-y-3">
        {/* Weight Selector Pills */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center p-1 rounded-full bg-oat border border-ink/10">
            {product.variants.map((v, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={v.weight}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative px-2.5 py-1 rounded-full font-mono text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'text-ink' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`weight-pill-${product.id}`}
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-saffron"
                    />
                  )}
                  <span className="relative z-10">{v.weight}</span>
                </button>
              );
            })}
          </div>
          <RollingPrice price={variant.price} />
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`relative w-full py-3 px-4 rounded-full font-mono text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            justAdded
              ? 'bg-pistachio text-ink'
              : 'btn-shine bg-ink text-oat hover:bg-saffron hover:text-ink'
          }`}
        >
          <ConfettiMicroBurst active={justAdded} />
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added {variant.weight}</span>
            </>
          ) : (
            <>
              <span>Add {variant.weight}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
