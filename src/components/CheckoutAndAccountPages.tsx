import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Package,
  Plus,
  Minus,
  Trash2,
  Truck,
  MapPin,
  LogOut,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import { useStore, type OrderSummary } from '../context/StoreContext';
import { FAQS, formatINR, getImageUrl } from '../data/catalog';
import { ImageWithFallback } from './NutSvgAssets';

export function CartPage() {
  const {
    cart,
    updateQty,
    removeItem,
    subtotal,
    shipping,
    total,
    freeDeliveryThreshold,
    navigate,
  } = useStore();

  const remaining = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <main className="py-12 sm:py-16 max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[65vh]">
      <h1 className="font-serif text-4xl sm:text-5xl text-ink mb-2">Your Cart</h1>
      <p className="text-sm text-ink/70 mb-8">
        Each weight pack stays separate so it can be weighed and sealed fresh in Jaipur.
      </p>

      {cart.length === 0 ? (
        <div className="rounded-[28px] bg-card border border-ink/10 p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-almond mx-auto mb-3" />
          <h2 className="font-serif text-2xl text-ink mb-2">Your cart is empty.</h2>
          <p className="text-sm text-ink/70 mb-6">Add nuts, dates, or a custom Jaipur gift box.</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="btn-shine px-7 py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Shop Packs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[24px] bg-card border border-ink/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-oat-muted"
                  />
                  <div>
                    <h3 className="font-serif text-xl text-ink">{item.name}</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-almond mt-0.5">
                      {item.weight} · {formatINR(item.price)} each
                    </p>
                    {item.customBoxDetails && (
                      <ul className="mt-1.5 text-xs text-ink/70 space-y-0.5">
                        {item.customBoxDetails.map((d, i) => (
                          <li key={i}>· {d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="inline-flex items-center rounded-full border border-ink/15 bg-oat">
                    <button
                      type="button"
                      onClick={() => updateQty(item.key, -1)}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.key, 1)}
                      aria-label="Increase quantity"
                      className="w-9 h-9 flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-mono text-base font-bold tabular-nums text-ink min-w-[72px] text-right">
                    {formatINR(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name}`}
                    className="text-ink/45 hover:text-rose p-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 rounded-[28px] bg-card border border-ink/10 p-6 space-y-5">
            <div className="p-3.5 rounded-2xl bg-oat text-xs flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-almond shrink-0" />
              <span>
                {remaining === 0
                  ? 'Unlocked: Free pan-India delivery'
                  : `Add ${formatINR(remaining)} more for free delivery`}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink/75">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/75">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? 'FREE' : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-ink pt-3 border-t border-ink/10">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="btn-shine w-full py-4 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export function CheckoutPage() {
  const {
    cart,
    subtotal,
    shipping,
    total,
    clearCart,
    navigate,
    showToast,
    token,
    user,
    setLastOrderId,
    refreshUserOrders,
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerName,
          phone,
          address,
          pincode,
          paymentMethod,
          items: cart.map((c) => ({
            productId: c.productId,
            name: c.name,
            weight: c.weight,
            price: c.price,
            quantity: c.quantity,
            customBoxDetails: c.customBoxDetails,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Please check your delivery details.');
      } else {
        setConfirmedOrder(data.order);
        setLastOrderId(data.order.id);
        clearCart();
        refreshUserOrders();
        showToast(`Order ${data.order.id} confirmed.`);
      }
    } catch {
      showToast('Network error placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <main className="py-12 sm:py-20 max-w-[720px] mx-auto px-4 sm:px-6">
        <div className="rounded-[32px] bg-card border-2 border-pistachio p-8 sm:p-10 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-ink">
            <CheckCircle2 className="w-8 h-8 text-almond shrink-0" />
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-almond block">
                Confirmed · Jaipur Packing Queue
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink">
                Order {confirmedOrder.id}
              </h1>
            </div>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed">
            Thank you, {confirmedOrder.customerName}. Your pouches are queued for fresh weighing and vacuum sealing in Jaipur.
          </p>

          <div className="p-5 rounded-2xl bg-oat border border-ink/10 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/70">Payment Method</span>
              <span className="font-mono font-bold">{confirmedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/70">Delivering To</span>
              <span className="text-right max-w-xs">{confirmedOrder.address}, {confirmedOrder.pincode}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-ink/10 font-semibold">
              <span>Total Paid / Payable</span>
              <span className="font-mono tabular-nums">{formatINR(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="btn-shine px-6 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Track Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-6 py-3 rounded-full border border-ink/20 text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 sm:py-16 max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl sm:text-5xl text-ink mb-2">Checkout</h1>
      <p className="text-sm text-ink/70 mb-8">
        Jaipur orders placed before 2 pm dispatch same day. Free delivery at ₹499+.
      </p>

      {cart.length === 0 ? (
        <div className="p-10 rounded-[28px] bg-card border border-ink/10 text-center">
          <p className="font-serif text-2xl mb-4">No items in cart yet.</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-6 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-card rounded-[28px] border border-ink/10 p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl text-ink">Delivery Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Anjali Mehta"
                  className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                  10-Digit Mobile *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9829012345"
                  className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                House / Flat / Street Address *
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="42, Bapu Nagar, Near Central Park, Jaipur"
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
              />
            </div>

            <div className="max-w-xs">
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                6-Digit Pincode *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                pattern="\d{6}"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="302001"
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm font-mono tabular-nums focus:outline-none focus:border-ink"
              />
            </div>

            <div className="pt-2">
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-2.5">
                Payment Method
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', sub: 'Instant payment' },
                    { id: 'COD', label: 'Cash on Delivery', sub: 'Pay at doorstep' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-saffron/20 border-saffron shadow-xs'
                        : 'bg-oat border-ink/15 hover:border-ink'
                    }`}
                  >
                    <p className="font-semibold text-sm text-ink">{m.label}</p>
                    <p className="text-xs text-ink/65 mt-0.5">{m.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-card rounded-[28px] border border-ink/10 p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl text-ink">Order Summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.key} className="flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">
                      {item.quantity} × {item.name}
                    </p>
                    <p className="font-mono text-[11px] text-almond">{item.weight}</p>
                  </div>
                  <span className="font-mono tabular-nums font-semibold">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm pt-4 border-t border-ink/10">
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
              <div className="flex justify-between text-lg font-bold text-ink pt-2 border-t border-ink/10">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-shine w-full py-4 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{submitting ? 'Confirming...' : `Place Order · ${formatINR(total)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

export function TrackOrderPage() {
  const { lastOrderId, showToast } = useStore();
  const [orderId, setOrderId] = useState(lastOrderId || 'NS-JPR-1042');
  const [phone, setPhone] = useState(lastOrderId ? '' : '9829012345');
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setOrder(null);
        showToast(data.error || 'Order not found.');
      } else {
        setOrder(data.order);
      }
    } catch {
      showToast('Could not reach tracking server.');
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    'Confirmed — Packing in Jaipur',
    'Vacuum Sealed & Dispatched',
    'In Transit',
    'Delivered',
  ];
  const currentStageIdx = order ? Math.max(0, stages.indexOf(order.status)) : 0;

  return (
    <main className="py-12 sm:py-16 max-w-[780px] mx-auto px-4 sm:px-6 min-h-[65vh]">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-2">
        Order Status
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-ink mb-3">Track your order</h1>
      <p className="text-sm text-ink/75 mb-8">
        Enter your Order ID (sample prefilled: <span className="font-mono font-bold">NS-JPR-1042</span> / <span className="font-mono font-bold">9829012345</span>) and phone number.
      </p>

      <form
        onSubmit={handleTrack}
        className="bg-card rounded-[28px] border border-ink/10 p-6 sm:p-8 flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID (e.g. NS-JPR-1042)"
          className="flex-1 px-4 py-3 rounded-full bg-oat border border-ink/15 text-sm font-mono uppercase focus:outline-none focus:border-ink"
        />
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit phone"
          className="flex-1 px-4 py-3 rounded-full bg-oat border border-ink/15 text-sm font-mono focus:outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-shine px-7 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] cursor-pointer shrink-0"
        >
          {loading ? 'Checking...' : 'Track'}
        </button>
      </form>

      {order && (
        <div className="bg-card rounded-[28px] border border-ink/10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-ink/10">
            <div>
              <span className="font-mono text-xs text-almond block">{order.id}</span>
              <h2 className="font-serif text-2xl text-ink">{order.status}</h2>
            </div>
            <span className="font-mono text-lg font-bold tabular-nums">{formatINR(order.total)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {stages.map((st, idx) => {
              const done = idx <= currentStageIdx;
              return (
                <div
                  key={st}
                  className={`p-3.5 rounded-2xl border text-xs ${
                    done ? 'bg-pistachio/30 border-ink/20 text-ink font-semibold' : 'bg-oat/60 border-ink/8 text-ink/50'
                  }`}
                >
                  <span className="font-mono text-[10px] block mb-1">0{idx + 1}</span>
                  <span>{st}</span>
                </div>
              );
            })}
          </div>

          <div className="text-sm space-y-1.5 pt-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-almond">Items</p>
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {it.quantity} × {it.name} ({it.weight})
                </span>
                <span className="font-mono tabular-nums">{formatINR(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export function AccountPage() {
  const { user, userOrders, setAuthSession, logout, showToast, navigate } = useStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'login' ? { email, password } : { name, email, phone, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Authentication failed.');
      } else {
        setAuthSession(data.token, data.user, data.orders || []);
        showToast(`Welcome, ${data.user.name}.`);
      }
    } catch {
      showToast('Network error connecting to account server.');
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <main className="py-12 sm:py-16 max-w-[1000px] mx-auto px-4 sm:px-6 min-h-[65vh] space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-ink/10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block mb-1">
              Customer Account
            </span>
            <h1 className="font-serif text-4xl text-ink">{user.name}</h1>
            <p className="text-sm text-ink/70 mt-1">
              {user.email} · {user.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 rounded-full border border-ink/20 hover:border-ink font-mono text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-ink mb-4">Order History</h2>
          {userOrders.length === 0 ? (
            <div className="p-8 rounded-[24px] bg-card border border-ink/10 text-center">
              <p className="text-sm text-ink/75 mb-4">No orders placed under this account yet.</p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-6 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
              >
                Explore Packs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-[24px] bg-card border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-almond">{ord.id}</span>
                    <h3 className="font-serif text-xl text-ink">{ord.status}</h3>
                    <p className="text-xs text-ink/70 mt-1">
                      {ord.items.map((i) => `${i.quantity}× ${i.name} (${i.weight})`).join(', ')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-lg font-bold tabular-nums block">
                      {formatINR(ord.total)}
                    </span>
                    <span className="font-mono text-[11px] text-ink/60">{ord.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 sm:py-20 max-w-[520px] mx-auto px-4 sm:px-6 min-h-[65vh]">
      <div className="bg-card rounded-[32px] border border-ink/10 p-7 sm:p-9 shadow-sm">
        <div className="flex gap-2 p-1 rounded-full bg-oat border border-ink/10 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-saffron text-ink' : 'text-ink/70'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
              mode === 'signup' ? 'bg-saffron text-ink' : 'text-ink/70'
            }`}
          >
            Create Account
          </button>
        </div>

        <h1 className="font-serif text-3xl text-ink mb-2">
          {mode === 'login' ? 'Welcome back' : 'Join NutStrid Jaipur'}
        </h1>
        <p className="text-sm text-ink/70 mb-6">
          {mode === 'login'
            ? 'Sign in to check past orders and reorder your staple packs.'
            : 'Save your address and keep track of every Jaipur dispatch.'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1">
                  10-Digit Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1">
              Password (min 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn-shine w-full py-3.5 rounded-full bg-ink text-oat hover:bg-saffron hover:text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer"
          >
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
}

export function InfoPage({ page }: { page: 'about' | 'contact' | 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms' }) {
  const { showToast, navigate } = useStore();
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cMsg, setCMsg] = useState('');
  const [ticket, setTicket] = useState<string | null>(null);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cName, email: cEmail, phone: cPhone, message: cMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticketId);
        setCName('');
        setCEmail('');
        setCPhone('');
        setCMsg('');
        showToast('Message received by our Jaipur team.');
      }
    } catch {
      showToast('Could not send message right now.');
    }
  };

  if (page === 'about') {
    return (
      <main className="py-12 sm:py-16 max-w-[1100px] mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-almond block">
              Jaipur, Rajasthan
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              Packed on order, never sitting open on a shelf.
            </h1>
            <p className="text-base text-ink/80 leading-relaxed">
              NutStrid packs premium dry fruits in Jaipur for families, offices, and gift boxes across India. We sort named varieties in small batches, weigh every pouch when your order lands, vacuum seal the freshness in, and dispatch Jaipur orders before 2 pm the very same day.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="btn-shine px-7 py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Fresh Packs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-[28px] overflow-hidden border border-ink/10">
              <ImageWithFallback
                src={getImageUrl('jaipurPackingTable')}
                alt="NutStrid Jaipur packing table"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (page === 'contact') {
    return (
      <main className="py-12 sm:py-16 max-w-[1000px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-4xl sm:text-5xl text-ink mb-3">Contact NutStrid</h1>
        <p className="text-sm text-ink/75 mb-8">
          Questions about a pack, Jaipur same-day dispatch, or custom hampers? Write to us or reach us on WhatsApp.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 bg-ink text-oat rounded-[28px] p-7 space-y-5">
            <h2 className="font-serif text-2xl text-saffron">Jaipur Desk</h2>
            <p className="text-sm text-oat/80">Phone / WhatsApp: +91 80004 12189</p>
            <p className="text-sm text-oat/80">Email: hello@nutstrid.shop</p>
            <p className="text-sm text-oat/80 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
              <span>Jaipur, Rajasthan 302001</span>
            </p>
          </div>

          <form
            onSubmit={handleContact}
            className="md:col-span-7 bg-card rounded-[28px] border border-ink/10 p-7 space-y-4"
          >
            {ticket && (
              <div className="p-3.5 rounded-2xl bg-pistachio/35 text-sm text-ink">
                Received! Reference ID: <strong>{ticket}</strong>
              </div>
            )}
            <input
              type="text"
              required
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm"
              />
              <input
                type="tel"
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm"
              />
            </div>
            <textarea
              rows={4}
              required
              value={cMsg}
              onChange={(e) => setCMsg(e.target.value)}
              placeholder="How can we help?"
              className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm"
            />
            <button
              type="submit"
              className="btn-shine px-7 py-3 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (page === 'faq') {
    return (
      <main className="py-12 sm:py-16 max-w-[840px] mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="font-serif text-4xl sm:text-5xl text-ink">Questions, answered</h1>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.id} className="p-6 rounded-[24px] bg-card border border-ink/10">
              <h2 className="font-serif text-2xl text-ink mb-2">{f.question}</h2>
              <p className="text-sm sm:text-base text-ink/75 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  const copyMap = {
    shipping: {
      title: 'Shipping Policy',
      paragraphs: [
        'Jaipur orders placed before 2:00 pm IST are weighed, vacuum sealed, and dispatched the very same day.',
        'Orders across India ship within 24 hours and typically deliver in 2 to 5 business days.',
        'Delivery is free on orders ₹499 and above. Orders below ₹499 carry a flat ₹49 shipping fee.',
      ],
    },
    returns: {
      title: 'Returns & Replacements',
      paragraphs: [
        'Because dry fruits are edible perishables packed to order, we do not accept open-pouch returns for change of mind.',
        'If a pouch arrives with a broken vacuum seal, moisture ingress, or transit damage, message us on WhatsApp (+91 80004 12189) within 48 hours of delivery with a quick photo. We will send a fresh replacement or full refund.',
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      paragraphs: [
        'We collect only the name, phone number, delivery address, and optional email needed to pack and deliver your NutStrid order.',
        'We do not sell or rent customer phone numbers or addresses to third-party marketers.',
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      paragraphs: [
        'All NutStrid weights (250 g, 500 g, 1 kg) represent net product weight packed fresh in Jaipur.',
        'Prices include applicable GST. Corporate and bulk hamper quotes remain valid for 7 days from issue.',
      ],
    },
  };

  const doc = copyMap[page];

  return (
    <main className="py-12 sm:py-16 max-w-[820px] mx-auto px-4 sm:px-6 min-h-[60vh] space-y-6">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-almond">
        <ShieldCheck className="w-4 h-4" />
        <span>NutStrid Jaipur Policy</span>
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl text-ink">{doc.title}</h1>
      <div className="bg-card rounded-[28px] border border-ink/10 p-7 sm:p-9 space-y-4">
        {doc.paragraphs.map((p, idx) => (
          <p key={idx} className="text-base text-ink/80 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </main>
  );
}
