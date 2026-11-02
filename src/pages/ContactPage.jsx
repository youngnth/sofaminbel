import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ContactPage() {
  const { showToast } = useShop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Free Design Consultation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      setError('Please complete all required fields (Name, Email, Phone, and Message).');
      return;
    }
    setError('');
    setSubmitted(true);
    showToast('Your message has been sent to our Hanoi team!');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Free Design Consultation',
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="contact-page">
      {/* Header Banner */}
      <section className="shop-hero-banner">
        <div className="container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Contact Us</span>
          </nav>
          <h1 className="shop-page-title">Contact Perfa Hanoi</h1>
          <p className="shop-page-subtitle">
            Have a project in mind or want free pet-friendly fabric swatches delivered to your home in Hanoi? Reach out to us today to start creating your dream space.
          </p>
        </div>
      </section>

      {/* Main Contact Section (Form + Info Cards) */}
      <section className="section contact-main-section">
        <div className="container contact-page-grid">
          {/* Left Column: Direct Contact Details & Showroom Info */}
          <div className="contact-details-column">
            <div className="contact-info-card">
              <span className="section-eyebrow">
                <Sparkles size={14} /> Direct Support
              </span>
              <h2>Get In Touch</h2>
              <p className="contact-intro-text">
                Our Hanoi furniture specialists and interior consultants are available 7 days a week to assist with room measurements, fabric selection, and delivery scheduling.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3>Hotline &amp; Showroom Phone</h3>
                    <p>
                      <a href="tel:1234567890">123-456-7890</a> (Toll-Free Hotline: 1900 6868)
                    </p>
                    <span className="info-sub">Instant consultation &amp; order support</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3>Email Address</h3>
                    <p>
                      <a href="mailto:perfa.corp@gmail.com">perfa.corp@gmail.com</a>
                    </p>
                    <span className="info-sub">Send us your floor plan for a free layout sketch</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3>Hanoi Flagship Showroom</h3>
                    <p>207 Giai Phong Street, Bach Mai Ward, Hanoi, Vietnam</p>
                    <span className="info-sub">Free car &amp; motorbike parking at entrance</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3>Showroom Hours</h3>
                    <p>Monday – Sunday: 9:00 AM – 8:30 PM</p>
                    <span className="info-sub">Kids &amp; pets are warmly welcome in our showroom!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              {submitted ? (
                <div className="contact-submitted-state" data-testid="contact-success-message">
                  <CheckCircle2 size={52} className="success-icon" />
                  <h2>Thank You for Reaching Out!</h2>
                  <p>
                    We have received your message from <strong>{formData.name}</strong> ({formData.email}). One of our Hanoi Design Consultants will call or email you within 2 hours.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleReset}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-page-form" noValidate>
                  <h2>Send Us a Message</h2>
                  <p className="form-subtitle">
                    Fill out the form below and our Hanoi team will get back to you promptly.
                  </p>

                  {error && <div className="form-error-banner">{error}</div>}

                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-phone">Phone Number *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="e.g. 0912 345 678"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject">Inquiry Topic</label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    >
                      <option value="Free Design Consultation">
                        Free Design Consultation
                      </option>
                      <option value="Request Free Pet-Friendly Fabric Swatches">
                        Request Free Pet-Friendly Fabric Swatches
                      </option>
                      <option value="Custom Sofa Dimensions & Sizing">
                        Custom Sofa Dimensions &amp; Sizing
                      </option>
                      <option value="Hanoi Delivery, Assembly & Warranty">
                        Hanoi Delivery, Assembly &amp; Warranty
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="Tell us which sofa model you like, your apartment size, or any questions about washable covers..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    data-testid="contact-submit-btn"
                  >
                    <Send size={17} /> Submit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hanoi Showroom Map Placeholder Section */}
      <section className="section contact-map-section">
        <div className="container">
          <div className="map-placeholder-container">
            <div className="map-visual-canvas">
              <div className="map-grid-lines" aria-hidden="true" />
              <div className="map-roads-svg" aria-hidden="true">
                <div className="road road-horizontal" />
                <div className="road road-vertical" />
                <div className="road road-diagonal" />
              </div>

              <div className="map-pin-card">
                <div className="map-pin-pulse">
                  <MapPin size={26} />
                </div>
                <div className="map-pin-details">
                  <span className="map-badge">PERFA HANOI SHOWROOM</span>
                  <h3>207 Giai Phong Street</h3>
                  <p>Bach Mai Ward, Hai Ba Trung District, Hanoi, Vietnam</p>
                  <div className="map-landmark-tags">
                    <span>Near Bach Mai Intersection</span>
                    <span>•</span>
                    <span>5 mins from Thong Nhat Park</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=207+Giai+Phong+Hanoi+Vietnam"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm map-directions-btn"
                  >
                    <Navigation size={14} /> Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
