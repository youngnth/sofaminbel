import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  PhoneCall,
  MapPin,
  LogOut,
  ClipboardList,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AuthModal() {
  const {
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    orders,
    setIsCartOpen,
    setCartView,
    theme,
    modalTopOffset
  } = useShop();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  // Register form state
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: ''
  });

  // Profile edit state when logged in
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || ''
      });
    }
    setErrorMsg('');
  }, [currentUser, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginData.identifier.trim() || !loginData.password.trim()) {
      setErrorMsg('Please enter your Email / Phone Number and Password.');
      return;
    }
    const res = loginUser(loginData);
    if (!res.ok) {
      setErrorMsg(res.message);
    }
  };

  const handleDemoLogin = () => {
    setErrorMsg('');
    loginUser({
      identifier: 'guest@perfa.vn',
      password: '123456'
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regData.fullName.trim() || !regData.phone.trim() || !regData.password.trim()) {
      setErrorMsg('Please fill in your Full Name, Phone Number, and Password.');
      return;
    }
    const res = registerUser(regData);
    if (!res.ok) {
      setErrorMsg(res.message);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(profileData);
  };

  return (
    <div
      className="modal-backdrop modal-backdrop-center"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="auth-modal"
        style={{ marginTop: `${modalTopOffset}px` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="User Account"
      >
        <button
          type="button"
          className="modal-close-btn modal-close-abs"
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {currentUser ? (
          /* LOGGED IN: USER PROFILE & ORDERS SHORTCUT */
          <div className="auth-profile-view">
            <div className="auth-profile-header">
              <div className="auth-avatar-circle">
                {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span className="auth-member-badge">
                  <CheckCircle2 size={12} /> Perfa Hanoi Member
                </span>
                <h3>{currentUser.fullName}</h3>
                <p>{currentUser.email || currentUser.phone}</p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleProfileSave}>
              <div className="checkout-field">
                <label>
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label>
                    <PhoneCall size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, phone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="checkout-field">
                  <label>
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label>
                  <MapPin size={14} /> Default Delivery Address (Hanoi)
                </label>
                <input
                  type="text"
                  placeholder="Apartment, building, street, district in Hanoi..."
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, address: e.target.value }))
                  }
                />
              </div>

              <div className="auth-profile-actions">
                <button type="submit" className="btn btn-primary btn-full">
                  Save Profile
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setCartView('orders');
                    setIsCartOpen(true);
                  }}
                >
                  <ClipboardList size={16} /> View &amp; Manage Orders ({orders.length})
                </button>
                <button
                  type="button"
                  className="btn-logout-account"
                  onClick={logoutUser}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* LOGGED OUT: SIGN IN / REGISTER TABS */
          <div className="auth-guest-view">
            <div className="auth-brand-top">
              <img
                src={theme === 'dark' ? '/logo-header-light.png' : '/logo-full-dark.png'}
                alt="Perfa — Sofa & Premium Furniture"
                className="auth-modal-logo"
              />
              <span className="eyebrow-tag">
                <Sparkles size={13} /> PERFA HANOI ACCOUNT
              </span>
              <h3>
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p>
                Sign in to save your delivery address, enjoy faster checkout, and manage your orders.
              </p>
            </div>

            <div className="auth-tabs-bar">
              <button
                type="button"
                className={`auth-tab-item ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-item ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                }}
              >
                Register
              </button>
            </div>

            {errorMsg && <div className="checkout-error-banner">{errorMsg}</div>}

            {activeTab === 'login' ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="checkout-field">
                  <label htmlFor="auth-login-id">
                    <User size={14} /> Email or Phone Number *
                  </label>
                  <input
                    id="auth-login-id"
                    type="text"
                    required
                    placeholder="guest@perfa.vn or 0912345678"
                    value={loginData.identifier}
                    onChange={(e) =>
                      setLoginData((p) => ({ ...p, identifier: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="auth-login-pw">
                    <Lock size={14} /> Password *
                  </label>
                  <input
                    id="auth-login-pw"
                    type="password"
                    required
                    placeholder="Enter your password..."
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                  Sign In
                </button>

                <div className="auth-demo-box">
                  <span>Want to test quickly?</span>
                  <button
                    type="button"
                    className="btn-demo-login"
                    onClick={handleDemoLogin}
                  >
                    Quick Sign In with Demo Account (1-Click)
                  </button>
                </div>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <div className="checkout-field">
                  <label htmlFor="reg-name">
                    <User size={14} /> Full Name *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Nguyen"
                    value={regData.fullName}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, fullName: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field-row">
                  <div className="checkout-field">
                    <label htmlFor="reg-phone">
                      <PhoneCall size={14} /> Phone Number *
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={regData.phone}
                      onChange={(e) =>
                        setRegData((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="reg-email">
                      <Mail size={14} /> Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="you@example.com"
                      value={regData.email}
                      onChange={(e) =>
                        setRegData((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="reg-addr">
                    <MapPin size={14} /> Delivery Address (Hanoi)
                  </label>
                  <input
                    id="reg-addr"
                    type="text"
                    placeholder="Apartment, street, district in Hanoi..."
                    value={regData.address}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, address: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="reg-pw">
                    <Lock size={14} /> Password *
                  </label>
                  <input
                    id="reg-pw"
                    type="password"
                    required
                    placeholder="At least 4 characters..."
                    value={regData.password}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                  Create Account
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
