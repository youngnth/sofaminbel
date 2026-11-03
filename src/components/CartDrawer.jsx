import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  ClipboardList,
  PhoneCall,
  MapPin,
  User,
  Mail,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../data/products';

export default function CartDrawer() {
  const {
    products,
    cartItems,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    cartView,
    setCartView,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    orders,
    placeOrder,
    openConsultationModal
  } = useShop();

  const [lastOrder, setLastOrder] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cod',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setFormError('Please fill in your Full Name, Phone Number, and Delivery Address.');
      return;
    }
    const createdOrder = placeOrder(formData);
    setLastOrder(createdOrder);
    setCartView('success');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      paymentMethod: 'cod',
      notes: ''
    });
  };

  // Suggest up to 4 popular sofas for quick-adding right inside the cart drawer
  const quickAddProducts = products
    .filter((p) => !cartItems.some((item) => item.product.id === p.id))
    .slice(0, 4);

  return (
    <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart"
      >
        {/* Header with Cart & Orders Tabs */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-tabs">
            <button
              type="button"
              className={`cart-tab-btn ${cartView === 'cart' || cartView === 'checkout' || cartView === 'success' ? 'active' : ''}`}
              onClick={() => setCartView('cart')}
            >
              <ShoppingBag size={17} />
              <span>Your Cart ({cartCount})</span>
            </button>
            <button
              type="button"
              className={`cart-tab-btn ${cartView === 'orders' ? 'active' : ''}`}
              onClick={() => setCartView('orders')}
            >
              <ClipboardList size={17} />
              <span>Orders ({orders.length})</span>
            </button>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="cart-drawer-body">
          {/* VIEW 1: ORDER CONFIRMED RECEIPT */}
          {cartView === 'success' && lastOrder ? (
            <div className="cart-checkout-success">
              <CheckCircle2 size={46} className="success-icon" />
              <span className="order-code-pill">Order #{lastOrder.id}</span>
              <h4>Thank You for Your Order!</h4>
              <p>
                Our Hanoi Delivery &amp; Concierge team will call{' '}
                <strong>{lastOrder.customer.phone}</strong> within 30 minutes to confirm your delivery schedule and free assembly.
              </p>

              <div className="order-receipt-box">
                <div className="receipt-row">
                  <span>Customer:</span>
                  <strong>{lastOrder.customer.fullName}</strong>
                </div>
                <div className="receipt-row">
                  <span>Delivery Address:</span>
                  <strong>{lastOrder.customer.address}</strong>
                </div>
                <div className="receipt-row">
                  <span>Payment Method:</span>
                  <strong>
                    {lastOrder.customer.paymentMethod === 'cod'
                      ? 'COD (Pay on Delivery)'
                      : lastOrder.customer.paymentMethod === 'bank'
                      ? 'Bank Transfer (VietQR)'
                      : '0% Installment Plan (12 Months)'}
                  </strong>
                </div>
                <div className="receipt-divider" />
                {lastOrder.items.map(({ product, quantity }) => (
                  <div key={product.id} className="receipt-item-row">
                    <span>
                      {product.name} × {quantity}
                    </span>
                    <strong>{formatVND(product.price * quantity)}</strong>
                  </div>
                ))}
                <div className="receipt-divider" />
                <div className="receipt-row total">
                  <span>Total Amount:</span>
                  <strong>{formatVND(lastOrder.total)}</strong>
                </div>
              </div>

              <div className="success-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={() => setCartView('orders')}
                >
                  View Order History ({orders.length})
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => {
                    setCartView('cart');
                    setIsCartOpen(false);
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : cartView === 'orders' ? (
            /* VIEW 2: SAVED ORDERS HISTORY */
            <div className="cart-orders-view">
              {orders.length === 0 ? (
                <div className="cart-empty-state">
                  <ClipboardList size={42} className="empty-icon" />
                  <h4>No orders placed yet</h4>
                  <p>
                    Once you complete a purchase, your order details and delivery status will be saved right here.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCartView('cart')}
                  >
                    Back to Cart
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((ord) => (
                    <div key={ord.id} className="saved-order-card">
                      <div className="saved-order-top">
                        <span className="order-id-badge">#{ord.id}</span>
                        <span className="order-date-text">{ord.createdAt}</span>
                      </div>
                      <div className="order-status-line">{ord.status}</div>
                      <div className="saved-order-customer">
                        <p>
                          <strong>{ord.customer.fullName}</strong> • {ord.customer.phone}
                        </p>
                        <p className="order-addr">{ord.customer.address}</p>
                      </div>
                      <div className="saved-order-items">
                        {ord.items.map(({ product, quantity }) => (
                          <div key={product.id} className="saved-order-item-line">
                            <span>
                              {product.name} ({product.material}) × {quantity}
                            </span>
                            <strong>{formatVND(product.price * quantity)}</strong>
                          </div>
                        ))}
                      </div>
                      <div className="saved-order-total">
                        <span>Total Paid / Due:</span>
                        <strong>{formatVND(ord.total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : cartView === 'checkout' && cartItems.length > 0 ? (
            /* VIEW 3: STEP-BY-STEP CHECKOUT FORM */
            <form className="cart-checkout-form" onSubmit={handleCheckoutSubmit}>
              <button
                type="button"
                className="back-to-cart-link"
                onClick={() => setCartView('cart')}
              >
                <ArrowLeft size={15} /> Back to Cart ({cartCount} items)
              </button>

              <div className="checkout-mini-summary">
                <div>
                  <span className="mini-summary-label">Order Summary ({cartCount} items)</span>
                  <strong className="mini-summary-total">{formatVND(cartTotal)}</strong>
                </div>
                <span className="free-ship-pill">Free Hanoi Delivery</span>
              </div>

              {formError && <div className="checkout-error-banner">{formError}</div>}

              <div className="checkout-field">
                <label htmlFor="checkout-fullName">
                  <User size={14} /> Full Name (Họ và tên) *
                </label>
                <input
                  id="checkout-fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Nguyen Minh Anh"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label htmlFor="checkout-phone">
                    <PhoneCall size={14} /> Phone Number (SĐT) *
                  </label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="e.g. 0912 345 678"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="checkout-field">
                  <label htmlFor="checkout-email">
                    <Mail size={14} /> Email (Optional)
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-address">
                  <MapPin size={14} /> Delivery Address in Hanoi (Địa chỉ nhận hàng) *
                </label>
                <input
                  id="checkout-address"
                  name="address"
                  type="text"
                  required
                  placeholder="Apartment, Building, Street, District, Hanoi"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkout-field">
                <label>Payment Method (Phương thức thanh toán)</label>
                <div className="payment-methods-grid">
                  <label
                    className={`payment-method-option ${
                      formData.paymentMethod === 'cod' ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <Banknote size={18} />
                    <div>
                      <strong>COD — Pay on Delivery</strong>
                      <span>Inspect your sofa at home in Hanoi before paying</span>
                    </div>
                  </label>

                  <label
                    className={`payment-method-option ${
                      formData.paymentMethod === 'bank' ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleInputChange}
                    />
                    <QrCode size={18} />
                    <div>
                      <strong>Bank Transfer (24/7 VietQR)</strong>
                      <span>Instant transfer to PERFA HANOI CO., LTD</span>
                    </div>
                  </label>

                  <label
                    className={`payment-method-option ${
                      formData.paymentMethod === 'installment' ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="installment"
                      checked={formData.paymentMethod === 'installment'}
                      onChange={handleInputChange}
                    />
                    <CreditCard size={18} />
                    <div>
                      <strong>0% Interest Installment (12 Months)</strong>
                      <span>
                        Only {formatVND(Math.round(cartTotal / 12))}/month via Visa/Mastercard
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'bank' && (
                <div className="bank-transfer-info-box">
                  <p>
                    <strong>Bank:</strong> Vietcombank — Hanoi Branch
                  </p>
                  <p>
                    <strong>Account No:</strong> <code>0011004567899</code>
                  </p>
                  <p>
                    <strong>Account Name:</strong> PERFA HANOI FURNITURE
                  </p>
                  <p className="bank-note">
                    Transfer content: <em>[Your Name] + [Phone Number]</em>
                  </p>
                </div>
              )}

              <div className="checkout-field">
                <label htmlFor="checkout-notes">
                  <FileText size={14} /> Delivery Notes / Free Swatch Request
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  rows={2}
                  placeholder="Preferred delivery date, apartment elevator info, or request free fabric swatches..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg">
                Confirm &amp; Place Order • {formatVND(cartTotal)}
              </button>
            </form>
          ) : cartItems.length === 0 ? (
            /* VIEW 4: EMPTY CART + INSTANT QUICK-ADD SOFAS */
            <div className="cart-empty-wrapper">
              <div className="cart-empty-state">
                <ShoppingBag size={40} className="empty-icon" />
                <h4>Your cart is currently empty</h4>
                <p>
                  Add a sofa below with 1 click or browse our full collection of 15 sustainable designs.
                </p>
                <Link
                  to="/shop"
                  className="btn btn-primary"
                  onClick={() => setIsCartOpen(false)}
                >
                  Browse Full Shop <ArrowRight size={16} />
                </Link>
              </div>

              <div className="cart-quick-add-section">
                <h5 className="quick-add-heading">Quick Add Popular Sofas</h5>
                <div className="quick-add-list">
                  {quickAddProducts.map((prod) => (
                    <div key={prod.id} className="quick-add-item">
                      <img src={prod.images[0]} alt={prod.name} className="quick-add-img" />
                      <div className="quick-add-info">
                        <strong>{prod.name}</strong>
                        <span>
                          {prod.material} • {prod.color}
                        </span>
                        <span className="quick-add-price">{formatVND(prod.price)}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-quick-add"
                        onClick={() => addToCart(prod, 1)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 5: ACTIVE CART ITEMS LIST */
            <>
              <ul className="cart-item-list">
                {cartItems.map(({ product, quantity }) => (
                  <li key={product.id} className="cart-item">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-details">
                      <Link
                        to={`/product/${product.id}`}
                        className="cart-item-name"
                        onClick={() => setIsCartOpen(false)}
                      >
                        {product.name}
                      </Link>
                      <p className="cart-item-meta">
                        {product.material} • {product.color} ({product.seatCount}-Seater)
                      </p>
                      <p className="cart-item-price">
                        {formatVND(product.price * quantity)}
                      </p>
                      <div className="cart-qty-controls">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              {quickAddProducts.length > 0 && (
                <div className="cart-quick-add-section compact">
                  <h5 className="quick-add-heading">Add Another Piece</h5>
                  <div className="quick-add-list">
                    {quickAddProducts.slice(0, 2).map((prod) => (
                      <div key={prod.id} className="quick-add-item">
                        <img src={prod.images[0]} alt={prod.name} className="quick-add-img" />
                        <div className="quick-add-info">
                          <strong>{prod.name}</strong>
                          <span className="quick-add-price">{formatVND(prod.price)}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-quick-add"
                          onClick={() => addToCart(prod, 1)}
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER FOR CART VIEW */}
        {cartView === 'cart' && cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-perks-note">
              <Truck size={14} /> Free Hanoi Delivery &amp; White-Glove Assembly Included
            </div>
            <div className="cart-subtotal-row">
              <div>
                <span>Total (VND)</span>
                <small className="cart-installment-hint">
                  or {formatVND(Math.round(cartTotal / 12))}/mo (0% for 12 months)
                </small>
              </div>
              <strong>{formatVND(cartTotal)}</strong>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-full btn-lg"
              onClick={() => setCartView('checkout')}
              data-testid="proceed-to-checkout-btn"
            >
              Proceed to Checkout (Đặt mua ngay) <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => {
                setIsCartOpen(false);
                openConsultationModal(cartItems[0].product);
              }}
            >
              Book Free Design Consultation First
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
