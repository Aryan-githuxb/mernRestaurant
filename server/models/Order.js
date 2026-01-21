import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: { type: Number, required: true },
    name: String,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'Placed', 
    enum: ['Placed', 'Delivered', 'Cancelled'] 
  },
  address: String,
  phone: String,
  userName: String
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);