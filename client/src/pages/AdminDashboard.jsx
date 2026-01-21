import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ user }) => {
  const [data, setData] = useState([]);
  const [foodMenu, setFoodMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const config = { headers: { Authorization: user.token } };
        const resOrders = await axios.get('http://localhost:5000/api/orders/admin/all', config);
        
        const deliveredOrders = resOrders.data.filter(order => order.status === 'Delivered');
        setData(deliveredOrders);
        
        const resFood = await axios.get('http://localhost:5000/api/food');
        setFoodMenu(resFood.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    if (user?.isAdmin) fetchAllData();
  }, [user]);

  if (!user?.isAdmin) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Access Denied</h2>;

  const typeMapping = {};
  foodMenu.forEach(food => {
    typeMapping[food.name] = food.type;
  });

  const categoryStats = data.reduce((acc, order) => {
    order.items.forEach(item => {
      const type = typeMapping[item.name] || 'Other';
      if (!acc[type]) {
        acc[type] = { name: type, totalQtySold: 0, uniqueUsers: new Set() };
      }
      acc[type].totalQtySold += item.quantity;
      acc[type].uniqueUsers.add(order.user);
    });
    return acc;
  }, {});

  const typeData = Object.values(categoryStats).map(cat => ({
    name: cat.name,
    qty: cat.totalQtySold,
    userCount: cat.uniqueUsers.size
  }));

  const dailyRevenue = data.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.totalAmount;
    return acc;
  }, {});
  const lineData = Object.keys(dailyRevenue).map(date => ({ name: date, amount: dailyRevenue[date] }));

  const foodCounts = {};
  data.forEach(order => {
    order.items.forEach(item => {
      foodCounts[item.name] = (foodCounts[item.name] || 0) + item.quantity;
    });
  });
  const sortedFood = Object.keys(foodCounts).map(name => ({ name, qty: foodCounts[name] }))
    .sort((a, b) => b.qty - a.qty).slice(0, 3);

  const COLORS = ['#ff7f50', '#ffbb28', '#00C49F', '#0088FE', '#a29bfe'];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Business Analytics</h2>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Showing data for <b>Delivered</b> orders</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/admin/add-food')} className="btn-primary">Add Food</button>
          <button onClick={() => navigate('/admin/orders')} style={{ backgroundColor: '#2d2d2d', color: 'white' }}>Orders</button>
        </div>
      </div>

      <div className='admin-grid'>
        <div className="card">
          <h3>Total Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#ff7f50" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2>Top 3 Items</h2>
          <div style={{ marginTop: '15px' }}>
            {sortedFood.map((food, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(255, 127, 80, 0.08)', borderRadius: '12px', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600' }}>{food.name}</span>
                <span style={{ color: '#ff7f50', fontWeight: 'bold' }}>{food.qty} units</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>User Reach per Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="userCount" fill="#ffbb28" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Total Units Sold per Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={typeData} 
                dataKey="qty" 
                nameKey="name" 
                cx="50%" cy="50%" 
                outerRadius={80} 
                innerRadius={40}
                paddingAngle={5}
                label
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;