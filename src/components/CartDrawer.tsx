import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../data/catalog';

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeItem,
    subtotal,
    shipping,
    total,
    freeDeliveryThreshold,
    navigate,
  } = useStore();

  const remaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPct = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[85] flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-ink/60 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-oat text-ink h-full flex flex-col shadow-2xl border-l border-ink/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10 bg-card">
              <div>
                <h2 className="font-serif text-2xl text-ink leading-none">Your Bag</h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-almond/80 mt-1">
                  Packed on order in Jaipur
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-oat transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Progress */}
            <div className="px-6 py-3.5 bg-oat-muted/55 border-b border-ink/10">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="flex items-center gap-2 text-ink">
                  <Truck className="w-4 h-4 text-almond" />
                  {remaining === 0 ? (
                    <span>Unlocked: Free pan-India delivery</span>
                  ) : (
                    <span>Add {formatINR(remaining)} more for free delivery</span>
                  )}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-almond">{progressPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    remaining === 0 ? 'bg-pistachio' : 'bg-saffron'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-oat-muted flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-almond" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink mb-2">Your bag is empty.</h3>
                  <p className="text-sm text-ink/70 max-w-xs mb-6">
                    Pick a weight from Best Sellers or build a custom 4-compartment Jaipur box.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/shop');
                    }}
                    className="btn-shine px-6 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Browse Packs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-4 p-3.5 rounded-2xl bg-card border border-ink/8"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-oat-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-base text-ink leading-snug truncate">
                            {item.name}
                          </h4>
                          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-almond mt-0.5">
                            {item.weight}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-ink/45 hover:text-rose p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.customBoxDetails && item.customBoxDetails.length > 0 && (
                        <ul className="mt-1.5 text-[11px] text-ink/70 space-y-0.5">
                          {item.customBoxDetails.map((line, i) => (
                            <li key={i}>· {line}</li>
                          ))}
                        </ul>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center rounded-full border border-ink/15 bg-oat">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, -1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center hover:text-almond cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs tabular-nums font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center hover:text-almond cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-bold tabular-nums text-ink">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="px-6 py-5 bg-card border-t border-ink/10 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink/75">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink/75">
                    <span>Delivery</span>
                    <span className="font-mono tabular-nums">
                      {shipping === 0 ? 'FREE' : formatINR(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-ink pt-1.5 border-t border-ink/10">
                    <span>Total</span>
                    <span className="font-mono tabular-nums">{formatINR(total)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/cart');
                    }}
                    className="py-3 px-4 rounded-full border border-ink/25 text-ink font-mono text-[11px] font-bold uppercase tracking-[0.12em] hover:border-ink transition-colors cursor-pointer"
                  >
                    View Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="btn-shine py-3 px-4 rounded-full bg-saffron text-ink font-mono text-[11px] font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5 hover:bg-saffron/90 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
