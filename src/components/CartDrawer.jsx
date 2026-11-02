import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../data/products';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    openConsultationModal
  } = useShop();

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart"
      >
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={20} />
            <h3>Your Perfa Cart</h3>
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

        <div className="cart-drawer-body">
          {checkoutSuccess ? (
            <div className="cart-checkout-success">
              <CheckCircle2 size={44} className="success-icon" />
              <h4>Order Request Received!</h4>
              <p>
                Our Hanoi Delivery &amp; Design Concierge will call you within 30 minutes to confirm your fabric swatch, delivery date, and free assembly.
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={42} className="empty-icon" />
              <h4>Your cart is currently empty</h4>
              <p>
                Explore our pet-friendly and washable family sofas crafted for Hanoi homes.
              </p>
              <Link
                to="/shop"
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
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
                      {product.material} • {product.color}
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
          )}
        </div>

        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="cart-drawer-footer">
            <div className="cart-perks-note">
              ✓ Free Hanoi Delivery &amp; Professional Assembly Included
            </div>
            <div className="cart-subtotal-row">
              <span>Total (VND)</span>
              <strong>{formatVND(cartTotal)}</strong>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={handleCheckout}
            >
              Proceed to Order &amp; Free Assembly
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
