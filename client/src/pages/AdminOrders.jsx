import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AdminOrders = ({ user, showFlash }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const config = { headers: { Authorization: user.token } };
    const { data } = await axios.get('http://localhost:5000/api/orders/admin/all', config);
    setOrders(data);
  };

  useEffect(() => {
    if (user && user.isAdmin) fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: user.token } };
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, config);
      
      const msg = status === 'Delivered' ? "Your order is delivered" : "Your order is cancelled";
      showFlash(msg, status === 'Delivered' ? 'success' : 'error');
      fetchOrders();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!user || !user.isAdmin) return <h2>Access Denied</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Manage Customer Orders</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map(order => (
          <div key={order._id} className="card" style={{ borderLeft: `10px solid ${order.status === 'Delivered' ? '#4caf50' : order.status === 'Cancelled' ? '#f44336' : '#ff7f50'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <h4>Customer: {order.userName}</h4>
                <p><strong>Phone:</strong> {order.phone} | <strong>Area:</strong> {order.address}</p>
                <div style={{ marginTop: '10px', padding: '10px', borderRadius: '10px' }}>
                  {order.items.map((item, idx) => (
                    <p key={idx} style={{ margin: '2px 0' }}>{item.name} x {item.quantity} — ${item.price * item.quantity}</p>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total: ${order.totalAmount}</p>
                <p>Status: <span style={{ fontWeight: 'bold' }}>{order.status}</span></p>
                {order.status === 'Placed' && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => updateStatus(order._id, 'Delivered')} style={{ backgroundColor: '#4caf50', color: 'white' }}>Deliver</button>
                    <button onClick={() => updateStatus(order._id, 'Cancelled')} style={{ backgroundColor: '#f44336', color: 'white' }}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;