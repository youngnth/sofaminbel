import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useInView
} from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  X
} from 'lucide-react';
import { portfolioCollections, portfolioTotalImages } from '../data/portfolio';
import { formatVND } from '../data/products';
import { useShop } from '../context/ShopContext';

// Signature "expo-out" easing used across motion-driven sites
const EASE = [0.16, 1, 0.3, 1];

const ALL_TAB = 'all';

/* ---------- Motion helpers ---------- */

function SplitWords({ text, className, delay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span className="split-word-mask" key={`${word}-${i}`} aria-hidden="true">
          <motion.span
            className="split-word"
            initial={{ opacity: 0, y: '0.7em', filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.07 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, delay: i * 0.08 }
  })
};

const tileVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.965, filter: 'blur(10px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE, delay: Math.min(i, 8) * 0.07 }
  })
};

/* ---------- Collection block ---------- */

function CollectionBlock({ collection, products, onOpenImage }) {
  const isOdd = collection.images.length % 2 === 1;
  const lookProducts = collection.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <section className="portfolio-collection" id={`collection-${collection.id}`}>
      <div className="portfolio-collection-head">
        <motion.div
          className="portfolio-collection-intro"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="portfolio-ghost-number" aria-hidden="true">
            {collection.number}
          </span>
          <span className="section-eyebrow">
            Collection {collection.number} • {collection.images.length} Styled Spaces
          </span>
          <h2 className="portfolio-collection-title">{collection.title}</h2>
          <p className="portfolio-collection-tagline">{collection.tagline}</p>
          <p className="portfolio-collection-desc">{collection.description}</p>
          <div className="portfolio-tag-row">
            {collection.tags.map((tag) => (
              <span key={tag} className="portfolio-tag">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.aside
          className="portfolio-shop-look"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="portfolio-shop-look-label">Shop the Look</span>
          <div className="portfolio-look-list">
            {lookProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="portfolio-look-item">
                <img src={p.images[0]} alt={p.name} loading="lazy" />
                <span className="portfolio-look-info">
                  <strong>{p.name}</strong>
                  <span>
                    {p.material} • {p.seatCount}-Seater
                  </span>
                  <span className="portfolio-look-price">{formatVND(p.price)}</span>
                </span>
                <ArrowRight size={15} className="portfolio-look-arrow" />
              </Link>
            ))}
          </div>
          <Link to={collection.shopLink} className="portfolio-look-more">
            {collection.shopLabel} <ArrowRight size={14} />
          </Link>
        </motion.aside>
      </div>

      <div className={`portfolio-grid ${isOdd ? 'has-feature' : ''}`}>
        {collection.images.map((image, idx) => (
          <motion.button
            type="button"
            key={image.src}
            className={`portfolio-tile ${isOdd && idx === 0 ? 'is-feature' : ''}`}
            variants={tileVariants}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            onClick={() => onOpenImage(collection.id, idx)}
            aria-label={`Open image: ${image.caption}`}
          >
            <img src={image.src} alt={image.caption} loading="lazy" draggable="false" />
            <span className="portfolio-tile-overlay">
              <span className="portfolio-tile-index">
                {collection.number}.{String(idx + 1).padStart(2, '0')}
              </span>
              <span className="portfolio-tile-caption">{image.caption}</span>
            </span>
            <span className="portfolio-tile-zoom" aria-hidden="true">
              <Maximize2 size={15} />
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ---------- Lightbox ---------- */

function PortfolioLightbox({ items, index, topOffset, onClose, onPrev, onNext }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <motion.div
      className="portfolio-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio image viewer"
    >
      <motion.div
        className="portfolio-lightbox-panel"
        style={{ marginTop: topOffset }}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="portfolio-lightbox-top">
          <div>
            <span className="portfolio-lightbox-collection">{item.collectionTitle}</span>
            <p className="portfolio-lightbox-caption">{item.caption}</p>
          </div>
          <div className="portfolio-lightbox-actions">
            <span className="portfolio-lightbox-count">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              className="portfolio-lightbox-btn"
              onClick={onClose}
              aria-label="Close image viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="portfolio-lightbox-stage">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.caption}
              className="portfolio-lightbox-img"
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) onNext();
                else if (info.offset.x > 70) onPrev();
              }}
              draggable="false"
            />
          </AnimatePresence>

          <button
            type="button"
            className="portfolio-lightbox-nav prev"
            onClick={onPrev}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            className="portfolio-lightbox-nav next"
            onClick={onNext}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Page ---------- */

export default function PortfolioPage() {
  const { products, openConsultationModal, modalTopOffset } = useShop();
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [lightbox, setLightbox] = useState(null); // { items, index }
  const filterAnchorRef = useRef(null);
  const anchorInView = useInView(filterAnchorRef, { amount: 0 });

  const visibleCollections = useMemo(
    () =>
      activeTab === ALL_TAB
        ? portfolioCollections
        : portfolioCollections.filter((c) => c.id === activeTab),
    [activeTab]
  );

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    // Bring the gallery back into view if the visitor has scrolled deep into a long list
    if (!anchorInView && filterAnchorRef.current) {
      filterAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openImage = useCallback(
    (collectionId, imageIdx) => {
      const items = visibleCollections.flatMap((c) =>
        c.images.map((im) => ({ ...im, collectionId: c.id, collectionTitle: c.title }))
      );
      const target = portfolioCollections.find((c) => c.id === collectionId);
      const src = target?.images[imageIdx]?.src;
      const index = Math.max(
        0,
        items.findIndex((it) => it.src === src)
      );
      setLightbox({ items, index });
    },
    [visibleCollections]
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImage = useCallback(
    () =>
      setLightbox((lb) =>
        lb ? { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length } : lb
      ),
    []
  );
  const nextImage = useCallback(
    () =>
      setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : lb)),
    []
  );

  const heroPicks = [
    portfolioCollections[3].images[0],
    portfolioCollections[0].images[2],
    portfolioCollections[1].images[0]
  ];

  const marqueeWords = portfolioCollections.flatMap((c) => [c.title, c.tagline]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-page">
        {/* HERO */}
        <section className="portfolio-hero">
          <div className="container portfolio-hero-grid">
            <div className="portfolio-hero-text">
              <motion.span
                className="section-eyebrow light"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Sparkles size={14} /> Perfa Portfolio
              </motion.span>
              <h1 className="portfolio-hero-title">
                <SplitWords text="Real Living Spaces," delay={0.1} />
                <br />
                <SplitWords text="Styled with Perfa" className="is-italic" delay={0.35} />
              </h1>
              <motion.p
                className="portfolio-hero-sub"
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
              >
                Four curated collections of family- and pet-friendly sofas, photographed in warm,
                lived-in rooms — explore each look, then bring it home.
              </motion.p>
              <motion.div
                className="portfolio-hero-stats"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
              >
                <div>
                  <strong>{portfolioCollections.length}</strong>
                  <span>Collections</span>
                </div>
                <div>
                  <strong>{portfolioTotalImages}</strong>
                  <span>Styled Spaces</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>Washable Covers</span>
                </div>
              </motion.div>
            </div>

            <div className="portfolio-hero-collage" aria-hidden="true">
              {heroPicks.map((pick, i) => (
                <motion.div
                  key={pick.src}
                  className={`portfolio-hero-card card-${i + 1}`}
                  initial={{ opacity: 0, y: 50, scale: 0.92, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.15 }}
                >
                  <motion.img
                    src={pick.src}
                    alt=""
                    animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                    transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="portfolio-marquee" aria-hidden="true">
          <div className="portfolio-marquee-track">
            {[...marqueeWords, ...marqueeWords].map((word, i) => (
              <span key={`${word}-${i}`} className={i % 2 === 0 ? 'is-title' : ''}>
                {word}
                <span className="portfolio-marquee-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* FILTER TABS */}
        <div ref={filterAnchorRef} className="portfolio-filter-anchor" />
        <div className="portfolio-filter-bar">
          <div className="container">
            <LayoutGroup id="portfolio-tabs">
              <div className="portfolio-tabs" role="tablist" aria-label="Portfolio collections">
                {[{ id: ALL_TAB, title: 'All Spaces', count: portfolioTotalImages }]
                  .concat(
                    portfolioCollections.map((c) => ({
                      id: c.id,
                      title: c.title,
                      count: c.images.length
                    }))
                  )
                  .map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`portfolio-tab ${isActive ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="portfolio-tab-pill"
                            className="portfolio-tab-pill"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="portfolio-tab-label">{tab.title}</span>
                        <span className="portfolio-tab-count">{tab.count}</span>
                      </button>
                    );
                  })}
              </div>
            </LayoutGroup>
          </div>
        </div>

        {/* GALLERY */}
        <div className="portfolio-gallery">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {visibleCollections.map((collection) => (
                  <CollectionBlock
                    key={collection.id}
                    collection={collection}
                    products={products}
                    onOpenImage={openImage}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        <section className="portfolio-cta">
          <motion.div
            className="container portfolio-cta-inner"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <div>
              <span className="section-eyebrow light">Love a Look?</span>
              <h2>Let&apos;s Style Your Living Room Next</h2>
              <p>
                Tell us about your space, your kids and your pets — our design team will match you
                with the right sofa, fabric and layout, free of charge.
              </p>
            </div>
            <div className="portfolio-cta-actions">
              <button
                type="button"
                className="btn btn-light-cream"
                onClick={() => openConsultationModal()}
              >
                Book Free Design Consultation <ArrowRight size={16} />
              </button>
              <Link to="/shop" className="btn btn-outline-light">
                Shop All Sofas
              </Link>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {lightbox && (
            <PortfolioLightbox
              items={lightbox.items}
              index={lightbox.index}
              topOffset={modalTopOffset}
              onClose={closeLightbox}
              onPrev={prevImage}
              onNext={nextImage}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
