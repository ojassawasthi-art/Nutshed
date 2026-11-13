import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Home,
  Store,
  Gift,
  MessageCircle,
  ArrowRight,
  Phone,
  MapPin,
  Mail,
} from 'lucide-react';
import { NutStridLogo } from './NutSvgAssets';
import { useStore } from '../context/StoreContext';

const NAV_ITEMS = [
  { label: 'Dry Fruits', to: '/shop?group=Dry%20Fruits' },
  { label: 'Nuts', to: '/shop?group=Nuts' },
  { label: 'Dates & Figs', to: '/shop?group=Dates%20%26%20Figs' },
  { label: 'Mixes', to: '/category/mixes' },
  { label: 'Gift Hampers', to: '/hampers' },
  { label: 'Shop by Need', to: '/#shop-by-need' },
];

export function AnnouncementBar() {
  return (
    <div className="bg-ink-deep text-saffron border-b border-saffron/15 px-4 py-2 text-center">
      <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.08em] leading-snug">
        Packed in Jaipur, sent across India. Free delivery on orders ₹499 and above. Jaipur orders before 2 pm ship same day.
      </p>
    </div>
  );
}

export function Header() {
  const {
    path,
    navigate,
    cartCount,
    setCartOpen,
    searchQuery,
    setSearchQuery,
    cartIconRef,
    mobileCartIconRef,
    cartBadgePulse,
    user,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const isHomeHero = path === '/' || path === '';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/shop');
    setMenuOpen(false);
  };

  const darkHeader = isHomeHero && !scrolled;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          darkHeader
            ? 'bg-ink/80 backdrop-blur-md text-oat border-b border-oat/10'
            : scrolled
              ? 'bg-oat/88 backdrop-blur-xl text-ink border-b border-ink/10 shadow-sm'
              : 'bg-oat text-ink border-b border-ink/10'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-4">
          {/* Mobile left: Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full hover:bg-saffron/15 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-saffron rounded-lg"
            aria-label="NutStrid Home"
          >
            <NutStridLogo theme={darkHeader ? 'dark' : 'light'} size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-6" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.to}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.to);
                }}
                className={`text-[13px] font-medium whitespace-nowrap shrink-0 relative py-1 transition-colors hover:text-saffron ${
                  darkHeader ? 'text-oat/90' : 'text-ink/85'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Search + Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  darkHeader ? 'text-oat/55' : 'text-ink/50'
                }`}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search dry fruits"
                aria-label="Search dry fruits"
                className={`pl-9 pr-4 py-2 rounded-full text-xs transition-all border focus:outline-none ${
                  searchFocused ? 'w-56' : 'w-44'
                } ${
                  darkHeader
                    ? 'bg-oat/10 border-oat/20 text-oat placeholder:text-oat/50 focus:border-saffron'
                    : 'bg-card border-ink/15 text-ink placeholder:text-ink/45 focus:border-ink'
                }`}
              />
            </form>

            <button
              type="button"
              onClick={() => navigate('/account')}
              aria-label={user ? 'My Account' : 'Sign in'}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                darkHeader ? 'hover:bg-oat/10 text-oat' : 'hover:bg-ink/8 text-ink'
              }`}
            >
              <User className="w-[18px] h-[18px]" />
            </button>

            <button
              ref={cartIconRef}
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart with ${cartCount} items`}
              className={`relative h-10 px-4 rounded-full flex items-center gap-2 font-mono text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
                darkHeader
                  ? 'bg-saffron text-ink hover:bg-saffron/90'
                  : 'bg-ink text-oat hover:bg-ink-deep'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <motion.span
                key={cartCount}
                animate={cartBadgePulse ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.32 }}
                className="tabular-nums"
              >
                {cartCount}
              </motion.span>
            </button>
          </div>

          {/* Mobile right: Cart Bag */}
          <div className="flex lg:hidden items-center">
            <button
              ref={mobileCartIconRef}
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart with ${cartCount} items`}
              className="relative w-11 h-11 -mr-2 flex items-center justify-center rounded-full cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  animate={cartBadgePulse ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                  className="absolute top-1.5 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-saffron text-ink font-mono text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[80] bg-ink text-oat paper-grain flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <NutStridLogo theme="dark" size="sm" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 rounded-full border border-oat/20 flex items-center justify-center text-oat hover:bg-saffron hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative mb-8">
                <Search className="w-4 h-4 text-oat/55 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dry fruits"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-oat/10 border border-oat/20 text-oat placeholder:text-oat/50 text-sm focus:outline-none focus:border-saffron"
                />
              </form>

              <nav className="space-y-3" aria-label="Mobile Navigation">
                {[
                  { label: 'Shop All', to: '/shop' },
                  ...NAV_ITEMS,
                  { label: 'Build Your Own Box', to: '/build-box' },
                  { label: 'Track Order', to: '/track' },
                  { label: user ? 'My Account' : 'Account / Login', to: '/account' },
                ].map((item, idx) => (
                  <motion.a
                    key={item.label}
                    href={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, duration: 0.35 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      navigate(item.to);
                    }}
                    className="flex items-center justify-between font-serif text-3xl text-oat hover:text-saffron py-1.5 border-b border-oat/10"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-5 h-5 text-saffron" />
                  </motion.a>
                ))}
              </nav>
            </div>

            <div className="pt-8 text-oat/65 font-mono text-[11px] uppercase tracking-[0.16em]">
              Packed fresh in Jaipur · Free delivery ₹499+
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileBottomBar() {
  const { path, navigate, cartCount, setCartOpen } = useStore();

  const items = [
    { label: 'Home', to: '/', icon: Home, active: path === '/' },
    { label: 'Shop', to: '/shop', icon: Store, active: path.startsWith('/shop') || path.startsWith('/category') || path.startsWith('/product') },
    { label: 'Hampers', to: '/hampers', icon: Gift, active: path === '/hampers' || path === '/build-box' },
    { label: 'Cart', to: '/cart', icon: ShoppingBag, active: path === '/cart' || path === '/checkout', isCart: true },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink/95 backdrop-blur-lg border-t border-oat/15 text-oat px-3 py-1.5 flex items-center justify-around"
      aria-label="Mobile quick bar"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.isCart) {
                setCartOpen(true);
              } else {
                navigate(item.to);
              }
            }}
            className={`relative flex flex-col items-center justify-center min-w-[60px] py-1.5 rounded-xl transition-colors cursor-pointer ${
              item.active ? 'text-saffron' : 'text-oat/75 hover:text-oat'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.isCart && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-saffron text-ink font-mono text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] mt-0.5 tracking-wide">{item.label}</span>
            {item.active && (
              <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-0.5" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/918000412189?text=Hello%20NutStrid%2C%20I%20have%20a%20question."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with NutStrid on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 group flex items-center gap-2.5 bg-ink text-oat border border-saffron/40 hover:border-saffron pl-3.5 pr-4 py-3 rounded-full shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
    >
      <span className="w-8 h-8 rounded-full bg-saffron text-ink flex items-center justify-center shrink-0">
        <MessageCircle className="w-4 h-4" />
      </span>
      <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.14em] text-oat group-hover:text-saffron transition-colors">
        WhatsApp
      </span>
    </a>
  );
}

