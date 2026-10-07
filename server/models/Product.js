import mongoose from 'mongoose';

const customizationOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    priceDelta: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., 'Portion Size', 'Spice Level'
    required: { type: Boolean, default: false },
    options: [customizationOptionSchema],
  },
  { _id: false }
);

const addOnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., 'Extra Boiled Egg', 'Extra Cheese'
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const comboDetailsSchema = new mongoose.Schema(
  {
    itemsIncluded: [{ type: String }],
    individualTotal: { type: Number, default: 0 },
    savingsAmount: { type: Number, default: 0 },
    servingSize: { type: String, default: 'Serves 1-2' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    categorySlug: {
      type: String,
      required: true,
      index: true,
    },
    foodType: {
      type: String,
      enum: ['veg', 'non-veg', 'egg'],
      required: [true, 'Food type is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      default: 0,
      min: [0, 'Compare price cannot be negative'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: [(val) => val.length > 0, 'Must have at least one image'],
    },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    portionSize: {
      type: String,
      default: 'Standard Serving',
    },
    customizations: [customizationSchema],
    addOns: [addOnSchema],
    prepTime: {
      type: String,
      default: '20 mins',
    },
    inventoryCount: {
      type: Number,
      default: 100,
      min: [0, 'Inventory cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isChefSpecial: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isCombo: {
      type: Boolean,
      default: false,
      index: true,
    },
    comboDetails: comboDetailsSchema,
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, index: true }],
  },
  { timestamps: true }
);

// Compound text index for search across name, description, and tags
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
