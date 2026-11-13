import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'nutstrid-db.json');

interface OrderItemRecord {
  productId: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  customBoxDetails?: string[];
}

interface OrderRecord {
  id: string;
  userId?: string | null;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  paymentMethod: 'RAZORPAY' | 'UPI' | 'COD';
  paymentStatus: 'paid' | 'pending_verification' | 'cod_pending' | 'pending';
  paymentId?: string;
  razorpayOrderId?: string;
  utrNumber?: string;
  items: OrderItemRecord[];
  subtotal: number;
  shipping: number;
  total: number;
  status:
    | 'Awaiting Payment'
    | 'Confirmed — Packing in Jaipur'
    | 'Vacuum Sealed & Dispatched'
    | 'In Transit'
    | 'Delivered';
  createdAt: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

interface SessionRecord {
  token: string;
  userId: string;
  createdAt: string;
}

interface QuoteRecord {
  id: string;
  name: string;
  phone: string;
  occasion: string;
  quantity: string;
  notes: string;
  createdAt: string;
}

interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface DatabaseSchema {
  orders: OrderRecord[];
  users: UserRecord[];
  sessions: SessionRecord[];
  quotes: QuoteRecord[];
  newsletter: { email: string; createdAt: string }[];
  contacts: ContactRecord[];
}

function createSeedDatabase(): DatabaseSchema {
  return {
    orders: [
      {
        id: 'NS-JPR-1042',
        userId: null,
        customerName: 'Anjali Mehta',
        phone: '9829012345',
        address: '42, Bapu Nagar, Near Central Park, Jaipur',
        pincode: '302015',
        paymentMethod: 'UPI',
        paymentStatus: 'paid',
        paymentId: 'UTR431982041122',
        items: [
          {
            productId: 'prod-cal-almonds',
            name: 'California Almonds',
            weight: '500 g',
            price: 649,
            quantity: 1,
          },
          {
            productId: 'prod-everyday-trail-mix',
            name: 'Everyday Trail Mix',
            weight: '250 g',
            price: 349,
            quantity: 1,
          },
        ],
        subtotal: 998,
        shipping: 0,
        total: 998,
        status: 'Vacuum Sealed & Dispatched',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ],
    users: [],
    sessions: [],
    quotes: [],
    newsletter: [],
    contacts: [],
  };
}

function readDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
}

function writeDb(db: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

function getAuthUser(req: express.Request, db: DatabaseSchema): UserRecord | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) ?? null;
}

