import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

export function DesktopSaffronCursor() {
  const { prefersReducedMotion } = useStore();
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isPointerFine = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024;
    if (!isPointerFine) return;
    setEnabled(true);

    let raf = 0;
    let targetX = -200;
    let targetY = -200;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          setPos({ x: targetX, y: targetY });
          raf = 0;
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  if (!enabled) return null;

  return (
    <div
      className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none z-40 transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x - 144}px, ${pos.y - 144}px, 0)`,
        background: 'radial-gradient(circle, rgba(242,169,59,0.12) 0%, rgba(242,169,59,0) 70%)',
      }}
      aria-hidden="true"
    />
  );
}

export function FlyingCartLayer() {
  const { flyingItems } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-[90]" aria-hidden="true">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.img
            key={item.id}
            src={item.image}
            alt=""
            initial={{
              x: item.startX - 24,
              y: item.startY - 24,
              scale: 1,
              opacity: 0.95,
              borderRadius: '16px',
            }}
            animate={{
              x: item.endX - 16,
              y: item.endY - 16,
              scale: 0.28,
              opacity: 0.2,
              borderRadius: '999px',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-12 object-cover shadow-lg border-2 border-saffron"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ConfettiMicroBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const specks = [
    { x: -24, y: -26, color: '#F2A93B' },
    { x: 22, y: -24, color: '#B9D86A' },
    { x: -30, y: -4, color: '#B9D86A' },
    { x: 28, y: -6, color: '#F2A93B' },
    { x: -12, y: -32, color: '#E8728F' },
    { x: 12, y: -30, color: '#F2A93B' },
  ];

  return (
    <span className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
      {specks.map((s, idx) => (
        <motion.span
          key={idx}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: s.x, y: s.y, scale: 0, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: s.color }}
        />
      ))}
    </span>
  );
}
