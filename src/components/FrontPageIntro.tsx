import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlmondIcon, JharokhaArchOutline, NutStridLogo } from './NutSvgAssets';
import { usePrefersReducedMotion } from '../context/StoreContext';

const INTRO_SESSION_KEY = 'nutstrid_intro_seen_v1';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vRot: number;
  kind: number; // 0..7
  settled: boolean;
}

const NUT_COLORS = [
  { fill: '#C98442', stroke: '#6E3B11' }, // almond
  { fill: '#EAD5AD', stroke: '#B69158' }, // cashew
  { fill: '#9CC54B', stroke: '#DFD2B8' }, // pistachio
  { fill: '#BE894C', stroke: '#6A411A' }, // walnut
  { fill: '#572711', stroke: '#9E5B37' }, // date
  { fill: '#C59A63', stroke: '#8A6232' }, // fig
  { fill: '#F08826', stroke: '#B34D0A' }, // apricot
  { fill: '#332436', stroke: '#684E6D' }, // raisin
];

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const c = NUT_COLORS[p.kind % NUT_COLORS.length];
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  switch (p.kind % 8) {
    case 0: // Almond
      ctx.beginPath();
      ctx.moveTo(0, -p.r * 1.15);
      ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.3, p.r * 0.9, p.r * 0.95, 0, p.r * 1.05);
      ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.95, -p.r * 0.9, -p.r * 0.3, 0, -p.r * 1.15);
      ctx.fillStyle = c.fill;
      ctx.fill();
      ctx.strokeStyle = c.stroke;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      break;
    case 1: // Cashew crescent
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 0.92, -0.4, Math.PI * 1.25);
      ctx.arc(-p.r * 0.25, -p.r * 0.15, p.r * 0.48, Math.PI * 1.1, -0.3, true);
      ctx.closePath();
      ctx.fillStyle = c.fill;
      ctx.fill();
      break;
    case 2: // Pistachio
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 0.72, p.r * 0.98, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.stroke;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.r * 0.1, 0, p.r * 0.36, p.r * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.fill;
      ctx.fill();
      break;
    case 3: // Walnut half
      ctx.beginPath();
      ctx.ellipse(-p.r * 0.24, 0, p.r * 0.45, p.r * 0.85, -0.1, 0, Math.PI * 2);
      ctx.ellipse(p.r * 0.24, 0, p.r * 0.45, p.r * 0.85, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = c.fill;
      ctx.fill();
      ctx.strokeStyle = c.stroke;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      break;
    case 4: // Medjool date
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 0.65, p.r * 1.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.fill;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-p.r * 0.2, -p.r * 0.5);
      ctx.lineTo(-p.r * 0.12, p.r * 0.45);
      ctx.strokeStyle = c.stroke;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      break;
    case 5: // Dried fig
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.95, -p.r * 0.2, p.r * 0.9, p.r * 0.9, 0, p.r * 0.92);
      ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.9, -p.r * 0.95, -p.r * 0.2, 0, -p.r);
      ctx.fillStyle = c.fill;
      ctx.fill();
      break;
    case 6: // Dried apricot
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 0.86, 0, Math.PI * 2);
      ctx.fillStyle = c.fill;
      ctx.fill();
      break;
    default: // Raisins
      ctx.beginPath();
      ctx.ellipse(-p.r * 0.22, p.r * 0.1, p.r * 0.45, p.r * 0.55, 0.2, 0, Math.PI * 2);
      ctx.ellipse(p.r * 0.25, -p.r * 0.15, p.r * 0.42, p.r * 0.52, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = c.fill;
      ctx.fill();
      break;
  }

  ctx.restore();
}

