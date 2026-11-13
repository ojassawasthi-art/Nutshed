import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CATEGORIES, NEEDS, PRODUCTS } from '../data/catalog';

export interface CartItem {
  key: string; // productId + '__' + weight (or unique custom box id)
  productId: string;
  slug: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
  customBoxDetails?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface OrderSummary {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  paymentMethod: 'RAZORPAY' | 'UPI' | 'COD';
  paymentStatus?: 'paid' | 'pending_verification' | 'cod_pending' | 'pending';
  paymentId?: string;
  utrNumber?: string;
  items: {
    productId: string;
    name: string;
    weight: string;
    price: number;
    quantity: number;
    customBoxDetails?: string[];
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface StoreContextValue {
  path: string;
  navigate: (to: string) => void;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeDeliveryThreshold: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'key'>, sourceEl?: HTMLElement | null) => void;
  updateQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartIconRef: React.RefObject<HTMLButtonElement | null>;
  mobileCartIconRef: React.RefObject<HTMLButtonElement | null>;
  cartBadgePulse: boolean;
  flyingItems: FlyingItem[];
  toast: string | null;
  showToast: (msg: string) => void;
  user: UserProfile | null;
  token: string | null;
  userOrders: OrderSummary[];
  setAuthSession: (token: string, user: UserProfile, orders: OrderSummary[]) => void;
  logout: () => void;
  refreshUserOrders: () => Promise<void>;
  lastOrderId: string | null;
  setLastOrderId: (id: string | null) => void;
  prefersReducedMotion: boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = 'nutstrid_cart_v1';
const TOKEN_STORAGE_KEY = 'nutstrid_auth_token_v1';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function getSeoMetaForPath(path: string): { title: string; description: string } {
  if (path === '/' || path === '') {
    return {
      title: 'NutStrid | Premium dry fruits, packed fresh in Jaipur',
      description:
        'Premium dry fruits, almonds, cashews, pistachios, Medjool dates, and curated gift hampers packed fresh on order in Jaipur and delivered across India.',
    };
  }
  if (path === '/shop') {
    return {
      title: 'Shop Dry Fruits & Nuts | NutStrid Jaipur',
      description: 'Shop California almonds, Mamra almonds, W240 cashews, pistachios, dates, figs, and trail mixes packed fresh on order in Jaipur.',
    };
  }
  if (path.startsWith('/category/')) {
    const slug = path.replace('/category/', '');
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (cat) {
      return {
        title: `${cat.name} | NutStrid Jaipur`,
        description: `${cat.tagline} Sold by weight, vacuum sealed on order in Jaipur.`,
      };
    }
  }
  if (path.startsWith('/need/')) {
    const slug = path.replace('/need/', '');
    const need = NEEDS.find((n) => n.slug === slug);
    if (need) {
      return {
        title: `${need.title} | NutStrid Jaipur`,
        description: `${need.description} Packed fresh in Jaipur and delivered across India.`,
      };
    }
  }
  if (path.startsWith('/product/')) {
    const slug = path.replace('/product/', '');
    const prod = PRODUCTS.find((p) => p.slug === slug);
    if (prod) {
      return {
        title: `${prod.name} | NutStrid Jaipur`,
        description: `${prod.shortCopy} Sold by weight and vacuum sealed fresh in Jaipur.`,
      };
    }
  }
  if (path === '/hampers') {
    return {
      title: 'Festive & Corporate Gift Hampers | NutStrid Jaipur',
      description: 'Diwali, wedding, and office dry fruit gift hampers packed fresh in Jaipur with custom bulk quotes across India.',
    };
  }
  if (path === '/build-box') {
    return {
      title: 'Build Your Own Dry Fruit Box | NutStrid Jaipur',
      description: 'Pick your nuts and dried fruits, choose pack weights, and send a custom 4-compartment NutStrid gift box from Jaipur.',
    };
  }
  if (path === '/track') {
    return {
      title: 'Track Your Order | NutStrid Jaipur',
      description: 'Check live packing and dispatch status for your NutStrid dry fruit order using your Order ID and phone number.',
    };
  }
  if (path === '/checkout') {
    return {
      title: 'Checkout | NutStrid Jaipur',
      description: 'Complete your NutStrid dry fruit order with UPI or Cash on Delivery. Free shipping on orders ₹499 and above.',
    };
  }
  if (path === '/cart') {
    return {
      title: 'Your Cart | NutStrid Jaipur',
      description: 'Review your packed-on-order NutStrid dry fruits and hampers before checkout.',
    };
  }
  if (path === '/account') {
    return {
      title: 'Account & Order History | NutStrid Jaipur',
      description: 'Sign in or create a NutStrid account to view past orders and reorder favourite dry fruit packs.',
    };
  }
  const simplePages: Record<string, { title: string; description: string }> = {
    '/about': {
      title: 'Our Jaipur Story | NutStrid',
      description: 'How NutStrid packs vacuum-sealed dry fruits and festive hampers to order in Jaipur, Rajasthan.',
    },
    '/contact': {
      title: 'Contact NutStrid | Jaipur',
      description: 'Reach NutStrid in Jaipur via phone (+91 80004 12189), WhatsApp, or our inquiry form.',
    },
    '/faq': {
      title: 'FAQ | NutStrid Jaipur',
      description: 'Storage tips, shelf life, same-day Jaipur dispatch, and bulk order answers from NutStrid.',
    },
    '/shipping': {
      title: 'Shipping Policy | NutStrid Jaipur',
      description: 'Same-day Jaipur dispatch before 2 pm and free pan-India shipping on orders ₹499 and above.',
    },
    '/returns': {
      title: 'Returns & Replacements | NutStrid',
      description: 'Damaged seal or box? Contact NutStrid within 48 hours for a fast replacement or refund.',
    },
    '/privacy': {
      title: 'Privacy Policy | NutStrid',
      description: 'How NutStrid handles your order and delivery details responsibly.',
    },
    '/terms': {
      title: 'Terms & Conditions | NutStrid',
      description: 'Standard store terms for ordering fresh dry fruits and gift hampers from NutStrid Jaipur.',
    },
  };
  return (
    simplePages[path] ?? {
      title: 'NutStrid | Premium dry fruits, packed fresh in Jaipur',
      description: 'Premium dry fruits, packed fresh in Jaipur and sent across India.',
    }
  );
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartBadgePulse, setCartBadgePulse] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<OrderSummary[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const cartIconRef = useRef<HTMLButtonElement | null>(null);
  const mobileCartIconRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore quota errors
    }
  }, [cart]);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update per-page SEO tags
  useEffect(() => {
    const meta = getSeoMetaForPath(path);
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.origin + path);
  }, [path]);

  const refreshUserOrders = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!currentToken) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setUserOrders(data.orders || []);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      }
    } catch {
      // offline fallback
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUserOrders();
    }
  }, [token, refreshUserOrders]);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('http')) {
      window.location.assign(to);
      return;
    }
    const [pathname, hash] = to.split('#');
    const nextPath = pathname || '/';
    if (window.location.pathname !== nextPath || hash) {
      window.history.pushState({}, '', to);
      setPath(nextPath);
    }
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }, [prefersReducedMotion]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'key'>, sourceEl?: HTMLElement | null) => {
      const key = item.customBoxDetails
        ? `${item.productId}__${Date.now()}`
        : `${item.productId}__${item.weight}`;

      setCart((prev) => {
        const idx = prev.findIndex((i) => i.key === key);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
          return updated;
        }
        return [...prev, { ...item, key }];
      });

      // Fly-to-cart thumbnail animation
      if (!prefersReducedMotion && sourceEl) {
        const targetBtn =
          (cartIconRef.current && cartIconRef.current.offsetParent !== null
            ? cartIconRef.current
            : mobileCartIconRef.current) ?? null;

        if (targetBtn) {
          const srcRect = sourceEl.getBoundingClientRect();
          const dstRect = targetBtn.getBoundingClientRect();
          const flyId = `${key}_${Math.random().toString(36).slice(2, 7)}`;
          setFlyingItems((prev) => [
            ...prev,
            {
              id: flyId,
              image: item.image,
              startX: srcRect.left + srcRect.width / 2,
              startY: srcRect.top + srcRect.height / 2,
              endX: dstRect.left + dstRect.width / 2,
              endY: dstRect.top + dstRect.height / 2,
            },
          ]);
          window.setTimeout(() => {
            setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
            setCartBadgePulse(true);
            window.setTimeout(() => setCartBadgePulse(false), 400);
          }, 620);
          return;
        }
      }

      setCartBadgePulse(true);
      window.setTimeout(() => setCartBadgePulse(false), 400);
    },
    [prefersReducedMotion]
  );

  const updateQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const setAuthSession = useCallback((newToken: string, newUser: UserProfile, orders: OrderSummary[]) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setUserOrders(orders);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setUserOrders([]);
    showToast('Signed out.');
  }, [showToast]);

  const freeDeliveryThreshold = 499;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <StoreContext.Provider
      value={{
        path,
        navigate,
        cart,
        cartCount,
        subtotal,
        shipping,
        total,
        freeDeliveryThreshold,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        searchQuery,
        setSearchQuery,
        cartIconRef,
        mobileCartIconRef,
        cartBadgePulse,
        flyingItems,
        toast,
        showToast,
        user,
        token,
        userOrders,
        setAuthSession,
        logout,
        refreshUserOrders,
        lastOrderId,
        setLastOrderId,
        prefersReducedMotion,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
