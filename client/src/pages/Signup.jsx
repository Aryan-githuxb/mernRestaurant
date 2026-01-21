import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', area: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }} className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Join Us</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="text" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
        <input type="text" placeholder="Area Name" onChange={(e) => setFormData({...formData, area: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Account</button>
      </form>
    </div>
  );
};

export default Signup;