export function FrontPageIntro({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem(INTRO_SESSION_KEY);
      // Only play intro on initial homepage load once per session
      const isHome = window.location.pathname === '/' || window.location.pathname === '';
      return !seen && isHome;
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'almond' | 'words' | 'arch' | 'brand' | 'curtain'>('almond');
  const [siteReady, setSiteReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: -999, y: -999, active: false });
  const tiltRef = useRef<{ gx: number }>({ gx: 0 });
  const exitingRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    setPhase('curtain');
    window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, prefersReducedMotion ? 200 : 720);
  }, [onDone, prefersReducedMotion]);

  useEffect(() => {
    if (!visible) {
      onDone();
    }
  }, [visible, onDone]);

  // Track document load readiness
  useEffect(() => {
    if (document.readyState === 'complete') {
      setSiteReady(true);
    } else {
      const onLoad = () => setSiteReady(true);
      window.addEventListener('load', onLoad);
      const fallback = window.setTimeout(() => setSiteReady(true), 800);
      return () => {
        window.removeEventListener('load', onLoad);
        window.clearTimeout(fallback);
      };
    }
  }, []);

  // Reduced motion simple 1-second fade
  useEffect(() => {
    if (!visible || !prefersReducedMotion) return;
    setProgress(100);
    setPhase('brand');
    const t = window.setTimeout(() => finishIntro(), 1000);
    return () => window.clearTimeout(t);
  }, [visible, prefersReducedMotion, finishIntro]);

  // Orchestrated 4.5s timeline
  useEffect(() => {
    if (!visible || prefersReducedMotion) return;

    const t1 = window.setTimeout(() => setPhase('words'), 450);
    const t2 = window.setTimeout(() => setPhase('arch'), 1550);
    const t3 = window.setTimeout(() => setPhase('brand'), 2950);
    const t4 = window.setTimeout(() => finishIntro(), 4400);

    const start = performance.now();
    const duration = 3900;
    let raf = 0;

    const tickProgress = (now: number) => {
      const pct = Math.min(100, Math.round(((now - start) / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tickProgress);
      }
    };
    raf = requestAnimationFrame(tickProgress);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      cancelAnimationFrame(raf);
    };
  }, [visible, prefersReducedMotion, finishIntro]);

  // Lightweight 60fps nut rain physics
  useEffect(() => {
    if (!visible || prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Optional mobile tilt
    const onOrient = (e: DeviceOrientationEvent) => {
      if (typeof e.gamma === 'number') {
        tiltRef.current.gx = Math.max(-0.4, Math.min(0.4, e.gamma / 45));
      }
    };
    window.addEventListener('deviceorientation', onOrient);

    const isMobile = w < 640;
    const totalNuts = isMobile ? 28 : 42;
    const particles: Particle[] = [];
    let spawned = 0;
    let frame = 0;

    const spawnBatch = () => {
      if (spawned >= totalNuts) return;
      const count = isMobile ? 2 : 3;
      for (let i = 0; i < count && spawned < totalNuts; i++) {
        particles.push({
          x: w * 0.1 + Math.random() * w * 0.8,
          y: -30 - Math.random() * 80,
          vx: (Math.random() - 0.5) * 2.4,
          vy: 1.5 + Math.random() * 2.5,
          r: isMobile ? 13 + Math.random() * 6 : 16 + Math.random() * 8,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.09,
          kind: spawned % 8,
          settled: false,
        });
        spawned++;
      }
    };

    let rafId = 0;
    const animate = () => {
      frame++;
      if (frame > 28 && frame % 3 === 0) {
        spawnBatch();
      }

      ctx.clearRect(0, 0, w, h);

      const floorY = h - 22;
      const ptr = pointerRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (exitingRef.current) {
          // Bounce away cleanly on curtain reveal
          p.vy -= 0.7;
          p.vx += (p.x < w / 2 ? -1 : 1) * 0.6;
        } else {
          p.vy += 0.48; // gravity
          p.vx += tiltRef.current.gx * 0.25;
        }

        // Interactive pointer/touch scatter
        if (ptr.active) {
          const dx = p.x - ptr.x;
          const dy = p.y - ptr.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 1) {
            const push = ((110 - dist) / 110) * 3.8;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push - 1.5;
            p.vRot += (Math.random() - 0.5) * 0.15;
            p.settled = false;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        // Soft floor pile height variation
        const pileOffset = ((i % 5) * 9) + Math.sin(p.x * 0.02) * 8;
        const ground = floorY - p.r - pileOffset;

        if (!exitingRef.current && p.y >= ground) {
          p.y = ground;
          if (Math.abs(p.vy) > 1.8) {
            p.vy = -p.vy * 0.42;
            p.vx *= 0.85;
            p.vRot *= 0.7;
          } else {
            p.vy = 0;
            p.vx *= 0.78;
            p.vRot *= 0.6;
            p.settled = true;
          }
        }

        if (p.x < p.r) {
          p.x = p.r;
          p.vx = Math.abs(p.vx) * 0.6;
        } else if (p.x > w - p.r) {
          p.x = w - p.r;
          p.vx = -Math.abs(p.vx) * 0.6;
        }

        drawParticle(ctx, p);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, [visible, prefersReducedMotion]);

  if (!visible) return null;

  const isCurtainOpen = phase === 'curtain';
  const archProgress = phase === 'almond' || phase === 'words' ? 0 : phase === 'arch' || phase === 'brand' || phase === 'curtain' ? 1 : 0;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden select-none"
      role="dialog"
      aria-label="NutStrid Jaipur Intro"
      onPointerMove={(e) => {
        pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      }}
      onPointerDown={(e) => {
        pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
    >
      {/* Split curtain halves */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isCurtainOpen ? '-102%' : 0 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 bg-ink paper-grain"
      />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isCurtainOpen ? '102%' : 0 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 bg-ink paper-grain"
      />

      {/* Interactive falling nuts layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Top Skip + Counter */}
      <motion.div
        animate={{ opacity: isCurtainOpen ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-5"
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-oat/70 tabular-nums">
          Jaipur · {progress}%
        </div>
        <button
          type="button"
          onClick={finishIntro}
          className="px-4 py-2 rounded-full border border-oat/25 text-oat/85 hover:text-ink hover:bg-saffron hover:border-saffron font-mono text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
        >
          Skip
        </button>
      </motion.div>

      {/* Center Stage */}
      <motion.div
        animate={{ opacity: isCurtainOpen ? 0 : 1, scale: isCurtainOpen ? 1.04 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 flex flex-col items-center justify-center h-[calc(100%-90px)] px-6 text-center pointer-events-none"
      >
        <div className="relative flex flex-col items-center justify-center w-[280px] sm:w-[330px] h-[360px] sm:h-[420px]">
          {/* Drawable Jharokha Arch Outline */}
          <div className="absolute inset-0 flex items-center justify-center">
            <JharokhaArchOutline
              className="w-full h-full transition-all duration-1000 ease-out"
              strokeColor="#F2A93B"
              strokeWidth={2.2}
              progress={archProgress}
            />
          </div>

          {/* Pulsing Almond Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.12, 1], opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <AlmondIcon className="w-10 h-10 sm:w-12 sm:h-12" color="#F2A93B" grooveColor="#0A1F17" />
          </motion.div>

          {/* Stacked Masked Serif Headline */}
          {!prefersReducedMotion && (
            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '110%' }}
                  animate={{ y: phase !== 'almond' ? '0%' : '110%' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-4xl sm:text-5xl text-oat tracking-tight leading-none"
                >
                  Crunch.
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '110%' }}
                  animate={{ y: phase !== 'almond' ? '0%' : '110%' }}
                  transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif italic text-4xl sm:text-5xl text-saffron tracking-tight leading-none pb-1"
                >
                  Different.
                </motion.p>
              </div>
            </div>
          )}

          {/* Wordmark + Loader Bar */}
          <AnimatePresence>
            {(phase === 'brand' || phase === 'curtain' || prefersReducedMotion) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 flex flex-col items-center"
              >
                <NutStridLogo theme="dark" showCaption={false} size="md" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-oat/75 mt-1.5">
                  packed fresh in Jaipur
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thin saffron progress line */}
          <div className="w-40 h-[2px] bg-oat/15 rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-saffron transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tap to enter prompt if loaded fast */}
        {siteReady && !prefersReducedMotion && (
          <button
            type="button"
            onClick={finishIntro}
            className="pointer-events-auto mt-3 px-4 py-1.5 rounded-full text-oat/75 hover:text-saffron font-mono text-[10px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
          >
            Tap to enter →
          </button>
        )}
      </motion.div>
    </div>
  );
}
