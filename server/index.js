import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fallbackCategories = [
  { name: 'Veg', badge: 'Fresh Picks', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' },
  { name: 'Non-Veg', badge: 'Chef Favorites', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80' },
  { name: 'Chef Specials', badge: 'Signature', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80' },
  { name: 'Juices & Shakes', badge: 'Refreshing', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80' },
  { name: 'Ice Creams', badge: 'Cold Treats', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80' },
  { name: 'Combos', badge: 'Value Meals', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80' },
];

const fallbackProducts = [
  {
    id: 1,
    name: 'Paneer Butter Masala',
    category: 'Veg',
    type: 'veg',
    price: 249,
    rating: 4.9,
    prepTime: '18 min',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    description: 'Rich buttery gravy with soft paneer cubes and a fragrant touch of kasuri methi.',
    badge: 'Best Seller',
    featured: true,
    inventoryCount: 42,
    isBestseller: true,
  },
  {
    id: 2,
    name: 'Veg Biryani Royale',
    category: 'Veg',
    type: 'veg',
    price: 259,
    rating: 4.8,
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    description: 'Aromatic basmati layered with saffron, vegetables, herbs, and roasted cashews.',
    badge: 'Chef Pick',
    featured: true,
    inventoryCount: 36,
    isBestseller: true,
  },
  {
    id: 3,
    name: 'Masala Dosa',
    category: 'Veg',
    type: 'veg',
    price: 139,
    rating: 4.7,
    prepTime: '14 min',
    image: 'https://images.unsplash.com/photo-1661714421901-9aa67f7e0eb4?auto=format&fit=crop&w=900&q=80',
    description: 'Crisp dosa with spiced potato masala and coconut chutney.',
    badge: 'South India',
    inventoryCount: 52,
  },
  {
    id: 4,
    name: 'Paneer Tikka',
    category: 'Veg',
    type: 'veg',
    price: 189,
    rating: 4.8,
    prepTime: '16 min',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    description: 'Char-grilled cottage cheese with smoky spices and mint yogurt dip.',
    badge: 'Smoky',
    inventoryCount: 48,
  },
  {
    id: 5,
    name: 'Chicken Biryani',
    category: 'Non-Veg',
    type: 'non-veg',
    price: 299,
    rating: 4.9,
    prepTime: '22 min',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Tender chicken, saffron rice, and aromatic spices slow-cooked to perfection.',
    badge: 'Hot Pick',
    featured: true,
    isBestseller: true,
    inventoryCount: 34,
  },
  {
    id: 6,
    name: 'Tandoori Chicken',
    category: 'Non-Veg',
    type: 'non-veg',
    price: 329,
    rating: 4.9,
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    description: 'Juicy chicken marinated in yogurt, ginger, garlic, and tandoori masala.',
    badge: 'House Classic',
    featured: true,
    inventoryCount: 28,
  },
  {
    id: 7,
    name: 'Fish Fry',
    category: 'Non-Veg',
    type: 'non-veg',
    price: 319,
    rating: 4.8,
    prepTime: '23 min',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy, golden fish fillets with curry leaves and a hint of coastal spice.',
    badge: 'Coastal',
    inventoryCount: 25,
  },
  {
    id: 8,
    name: 'Chicken Curry',
    category: 'Non-Veg',
    type: 'non-veg',
    price: 279,
    rating: 4.8,
    prepTime: '21 min',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    description: 'Classic chicken curry with tomatoes, onion gravy, coconut, and warm spices.',
    badge: 'Comfort Bowl',
    inventoryCount: 31,
  },
  {
    id: 9,
    name: 'Chef Signature Platter',
    category: 'Chef Specials',
    type: 'special',
    price: 699,
    rating: 5,
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'An indulgent spread with biryani, curries, kebabs, breads, and dessert bites.',
    badge: 'Limited Time',
    featured: true,
    inventoryCount: 15,
  },
  {
    id: 10,
    name: 'Family Feast Combo',
    category: 'Combos',
    type: 'special',
    price: 799,
    rating: 4.9,
    prepTime: '35 min',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
    description: 'A complete meal for four with biryani, kebabs, sides, breads, and dessert.',
    badge: 'Value Box',
    featured: true,
    inventoryCount: 20,
  },
  {
    id: 11,
    name: 'Premium Dinner Box',
    category: 'Combos',
    type: 'special',
    price: 849,
    rating: 4.8,
    prepTime: '35 min',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Biryani, curry, breads, sides, and a sweet finish for a complete evening meal.',
    badge: 'Best Value',
    inventoryCount: 18,
  },
  {
    id: 12,
    name: 'Mango Juice',
    category: 'Juices & Shakes',
    type: 'special',
    price: 119,
    rating: 4.8,
    prepTime: '6 min',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',
    description: 'Fresh Alphonso mango juice squeezed daily and served chilled.',
    badge: 'Seasonal',
    inventoryCount: 40,
  },
  {
    id: 13,
    name: 'Cold Coffee',
    category: 'Juices & Shakes',
    type: 'special',
    price: 169,
    rating: 4.7,
    prepTime: '7 min',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy chilled coffee blended with ice and a hint of chocolate.',
    badge: 'Cafe Style',
    inventoryCount: 37,
  },
  {
    id: 14,
    name: 'Strawberry Milkshake',
    category: 'Juices & Shakes',
    type: 'special',
    price: 159,
    rating: 4.8,
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
    description: 'Velvety strawberry shake layered with cream and vanilla.',
    badge: 'Creamy',
    inventoryCount: 39,
  },
  {
    id: 15,
    name: 'Vanilla Ice Cream',
    category: 'Ice Creams',
    type: 'special',
    price: 129,
    rating: 4.8,
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80',
    description: 'Classic vanilla scoop with rich cream and a delicate caramel finish.',
    badge: 'Classic',
    inventoryCount: 46,
  },
  {
    id: 16,
    name: 'Chocolate Brownie With Ice Cream',
    category: 'Ice Creams',
    type: 'special',
    price: 189,
    rating: 4.9,
    prepTime: '8 min',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    description: 'Warm brownie topped with vanilla ice cream and a smoky chocolate drizzle.',
    badge: 'Sweet Finish',
    featured: true,
    inventoryCount: 32,
  },
  {
    id: 17,
    name: 'Sundae Delight',
    category: 'Ice Creams',
    type: 'special',
    price: 179,
    rating: 4.8,
    prepTime: '7 min',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
    description: 'A decadent sundae with scoops of ice cream, nuts, and chocolate crunch.',
    badge: 'Frozen Treat',
    inventoryCount: 30,
  },
  {
    id: 18,
    name: 'Pineapple Juice',
    category: 'Juices & Shakes',
    type: 'special',
    price: 109,
    rating: 4.7,
    prepTime: '6 min',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80',
    description: 'Fresh pineapple juice with a tangy tropical burst and a chilled finish.',
    badge: 'Tropical',
    inventoryCount: 40,
  },
];

const demoUsers = {
  customer: { name: 'Customer Demo', email: 'customer@spiceandsip.com', role: 'customer' },
  admin: { name: 'Admin Demo', email: 'admin@spiceandsip.com', role: 'admin' },
};

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    return connection;
  } catch (error) {
    console.warn('MongoDB connection failed. Using built-in fallback data.');
    return null;
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Spice & Sip API is running' });
});

app.get('/api/categories', async (req, res) => {
  const connection = await connectDatabase();

  if (connection) {
    try {
      const categories = await connection.connection.collection('categories').find({}).toArray();
      if (categories.length) {
        return res.json(categories);
      }
    } catch (error) {
      console.warn('Category lookup failed. Falling back to built-in menu categories.');
    }
  }

  res.json(fallbackCategories);
});

app.get('/api/products', async (req, res) => {
  const connection = await connectDatabase();

  if (connection) {
    try {
      const products = await connection.connection.collection('products').find({}).toArray();
      if (products.length) {
        return res.json(products);
      }
    } catch (error) {
      console.warn('Product lookup failed. Falling back to built-in menu data.');
    }
  }

  res.json(fallbackProducts);
});

app.post('/api/auth/login', (req, res) => {
  const { email = '', password = '', role = 'customer' } = req.body || {};
  const normalizedEmail = String(email).trim().toLowerCase();
  const expected = demoUsers[role] || demoUsers.customer;

  const validCredentials =
    normalizedEmail === expected.email.toLowerCase() &&
    ((role === 'admin' && password === 'admin123') ||
      (role === 'customer' && password === 'customer123') ||
      password === 'admin123' ||
      password === 'customer123');

  if (!validCredentials) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  return res.json({
    user: { ...expected, email: normalizedEmail },
    token: 'demo-token',
    message: 'Login successful.',
  });
});

app.post('/api/checkout', (req, res) => {
  const { customer, items = [], subtotal = 0, total = 0, fulfillmentMethod = 'delivery' } = req.body || {};

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Cart is empty.' });
  }

  const orderNumber = `SP-${Date.now().toString().slice(-6)}`;
  return res.status(200).json({
    success: true,
    orderNumber,
    message: `${fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery'} order placed successfully for ${customer?.name || 'Guest Customer'}.`,
    total,
    subtotal,
  });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    revenue: 128400,
    orders: 248,
    avgTicket: 518,
    rating: 4.9,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
