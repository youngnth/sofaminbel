import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatVND, formatVNDWithCode } from '../data/products';
import { searchProducts } from '../utils/searchProducts';
import { useShop } from '../context/ShopContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsCartOpen, openConsultationModal, products } = useShop();

  const searchResults = searchProducts(products, searchQuery);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (searchResults.length === 1) {
      navigate(`/product/${searchResults[0].id}`);
      setIsSearchOpen(false);
    } else {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleQuickQuery = (term) => {
    setSearchQuery(term);
    setIsSearchOpen(true);
  };

  return (
    <header className="site-header">
      {/* Top Wix-style announcement bar */}
      <div className="top-announcement-bar">
        <div className="container top-announcement-inner">
          <span className="announcement-text">
            <Sparkles size={14} className="inline-icon" />
            Family &amp; Pet-Friendly Sofas in Hanoi • Washable Covers • Free Design Consultation
          </span>
          <div className="announcement-links">
            <a href="tel:1234567890" className="announcement-link">
              <PhoneCall size={13} /> Hotline: 123-456-7890
            </a>
            <span className="divider">|</span>
            <span>207 Giai Phong St, Hanoi</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header matching Wix #SITE_HEADER */}
      <div className="main-header-bar">
        <div className="container header-inner">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" aria-label="PERFA Home">
            <span className="brand-logo-text">PERFA</span>
            <span className="brand-logo-sub">HANOI • EST. 2026</span>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="desktop-nav" aria-label="Primary Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Search Bar & Actions */}
          <div className="header-actions">
            <div className="header-search-wrapper" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="header-search-form" role="search">
                <Search size={17} className="search-icon" />
                <input
                  type="text"
                  className="header-search-input"
                  placeholder="Search sofa or price (e.g. Luna Sofa, 25 million)..."
                  aria-label="Search products by name or price"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </form>

              {/* Live Search Dropdown */}
              {isSearchOpen && (
                <div className="search-dropdown" data-testid="search-dropdown">
                  {!searchQuery.trim() ? (
                    <div className="search-suggestions">
                      <p className="search-dropdown-label">Popular Searches</p>
                      <div className="search-chip-group">
                        <button
                          type="button"
                          className="search-chip"
                          onClick={() => handleQuickQuery('Luna Sofa')}
                        >
                          Luna Sofa
                        </button>
                        <button
                          type="button"
                          className="search-chip"
                          onClick={() => handleQuickQuery('25 million')}
                        >
                          25 million
                        </button>
                        <button
                          type="button"
                          className="search-chip"
                          onClick={() => handleQuickQuery('25000000')}
                        >
                          25000000
                        </button>
                        <button
                          type="button"
                          className="search-chip"
                          onClick={() => handleQuickQuery('Pet-Friendly')}
                        >
                          Pet-Friendly
                        </button>
                        <button
                          type="button"
                          className="search-chip"
                          onClick={() => handleQuickQuery('Stain-Resistant Linen')}
                        >
                          Stain-Resistant Linen
                        </button>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="search-results-list">
                      <div className="search-results-header">
                        <span>
                          Matching Sofas ({searchResults.length})
                        </span>
                        <button
                          type="button"
                          className="view-all-search-btn"
                          onClick={handleSearchSubmit}
                        >
                          View in Shop <ArrowRight size={13} />
                        </button>
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="search-result-item"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="search-result-thumb"
                          />
                          <div className="search-result-info">
                            <div className="search-result-name">
                              {product.name}
                            </div>
                            <div className="search-result-meta">
                              <span>{product.material}</span>
                              <span>•</span>
                              <span>{product.seatCount}-Seater</span>
                              <span>•</span>
                              <span>{product.color}</span>
                            </div>
                          </div>
                          <div className="search-result-price">
                            <span className="price-primary">
                              {formatVND(product.price)}
                            </span>
                            <span className="price-secondary">
                              {formatVNDWithCode(product.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="search-no-results">
                      <p>
                        No exact matches found for "<strong>{searchQuery}</strong>".
                      </p>
                      <p className="search-no-results-hint">
                        Try searching by sofa name (e.g. "Luna Sofa", "Cloud") or price (e.g. "25 million", "25000000").
                      </p>
                      <Link
                        to="/shop"
                        className="btn btn-outline btn-sm"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        Browse All 12 Sofas
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <ShoppingBag size={19} />
              <span className="cart-btn-label">Cart</span>
              <span className="cart-badge">{cartCount}</span>
            </button>

            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <>
                  <X size={20} /> <span>Close</span>
                </>
              ) : (
                <>
                  <Menu size={20} /> <span>MENU</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="container">
            <nav className="mobile-nav-links">
              <NavLink to="/" end className="mobile-nav-link">
                Home
              </NavLink>
              <NavLink to="/shop" className="mobile-nav-link">
                Shop Collection
              </NavLink>
              <NavLink to="/about" className="mobile-nav-link">
                About Us
              </NavLink>
              <NavLink to="/contact" className="mobile-nav-link">
                Contact Us
              </NavLink>
            </nav>
            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openConsultationModal();
                }}
              >
                Free Design Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
