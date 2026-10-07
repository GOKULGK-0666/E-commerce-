import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    foodType: { type: String, enum: ['veg', 'non-veg', 'egg'], default: 'veg' },
    image: { type: String, default: '' },
    basePrice: { type: Number, required: true },
    selectedPortion: {
      name: { type: String, default: 'Standard' },
      priceDelta: { type: Number, default: 0 },
    },
    spiceLevel: { type: String, default: 'Medium' },
    selectedAddOns: [
      {
        name: { type: String },
        price: { type: Number, default: 0 },
      },
    ],
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    fulfillmentMethod: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true,
      default: 'delivery',
      index: true,
    },
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      instructions: { type: String },
    },
    pickupTime: {
      type: String,
      default: 'In 20-30 mins',
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    appliedCoupon: {
      code: String,
      discountType: String,
      discountValue: Number,
      amountSaved: Number,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      required: true,
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      index: true,
    },
    paymentDetails: {
      transactionId: String,
      orderId: String,
      paymentSignature: String,
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'delivered',
        'completed',
        'cancelled',
      ],
      default: 'placed',
      index: true,
    },
    statusHistory: [statusHistorySchema],
    cancellationReason: {
      type: String,
      default: '',
    },
    estimatedDeliveryTime: {
      type: String,
      default: '30-40 mins',
    },
  },
  { timestamps: true }
);

// Helpful index for order searching and sorting
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
