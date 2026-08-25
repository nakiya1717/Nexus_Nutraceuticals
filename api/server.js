import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_key_12345';

// Use /tmp for data persistence on Vercel (read-only filesystem bypass)
const DATA_DIR = process.env.VERCEL
  ? '/tmp'
  : path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

app.use(cors());
app.use(express.json());

// Ensure data directory and database files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

// Database helper functions
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

const readOrders = () => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeOrders = (orders) => {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
};

// 1. User Registration Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const emailTrim = email.trim().toLowerCase();
    const users = readUsers();

    // Check if user already exists
    if (users.find(u => u.email === emailTrim)) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: emailTrim,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. User Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter all fields.' });
    }

    const emailTrim = email.trim().toLowerCase();
    const users = readUsers();

    // Check for user
    const user = users.find(u => u.email === emailTrim);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// 3. Send OTP Route (Fast2SMS)
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: 'Mobile number is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SECURE OTP] Generated for +91 ${mobile}: ${otp}`);

    // Fast2SMS API call (Mocked for safety, or you can add real fetch here)
    const fast2smsResponse = {
      return: true,
      request_id: 'MOCK_REQ_ID_' + Date.now(),
      message: [ 'SMS sent successfully.' ]
    };
    
    console.log(`[FAST2SMS] Response:`, fast2smsResponse);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// 4. Create/Save Order Route
app.post('/api/orders', (req, res) => {
  try {
    const { userId, userEmail, name, phone, pincode, address, paymentMethod, items, total, paymentDetails } = req.body;
    
    if (!name || !phone || !pincode || !address || !paymentMethod || !items || !total) {
      return res.status(400).json({ error: 'Missing required order details.' });
    }

    const orders = readOrders();
    const newOrder = {
      id: 'NX-' + Math.floor(100000 + Math.random() * 900000),
      userId: userId || 'guest',
      userEmail: userEmail || '',
      name,
      phone,
      pincode,
      address,
      paymentMethod,
      items,
      total,
      paymentDetails: paymentDetails || null,
      status: paymentMethod === 'COD' ? 'Pending Verification' : 'Payment Awaiting Verification',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeOrders(orders);

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while placing order.' });
  }
});

// 4. Fetch User Orders Route
app.get('/api/orders/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const orders = readOrders();
    const userOrders = orders.filter(o => o.userId === userId);
    res.json({ success: true, orders: userOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching user orders.' });
  }
});

// 5. Mock Policies Route
app.get('/api/policies/:slug/', (req, res) => {
  let slug = req.params.slug;
  try {
    const policies = JSON.parse(fs.readFileSync(path.join(__dirname, 'policies.json'), 'utf8'));
    const policy = policies.find(p => p.slug === slug);
    if (policy) {
      res.json(policy);
    } else {
      res.status(404).json({ error: 'Policy not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching policy' });
  }
});
app.get('/api/policies/:slug', (req, res) => {
  let slug = req.params.slug;
  try {
    const policies = JSON.parse(fs.readFileSync(path.join(__dirname, 'policies.json'), 'utf8'));
    const policy = policies.find(p => p.slug === slug);
    if (policy) {
      res.json(policy);
    } else {
      res.status(404).json({ error: 'Policy not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching policy' });
  }
});

// 6. Mock Settings Route
app.get('/api/website-settings/', (req, res) => {
  res.json({
        "store_name": "Nexus Nutraceuticals",
        "tagline": "Better Health Starts Here",
        "support_email": "support@nexusnutraceuticals.com",
        "support_phone": "+91 99999 99999",
        "shipping_fee": "0.00",
        "free_shipping_threshold": "999.00",
        "gst_rate": "18.00"
  });
});

// Run local listener only when not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Nexus Auth Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
