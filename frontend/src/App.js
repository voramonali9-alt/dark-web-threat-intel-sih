import React, { useState } from 'react';
import './App.css';
import ShopkeeperDashboard from './components/ShopkeeperDashboard'; 
import CustomerDashboard from './components/CustomerDashboard'; 
import { useTranslation } from 'react-i18next'; // Translation Tool import kiya

function App() {
  const { t, i18n } = useTranslation(); // t = translate karne wala function

  // Bhasha badalne ka function
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Screen badalne ke liye (Login dikhana hai ya Register)
  const [isLoginView, setIsLoginView] = useState(true);

  // Form ka Data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Shopkeeper'); // By default Shopkeeper
  
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // ================= LOGIN LOGIC =================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setLoggedInUser(data.user); // SUCCESS: User data save karein aur dashboard dikhayein
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Error: Backend se connect nahi ho paya.");
      setIsError(true);
    }
  };

  // ================= REGISTER LOGIC =================
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, role }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Mubarak ho! " + data.message + " Ab aap login kar sakte hain.");
        setIsError(false);
        setTimeout(() => {
          setIsLoginView(true);
          setMessage(null);
        }, 2000); 
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Error: Backend se connect nahi ho paya.");
      setIsError(true);
    }
  };

  // Agar user login hai, toh seedha Dashboard dikhao
  if (loggedInUser) {
    if (loggedInUser.role === 'Shopkeeper') {
      return <ShopkeeperDashboard user={loggedInUser} onLogout={() => setLoggedInUser(null)} />;
    } else {
      return <CustomerDashboard user={loggedInUser} onLogout={() => setLoggedInUser(null)} />;
    }
  }

  // Varna normal Login/Register page dikhao
  return (
    <div>
      {/* Language Badalne ka Button */}
      <div style={{textAlign: 'right', padding: '15px 30px'}}>
        <label style={{fontWeight: 'bold', marginRight: '10px'}}>🌐 Language: </label>
        <select onChange={changeLanguage} value={i18n.language} style={{padding: '5px', borderRadius: '5px'}}>
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="mr">मराठी (Marathi)</option>
        </select>
      </div>

      <div className="login-container" style={{height: '85vh'}}>
        <div className="login-card">
          <h2>{isLoginView ? t('appTitle') : t('createAccount')}</h2>
          
          {/* ================= LOGIN FORM ================= */}
          {isLoginView ? (
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>{t('phoneLabel')}</label>
                <input type="text" placeholder={t('phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>{t('passwordLabel')}</label>
                <input type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="login-btn">{t('loginBtn')}</button>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>{t('nameLabel')}</label>
                <input type="text" placeholder={t('namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>{t('phoneLabel')}</label>
                <input type="text" placeholder={t('phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>{t('passwordLabel')}</label>
                <input type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>{t('roleLabel')}</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px'}}>
                  <option value="Shopkeeper">{t('shopkeeper')}</option>
                  <option value="Customer">{t('customer')}</option>
                </select>
              </div>
              <button type="submit" className="login-btn" style={{backgroundColor: '#10b981'}}>{t('registerBtn')}</button>
            </form>
          )}

          {/* Niche wala Toggle Button */}
          <p 
            style={{marginTop: '20px', cursor: 'pointer', color: '#3b82f6', fontWeight: 'bold'}} 
            onClick={() => { setIsLoginView(!isLoginView); setMessage(null); }}
          >
            {isLoginView ? t('newAccount') : t('alreadyAccount')}
          </p>

          {/* Success ya Error Message */}
          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
