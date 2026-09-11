import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fallbackProducts = [
  {
    id: 1,
    name: 'Paneer Tikka Bowl',
    category: 'Veg Starters',
    type: 'veg',
    price: 189,
    rating: 4.8,
    prepTime: '15 min',
    image:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    description: 'Cottage cheese cubes marinated in smoky spices served with mint dip.',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Veg Biryani Royale',
    category: 'Main Course',
    type: 'veg',
    price: 249,
    rating: 4.9,
    prepTime: '20 min',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
    description: 'Aromatic basmati rice layered with herbs, vegetables and saffron.',
    badge: 'Chef Special',
  },
  {
    id: 3,
    name: 'Butter Masala Pasta',
    category: 'Italian Twist',
    type: 'veg',
    price: 229,
    rating: 4.7,
    prepTime: '18 min',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy tomato sauce, roasted garlic and fresh basil over pasta.',
    badge: 'Comfort Food',
  },
  {
    id: 4,
    name: 'Chicken Tandoori Platter',
    category: 'Non-Veg Starters',
    type: 'nonveg',
    price: 299,
    rating: 4.9,
    prepTime: '25 min',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    description: 'Juicy chicken marinated in yogurt, spices and fire-grilled to perfection.',
    badge: 'Hot Pick',
  },
  {
    id: 5,
    name: 'Kerala Fish Curry',
    category: 'Seafood',
    type: 'nonveg',
    price: 319,
    rating: 4.8,
    prepTime: '22 min',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    description: 'Fresh coastal fish simmered in coconut gravy with curry leaves.',
    badge: 'Coastal Taste',
  },
  {
    id: 6,
    name: 'Mutton Rogan Josh',
    category: 'Non-Veg Main',
    type: 'nonveg',
    price: 349,
    rating: 4.9,
    prepTime: '30 min',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Slow-cooked mutton in a rich Kashmiri spice gravy with tender texture.',
    badge: 'Premium',
  },
  {
    id: 7,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    type: 'dessert',
    price: 149,
    rating: 4.8,
    prepTime: '12 min',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    description: 'Molten chocolate center with creamy vanilla bean cream.',
    badge: 'Sweet Finish',
  },
  {
    id: 8,
    name: 'Vanilla Ice Cream Sundae',
    category: 'Desserts',
    type: 'dessert',
    price: 129,
    rating: 4.7,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80',
    description: 'Classic vanilla gelato topped with crunchy nuts and chocolate drizzle.',
    badge: 'Cool Treat',
  },
  {
    id: 9,
    name: 'Truffle Mushroom Crostini',
    category: 'Veg Starters',
    type: 'veg',
    price: 219,
    rating: 4.8,
    prepTime: '16 min',
    image:
      'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80',
    description: 'Garlic mushrooms, whipped ricotta and truffle oil on toasted sourdough.',
    badge: 'New',
  },
  {
    id: 10,
    name: 'Malai Kofta Royale',
    category: 'Main Course',
    type: 'veg',
    price: 279,
    rating: 4.9,
    prepTime: '24 min',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    description: 'Silken potato-paneer dumplings finished in a fragrant cashew tomato sauce.',
    badge: 'Signature',
  },
  {
    id: 11,
    name: 'Pesto Paneer Pizza',
    category: 'Italian Twist',
    type: 'veg',
    price: 289,
    rating: 4.8,
    prepTime: '22 min',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    description: 'Charred paneer, basil pesto, roasted peppers and mozzarella on a crisp crust.',
    badge: 'Italian Twist',
  },
  {
    id: 12,
    name: 'Pepper Garlic Prawns',
    category: 'Seafood',
    type: 'nonveg',
    price: 379,
    rating: 4.9,
    prepTime: '20 min',
    image:
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80',
    description: 'Wok-tossed prawns with cracked pepper, garlic, lime and fresh herbs.',
    badge: 'Ocean Fresh',
  },
  {
    id: 13,
    name: 'Coastal Fish & Chips',
    category: 'Seafood',
    type: 'nonveg',
    price: 339,
    rating: 4.7,
    prepTime: '25 min',
    image:
      'https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy beer-battered fish, golden fries and a bright tartar dip.',
    badge: 'Weekend Pick',
  },
  {
    id: 14,
    name: 'Smoked Chicken Alfredo',
    category: 'Italian Twist',
    type: 'nonveg',
    price: 319,
    rating: 4.8,
    prepTime: '21 min',
    image:
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy parmesan pasta with smoked chicken, herbs and roasted garlic.',
    badge: 'Chef Special',
  },
  {
    id: 15,
    name: 'Saffron Rasmalai',
    category: 'Desserts',
    type: 'dessert',
    price: 159,
    rating: 4.9,
    prepTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80',
    description: 'Soft cottage-cheese dumplings soaked in saffron-cardamom milk.',
    badge: 'Indian Classic',
  },
  {
    id: 16,
    name: 'Pistachio Tiramisu',
    category: 'Desserts',
    type: 'dessert',
    price: 199,
    rating: 4.8,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80',
    description: 'Italian mascarpone, espresso-soaked sponge and a toasted pistachio finish.',
    badge: 'Premium Dessert',
  },
  {
    id: 17,
    name: 'Gulab Jamun Cheesecake',
    category: 'Desserts',
    type: 'dessert',
    price: 189,
    rating: 4.9,
    prepTime: '12 min',
    image:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy baked cheesecake layered with cardamom and warm gulab jamun.',
    badge: 'New Favourite',
  },
  {
    id: 18,
    name: 'Mango Tres Leches',
    category: 'Desserts',
    type: 'dessert',
    price: 179,
    rating: 4.8,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    description: 'Soft milk cake soaked with mango, vanilla cream and toasted coconut.',
    badge: 'Seasonal',
  },
  {
    id: 19,
    name: 'Lotus Biscoff Jar',
    category: 'Desserts',
    type: 'dessert',
    price: 169,
    rating: 4.7,
    prepTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=80',
    description: 'Biscoff crumble, silky cream cheese mousse and caramel in every spoonful.',
    badge: 'Trending',
  },
  {
    id: 20,
    name: 'Berry Pavlova',
    category: 'Desserts',
    type: 'dessert',
    price: 199,
    rating: 4.8,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=900&q=80',
    description: 'Crisp meringue, vanilla chantilly and fresh berries with a citrus gloss.',
    badge: 'Chef Creation',
  },
  {
    id: 21,
    name: 'Salted Caramel Brownie',
    category: 'Desserts',
    type: 'dessert',
    price: 159,
    rating: 4.9,
    prepTime: '9 min',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    description: 'Warm fudgy brownie with sea salt caramel and a scoop of vanilla gelato.',
    badge: 'Warm & Gooey',
  },
  {
    id: 22,
    name: 'Kulfi Falooda',
    category: 'Desserts',
    type: 'dessert',
    price: 149,
    rating: 4.8,
    prepTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
    description: 'Traditional kesar kulfi with rose syrup, basil seeds and silky falooda.',
    badge: 'Indian Favourite',
  },
  {
    id: 23,
    name: 'Breakfast Pancake Stack',
    category: 'Breakfast',
    type: 'veg',
    price: 229,
    rating: 4.7,
    prepTime: '15 min',
    image:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80',
    description: 'Fluffy pancakes with berries, whipped cream and a drizzle of maple syrup.',
    badge: 'Morning Pick',
  },
  {
    id: 24,
    name: 'Avocado Power Bowl',
    category: 'Healthy Bowls',
    type: 'veg',
    price: 249,
    rating: 4.8,
    prepTime: '14 min',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    description: 'Quinoa, avocado, greens, roasted vegetables and a bright lemon dressing.',
    badge: 'Fresh Choice',
  },
  {
    id: 25,
    name: 'Family Biryani Feast',
    category: 'Family Combos',
    type: 'nonveg',
    price: 699,
    rating: 4.9,
    prepTime: '35 min',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
    description: 'A generous biryani spread with kebabs, raita and dessert for the table.',
    badge: 'Best Value',
  },
  {
    id: 26,
    name: 'Crispy Corn Chaat',
    category: 'Veg Starters',
    type: 'veg',
    price: 179,
    rating: 4.7,
    prepTime: '14 min',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy sweet corn tossed with peppers, herbs and a zesty chaat dressing.',
    badge: 'Crunchy',
  },
  {
    id: 27,
    name: 'Tandoori Broccoli',
    category: 'Veg Starters',
    type: 'veg',
    price: 199,
    rating: 4.8,
    prepTime: '18 min',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    description: 'Charred broccoli florets with smoky tikka spices and cooling mint chutney.',
    badge: 'Chef Pick',
  },
  {
    id: 28,
    name: 'Spinach Cheese Rolls',
    category: 'Veg Starters',
    type: 'veg',
    price: 189,
    rating: 4.6,
    prepTime: '15 min',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    description: 'Golden pastry rolls filled with spinach, herbs and molten cheese.',
    badge: 'New',
  },
  {
    id: 29,
    name: 'Dal Makhani Signature',
    category: 'Main Course',
    type: 'veg',
    price: 239,
    rating: 4.9,
    prepTime: '22 min',
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    description: 'Slow-simmered black lentils finished with butter, cream and smoked spices.',
    badge: 'House Classic',
  },
  {
    id: 30,
    name: 'Kashmiri Veg Pulao',
    category: 'Main Course',
    type: 'veg',
    price: 229,
    rating: 4.7,
    prepTime: '20 min',
    image:
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80',
    description: 'Fragrant basmati rice with garden vegetables, dry fruits and saffron.',
    badge: 'Aromatic',
  },
  {
    id: 31,
    name: 'Palak Paneer Supreme',
    category: 'Main Course',
    type: 'veg',
    price: 259,
    rating: 4.8,
    prepTime: '21 min',
    image:
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80',
    description: 'Soft paneer in silky spinach gravy with garlic, cream and toasted cumin.',
    badge: 'Customer Love',
  },
  {
    id: 32,
    name: 'Margherita Burrata Pizza',
    category: 'Italian Twist',
    type: 'veg',
    price: 299,
    rating: 4.9,
    prepTime: '20 min',
    image:
      'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80',
    description: 'San Marzano tomato, fresh basil, mozzarella and creamy burrata.',
    badge: 'Italian Classic',
  },
  {
    id: 33,
    name: 'Arrabbiata Gnocchi',
    category: 'Italian Twist',
    type: 'veg',
    price: 269,
    rating: 4.7,
    prepTime: '19 min',
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
    description: 'Pillowy potato gnocchi in spicy tomato sauce with parmesan and basil.',
    badge: 'Spicy Favourite',
  },
  {
    id: 34,
    name: 'Chicken Seekh Kebab',
    category: 'Non-Veg Starters',
    type: 'nonveg',
    price: 279,
    rating: 4.8,
    prepTime: '22 min',
    image:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
    description: 'Juicy minced chicken kebabs grilled with green chilli and fresh coriander.',
    badge: 'Grill House',
  },
  {
    id: 35,
    name: 'Lamb Shami Kebab',
    category: 'Non-Veg Starters',
    type: 'nonveg',
    price: 299,
    rating: 4.7,
    prepTime: '24 min',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Tender lamb and lentil kebabs with a delicate spice blend and mint relish.',
    badge: 'Royal Starter',
  },
  {
    id: 36,
    name: 'Crispy Fish Fingers',
    category: 'Non-Veg Starters',
    type: 'nonveg',
    price: 269,
    rating: 4.6,
    prepTime: '20 min',
    image:
      'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80',
    description: 'Golden crumb-coated fish with lemon aioli and a fresh herb salad.',
    badge: 'Crispy Pick',
  },
  {
    id: 37,
    name: 'Chicken Malai Tikka',
    category: 'Non-Veg Starters',
    type: 'nonveg',
    price: 289,
    rating: 4.9,
    prepTime: '23 min',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy chicken tikka marinated with cheese, cardamom and mild spices.',
    badge: 'Best Seller',
  },
  {
    id: 38,
    name: 'Goan Prawn Curry',
    category: 'Seafood',
    type: 'nonveg',
    price: 389,
    rating: 4.9,
    prepTime: '24 min',
    image:
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80',
    description: 'Juicy prawns simmered in a tangy coconut curry with coastal aromatics.',
    badge: 'Coastal Special',
  },
  {
    id: 39,
    name: 'Butter Garlic Calamari',
    category: 'Seafood',
    type: 'nonveg',
    price: 359,
    rating: 4.7,
    prepTime: '18 min',
    image:
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80',
    description: 'Tender calamari rings tossed in butter, garlic, chilli and lemon zest.',
    badge: 'Ocean Fresh',
  },
  {
    id: 40,
    name: 'Tandoori Pomfret',
    category: 'Seafood',
    type: 'nonveg',
    price: 449,
    rating: 4.8,
    prepTime: '28 min',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
    description: 'Whole pomfret marinated in yoghurt and spices, charred in the tandoor.',
    badge: 'Premium Catch',
  },
  {
    id: 41,
    name: 'Chicken Chettinad',
    category: 'Non-Veg Main',
    type: 'nonveg',
    price: 329,
    rating: 4.9,
    prepTime: '28 min',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    description: 'Tender chicken in a bold roasted coconut and pepper Chettinad masala.',
    badge: 'Spice Trail',
  },
  {
    id: 42,
    name: 'Butter Chicken Royale',
    category: 'Non-Veg Main',
    type: 'nonveg',
    price: 339,
    rating: 4.9,
    prepTime: '26 min',
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    description: 'Tandoori chicken pieces in a velvety tomato, butter and cream gravy.',
    badge: 'Signature',
  },
  {
    id: 43,
    name: 'Lamb Keema Matar',
    category: 'Non-Veg Main',
    type: 'nonveg',
    price: 359,
    rating: 4.8,
    prepTime: '29 min',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Slow-cooked minced lamb with garden peas, tomato and warming spices.',
    badge: 'Hearty Bowl',
  },
  {
    id: 44,
    name: 'Andhra Chicken Curry',
    category: 'Non-Veg Main',
    type: 'nonveg',
    price: 319,
    rating: 4.7,
    prepTime: '27 min',
    image:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
    description: 'Fiery Andhra-style chicken curry finished with curry leaves and fresh chilli.',
    badge: 'Fiery Favourite',
  },
  {
    id: 45,
    name: 'Blueberry Cheesecake',
    category: 'Desserts',
    type: 'dessert',
    price: 189,
    rating: 4.8,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80',
    description: 'Silky cream cheese on a buttery biscuit base with blueberry compote.',
    badge: 'Berry Sweet',
  },
  {
    id: 46,
    name: 'Dark Chocolate Mousse',
    category: 'Desserts',
    type: 'dessert',
    price: 169,
    rating: 4.9,
    prepTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1511715112108-9acc5d9e5c8a?auto=format&fit=crop&w=900&q=80',
    description: 'Airy dark chocolate mousse with cocoa nibs and a sea salt finish.',
    badge: 'Chocolate Lover',
  },
  {
    id: 47,
    name: 'Rasmalai Tres Leches',
    category: 'Desserts',
    type: 'dessert',
    price: 179,
    rating: 4.8,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80',
    description: 'A fusion milk cake layered with rasmalai cream, pistachio and saffron.',
    badge: 'Fusion Sweet',
  },
  {
    id: 48,
    name: 'Strawberry Shortcake',
    category: 'Desserts',
    type: 'dessert',
    price: 179,
    rating: 4.7,
    prepTime: '9 min',
    image:
      'https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=900&q=80',
    description: 'Vanilla sponge, fresh strawberries and clouds of whipped cream.',
    badge: 'Fresh Cream',
  },
  {
    id: 49,
    name: 'Mango Kulfi Sundae',
    category: 'Desserts',
    type: 'dessert',
    price: 159,
    rating: 4.8,
    prepTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
    description: 'Mango kulfi, alphonso pulp, pistachios and rose falooda pearls.',
    badge: 'Summer Favourite',
  },
  {
    id: 50,
    name: 'Cinnamon Churros',
    category: 'Desserts',
    type: 'dessert',
    price: 149,
    rating: 4.7,
    prepTime: '12 min',
    image:
      'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=900&q=80',
    description: 'Warm cinnamon sugar churros served with rich Belgian chocolate dip.',
    badge: 'Warm Treat',
  },
  {
    id: 51,
    name: 'Masala Omelette Toast',
    category: 'Breakfast',
    type: 'nonveg',
    price: 179,
    rating: 4.7,
    prepTime: '12 min',
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    description: 'Fluffy masala omelette, toasted sourdough, herbs and chilli butter.',
    badge: 'Protein Start',
  },
  {
    id: 52,
    name: 'South Indian Breakfast Box',
    category: 'Breakfast',
    type: 'veg',
    price: 199,
    rating: 4.8,
    prepTime: '18 min',
    image:
      'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=80',
    description: 'Mini idlis, masala dosa bites, vada and three house chutneys.',
    badge: 'Morning Classic',
  },
  {
    id: 53,
    name: 'Berry Granola Parfait',
    category: 'Breakfast',
    type: 'veg',
    price: 189,
    rating: 4.6,
    prepTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
    description: 'Greek yoghurt, crunchy granola, berries and honey in a chilled parfait.',
    badge: 'Light & Fresh',
  },
  {
    id: 54,
    name: 'Mediterranean Protein Bowl',
    category: 'Healthy Bowls',
    type: 'veg',
    price: 259,
    rating: 4.8,
    prepTime: '16 min',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    description: 'Hummus, falafel, quinoa, greens and roasted vegetables with tahini.',
    badge: 'Plant Powered',
  },
  {
    id: 55,
    name: 'Grilled Chicken Wellness Bowl',
    category: 'Healthy Bowls',
    type: 'nonveg',
    price: 299,
    rating: 4.9,
    prepTime: '18 min',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    description: 'Herb chicken, brown rice, avocado and greens with a lemon dressing.',
    badge: 'High Protein',
  },
  {
    id: 56,
    name: 'Paneer Power Bowl',
    category: 'Healthy Bowls',
    type: 'veg',
    price: 269,
    rating: 4.7,
    prepTime: '17 min',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    description: 'Grilled paneer, millet, greens, corn and a creamy coriander dressing.',
    badge: 'Wholesome',
  },
  {
    id: 57,
    name: 'Weekend Family Combo',
    category: 'Family Combos',
    type: 'nonveg',
    price: 799,
    rating: 4.9,
    prepTime: '38 min',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80',
    description: 'Biryani, tandoori chicken, naan, raita and two decadent desserts.',
    badge: 'Feeds Four',
  },
  {
    id: 58,
    name: 'Vegetarian Celebration Combo',
    category: 'Family Combos',
    type: 'veg',
    price: 699,
    rating: 4.8,
    prepTime: '32 min',
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    description: 'Paneer tikka, biryani, dal makhani, breads and a dessert platter.',
    badge: 'Veg Feast',
  },
  {
    id: 59,
    name: 'Seafood Sharing Platter',
    category: 'Family Combos',
    type: 'nonveg',
    price: 899,
    rating: 4.9,
    prepTime: '35 min',
    image:
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80',
    description: 'Prawns, fish, calamari, fries and coastal dips made for sharing.',
    badge: 'Party Favourite',
  },
  {
    id: 60,
    name: 'Classic French Toast',
    category: 'Breakfast',
    type: 'veg',
    price: 169,
    rating: 4.7,
    prepTime: '10 min',
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80',
    description: 'Brioche French toast with berries, whipped cream and maple syrup.',
    badge: 'Brunch Favourite',
  },
  {
    id: 61,
    name: 'Teriyaki Tofu Bowl',
    category: 'Healthy Bowls',
    type: 'veg',
    price: 249,
    rating: 4.7,
    prepTime: '15 min',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    description: 'Crisp tofu, edamame, brown rice and greens glazed with teriyaki.',
    badge: 'Feel Good',
  },
  {
    id: 62,
    name: 'Premium Dinner Box',
    category: 'Family Combos',
    type: 'nonveg',
    price: 849,
    rating: 4.8,
    prepTime: '36 min',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'A generous dinner box with biryani, curry, breads, sides and sweets.',
    badge: 'Complete Meal',
  },
];

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    return mongoose.connection;
  } catch (error) {
    console.log('MongoDB connection failed, using in-memory data instead.');
    return null;
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TastyBite API is running' });
});

app.get('/api/products', async (req, res) => {
  const db = await connectDatabase();

  if (db) {
    try {
      const products = await db.collection('products').find({}).toArray();
      if (products.length) {
        const categoryCounts = new Map();
        const existingIds = new Set(products.map((product) => product.id));
        products.forEach((product) => {
          categoryCounts.set(
            product.category,
            (categoryCounts.get(product.category) || 0) + 1
          );
        });
        const expandedProducts = fallbackProducts.filter((product) => {
          const categoryCount = categoryCounts.get(product.category) || 0;
          if (categoryCount >= 5 || existingIds.has(product.id)) {
            return false;
          }
          categoryCounts.set(product.category, categoryCount + 1);
          return true;
        });
        return res.json([...products, ...expandedProducts]);
      }
    } catch (error) {
      console.log('Using fallback product data due to database issue.');
    }
  }

  res.json(fallbackProducts);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
