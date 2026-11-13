import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { GlobalSvgDefs } from './components/NutSvgAssets';
import { FrontPageIntro } from './components/FrontPageIntro';
import { DesktopSaffronCursor, FlyingCartLayer } from './components/CursorEffects';
import {
  AnnouncementBar,
  Header,
  Footer,
  MobileBottomBar,
  WhatsAppFab,
} from './components/LayoutChrome';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './components/HomePage';
import {
  ShopPage,
  ProductDetailPage,
  HampersPage,
  BuildBoxPage,
} from './components/ShopPages';
import {
  CartPage,
  CheckoutPage,
  TrackOrderPage,
  AccountPage,
  InfoPage,
} from './components/CheckoutAndAccountPages';

function ToastBanner() {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[95] px-5 py-3 rounded-full bg-ink text-oat border border-saffron/40 shadow-xl font-mono text-xs tracking-wide whitespace-nowrap"
          role="status"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PageRouter() {
  const { path, prefersReducedMotion } = useStore();

  const renderPage = () => {
    if (path === '/' || path === '') return <HomePage />;
    if (path === '/shop') return <ShopPage />;
    if (path.startsWith('/category/')) {
      return <ShopPage initialCategorySlug={path.replace('/category/', '')} />;
    }
    if (path.startsWith('/need/')) {
      return <ShopPage initialNeedSlug={path.replace('/need/', '')} />;
    }
    if (path.startsWith('/product/')) {
      return <ProductDetailPage slug={path.replace('/product/', '')} />;
    }
    if (path === '/hampers') return <HampersPage />;
    if (path === '/build-box') return <BuildBoxPage />;
    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/track') return <TrackOrderPage />;
    if (path === '/account') return <AccountPage />;
    if (path === '/about') return <InfoPage page="about" />;
    if (path === '/contact') return <InfoPage page="contact" />;
    if (path === '/faq') return <InfoPage page="faq" />;
    if (path === '/shipping') return <InfoPage page="shipping" />;
    if (path === '/returns') return <InfoPage page="returns" />;
    if (path === '/privacy') return <InfoPage page="privacy" />;
    if (path === '/terms') return <InfoPage page="terms" />;
    return <HomePage />;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const [_introDone, setIntroDone] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-oat text-ink paper-grain paper-grain-light">
      <GlobalSvgDefs />
      <FrontPageIntro onDone={() => setIntroDone(true)} />
      <DesktopSaffronCursor />
      <FlyingCartLayer />
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <PageRouter />
      </div>
      <Footer />
      <CartDrawer />
      <WhatsAppFab />
      <MobileBottomBar />
      <ToastBanner />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
