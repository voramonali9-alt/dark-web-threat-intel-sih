import React, { useState, useEffect } from 'react';

function CustomerDashboard({ user, onLogout }) {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  // 1. Page khulte hi Cloud Database se saari Dukaanein load karo
  useEffect(() => {
    fetch('http://localhost:5000/api/shops/all')
      .then(res => res.json())
      .then(data => setShops(data))
      .catch(err => console.log(err));
  }, []);

  // 2. Kisi bhi Dukaan par click karne par uska andar ka Samaan load karo
  const handleShopClick = async (shop) => {
    setSelectedShop(shop);
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/products/shop/${shop._id}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("Items load nahi hue");
    }
  };

  // 3. Samaan Kharidna (Buy Button)
  const handleBuy = async (productId, productName) => {
    try {
      const res = await fetch('http://localhost:5000/api/products/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantityBought: 1 }) // Ek baar mein 1 item kharida
      });
      const data = await res.json();
      
      if(res.ok) {
        setMessage(`✅ Aapne 1 "${productName}" kharid liya!`);
        // Kharidne ke baad stock kam dikhane ke liye list ko automatic refresh karo
        handleShopClick(selectedShop);
      } else {
        setMessage(`❌ Error: ${data.message}`); // Jaise agar Out of Stock ho
      }
    } catch (err) {
      setMessage("Purchase failed");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome Customer, {user.name} 🛍️</h2>
        <button onClick={onLogout} style={logoutBtnStyle}>Logout</button>
      </div>

      {/* Success/Error Message */}
      {message && <div style={{ background: '#dcfce7', padding: '12px', marginBottom: '20px', color: '#166534', borderRadius: '5px', fontWeight: 'bold' }}>{message}</div>}

      {/* Agar customer ne koi dukaan select nahi ki hai toh Shop List dikhao */}
      {!selectedShop ? (
        <div>
          <h3>Apne aas-paas ki Dukaanein:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {shops.length === 0 ? <p>Abhi koi dukaan register nahi hui hai.</p> : null}
            {shops.map(shop => (
              <div key={shop._id} onClick={() => handleShopClick(shop)} style={shopCardStyle}>
                <h4 style={{margin: '0 0 10px 0', fontSize: '20px'}}>{shop.shopName}</h4>
                <span style={{background: '#e0e7ff', color: '#3730a3', padding: '4px 8px', borderRadius: '15px', fontSize: '12px'}}>{shop.category}</span>
                <p style={{margin: '15px 0 0 0', fontSize: '14px', color: '#64748b'}}>📍 {shop.address}</p>
                <p style={{margin: '5px 0 0 0', fontSize: '14px', color: '#64748b'}}>📞 {shop.contactNumber}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Agar dukaan select kar li hai toh uske Andar ka Samaan dikhao */
        <div>
          <button onClick={() => { setSelectedShop(null); setMessage(''); }} style={backBtnStyle}>⬅ Wapas Dukaano par jayein</button>
          <h3>{selectedShop.shopName} ka Samaan:</h3>
          
          {products.length === 0 ? <p>Is dukaan mein abhi koi samaan add nahi kiya gaya hai.</p> : null}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
            {products.map(product => (
              <div key={product._id} style={productCardStyle}>
                <div>
                  <h4 style={{margin: '0 0 8px 0', fontSize: '18px'}}>{product.name}</h4>
                  <p style={{margin: '0 0 8px 0', color: '#10b981', fontWeight: 'bold', fontSize: '18px'}}>₹ {product.price}</p>
                  <p style={{margin: 0, fontSize: '14px', color: product.stockQuantity <= product.alertLimit ? '#ef4444' : '#64748b'}}>
                    Stock bacha hai: {product.stockQuantity} {product.stockQuantity <= product.alertLimit ? "(Hurry!)" : ""}
                  </p>
                </div>
                <button 
                  onClick={() => handleBuy(product._id, product.name)} 
                  style={product.stockQuantity > 0 ? buyBtnStyle : disabledBtnStyle}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? 'Buy 1 Item' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Styling variables
const logoutBtnStyle = { padding: '8px 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const backBtnStyle = { padding: '8px 15px', background: '#e2e8f0', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' };
const shopCardStyle = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.3s', border: '1px solid #e2e8f0' };
const productCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' };
const buyBtnStyle = { padding: '12px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' };
const disabledBtnStyle = { padding: '12px 20px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '5px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '15px' };

export default CustomerDashboard;
