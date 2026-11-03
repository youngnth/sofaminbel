import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Layers,
  Ruler,
  Users,
  Palette,
  Droplets,
  ShieldCheck,
  Truck,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { formatVND, formatVNDWithCode } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const THUMB_LABELS = ['Front View', 'Side Angle', 'Fabric Close-Up'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const {
    addToCart,
    buyNow,
    openConsultationModal,
    products,
    isEditMode,
    updateProduct,
    openCropModal,
    openItemEditor
  } = useShop();

  const product = products.find((p) => p.id === id) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSameMaterialProducts, setShowSameMaterialProducts] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const materialSectionRef = useRef(null);

  // Reset image index and states when navigating between products
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    setZoomLevel(1);
    setShowSameMaterialProducts(false);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Other products sharing the exact same material
  const sameMaterialProducts = products.filter(
    (p) => p.material === product.material && p.id !== product.id
  );

  // Related products at the bottom (prioritize same category or seat count, excluding current)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aScore =
        (a.wixCategory === product.wixCategory ? 2 : 0) +
        (a.seatCount === product.seatCount ? 1 : 0);
      const bScore =
        (b.wixCategory === product.wixCategory ? 2 : 0) +
        (b.seatCount === product.seatCount ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, 4);

  const handleOpenLightbox = () => {
    setZoomLevel(1);
    setIsLightboxOpen(true);
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.85 : prev === 1.85 ? 2.5 : 1));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setActiveImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setActiveImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleMaterialLinkClick = (e) => {
    e.preventDefault();
    setShowSameMaterialProducts((prev) => !prev);
    if (!showSameMaterialProducts && materialSectionRef.current) {
      setTimeout(() => {
        materialSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Bar */}
      <div className="breadcrumb-strip">
        <div className="container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <Link to={`/shop?material=${encodeURIComponent(product.material)}`}>
              {product.material}
            </Link>
            <span>/</span>
            <span className="current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="section product-detail-main">
        <div className="container product-detail-grid">
          {/* LEFT: Interactive Image Gallery + Thumbnails */}
          <div className="product-gallery-column">
            <div
              className="product-main-image-container"
              onClick={handleOpenLightbox}
              role="button"
              tabIndex={0}
              aria-label="Click main image to open lightbox with zoom"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleOpenLightbox();
              }}
              data-testid="main-product-image-trigger"
            >
              <img
                src={product.images[activeImageIndex]}
                alt={`${product.name} - ${THUMB_LABELS[activeImageIndex] || 'View'}`}
                className="product-main-image"
                data-testid="main-product-image"
              />
              <div className="main-image-top-badges">
                {product.tags?.map((tag) => (
                  <span key={tag} className="badge badge-tag">
                    <Sparkles size={11} /> {tag}
                  </span>
                ))}
              </div>
              <div className="main-image-zoom-hint">
                <ZoomIn size={16} />
                <span>Click image to open Lightbox &amp; Zoom</span>
              </div>
            </div>

            {/* 3 Thumbnails (Front, Side, Fabric Close-Up) */}
            <div className="product-thumbnails-row" role="tablist" aria-label="Product angles">
              {product.images.map((imgUrl, index) => (
                <button
                  key={imgUrl + index}
                  type="button"
                  role="tab"
                  aria-selected={activeImageIndex === index}
                  className={`product-thumbnail-btn ${
                    activeImageIndex === index ? 'active' : ''
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  data-testid={`thumbnail-btn-${index}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} ${THUMB_LABELS[index] || `Angle ${index + 1}`}`}
                  />
                  <span className="thumbnail-caption">
                    {THUMB_LABELS[index] || `View ${index + 1}`}
                  </span>
                </button>
              ))}
            </div>

            {isEditMode && (
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    openCropModal({
                      initialUrl: product.images[activeImageIndex],
                      aspectRatio: 1,
                      title: `Cắt & Thay ảnh góc ${THUMB_LABELS[activeImageIndex] || activeImageIndex + 1}: ${product.name}`,
                      onApply: (croppedDataUrl) => {
                        const newImgs = [...product.images];
                        newImgs[activeImageIndex] = croppedDataUrl;
                        updateProduct(product.id, { images: newImgs });
                      }
                    });
                  }}
                >
                  🖼️ Cắt &amp; Thay Góc Ảnh Này
                </button>
                <button
                  type="button"
                  className="btn btn-secondary-sage btn-sm"
                  onClick={() => {
                    openItemEditor({
                      title: `Sửa thông tin: ${product.name}`,
                      fields: [
                        { label: 'Tên Sản Phẩm (Name)', key: 'name', type: 'text' },
                        { label: 'Giá (VND Số)', key: 'price', type: 'number' },
                        { label: 'Chất Liệu (Material)', key: 'material', type: 'text' },
                        { label: 'Kích Thước (Dimensions)', key: 'dimensions', type: 'text' },
                        { label: 'Mô Tả Sản Phẩm (Description)', key: 'description', type: 'textarea' }
                      ],
                      initialValues: {
                        name: product.name,
                        price: product.price,
                        material: product.material,
                        dimensions: product.dimensions,
                        description: product.description
                      },
                      onSave: (vals) => {
                        updateProduct(product.id, {
                          name: vals.name,
                          price: parseInt(vals.price, 10) || product.price,
                          material: vals.material,
                          dimensions: vals.dimensions,
                          description: vals.description
                        });
                      }
                    });
                  }}
                >
                  ✏️ Sửa Thông Tin Sofa
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Interactive Material Section */}
          <div className="product-info-column">
            <div className="product-category-eyebrow">
              <span>{product.wixCategory}</span>
              <span>•</span>
              <span>In Stock in Hanoi</span>
            </div>

            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-detail-price-box">
              <span className="product-detail-price" data-testid="product-detail-price">
                {formatVND(product.price)}
              </span>
              <span className="product-detail-price-code">
                ({formatVNDWithCode(product.price)})
              </span>
              <p className="installment-note">
                Flexible 0% financing from{' '}
                <strong>{formatVND(Math.round(product.price / 12))}/month</strong> for 12 months
              </p>
            </div>

            <p className="product-detail-description">{product.description}</p>

            {/* Key Specifications Grid */}
            <div className="product-specs-card">
              <h2 className="specs-card-heading">Product Specifications</h2>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">
                    <Layers size={15} /> Material
                  </span>
                  <span className="spec-value">
                    <a
                      href="#same-material-products"
                      onClick={handleMaterialLinkClick}
                      className="material-inline-link"
                      data-testid="material-spec-link"
                    >
                      {product.material}
                    </a>
                  </span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">
                    <Palette size={15} /> Color
                  </span>
                  <span className="spec-value">
                    <span
                      className="color-dot"
                      style={{ backgroundColor: product.colorHex }}
                    />
                    {product.color}
                  </span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">
                    <Users size={15} /> Seat Count
                  </span>
                  <span className="spec-value">{product.seatCount} Seats</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">
                    <Ruler size={15} /> Dimensions
                  </span>
                  <span className="spec-value">{product.dimensions}</span>
                </div>

                <div className="spec-item spec-item-full">
                  <span className="spec-label">
                    <Droplets size={15} /> Washable Cover
                  </span>
                  <span className="spec-value">
                    {product.isWashable
                      ? 'Yes — Removable zippered cushion covers, machine-washable at 30°C'
                      : 'Wipe-Clean Surface Protection (Damp microfiber cloth)'}
                  </span>
                </div>
              </div>
            </div>

            {/* CRITICAL FEATURE: Interactive "Material" Section with Clickable Cross-Link */}
            <div
              className="product-material-explorer"
              ref={materialSectionRef}
              id="same-material-products"
            >
              <div className="material-explorer-header">
                <div>
                  <span className="material-explorer-eyebrow">Material Spotlight</span>
                  <h3 className="material-explorer-title">
                    Upholstered in:{' '}
                    <a
                      href="#same-material-products"
                      onClick={handleMaterialLinkClick}
                      className="material-clickable-link"
                      data-testid="material-section-link"
                    >
                      {product.material}
                    </a>
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn-material-toggle"
                  onClick={handleMaterialLinkClick}
                  data-testid="material-toggle-btn"
                >
                  {showSameMaterialProducts
                    ? 'Hide Matching Sofas'
                    : `See ${sameMaterialProducts.length} Other Sofas in ${product.material}`}
                </button>
              </div>

              <p className="material-care-text">
                <strong>Care &amp; Durability:</strong> {product.careInstructions}
              </p>

              {/* Revealed when clicking the Material name/link */}
              {showSameMaterialProducts && (
                <div
                  className="same-material-drawer"
                  data-testid="same-material-results"
                >
                  <p className="same-material-heading">
                    Other Perfa Sofas Crafted with <strong>{product.material}</strong>:
                  </p>
                  <div className="same-material-cards-list">
                    {sameMaterialProducts.slice(0, 3).map((otherProd) => (
                      <Link
                        key={otherProd.id}
                        to={`/product/${otherProd.id}`}
                        className="same-material-mini-card"
                        data-testid={`same-material-link-${otherProd.id}`}
                      >
                        <img
                          src={otherProd.images[0]}
                          alt={otherProd.name}
                          className="same-material-thumb"
                        />
                        <div className="same-material-info">
                          <strong>{otherProd.name}</strong>
                          <span>
                            {otherProd.seatCount}-Seater • {otherProd.color}
                          </span>
                          <span className="same-material-price">
                            {formatVND(otherProd.price)}
                          </span>
                        </div>
                        <ArrowRight size={16} className="same-material-arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purchase & Consultation CTA Buttons */}
            <div className="product-purchase-actions">
              <div className="quantity-selector" aria-label="Select quantity">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg btn-add-cart"
                onClick={() => addToCart(product, quantity)}
                data-testid="add-to-cart-btn"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-buy-now-detail btn-lg"
                onClick={() => buyNow(product, quantity)}
                data-testid="buy-now-btn"
              >
                Buy Now <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="btn btn-secondary-sage btn-lg btn-consultation"
                onClick={() => openConsultationModal(product)}
                data-testid="contact-consultation-btn"
              >
                <MessageSquare size={18} /> Contact for Consultation
              </button>
            </div>

            {/* Trust Guarantees */}
            <div className="product-guarantees-strip">
              <div className="guarantee-item">
                <Truck size={17} />
                <span>Free Delivery &amp; Assembly in Hanoi (2–5 Days)</span>
              </div>
              <div className="guarantee-item">
                <ShieldCheck size={17} />
                <span>{product.warranty}</span>
              </div>
              <div className="guarantee-item">
                <CheckCircle2 size={17} />
                <span>Free Home Fabric Swatch Box Available on Request</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="section related-products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Complete Your Living Room</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <Link to="/shop" className="section-link">
              Browse Full Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid-4">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal with Zoom */}
      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image lightbox with zoom"
          data-testid="lightbox-modal"
        >
          <div
            className="lightbox-toolbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-caption">
              <strong>{product.name}</strong> —{' '}
              {THUMB_LABELS[activeImageIndex] || `View ${activeImageIndex + 1}`} (
              {activeImageIndex + 1} / {product.images.length})
            </div>

            <div className="lightbox-controls">
              <button
                type="button"
                className="lightbox-ctrl-btn"
                onClick={() => setZoomLevel((z) => Math.max(1, +(z - 0.5).toFixed(2)))}
                disabled={zoomLevel <= 1}
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                type="button"
                className="lightbox-zoom-pill"
                onClick={handleToggleZoom}
                data-testid="lightbox-zoom-toggle"
              >
                {Math.round(zoomLevel * 100)}% (Click to Zoom)
              </button>
              <button
                type="button"
                className="lightbox-ctrl-btn"
                onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.5).toFixed(2)))}
                disabled={zoomLevel >= 3}
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close lightbox"
                data-testid="lightbox-close-btn"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="lightbox-nav-arrow prev"
            onClick={handlePrevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="lightbox-stage"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleZoom();
            }}
          >
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="lightbox-image"
              style={{
                transform: `scale(${zoomLevel})`,
                cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in'
              }}
              data-testid="lightbox-image"
            />
          </div>

          <button
            type="button"
            className="lightbox-nav-arrow next"
            onClick={handleNextImage}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          <div
            className="lightbox-thumbs-bar"
            onClick={(e) => e.stopPropagation()}
          >
            {product.images.map((imgUrl, idx) => (
              <button
                key={imgUrl + idx}
                type="button"
                className={`lightbox-thumb-item ${
                  activeImageIndex === idx ? 'active' : ''
                }`}
                onClick={() => {
                  setZoomLevel(1);
                  setActiveImageIndex(idx);
                }}
              >
                <img src={imgUrl} alt={THUMB_LABELS[idx] || `Angle ${idx + 1}`} />
                <span>{THUMB_LABELS[idx]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
