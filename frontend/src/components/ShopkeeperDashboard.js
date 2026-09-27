import React, { useState, useEffect } from 'react';

function ShopkeeperDashboard({ user, onLogout }) {
  const [shopId, setShopId] = useState(null);
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Grocery');
  
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // PAGE LOAD HOTE HI DUKAAN AUR SAMAAN DHUNDHO
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const shopRes = await fetch(`http://localhost:5000/api/shops/owner/${user.id}`);
        const shopData = await shopRes.json();
        
        if (shopData) {
          setShopId(shopData._id);
          setShopInfo(shopData);
          
          const prodRes = await fetch(`http://localhost:5000/api/products/shop/${shopData._id}`);
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
      } catch (err) { console.log(err); }
    };
    fetchDashboardData();
  }, [user.id]);

  const handleCreateShop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/shops/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId: user.id, shopName, category, address: "Local", contactNumber: "000" })
      });
      const data = await res.json();
      if(res.ok) {
        setShopId(data.shop._id);
        setShopInfo(data.shop);
        setMessage("✅ Dukaan ban gayi!");
      }
    } catch (err) { setMessage("Error creating shop"); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, name: productName, price, stockQuantity: stock, alertLimit: 5 }) // Danger level 5
      });
      const data = await res.json();
      if(res.ok) {
        setMessage(`✅ "${productName}" add ho gaya!`);
        setProducts([...products, data.product]); // List update karo
        setProductName(''); setPrice(''); setStock('');
      }
    } catch (err) { setMessage("Error adding product"); }
  };

  // SMART ALARM LOGIC (Danger level <= alertLimit)
  const lowStockItems = products.filter(p => p.stockQuantity <= p.alertLimit);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {user.name} 🏪</h2>
        <button onClick={onLogout} style={{ padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px' }}>Logout</button>
      </div>

      {/* 💰 TOTAL EARNINGS BOX */}
      {shopId && (
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Total Sales / Kamai:</h3>
          <h2 style={{ margin: 0, fontSize: '32px' }}>₹ {shopInfo?.totalSales || 0}</h2>
        </div>
      )}

      {/* 🚨 RED ALARM BOX (Sirf tab dikhega jab stock kam hoga) */}
      {shopId && lowStockItems.length > 0 && (
        <div style={{ background: '#fee2e2', borderLeft: '6px solid #ef4444', padding: '15px', borderRadius: '5px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#b91c1c', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{fontSize: '24px', marginRight: '10px'}}>🚨</span> WARNING: LOW STOCK ALERT!
          </h3>
          <p style={{ margin: '0 0 10px 0', color: '#991b1b' }}>Niche diye gaye samaan ka order jaldi dein, ye khatam hone wale hain:</p>
          <ul style={{ color: '#7f1d1d', fontWeight: 'bold', margin: 0 }}>
            {lowStockItems.map(item => (
              <li key={item._id} style={{marginBottom: '5px'}}>
                {item.name} (Sirf {item.stockQuantity} bache hain!)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {message && <div style={{ background: '#dcfce7', padding: '12px', marginBottom: '20px', color: '#166534', borderRadius: '5px', fontWeight: 'bold' }}>{message}</div>}

      {!shopId ? (
        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>1. Apni Dukaan Register Karein</h3>
          <form onSubmit={handleCreateShop}>
            <input placeholder="Dukaan ka Naam" value={shopName} onChange={e => setShopName(e.target.value)} required style={inputStyle} />
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              <option>Grocery</option><option>Bakery</option><option>Clothes</option>
            </select>
            <button type="submit" style={btnStyle}>Dukaan Banao</button>
          </form>
        </div>
      ) : (
        <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
          {/* Add Item Form */}
          <div style={{ flex: '1 1 300px', background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>Samaan Add Karein ({shopInfo?.shopName})</h3>
            <form onSubmit={handleAddProduct}>
              <input placeholder="Samaan ka Naam" value={productName} onChange={e => setProductName(e.target.value)} required style={inputStyle} />
              <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required style={inputStyle} />
              <input type="number" placeholder="Kitna Stock hai?" value={stock} onChange={e => setStock(e.target.value)} required style={inputStyle} />
              <button type="submit" style={btnStyle}>Add Item</button>
            </form>
          </div>

          {/* Current Stock List */}
          <div style={{ flex: '1 1 300px', background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>Aapka Samaan (Inventory)</h3>
            {products.length === 0 ? <p>Abhi dukaan khali hai.</p> : (
              <ul style={{padding: 0, listStyle: 'none'}}>
                {products.map(p => (
                  <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                    <span>{p.name} (₹{p.price})</span>
                    <span style={{ fontWeight: 'bold', color: p.stockQuantity <= p.alertLimit ? 'red' : 'green' }}>
                      Stock: {p.stockQuantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' };
const btnStyle = { width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };

export default ShopkeeperDashboard;