export function Footer() {
  const { navigate, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      showToast('Enter a valid email address.');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('nutstrid_newsletter_emails') || '[]');
      if (!existing.includes(email.trim().toLowerCase())) {
        existing.push(email.trim().toLowerCase());
        localStorage.setItem('nutstrid_newsletter_emails', JSON.stringify(existing));
      }
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setJoined(true);
      setEmail('');
      showToast('You are on the Jaipur kitchen list.');
    } catch {
      setJoined(true);
      setEmail('');
      showToast('Saved locally on this browser.');
    }
  };

  return (
    <footer className="bg-ink text-oat paper-grain pt-16 pb-20 md:pb-8 border-t border-saffron/15 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-oat/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <NutStridLogo theme="dark" size="lg" />
            <p className="text-sm text-oat/80 leading-relaxed max-w-sm">
              NutStrid packs premium dry fruits in Jaipur for families, offices, and gift boxes across India. Sold by weight, vacuum sealed on order.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3 py-1.5 rounded-full border border-oat/20 font-mono text-[10px] uppercase tracking-[0.14em] text-oat/85">
                UPI Accepted
              </span>
              <span className="px-3 py-1.5 rounded-full border border-oat/20 font-mono text-[10px] uppercase tracking-[0.14em] text-oat/85">
                Cash on Delivery
              </span>
            </div>
            <p className="font-mono text-[11px] text-oat/55 tracking-wide">
              FSSAI Lic. No. 12224026001084 (Placeholder)
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-oat/80">
              {[
                { label: 'Shop', to: '/shop' },
                { label: 'Gift Hampers', to: '/hampers' },
                { label: 'Build Your Box', to: '/build-box' },
                { label: 'Account', to: '/account' },
                { label: 'Track Order', to: '/track' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.to);
                    }}
                    className="hover:text-saffron transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">
              Policies
            </h3>
            <ul className="space-y-2.5 text-sm text-oat/80">
              {[
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Shipping', to: '/shipping' },
                { label: 'Returns', to: '/returns' },
                { label: 'Privacy', to: '/privacy' },
                { label: 'Terms', to: '/terms' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.to);
                    }}
                    className="hover:text-saffron transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-saffron">
              Jaipur Packing Table
            </h3>
            <div className="space-y-2 text-sm text-oat/80">
              <a
                href="tel:+918000412189"
                className="flex items-center gap-2.5 hover:text-saffron transition-colors"
              >
                <Phone className="w-4 h-4 text-saffron shrink-0" />
                <span className="tabular-nums">+91 80004 12189</span>
              </a>
              <a
                href="https://wa.me/918000412189?text=Hello%20NutStrid%2C%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-saffron transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-saffron shrink-0" />
                <span>WhatsApp Support</span>
              </a>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-saffron shrink-0" />
                <span>hello@nutstrid.shop</span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <span>Jaipur, Rajasthan 302001</span>
              </p>
            </div>

            <form onSubmit={handleJoin} className="pt-2">
              <label htmlFor="footer-newsletter" className="block font-mono text-[10px] uppercase tracking-[0.16em] text-oat/70 mb-2">
                Kitchen dispatch notes
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-oat/10 border border-oat/20 text-oat placeholder:text-oat/45 text-xs focus:outline-none focus:border-saffron"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] hover:bg-saffron/90 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {joined ? 'Joined' : 'Join'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-oat/55">
          <p>© {new Date().getFullYear()} NutStrid Jaipur. All rights reserved.</p>
          <p>Freshly weighed &amp; vacuum sealed in Jaipur, India.</p>
        </div>

        {/* Giant Outlined Wordmark */}
        <div className="pt-4 select-none pointer-events-none overflow-hidden" aria-hidden="true">
          <svg viewBox="0 0 1200 220" className="w-full h-auto">
            <text
              x="50%"
              y="180"
              textAnchor="middle"
              fill="none"
              stroke="rgba(250, 244, 230, 0.14)"
              strokeWidth="2"
              className="font-serif lowercase font-semibold"
              style={{ fontSize: '210px', letterSpacing: '-0.04em' }}
            >
              nutstrid
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}
