import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  HeartHandshake,
  CreditCard,
  Compass,
  Quote,
  CheckCircle2,
  PawPrint,
  Droplets,
  Baby
} from 'lucide-react';
import {
  products,
  featuredCollections,
  wixPortfolioItems,
  whyPerfaServices,
  materialSwatches,
  testimonials,
  formatVND
} from '../data/products';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

export default function HomePage() {
  const { openConsultationModal, showToast } = useShop();
  const [activeCatalogTab, setActiveCatalogTab] = useState('All');
  const [quickContactSent, setQuickContactSent] = useState(false);
  const [quickContact, setQuickContact] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const catalogProducts =
    activeCatalogTab === 'All'
      ? products.slice(0, 6)
      : products.filter((p) => p.wixCategory === activeCatalogTab);

  const handleQuickContactSubmit = (e) => {
    e.preventDefault();
    setQuickContactSent(true);
    setQuickContact({ name: '', phone: '', email: '', message: '' });
    showToast('Thank you! Our Hanoi team has received your message.');
  };

  return (
    <div className="home-page">
      {/* 1. HERO BANNER (Matches Wix Section 2 #comp-m8ley4yv + Enhanced CTA) */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <PawPrint size={15} />
              <span>HANOI FAMILY &amp; PET-FRIENDLY SOFA SPECIALIST</span>
            </div>
            <h1 className="hero-headline">Unique Elegance for Everyday Family Life</h1>
            <p className="hero-subheadline">
              Crafting spaces where luxury meets family comfort. Durable, scratch-resistant, and machine-washable sofas thoughtfully designed for Hanoi households with young children and pets.
            </p>

            <div className="hero-cta-group">
              <Link to="/shop" className="btn btn-light-cream btn-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                className="btn btn-outline-light btn-lg"
                onClick={() => openConsultationModal()}
              >
                Experience Perfa
              </button>
            </div>

            <div className="hero-trust-row">
              <div className="hero-trust-item">
                <PawPrint size={16} />
                <span>Claw-Proof Weave</span>
              </div>
              <div className="hero-trust-item">
                <Droplets size={16} />
                <span>Washable Covers</span>
              </div>
              <div className="hero-trust-item">
                <Baby size={16} />
                <span>Child-Safe Edges</span>
              </div>
              <div className="hero-trust-item">
                <Truck size={16} />
                <span>Free Hanoi Assembly</span>
              </div>
            </div>
          </div>

          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85"
              alt="Perfa Luna 3-Seater Family Sofa in a warm Hanoi living room"
              className="hero-main-img"
            />
            <div className="hero-floating-badge">
              <span className="floating-badge-label">Featured Best Seller</span>
              <strong>Luna 3-Seater Sofa</strong>
              <span className="floating-badge-price">25,000,000 ₫ • Pet-Friendly Fabric</span>
              <Link to="/product/1" className="floating-badge-link">
                View Sofa <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS SECTION (4 Category Cards) */}
      <section className="section featured-collections-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Curated for Hanoi Homes</span>
              <h2 className="section-title">Featured Collections</h2>
            </div>
            <Link to="/shop" className="section-link">
              View All 12 Sofas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="collections-grid">
            {featuredCollections.map((col) => {
              const queryParam =
                col.filterType === 'material'
                  ? `/shop?material=${encodeURIComponent(col.filterValue)}`
                  : `/shop?seatCount=${encodeURIComponent(col.filterValue)}`;
              return (
                <Link
                  to={queryParam}
                  key={col.id}
                  className="collection-card"
                >
                  <div className="collection-card-img-wrap">
                    <img
                      src={col.image}
                      alt={col.title}
                      className="collection-card-img"
                      loading="lazy"
                    />
                    <span className="collection-count-badge">{col.itemCount}</span>
                  </div>
                  <div className="collection-card-content">
                    <span className="collection-subtitle">{col.subtitle}</span>
                    <h3 className="collection-title">{col.title}</h3>
                    <p className="collection-desc">{col.description}</p>
                    <span className="collection-cta">
                      Explore Category <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION (4 Flagship Product Cards) */}
      <section className="section best-sellers-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Most Loved by Young Families</span>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-subtitle">
                Engineered with removable washable covers and pet-friendly fabrics — priced from 11,000,000 ₫ to 60,000,000 ₫.
              </p>
            </div>
            <Link to="/shop" className="btn btn-primary">
              Shop All Sofas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WIX ABOUT VISION/MISSION + PORTFOLIO & PRODUCT CATALOG SHOWCASE */}
      <section className="section wix-about-banner-section">
        <div className="container">
          <div className="wix-about-split">
            <div className="wix-about-text-col">
              <span className="section-eyebrow light">About Perfa Hanoi</span>
              <h2 className="wix-about-heading">
                Built for Homes with Active Kids &amp; Beloved Pets
              </h2>
              <div className="wix-vision-mission-cards">
                <div className="vision-card">
                  <h3>Our Vision</h3>
                  <p>
                    To make durable, family-friendly furniture accessible and affordable for households with children and pets, helping them create safe, comfortable, and functional homes.
                  </p>
                </div>
                <div className="vision-card">
                  <h3>Our Mission</h3>
                  <p>
                    To become a trusted mid-range furniture e-commerce brand in Hanoi for young families, recognized for practical design, pet- and child-friendly materials, and reliable service.
                  </p>
                </div>
              </div>
              <Link to="/about" className="btn btn-light-cream">
                Read Our Full Story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="wix-about-image-col">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                alt="Happy dogs relaxing on a durable Perfa sofa"
                className="wix-about-img"
              />
            </div>
          </div>

          {/* Wix Portfolio Strip (#comp-m8lfzgqb) */}
          <div className="wix-portfolio-block" id="portfolio">
            <div className="wix-portfolio-header">
              <div>
                <span className="section-eyebrow light">Real Hanoi Living Rooms</span>
                <h3 className="wix-portfolio-title">Our Portfolio</h3>
              </div>
              <Link to="/shop" className="btn btn-outline-light btn-sm">
                See Full Catalog <ArrowRight size={14} />
              </Link>
            </div>
            <div className="wix-portfolio-grid">
              {wixPortfolioItems.map((item) => (
                <Link
                  to={`/product/${item.linkedProductId}`}
                  key={item.id}
                  className="wix-portfolio-card"
                >
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="wix-portfolio-overlay">
                    <span className="portfolio-cat">{item.category}</span>
                    <h4>{item.title}</h4>
                    <p>{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wix Categorized Product Catalog Preview (#comp-mvtsvux1 / #comp-mvtwhk66 / #comp-mvtxph5v) */}
      <section className="section wix-catalog-preview-section" id="catalog">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Browse by Silhouette</span>
              <h2 className="section-title">Product Catalog</h2>
            </div>
            <div className="catalog-tabs" role="tablist">
              {['All', 'Single Seat & Compact', 'Sofa & Daybeds', 'Corner & Modular'].map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeCatalogTab === tab}
                    className={`catalog-tab-btn ${
                      activeCatalogTab === tab ? 'active' : ''
                    }`}
                    onClick={() => setActiveCatalogTab(tab)}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="product-grid-3">
            {catalogProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. "WHY PERFA" BENEFITS, MATERIALS & SERVICES SECTION (Matches Wix Sections 8 & 11) */}
      <section className="section why-perfa-section" id="services">
        <div className="container">
          <div className="section-header centered">
            <span className="section-eyebrow">Why Families in Hanoi Choose Perfa</span>
            <h2 className="section-title">Why Perfa &amp; Our Services</h2>
            <p className="section-subtitle">
              From claw-resistant fabrics and machine-washable slipcovers to complimentary room layout advice and white-glove assembly in Hanoi.
            </p>
          </div>

          {/* 4 Services from Wix (#comp-m8lfbrub) */}
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-box">
                <Compass size={26} />
              </div>
              <h3>{whyPerfaServices[0].title}</h3>
              <p>{whyPerfaServices[0].description}</p>
            </div>

            <div className="service-card">
              <div className="service-icon-box">
                <Truck size={26} />
              </div>
              <h3>{whyPerfaServices[1].title}</h3>
              <p>{whyPerfaServices[1].description}</p>
            </div>

            <div className="service-card">
              <div className="service-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3>{whyPerfaServices[2].title}</h3>
              <p>{whyPerfaServices[2].description}</p>
            </div>

            <div className="service-card">
              <div className="service-icon-box">
                <CreditCard size={26} />
              </div>
              <h3>{whyPerfaServices[3].title}</h3>
              <p>{whyPerfaServices[3].description}</p>
            </div>
          </div>

          {/* Wix Materials Showcase (#comp-mvxxjr3c) */}
          <div className="materials-showcase-box" id="materials">
            <div className="materials-showcase-header">
              <div>
                <span className="section-eyebrow">Engineered for Kids &amp; Pets</span>
                <h3 className="materials-showcase-title">Signature Perfa Materials</h3>
              </div>
              <p className="materials-showcase-note">
                Click any material below to filter sofas crafted with that exact upholstery.
              </p>
            </div>

            <div className="materials-swatch-grid">
              {materialSwatches.map((mat) => (
                <Link
                  to={`/shop?material=${encodeURIComponent(mat.name)}`}
                  key={mat.name}
                  className="material-swatch-card"
                >
                  <div className="material-swatch-img-wrap">
                    <img src={mat.image} alt={mat.name} loading="lazy" />
                    <span className="material-swatch-badge">{mat.badge}</span>
                  </div>
                  <div className="material-swatch-info">
                    <h4>{mat.name}</h4>
                    <p>{mat.description}</p>
                    <span className="material-swatch-link">
                      Shop {mat.name} Sofas <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS SECTION (Matches Wix Sections 9, 10 & 12) */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header centered">
            <span className="section-eyebrow">Trusted by Hanoi Households</span>
            <h2 className="section-title">Client Testimonials</h2>
            <p className="section-subtitle">
              Real stories from parents and pet owners across Hanoi who upgraded their living rooms with Perfa.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <article key={item.id} className="testimonial-card">
                <div className="testimonial-image-wrap">
                  <img src={item.image} alt={item.family} loading="lazy" />
                  <span className="testimonial-location-pill">{item.location}</span>
                </div>
                <div className="testimonial-body">
                  <Quote size={24} className="quote-icon" />
                  <p className="testimonial-quote">"{item.quote}"</p>
                  <div className="testimonial-author">
                    <strong>{item.family}</strong>
                    <span>{item.household}</span>
                  </div>
                  <div className="testimonial-sofa-link-row">
                    <span>Purchased:</span>
                    <Link to={`/product/${item.productId}`}>
                      {item.sofaPurchased} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOMEPAGE CONTACT SECTION (Matches Wix Section 13 #comp-m8lgly9k) */}
      <section className="section home-contact-section">
        <div className="container">
          <div className="home-contact-card">
            <div className="home-contact-info">
              <span className="section-eyebrow light">Visit or Message Us</span>
              <h2>Contact Us</h2>
              <p>
                Have a project in mind or need help choosing the right pet-friendly sofa for your Hanoi apartment? Reach out to us today to start creating your dream space.
              </p>
              <div className="home-contact-highlights">
                <div>
                  <strong>Hanoi Showroom</strong>
                  <span>207 Giai Phong Street, Bach Mai Ward, Hanoi, Vietnam</span>
                </div>
                <div>
                  <strong>Direct Hotline &amp; Email</strong>
                  <span>123-456-7890 • perfa.corp@gmail.com</span>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80"
                alt="Perfa Hanoi Showroom Interior"
                className="home-contact-preview-img"
              />
            </div>

            <div className="home-contact-form-wrap">
              {quickContactSent ? (
                <div className="contact-success-box">
                  <CheckCircle2 size={42} />
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for reaching out to Perfa. Our Hanoi design consultant will respond within 2 business hours.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setQuickContactSent(false)}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickContactSubmit} className="wix-contact-form">
                  <h3>Send an Inquiry</h3>
                  <div className="form-group">
                    <label htmlFor="home-contact-name">Full Name *</label>
                    <input
                      id="home-contact-name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={quickContact.name}
                      onChange={(e) =>
                        setQuickContact({ ...quickContact, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="home-contact-phone">Phone Number *</label>
                      <input
                        id="home-contact-phone"
                        type="tel"
                        required
                        placeholder="e.g. 0912 345 678"
                        value={quickContact.phone}
                        onChange={(e) =>
                          setQuickContact({ ...quickContact, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="home-contact-email">Email *</label>
                      <input
                        id="home-contact-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={quickContact.email}
                        onChange={(e) =>
                          setQuickContact({ ...quickContact, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="home-contact-msg">Message</label>
                    <textarea
                      id="home-contact-msg"
                      rows={4}
                      placeholder="Tell us about your living room dimensions, kids, or pets..."
                      value={quickContact.message}
                      onChange={(e) =>
                        setQuickContact({ ...quickContact, message: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
