import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Phone, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ConsultationModal() {
  const { consultationProduct, closeConsultationModal, showToast, modalTopOffset } = useShop();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: 'Cau Giay District, Hanoi',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!consultationProduct) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Free consultation request submitted! Our Hanoi design team will contact you shortly.');
  };

  const handleClose = () => {
    setSubmitted(false);
    closeConsultationModal();
  };

  return (
    <div
      className="modal-backdrop modal-backdrop-center"
      onClick={handleClose}
    >
      <div
        className="consultation-modal"
        style={{ marginTop: `${modalTopOffset}px` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
      >
        <button
          type="button"
          className="modal-close-btn modal-close-abs"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="consultation-success">
            <CheckCircle2 size={48} className="success-icon" />
            <h3>Consultation Request Confirmed!</h3>
            <p>
              Thank you, <strong>{formData.name || 'Valued Guest'}</strong>. Our Hanoi Interior Design Consultant will call you at{' '}
              <strong>{formData.phone || 'your number'}</strong> with complimentary fabric swatches for{' '}
              <strong>{consultationProduct.name}</strong>.
            </p>
            <button type="button" className="btn btn-primary" onClick={handleClose}>
              Back to Browsing
            </button>
          </div>
        ) : (
          <>
            <div className="consultation-modal-header">
              <span className="eyebrow-tag">
                <Sparkles size={13} /> Complimentary Hanoi Service
              </span>
              <h3 id="consultation-modal-title">Book a Free Design Consultation</h3>
              <p>
                Interested in <strong>{consultationProduct.name}</strong>? Our specialists bring pet-friendly &amp; stain-resistant fabric swatches directly to your home in Hanoi and help measure your living room.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="consultation-form">
              <div className="form-group">
                <label htmlFor="consult-name">Full Name *</label>
                <input
                  id="consult-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Nguyen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="consult-phone">Phone Number *</label>
                  <input
                    id="consult-phone"
                    type="tel"
                    required
                    placeholder="e.g. 0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="consult-email">Email Address *</label>
                  <input
                    id="consult-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="consult-district">Hanoi District / Area</label>
                <select
                  id="consult-district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  <option value="Cau Giay District, Hanoi">Cau Giay District, Hanoi</option>
                  <option value="Tay Ho District, Hanoi">Tay Ho District, Hanoi</option>
                  <option value="Hai Ba Trung District, Hanoi">Hai Ba Trung District, Hanoi</option>
                  <option value="Ba Dinh District, Hanoi">Ba Dinh District, Hanoi</option>
                  <option value="Nam Tu Liem / Vinhomes Smart City">Nam Tu Liem / Vinhomes Smart City</option>
                  <option value="Long Bien / Ecopark Area">Long Bien / Ecopark Area</option>
                  <option value="Other Hanoi Area">Other Hanoi Area</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="consult-notes">Tell us about your household (kids, pets, room size)</label>
                <textarea
                  id="consult-notes"
                  rows={3}
                  placeholder="e.g. We have a toddler and a Golden Retriever, looking for a 3-seater with washable covers..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="consultation-modal-actions">
                <button type="submit" className="btn btn-primary btn-full">
                  <Calendar size={16} /> Request Free Home or Showroom Consultation
                </button>
                <p className="consultation-hotline-note">
                  <Phone size={13} /> Prefer to speak now? Call our Hanoi Studio at <strong>123-456-7890</strong>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
