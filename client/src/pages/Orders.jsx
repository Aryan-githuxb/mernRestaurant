import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = { headers: { Authorization: user.token } };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders");
      }
    };
    if (user) fetchMyOrders();
  }, [user]);

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map(order => (
            <div key={order._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#777' }}>Order ID: {order._id}</p>
                  <p style={{ margin: '5px 0', fontWeight: '600' }}>
                    Status: <span style={{ 
                      color: order.status === 'Delivered' ? '#4caf50' : order.status === 'Cancelled' ? '#f44336' : '#ff7f50' 
                    }}>{order.status}</span>
                  </p>
                </div>
                <h3 style={{ margin: 0 }}>Total: ${order.totalAmount}</h3>
              </div>
              <hr style={{ margin: '15px 0', opacity: 0.1 }} />
              <div>
                {order.items.map((item, i) => (
                  <p key={i} style={{ margin: '5px 0' }}>{item.name} x {item.quantity}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;