import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = ({ user, showFlash }) => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await axios.get('http://localhost:5000/api/food');
      setFoods(data.map(f => ({ ...f, quantity: 1 })));
    };
    fetchFoods();
  }, []);

  const updateQty = (id, a) => {
    setFoods(foods.map(f => f._id === id ? { ...f, quantity: Math.min(20, Math.max(1, f.quantity + a)) } : f));
  };

  const addToCart = (food) => {
    if (!user) return alert("Please login to order!");
    const existing = cart.find(item => item._id === food._id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => item._id === food._id ? { ...item, quantity: Math.min(20, item.quantity + food.quantity) } : item);
    } else {
      newCart = [...cart, { ...food }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    showFlash(`${food.name} added to cart!`);
  };

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <input 
          type="text" 
          placeholder="Search for your favorite food..." 
          style={{ maxWidth: '600px', fontSize: '1.1rem', border: '2px solid #ff7f50' }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className='food-grid'>
        {filteredFoods.map(food => (
          <div key={food._id} className="card" style={{  }}>
            <img src={food.image} alt={food.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' }} />
            <h3 style={{ margin: '15px 0 5px' }}>{food.name}</h3>
            <p style={{ color: '#777', fontSize: '0.9rem' }}>{food.type}</p>
            
            <div style={{ display: 'flex', justifyContent:'space-between' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' }}>{food.price} Rs</p>
              <div style={{ display:'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
                <button onClick={() => updateQty(food._id, -1)} style={{ backgroundColor: '#eee', color: '#333', padding: '5px 15px', border: '3px solid red' }}>-</button>
                <span style={{ fontWeight: 'bold' }}>{food.quantity}</span>
                <button onClick={() => updateQty(food._id, 1)} style={{ backgroundColor: '#eee', color: '#333', padding: '5px 15px', border: '3px solid green' }}>+</button>
              </div>
            </div>

            <button onClick={() => addToCart(food)} className="btn-primary" style={{ width: '100%' }}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;