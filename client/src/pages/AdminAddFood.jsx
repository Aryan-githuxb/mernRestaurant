import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAddFood = ({ user, showFlash }) => {
  const [formData, setFormData] = useState({ name: '', image: '', type: 'Main Course', price: '' });
  const navigate = useNavigate();

  if (!user || !user.isAdmin) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Access Denied</h2>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: user.token } };
      await axios.post('http://localhost:5000/api/food', formData, config);
      showFlash("Food item added successfully!");
      navigate('/');
    } catch (err) {
      alert("Error adding food");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }} className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Food Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Food Name</label>
        <input type="text" placeholder="e.g. Veg Grill Sandwich" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        
        <label>Image URL</label>
        <input type="text" placeholder="image-link" onChange={(e) => setFormData({...formData, image: e.target.value})} required />
        
        <label>Category</label>
        <select 
          style={{ width: '100%', padding: '12px', borderRadius: '20px', marginBottom: '15px', border: '1px solid #ddd' }}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="Main Course">Main Course</option>
          <option value="Snacks">Snacks</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
        </select>
        
        <label>Price</label>
        <input type="number" placeholder="25" min="5" max="500" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Add Item</button>
      </form>
    </div>
  );
};

export default AdminAddFood;