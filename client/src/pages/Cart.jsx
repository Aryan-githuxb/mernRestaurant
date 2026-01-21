import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = ({ user, showFlash }) => {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const updateQty = (id, a) => {
    const updated = cartItems.map(item => 
      item._id === id ? { ...item, quantity: Math.min(20, Math.max(1, item.quantity + a)) } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      const config = { headers: { Authorization: user.token } };
      const orderData = {
        items: cartItems.map(i => ({ food: i._id, quantity: i.quantity, name: i.name, price: i.price })),
        totalAmount: total,
        address: user.area,
        phone: user.phone,
        userName: user.name
      };
      await axios.post('http://localhost:5000/api/orders', orderData, config);
      localStorage.removeItem('cart');
      setCartItems([]);
      showFlash("Your order is placed!");
      navigate('/orders');
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Shopping Cart</h2>
      {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          {cartItems.map(item => (
            <div key={item._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={item.image} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#777' }}>${item.price} each</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => updateQty(item._id, -1)} style={{ backgroundColor: '#eee' }}>-</button>
                <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item._id, 1)} style={{ backgroundColor: '#eee' }}>+</button>
                <button onClick={() => removeItem(item._id)} style={{ backgroundColor: '#ffdede', color: '#f44336' }}>Remove</button>
              </div>
            </div>
          ))}
          <div className="card" style={{ textAlign: 'right', marginTop: '20px' }}>
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={placeOrder} className="btn-primary" style={{ marginTop: '10px', padding: '12px 40px' }}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;