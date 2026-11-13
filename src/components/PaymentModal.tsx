import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { formatINR } from '../data/catalog';
import type { OrderSummary } from '../context/StoreContext';

export interface PaymentSessionData {
  mode: 'upi_direct' | 'razorpay_sandbox' | 'razorpay_live';
  order: OrderSummary;
  upiUri?: string;
  upiVpa?: string;
}

export function PaymentModal({
  session,
  onClose,
  onSuccess,
  onError,
}: {
  session: PaymentSessionData | null;
  onClose: () => void;
  onSuccess: (confirmedOrder: OrderSummary) => void;
  onError: (msg: string) => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sandbox Razorpay modal state
  const [tab, setTab] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('424');
  const [sandboxUpi, setSandboxUpi] = useState('success@upi');
  const [bank, setBank] = useState('HDFC Bank');

  useEffect(() => {
    if (!session || session.mode !== 'upi_direct' || !session.upiUri) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(session.upiUri, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0A1F17',
        light: '#FFFCF5',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [session]);

  const handleCopyVpa = () => {
    if (!session?.upiVpa) return;
    navigator.clipboard?.writeText(session.upiVpa);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleVerifyUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: session.order.id,
          mode: 'upi_direct',
          utrNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Could not verify UPI reference.');
      } else {
        onSuccess(data.order);
      }
    } catch {
      onError('Network error verifying UPI payment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSandboxPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: session.order.id,
          mode: 'razorpay_sandbox',
          methodDetail: tab === 'card' ? cardNumber.slice(-4) : tab === 'upi' ? sandboxUpi : bank,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Payment authorization failed.');
      } else {
        onSuccess(data.order);
      }
    } catch {
      onError('Network error authorizing payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {session && session.mode !== 'razorpay_live' && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Complete Payment"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-card text-ink rounded-[30px] border border-ink/15 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-ink text-oat px-6 py-5 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-saffron block">
                  {session.mode === 'upi_direct' ? 'Direct UPI Transfer' : 'Test Payment Gateway'}
                </span>
                <h2 className="font-serif text-2xl text-oat mt-0.5">
                  Pay {formatINR(session.order.total)}
                </h2>
                <p className="font-mono text-[11px] text-oat/65 mt-0.5">
                  Order {session.order.id}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close payment window"
                className="w-9 h-9 rounded-full border border-oat/20 flex items-center justify-center text-oat hover:bg-saffron hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {session.mode === 'upi_direct' ? (
              <form onSubmit={handleVerifyUpi} className="p-6 space-y-5">
                <div className="flex flex-col items-center text-center bg-oat rounded-2xl p-4 border border-ink/10">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`UPI QR code for ${formatINR(session.order.total)}`}
                      className="w-44 h-44 rounded-xl border border-ink/10 bg-card p-1.5"
                    />
                  ) : (
                    <div className="w-44 h-44 rounded-xl bg-oat-muted animate-pulse" />
                  )}
                  <p className="text-xs text-ink/75 mt-3">
                    Scan with <strong>GPay, PhonePe, Paytm, or BHIM</strong>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-xs font-bold text-ink bg-card px-3 py-1 rounded-full border border-ink/15">
                      {session.upiVpa}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVpa}
                      className="px-2.5 py-1 rounded-full border border-ink/15 text-xs font-mono hover:bg-saffron/20 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  {session.upiUri && (
                    <a
                      href={session.upiUri}
                      className="sm:hidden mt-3 px-4 py-2 rounded-full bg-ink text-oat font-mono text-[11px] uppercase tracking-wider"
                    >
                      Open UPI App
                    </a>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="upi-utr-input"
                    className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5"
                  >
                    Enter 12-Digit UTR / Transaction Ref *
                  </label>
                  <input
                    id="upi-utr-input"
                    type="text"
                    required
                    minLength={8}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 431982041122"
                    className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm font-mono focus:outline-none focus:border-ink"
                  />
                  <p className="text-[11px] text-ink/60 mt-1">
                    Shown in your UPI app receipt immediately after transfer.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shine w-full py-3.5 rounded-full bg-saffron text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{submitting ? 'Confirming...' : 'Confirm UPI Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSandboxPay} className="p-6 space-y-5">
                <div className="p-3 rounded-xl bg-saffron/15 border border-saffron/40 text-xs text-ink leading-relaxed">
                  <strong>Sandbox Preview:</strong> Add <code className="font-mono">RAZORPAY_KEY_ID</code> &amp; <code className="font-mono">RAZORPAY_KEY_SECRET</code> in Secrets to switch to live Razorpay processing.
                </div>

                <div className="grid grid-cols-3 gap-2 p-1 rounded-full bg-oat border border-ink/10">
                  {(
                    [
                      { id: 'upi', label: 'UPI', icon: Smartphone },
                      { id: 'card', label: 'Card', icon: CreditCard },
                      { id: 'netbanking', label: 'Bank', icon: Building2 },
                    ] as const
                  ).map((t) => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`py-2 px-3 rounded-full font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          active ? 'bg-saffron text-ink' : 'text-ink/65 hover:text-ink'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {tab === 'upi' && (
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      required
                      value={sandboxUpi}
                      onChange={(e) => setSandboxUpi(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm font-mono"
                    />
                  </div>
                )}

                {tab === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1">
                        Test Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm font-mono tabular-nums"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm font-mono tabular-nums"
                      />
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm font-mono tabular-nums"
                      />
                    </div>
                  </div>
                )}

                {tab === 'netbanking' && (
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-almond mb-1.5">
                      Select Bank
                    </label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-oat border border-ink/15 text-sm"
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shine w-full py-3.5 rounded-full bg-ink text-oat hover:bg-saffron hover:text-ink font-mono text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Authorizing...' : `Authorize ${formatINR(session.order.total)}`}</span>
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink/55">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-bit encrypted checkout simulation</span>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
