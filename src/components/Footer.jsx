import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
  Twitter
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useShop();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please agree to the terms & conditions to subscribe.');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
    setEmail('');
    showToast('Thank you for subscribing to the Perfa Hanoi newsletter!');
  };

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        {/* Column 1: Brand & Contact Info matching Wix Footer */}
        <div className="footer-col footer-brand-col">
          <Link to="/" className="footer-logo">
            PERFA
          </Link>
          <p className="footer-tagline">
            Durable, easy-to-clean, family and pet-friendly sofas crafted for modern households in Hanoi.
          </p>
          <ul className="footer-contact-list">
            <li>
              <Phone size={16} />
              <a href="tel:1234567890">123-456-7890 (Hotline: 1900 6868)</a>
            </li>
            <li>
              <Mail size={16} />
              <a href="mailto:perfa.corp@gmail.com">perfa.corp@gmail.com</a>
            </li>
            <li>
              <MapPin size={16} />
              <span>207 Giai Phong Street, Bach Mai Ward, Hanoi, Vietnam</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore Perfa</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop All Sofas</Link>
            </li>
            <li>
              <Link to="/shop?material=Pet-Friendly+Fabric">Pet-Friendly Collection</Link>
            </li>
            <li>
              <Link to="/shop?material=Stain-Resistant+Linen">Stain-Resistant Linen</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Policies (matching Wix Footer) */}
        <div className="footer-col">
          <h4 className="footer-heading">Customer Care</h4>
          <ul className="footer-links">
            <li>
              <Link to="/contact">Free Design Consultation</Link>
            </li>
            <li>
              <Link to="/about">Hanoi Delivery &amp; Assembly</Link>
            </li>
            <li>
              <Link to="/about">5-Year Frame Warranty</Link>
            </li>
            <li>
              <Link to="/about">0% Installment Financing</Link>
            </li>
            <li>
              <Link to="/about">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/about">Accessibility Statement</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Join the Newsletter + Social Icons */}
        <div className="footer-col footer-newsletter-col">
          <h4 className="footer-heading">Join the Newsletter</h4>
          <p className="footer-newsletter-desc">
            Receive new family sofa arrivals, fabric care tips, and exclusive Hanoi showroom invitations.
          </p>

          {subscribed ? (
            <div className="newsletter-success">
              <CheckCircle2 size={20} />
              <div>
                <strong>Welcome to the Perfa Family!</strong>
                <p>You are subscribed to our Hanoi living updates.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form" noValidate>
              <label htmlFor="footer-email" className="newsletter-label">
                Your Email *
              </label>
              <div className="newsletter-input-row">
                <input
                  id="footer-email"
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="newsletter-submit-btn">
                  Subscribe
                </button>
              </div>
              <label className="newsletter-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>I agree to the terms &amp; conditions</span>
              </label>
              {errorMsg && <p className="newsletter-error">{errorMsg}</p>}
            </form>
          )}

          <div className="footer-social-block">
            <span className="social-heading">Get In Touch</span>
            <div className="social-icons-row">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="social-icon-link"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="social-icon-link"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="social-icon-link"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="social-icon-link"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 by Perfa. Crafted for Family &amp; Pet-Friendly Living in Hanoi.</p>
          <p className="footer-bottom-meta">
            All Prices in VND (₫) • Free Fabric Swatches • Showroom at 207 Giai Phong Street, Hanoi
          </p>
        </div>
      </div>
    </footer>
  );
}