function sanitizeOrderItems(items: unknown): OrderItemRecord[] {
  if (!Array.isArray(items)) return [];
  return items.map((raw) => {
    const item = raw as OrderItemRecord;
    return {
      productId: String(item.productId || 'custom'),
      name: String(item.name || 'NutStrid Pack'),
      weight: String(item.weight || '250 g'),
      price: Math.max(0, Number(item.price) || 0),
      quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
      customBoxDetails: Array.isArray(item.customBoxDetails)
        ? item.customBoxDetails.map(String)
        : undefined,
    };
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, city: 'Jaipur' });
  });

  // Payment gateway capabilities (never exposes secrets)
  app.get('/api/payments/config', (_req, res) => {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const razorpayEnabled = Boolean(keyId && keySecret);
    const upiVpa = process.env.NUTSTRID_UPI_VPA || 'nutstrid@okaxis';

    res.json({
      razorpayEnabled,
      razorpayKeyId: razorpayEnabled ? keyId : null,
      upiVpa,
      merchantName: 'NutStrid Jaipur',
      currency: 'INR',
    });
  });

  // Step 1 of Checkout: Create order & initiate payment session
  app.post('/api/payments/create-order', async (req, res) => {
    const { customerName, phone, address, pincode, paymentMethod, items } = req.body ?? {};

    if (
      typeof customerName !== 'string' ||
      customerName.trim().length < 2 ||
      typeof phone !== 'string' ||
      normalizePhone(phone).length < 10 ||
      typeof address !== 'string' ||
      address.trim().length < 6 ||
      typeof pincode !== 'string' ||
      !/^\d{6}$/.test(pincode.trim()) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        error: 'Please fill in a valid name, 10-digit phone, full address, and 6-digit pincode.',
      });
      return;
    }

    const db = readDb();
    const user = getAuthUser(req, db);
    const sanitizedItems = sanitizeOrderItems(items);
    const subtotal = sanitizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal + shipping;
    const orderNum = 1043 + db.orders.length;
    const method: 'RAZORPAY' | 'UPI' | 'COD' =
      paymentMethod === 'COD' ? 'COD' : paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'UPI';

    const newOrder: OrderRecord = {
      id: `NS-JPR-${orderNum}`,
      userId: user ? user.id : null,
      customerName: customerName.trim(),
      phone: normalizePhone(phone),
      address: address.trim(),
      pincode: pincode.trim(),
      paymentMethod: method,
      paymentStatus: method === 'COD' ? 'cod_pending' : 'pending',
      items: sanitizedItems,
      subtotal,
      shipping,
      total,
      status: method === 'COD' ? 'Confirmed — Packing in Jaipur' : 'Awaiting Payment',
      createdAt: new Date().toISOString(),
    };

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const upiVpa = process.env.NUTSTRID_UPI_VPA || 'nutstrid@okaxis';

    if (method === 'RAZORPAY' && keyId && keySecret) {
      try {
        const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify({
            amount: total * 100,
            currency: 'INR',
            receipt: newOrder.id,
            notes: {
              customerName: newOrder.customerName,
              phone: newOrder.phone,
            },
          }),
        });

        if (rzpRes.ok) {
          const rzpOrder = (await rzpRes.json()) as { id: string; amount: number; currency: string };
          newOrder.razorpayOrderId = rzpOrder.id;
          db.orders.unshift(newOrder);
          writeDb(db);
          res.status(201).json({
            mode: 'razorpay_live',
            keyId,
            razorpayOrder: rzpOrder,
            order: newOrder,
          });
          return;
        }
      } catch {
        // Fall through cleanly to sandbox if network error
      }
    }

    db.orders.unshift(newOrder);
    writeDb(db);

    if (method === 'COD') {
      res.status(201).json({
        mode: 'cod',
        order: newOrder,
      });
      return;
    }

    if (method === 'UPI') {
      const upiUri = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(
        'NutStrid Jaipur'
      )}&tr=${encodeURIComponent(newOrder.id)}&tn=${encodeURIComponent(
        `NutStrid ${newOrder.id}`
      )}&am=${total.toFixed(2)}&cu=INR`;

      res.status(201).json({
        mode: 'upi_direct',
        upiVpa,
        upiUri,
        order: newOrder,
      });
      return;
    }

    // Razorpay Sandbox fallback when merchant keys are not set in environment secrets
    res.status(201).json({
      mode: 'razorpay_sandbox',
      order: newOrder,
    });
  });

  // Step 2 of Checkout: Verify & finalize payment
  app.post('/api/payments/verify', (req, res) => {
    const {
      orderId,
      mode,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      utrNumber,
    } = req.body ?? {};

    if (typeof orderId !== 'string' || !orderId.trim()) {
      res.status(400).json({ error: 'Missing order ID.' });
      return;
    }

    const db = readDb();
    const idx = db.orders.findIndex((o) => o.id === orderId.trim());
    if (idx === -1) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    const order = db.orders[idx];

    if (mode === 'razorpay_live') {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
      if (!keySecret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        res.status(400).json({ error: 'Incomplete Razorpay payment verification payload.' });
        return;
      }
      const expected = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const sigBuf = Buffer.from(String(razorpay_signature), 'utf8');
      const expBuf = Buffer.from(expected, 'utf8');
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        res.status(400).json({ error: 'Payment signature mismatch. Verification failed.' });
        return;
      }

      order.paymentStatus = 'paid';
      order.paymentId = String(razorpay_payment_id);
      order.status = 'Confirmed — Packing in Jaipur';
    } else if (mode === 'upi_direct') {
      const cleanUtr = String(utrNumber || '').replace(/[^a-zA-Z0-9]/g, '').trim();
      if (cleanUtr.length < 8) {
        res.status(400).json({ error: 'Please enter a valid 12-digit UPI UTR / Transaction Reference ID.' });
        return;
      }
      order.paymentStatus = 'pending_verification';
      order.utrNumber = cleanUtr;
      order.paymentId = cleanUtr;
      order.status = 'Confirmed — Packing in Jaipur';
    } else {
      // razorpay_sandbox
      order.paymentStatus = 'paid';
      order.paymentId = `pay_test_${crypto.randomBytes(5).toString('hex')}`;
      order.status = 'Confirmed — Packing in Jaipur';
    }

    db.orders[idx] = order;
    writeDb(db);
    res.json({ verified: true, order });
  });

  // Backwards-compatible direct order creation endpoint
  app.post('/api/orders', (req, res) => {
    const { customerName, phone, address, pincode, paymentMethod, items } = req.body ?? {};

    if (
      typeof customerName !== 'string' ||
      customerName.trim().length < 2 ||
      typeof phone !== 'string' ||
      normalizePhone(phone).length < 10 ||
      typeof address !== 'string' ||
      address.trim().length < 6 ||
      typeof pincode !== 'string' ||
      !/^\d{6}$/.test(pincode.trim()) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({ error: 'Please fill in a valid name, 10-digit phone, full address, and 6-digit pincode.' });
      return;
    }

    const db = readDb();
    const user = getAuthUser(req, db);
    const sanitizedItems = sanitizeOrderItems(items);
    const subtotal = sanitizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal + shipping;
    const orderNum = 1043 + db.orders.length;

    const method: 'RAZORPAY' | 'UPI' | 'COD' = paymentMethod === 'COD' ? 'COD' : 'UPI';

    const newOrder: OrderRecord = {
      id: `NS-JPR-${orderNum}`,
      userId: user ? user.id : null,
      customerName: customerName.trim(),
      phone: normalizePhone(phone),
      address: address.trim(),
      pincode: pincode.trim(),
      paymentMethod: method,
      paymentStatus: method === 'COD' ? 'cod_pending' : 'paid',
      items: sanitizedItems,
      subtotal,
      shipping,
      total,
      status: 'Confirmed — Packing in Jaipur',
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    writeDb(db);

    res.status(201).json({ order: newOrder });
  });

  app.get('/api/orders/track', (req, res) => {
    const orderId = String(req.query.orderId ?? '').trim().toUpperCase();
    const phone = normalizePhone(String(req.query.phone ?? ''));

    if (!orderId || phone.length < 10) {
      res.status(400).json({ error: 'Enter both your Order ID (e.g. NS-JPR-1042) and 10-digit phone number.' });
      return;
    }

    const db = readDb();
    const found = db.orders.find(
      (o) => o.id.toUpperCase() === orderId && normalizePhone(o.phone) === phone
    );

    if (!found) {
      res.status(404).json({ error: 'No matching order found. Check your Order ID and phone number.' });
      return;
    }

    res.json({ order: found });
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, phone, password } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      typeof email !== 'string' ||
      !email.includes('@') ||
      typeof phone !== 'string' ||
      normalizePhone(phone).length < 10 ||
      typeof password !== 'string' ||
      password.length < 6
    ) {
      res.status(400).json({ error: 'Enter name, valid email, 10-digit phone, and password (min 6 chars).' });
      return;
    }

    const db = readDb();
    const lowerEmail = email.trim().toLowerCase();
    if (db.users.some((u) => u.email === lowerEmail)) {
      res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const user: UserRecord = {
      id: `usr_${crypto.randomUUID()}`,
      name: name.trim(),
      email: lowerEmail,
      phone: normalizePhone(phone),
      passwordHash: hashPassword(password, salt),
      salt,
      createdAt: new Date().toISOString(),
    };

    const token = crypto.randomBytes(32).toString('hex');
    db.users.push(user);
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    writeDb(db);

    const orders = db.orders.filter((o) => o.userId === user.id || o.phone === user.phone);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      orders,
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const db = readDb();
    const user = db.users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || hashPassword(password, user.salt) !== user.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    writeDb(db);

    const orders = db.orders.filter((o) => o.userId === user.id || o.phone === user.phone);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      orders,
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const db = readDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(401).json({ error: 'Not signed in.' });
      return;
    }
    const orders = db.orders.filter((o) => o.userId === user.id || o.phone === user.phone);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      orders,
    });
  });

  app.post('/api/quotes', (req, res) => {
    const { name, phone, occasion, quantity, notes } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || typeof phone !== 'string' || normalizePhone(phone).length < 10) {
      res.status(400).json({ error: 'Please include your name and a 10-digit phone number.' });
      return;
    }
    const db = readDb();
    const quote: QuoteRecord = {
      id: `QT-${100 + db.quotes.length}`,
      name: name.trim(),
      phone: normalizePhone(phone),
      occasion: String(occasion || 'Corporate / Festive'),
      quantity: String(quantity || '25 boxes'),
      notes: String(notes || '').trim(),
      createdAt: new Date().toISOString(),
    };
    db.quotes.unshift(quote);
    writeDb(db);
    res.status(201).json({ quote });
  });

  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body ?? {};
    if (typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    const db = readDb();
    const normalized = email.trim().toLowerCase();
    if (!db.newsletter.some((n) => n.email === normalized)) {
      db.newsletter.push({ email: normalized, createdAt: new Date().toISOString() });
      writeDb(db);
    }
    res.status(201).json({ subscribed: true, email: normalized });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Please include your name and message.' });
      return;
    }
    const db = readDb();
    const record: ContactRecord = {
      id: `MSG-${100 + db.contacts.length}`,
      name: name.trim(),
      email: String(email || '').trim(),
      phone: String(phone || '').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    db.contacts.unshift(record);
    writeDb(db);
    res.status(201).json({ ticketId: record.id });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NutStrid server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
