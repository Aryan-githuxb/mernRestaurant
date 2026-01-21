import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Main Course', 'Snacks', 'Dessert', 'Drink'] 
  },
  price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Food', foodSchema);