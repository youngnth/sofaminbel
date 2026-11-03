import React from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Baby,
  Droplets,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { materialSwatches, whyPerfaServices } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function AboutPage() {
  const { openConsultationModal } = useShop();

  return (
    <div className="about-page">
      {/* Hero Banner */}
      <section className="about-hero-section">
        <div className="container about-hero-grid">
          <div className="about-hero-text">
            <span className="section-eyebrow light">
              <Sparkles size={14} /> About Perfa Hanoi
            </span>
            <h1>Designing Safe, Joyful Living Rooms for Families with Kids &amp; Pets</h1>
            <p>
              Born in Hanoi, Perfa is a direct-to-consumer furniture brand dedicated to a simple belief: you should never have to choose between an elegant living room and a home where children and pets can play freely.
            </p>
            <div className="about-hero-actions">
              <Link to="/shop" className="btn btn-light-cream">
                Explore Our Sofas <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => openConsultationModal()}
              >
                Book Free Consultation
              </button>
            </div>
          </div>

          <div className="about-hero-img-wrap">
            <img
              src="/about/about_hero.jpg"
              alt="Happy child coloring on the rug with their dog beside a Perfa sofa"
            />
          </div>
        </div>
      </section>

      {/* Wix Vision & Mission Section (#comp-m8ley4z15) */}
      <section className="section about-vision-mission-section">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vm-card">
              <span className="vm-tag">01 • Purpose</span>
              <h2>Our Vision</h2>
              <p>
                To make durable, family-friendly furniture accessible and affordable for households with children and pets, helping them create safe, comfortable, and functional homes.
              </p>
            </div>
            <div className="vm-card">
              <span className="vm-tag">02 • Commitment</span>
              <h2>Our Mission</h2>
              <p>
                To become a trusted mid-range furniture e-commerce brand in Hanoi for young families, recognized for practical design, pet- and child-friendly materials, and reliable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story & Hanoi Family Focus */}
      <section className="section about-story-section">
        <div className="container about-story-grid">
          <div className="about-story-images">
            <img
              src="/about/about_story_1.jpg"
              alt="Golden Retriever and cat playing on a pet-friendly Perfa modular sofa"
              className="story-img-primary"
            />
            <img
              src="/about/about_story_2.jpg"
              alt="Close-up of Perfa zip-off machine-washable sofa cushion cover"
              className="story-img-secondary"
            />
          </div>

          <div className="about-story-content">
            <span className="section-eyebrow">Our Brand Story</span>
            <h2 className="section-title">Why We Started Perfa in Hanoi</h2>
            <p>
              When young parents and pet owners in Hanoi shop for a sofa, they often face a frustrating dilemma: imported designer sofas look beautiful in showrooms but stain at the first juice spill or snag under a cat's claws, while budget options sag within a year and have hard, exposed wooden corners.
            </p>
            <p>
              By working directly with certified textile mills and skilled northern Vietnamese timber craftsmen, Perfa eliminates middlemen markups. We deliver sofas priced fairly between <strong>VND 11,000,000 and VND 60,000,000</strong> with features engineered for real family life:
            </p>

            <div className="about-pillars-list">
              <div className="about-pillar-item">
                <div className="pillar-icon">
                  <PawPrint size={20} />
                </div>
                <div>
                  <h3>100,000-Rub Pet-Friendly Weaves</h3>
                  <p>
                    Micro-interlocked threads prevent dog and cat claws from catching or fraying, and release pet fur without static cling.
                  </p>
                </div>
              </div>

              <div className="about-pillar-item">
                <div className="pillar-icon">
                  <Droplets size={20} />
                </div>
                <div>
                  <h3>Zip-Off Machine-Washable Covers</h3>
                  <p>
                    Milk, markers, or muddy paws? Unzip the cushion slipcovers in under two minutes and wash them in your home washing machine at 30°C.
                  </p>
                </div>
              </div>

              <div className="about-pillar-item">
                <div className="pillar-icon">
                  <Baby size={20} />
                </div>
                <div>
                  <h3>Child-Safe Rounded Ergonomics</h3>
                  <p>
                    Every corner and armrest is wrapped in multi-layer high-resilience padding with OEKO-TEX® Standard 100 non-toxic fabrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Material Craftsmanship Overview */}
      <section className="section about-materials-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-eyebrow">Material Science</span>
            <h2 className="section-title">Four Family-Tested Uphostery Options</h2>
            <p className="section-subtitle">
              Every material in our catalog is tested for abrasion resistance, colorfastness, and easy cleaning in Hanoi's humid climate.
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
                    Explore {mat.name} Sofas <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
