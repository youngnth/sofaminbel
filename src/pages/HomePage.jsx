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
  Baby,
  Plus,
  Edit2,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { formatVND } from '../data/products';
import ProductCard from '../components/ProductCard';
import SectionToolbar from '../components/SectionToolbar';
import { useShop } from '../context/ShopContext';

export default function HomePage() {
  const {
    openConsultationModal,
    showToast,
    isEditMode,
    products,
    heroData,
    aboutData,
    collections,
    portfolioItems,
    services,
    materials,
    testimonials,
    updateHero,
    updateAbout,
    addProduct,
    updatePortfolioItem,
    deletePortfolioItem,
    updateService,
    updateMaterial,
    updateTestimonial,
    deleteTestimonial,
    openCropModal,
    openItemEditor
  } = useShop();

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

  // Section Edit Handlers
  const handleEditHero = () => {
    openItemEditor({
      title: 'Chỉnh sửa Hero Banner',
      fields: [
        { label: 'Tiêu Đề Lớn (Headline)', key: 'title', type: 'text' },
        { label: 'Đoạn Mô Tả (Subtitle)', key: 'subtitle', type: 'textarea' },
        { label: 'Nút Chính (Primary CTA)', key: 'ctaPrimary', type: 'text' },
        { label: 'Nút Phụ (Secondary CTA)', key: 'ctaSecondary', type: 'text' }
      ],
      initialValues: {
        title: heroData.title,
        subtitle: heroData.subtitle,
        ctaPrimary: heroData.ctaPrimary,
        ctaSecondary: heroData.ctaSecondary
      },
      onSave: (vals) => updateHero(vals)
    });
  };

  const handleCropHero = () => {
    openCropModal({
      initialUrl: heroData.bgImage,
      aspectRatio: 16 / 9,
      title: 'Cắt & Thay ảnh Hero Banner',
      onApply: (croppedDataUrl) => updateHero({ bgImage: croppedDataUrl })
    });
  };

  const handleEditAbout = () => {
    openItemEditor({
      title: 'Chỉnh sửa About Us (Vision & Mission)',
      fields: [
        { label: 'Tiêu Đề Phần (Heading)', key: 'sectionTitle', type: 'text' },
        { label: 'Tiêu Đề Tầm Nhìn (Vision Title)', key: 'visionTitle', type: 'text' },
        { label: 'Nội Dung Tầm Nhìn (Vision Text)', key: 'visionText', type: 'textarea' },
        { label: 'Tiêu Đề Sứ Mệnh (Mission Title)', key: 'missionTitle', type: 'text' },
        { label: 'Nội Dung Sứ Mệnh (Mission Text)', key: 'missionText', type: 'textarea' }
      ],
      initialValues: {
        sectionTitle: aboutData.sectionTitle,
        visionTitle: aboutData.visionTitle,
        visionText: aboutData.visionText,
        missionTitle: aboutData.missionTitle,
        missionText: aboutData.missionText
      },
      onSave: (vals) => updateAbout(vals)
    });
  };

  const handleCropAbout = () => {
    openCropModal({
      initialUrl: aboutData.image,
      aspectRatio: 3 / 4,
      title: 'Cắt & Thay ảnh About Us',
      onApply: (croppedDataUrl) => updateAbout({ image: croppedDataUrl })
    });
  };

  const handleAddNewProduct = () => {
    const newId = String(Date.now());
    const newProd = {
      id: newId,
      name: 'Luna Modular Luxury Sofa',
      price: 29500000,
      material: 'Liocel',
      color: 'Beige',
      colorHex: '#E6DEC8',
      seatCount: 3,
      dimensions: '230 cm (W) × 95 cm (D) × 84 cm (H)',
      isWashable: true,
      isBestSeller: true,
      createdAt: new Date().toISOString(),
      wixCategory: 'Sofa & Daybeds',
      tags: ['Liocel Weave', 'Washable Cover', 'New Arrival'],
      description: 'Handcrafted luxury sofa engineered for modern Hanoi homes with young children and pets.',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
      ]
    };
    addProduct(newProd);
  };

  return (
    <div className={`home-page ${isEditMode ? 'perfa-edit-mode' : ''}`}>
      {/* 1. HERO BANNER */}
      <section className="hero-section">
        <SectionToolbar
          sectionKey="hero"
          sectionName="Hero Banner"
          onEditText={handleEditHero}
          onCropImage={handleCropHero}
        />
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <PawPrint size={15} />
              <span>HANOI FAMILY &amp; PET-FRIENDLY SOFA SPECIALIST</span>
            </div>
            <h1 className="hero-headline">{heroData.title}</h1>
            <p className="hero-subheadline">{heroData.subtitle}</p>

            <div className="hero-cta-group">
              <Link to="/shop" className="btn btn-light-cream btn-lg">
                {heroData.ctaPrimary || 'Shop Now'} <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                className="btn btn-outline-light btn-lg"
                onClick={() => openConsultationModal()}
              >
                {heroData.ctaSecondary || 'Experience Perfa'}
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
              src={heroData.bgImage}
              alt="Perfa Family Sofa in a warm Hanoi living room"
              className="hero-main-img"
            />
            <div className="hero-floating-badge">
              <span className="floating-badge-label">Featured Sofa</span>
              <strong>{heroData.featuredProductName || 'Sage Tufted 3-Seater Sofa'}</strong>
              <span className="floating-badge-price">
                {heroData.featuredProductPrice || '41,900,000 ₫ • Algodão Organic Cotton'}
              </span>
              <Link to={`/product/${products[0]?.id || '1793686225231'}`} className="floating-badge-link">
                View Sofa <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS SECTION */}
      <section className="section featured-collections-section">
        <SectionToolbar
          sectionKey="collections"
          sectionName="Featured Collections"
        />
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Curated for Hanoi Homes</span>
              <h2 className="section-title">Featured Collections</h2>
            </div>
            <Link to="/shop" className="section-link">
              View All {products.length} Sofas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="collections-grid">
            {collections.map((col) => {
              const queryParam =
                col.filterType === 'material'
                  ? `/shop?material=${encodeURIComponent(col.filterValue)}`
                  : `/shop?seatCount=${encodeURIComponent(col.filterValue)}`;
              return (
                <Link to={queryParam} key={col.id} className="collection-card">
                  <div className="collection-card-img-wrap">
                    <img src={col.image} alt={col.title} className="collection-card-img" loading="lazy" />
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

      {/* 3. BEST SELLERS SECTION */}
      <section className="section best-sellers-section">
        <SectionToolbar
          sectionKey="products"
          sectionName="Best Sellers & Products"
        />
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Most Loved by Young Families</span>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-subtitle">
                Engineered with removable washable covers and pet-friendly fabrics — priced from 11,000,000 ₫ to 60,000,000 ₫.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {isEditMode && (
                <button type="button" className="btn btn-secondary-sage" onClick={handleAddNewProduct}>
                  <Plus size={16} /> + Thêm Sofa Mới
                </button>
              )}
              <Link to="/shop" className="btn btn-primary">
                Shop All Sofas <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="product-grid-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {isEditMode && (
              <div className="perfa-add-item-card" onClick={handleAddNewProduct}>
                <div className="perfa-add-icon">+</div>
                <span>Thêm Sofa Mới</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. ABOUT VISION/MISSION + PORTFOLIO SHOWCASE */}
      <section className="section wix-about-banner-section">
        <SectionToolbar
          sectionKey="about"
          sectionName="About Us & Story"
          onEditText={handleEditAbout}
          onCropImage={handleCropAbout}
        />
        <div className="container">
          <div className="wix-about-split">
            <div className="wix-about-text-col">
              <span className="section-eyebrow light">About Perfa Hanoi</span>
              <h2 className="wix-about-heading">{aboutData.sectionTitle}</h2>
              <div className="wix-vision-mission-cards">
                <div className="vision-card">
                  <h3>{aboutData.visionTitle}</h3>
                  <p>{aboutData.visionText}</p>
                </div>
                <div className="vision-card">
                  <h3>{aboutData.missionTitle}</h3>
                  <p>{aboutData.missionText}</p>
                </div>
              </div>
              <Link to="/about" className="btn btn-light-cream">
                Read Our Full Story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="wix-about-image-col">
              <img
                src={aboutData.image}
                alt="Happy dogs relaxing on a durable Perfa sofa"
                className="wix-about-img"
              />
            </div>
          </div>

          {/* Portfolio Strip */}
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
              {portfolioItems.map((item) => (
                <div key={item.id} className="wix-portfolio-card">
                  {isEditMode && (
                    <div className="perfa-card-actions">
                      <button
                        type="button"
                        className="perfa-card-btn"
                        onClick={() => {
                          openItemEditor({
                            title: `Sửa dự án: ${item.title}`,
                            fields: [
                              { label: 'Tên Dự Án (Title)', key: 'title', type: 'text' },
                              { label: 'Địa Điểm (Location)', key: 'location', type: 'text' },
                              { label: 'Phân Loại (Category)', key: 'category', type: 'text' }
                            ],
                            initialValues: { title: item.title, location: item.location, category: item.category },
                            onSave: (vals) => updatePortfolioItem(item.id, vals)
                          });
                        }}
                      >
                        <Edit2 size={12} /> Sửa
                      </button>
                      <button
                        type="button"
                        className="perfa-card-btn btn-crop"
                        onClick={() => {
                          openCropModal({
                            initialUrl: item.image,
                            aspectRatio: 4 / 3,
                            title: `Cắt & Thay ảnh: ${item.title}`,
                            onApply: (url) => updatePortfolioItem(item.id, { image: url })
                          });
                        }}
                      >
                        <ImageIcon size={12} /> Cắt
                      </button>
                      <button
                        type="button"
                        className="perfa-card-btn btn-delete"
                        onClick={() => deletePortfolioItem(item.id)}
                      >
                        <Trash2 size={12} /> Xóa
                      </button>
                    </div>
                  )}
                  <Link to={`/product/${item.linkedProductId || 1}`}>
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="wix-portfolio-overlay">
                      <span className="portfolio-cat">{item.category}</span>
                      <h4>{item.title}</h4>
                      <p>{item.location}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT CATALOG PREVIEW */}
      <section className="section wix-catalog-preview-section" id="catalog">
        <SectionToolbar
          sectionKey="products"
          sectionName="Product Catalog Silhouettes"
        />
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

      {/* 6. "WHY PERFA" SERVICES & SIGNATURE MATERIALS */}
      <section className="section why-perfa-section" id="services">
        <SectionToolbar
          sectionKey="services"
          sectionName="Why Perfa & Services"
        />
        <div className="container">
          <div className="section-header centered">
            <span className="section-eyebrow">Why Families in Hanoi Choose Perfa</span>
            <h2 className="section-title">Why Perfa &amp; Our Services</h2>
            <p className="section-subtitle">
              From claw-resistant fabrics and machine-washable slipcovers to complimentary room layout advice and white-glove assembly in Hanoi.
            </p>
          </div>

          {/* 4 Services */}
          <div className="services-grid">
            {services.map((srv, idx) => (
              <div key={srv.id || idx} className="service-card">
                {isEditMode && (
                  <div className="perfa-card-actions">
                    <button
                      type="button"
                      className="perfa-card-btn"
                      onClick={() => {
                        openItemEditor({
                          title: `Sửa dịch vụ: ${srv.title}`,
                          fields: [
                            { label: 'Tiêu Đề (Title)', key: 'title', type: 'text' },
                            { label: 'Mô Tả (Description)', key: 'description', type: 'textarea' }
                          ],
                          initialValues: { title: srv.title, description: srv.description },
                          onSave: (vals) => updateService(srv.id, vals)
                        });
                      }}
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
                  </div>
                )}
                <div className="service-icon-box">
                  {idx === 0 ? <Compass size={26} /> : idx === 1 ? <Truck size={26} /> : idx === 2 ? <ShieldCheck size={26} /> : <CreditCard size={26} />}
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MATERIALS SECTION - EXACT WIX SPLIT CARDS */}
      <section className="section wix-materials-section" id="materials">
        <SectionToolbar
          sectionKey="materials"
          sectionName="Materials"
        />
        <div className="container">
          <div className="wix-materials-header">
            <div>
              <span className="section-eyebrow light">Eco-Certified Textiles</span>
              <h2 className="section-title light">Materials</h2>
            </div>
            <p className="wix-materials-note">
              Click any sustainable material below to browse all sofas crafted in that exact upholstery.
            </p>
          </div>

          <div className="wix-materials-grid">
            {materials.map((mat) => (
              <div key={mat.name} className="material-split-card-theme">
                {isEditMode && (
                  <div className="perfa-card-actions">
                    <button
                      type="button"
                      className="perfa-card-btn btn-crop"
                      onClick={() => {
                        openCropModal({
                          initialUrl: mat.fabricImage || mat.image,
                          aspectRatio: 3 / 4,
                          title: `Cắt & Thay ảnh chất liệu: ${mat.name}`,
                          onApply: (url) => {
                            updateMaterial(mat.name, { fabricImage: url, image: url });
                          }
                        });
                      }}
                    >
                      <ImageIcon size={12} /> Cắt
                    </button>
                    <button
                      type="button"
                      className="perfa-card-btn"
                      onClick={() => {
                        openItemEditor({
                          title: `Sửa thông tin chất liệu: ${mat.name}`,
                          fields: [
                            { label: 'Tên Chất Liệu (Name)', key: 'name', type: 'text' },
                            { label: 'Tiêu Đề Viết Hoa (Script Title)', key: 'scriptTitle', type: 'text' },
                            { label: 'Nguồn Gốc (Origin)', key: 'origin', type: 'text' },
                            { label: 'Mô Tả (Description)', key: 'description', type: 'textarea' }
                          ],
                          initialValues: {
                            name: mat.name,
                            scriptTitle: mat.scriptTitle || mat.name,
                            origin: mat.origin || '',
                            description: mat.description
                          },
                          onSave: (vals) => updateMaterial(mat.name, vals)
                        });
                      }}
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
                  </div>
                )}
                <Link
                  to={`/shop?material=${encodeURIComponent(mat.name)}`}
                  className="material-card-link-wrapper"
                >
                  <div className="material-split-visual">
                    <img
                      src={mat.image || mat.fabricImage}
                      alt={`${mat.name} — ${mat.origin || 'Sustainable Material'}`}
                      className="material-composite-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="material-card-meta">
                    <span className="material-origin-tag">{mat.origin || 'Sustainable Fiber'}</span>
                    <h4 className="material-name-heading">{mat.name}</h4>
                    <p className="material-desc-text">{mat.description}</p>
                    <span className="material-explore-btn">
                      Shop {mat.name} Sofas <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="section testimonials-section" id="testimonials">
        <SectionToolbar
          sectionKey="testimonials"
          sectionName="Client Testimonials"
        />
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
                {isEditMode && (
                  <div className="perfa-card-actions">
                    <button
                      type="button"
                      className="perfa-card-btn"
                      onClick={() => {
                        openItemEditor({
                          title: `Sửa đánh giá: ${item.family}`,
                          fields: [
                            { label: 'Tên Gia Đình (Family Name)', key: 'family', type: 'text' },
                            { label: 'Khu Vực (Location)', key: 'location', type: 'text' },
                            { label: 'Hộ Gia Đình (Household)', key: 'household', type: 'text' },
                            { label: 'Lời Đánh Giá (Quote)', key: 'quote', type: 'textarea' }
                          ],
                          initialValues: { family: item.family, location: item.location, household: item.household, quote: item.quote },
                          onSave: (vals) => updateTestimonial(item.id, vals)
                        });
                      }}
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
                    <button
                      type="button"
                      className="perfa-card-btn btn-crop"
                      onClick={() => {
                        openCropModal({
                          initialUrl: item.image,
                          aspectRatio: 1,
                          title: `Cắt & Thay ảnh gia đình: ${item.family}`,
                          onApply: (url) => updateTestimonial(item.id, { image: url })
                        });
                      }}
                    >
                      <ImageIcon size={12} /> Cắt
                    </button>
                    <button
                      type="button"
                      className="perfa-card-btn btn-delete"
                      onClick={() => deleteTestimonial(item.id)}
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                )}
                <div className="testimonial-image-wrap">
                  <img
                    src={item.image}
                    alt={item.family}
                    loading="lazy"
                    style={{ objectPosition: item.imagePosition || 'center center' }}
                  />
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
                    <Link to={`/product/${item.productId || 1}`}>
                      {item.sofaPurchased || 'Perfa Sofa'} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HOMEPAGE CONTACT */}
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
