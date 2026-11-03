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
    setCartView
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
      setErrorMsg('Vui lòng nhập Email/SĐT và Mật khẩu.');
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
      identifier: 'khachhang@perfa.vn',
      password: '123456'
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regData.fullName.trim() || !regData.phone.trim() || !regData.password.trim()) {
      setErrorMsg('Vui lòng điền Họ tên, Số điện thoại và Mật khẩu.');
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
    <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="auth-modal"
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
                  <User size={14} /> Họ và tên (Full Name)
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
                    <PhoneCall size={14} /> Số điện thoại
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
                  <MapPin size={14} /> Địa chỉ giao hàng mặc định (Hà Nội)
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tòa nhà, đường, quận tại Hà Nội..."
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, address: e.target.value }))
                  }
                />
              </div>

              <div className="auth-profile-actions">
                <button type="submit" className="btn btn-primary btn-full">
                  Lưu thông tin (Save Profile)
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
                  <ClipboardList size={16} /> Xem &amp; Hủy đơn hàng ({orders.length})
                </button>
                <button
                  type="button"
                  className="btn-logout-account"
                  onClick={logoutUser}
                >
                  <LogOut size={15} /> Đăng xuất (Sign Out)
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* LOGGED OUT: SIGN IN / REGISTER TABS */
          <div className="auth-guest-view">
            <div className="auth-brand-top">
              <span className="eyebrow-tag">
                <Sparkles size={13} /> PERFA HANOI ACCOUNT
              </span>
              <h3>
                {activeTab === 'login'
                  ? 'Welcome Back (Đăng nhập)'
                  : 'Create Account (Đăng ký)'}
              </h3>
              <p>
                Đăng nhập để lưu địa chỉ nhận hàng, thanh toán nhanh và quản lý đơn hàng của bạn.
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
                Đăng nhập (Sign In)
              </button>
              <button
                type="button"
                className={`auth-tab-item ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                }}
              >
                Đăng ký mới (Register)
              </button>
            </div>

            {errorMsg && <div className="checkout-error-banner">{errorMsg}</div>}

            {activeTab === 'login' ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="checkout-field">
                  <label htmlFor="auth-login-id">
                    <User size={14} /> Email hoặc Số điện thoại *
                  </label>
                  <input
                    id="auth-login-id"
                    type="text"
                    required
                    placeholder="khachhang@perfa.vn hoặc 0912345678"
                    value={loginData.identifier}
                    onChange={(e) =>
                      setLoginData((p) => ({ ...p, identifier: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="auth-login-pw">
                    <Lock size={14} /> Mật khẩu (Password) *
                  </label>
                  <input
                    id="auth-login-pw"
                    type="password"
                    required
                    placeholder="Nhập mật khẩu..."
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                  Đăng nhập (Sign In)
                </button>

                <div className="auth-demo-box">
                  <span>Muốn thử nhanh?</span>
                  <button
                    type="button"
                    className="btn-demo-login"
                    onClick={handleDemoLogin}
                  >
                    Đăng nhập nhanh bằng Tài khoản Mẫu (1-Click)
                  </button>
                </div>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <div className="checkout-field">
                  <label htmlFor="reg-name">
                    <User size={14} /> Họ và tên (Full Name) *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Nguyễn Minh Anh"
                    value={regData.fullName}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, fullName: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field-row">
                  <div className="checkout-field">
                    <label htmlFor="reg-phone">
                      <PhoneCall size={14} /> Số điện thoại *
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
                      placeholder="ban@email.com"
                      value={regData.email}
                      onChange={(e) =>
                        setRegData((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="reg-addr">
                    <MapPin size={14} /> Địa chỉ nhận hàng (Hà Nội)
                  </label>
                  <input
                    id="reg-addr"
                    type="text"
                    placeholder="Số nhà, đường, quận tại Hà Nội..."
                    value={regData.address}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, address: e.target.value }))
                    }
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="reg-pw">
                    <Lock size={14} /> Mật khẩu *
                  </label>
                  <input
                    id="reg-pw"
                    type="password"
                    required
                    placeholder="Tối thiểu 4 ký tự..."
                    value={regData.password}
                    onChange={(e) =>
                      setRegData((p) => ({ ...p, password: e.target.value }))
                    }
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                  Tạo tài khoản (Create Account)
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
