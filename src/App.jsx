import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ConsultationModal from './components/ConsultationModal';
import FloatingEditorBar from './components/FloatingEditorBar';
import CropModal from './components/CropModal';
import ItemEditorModal from './components/ItemEditorModal';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { CheckCircle2 } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function ToastNotification() {
  const { toastMessage } = useShop();
  if (!toastMessage) return null;
  return (
    <div className="toast-banner" role="status" aria-live="polite">
      <CheckCircle2 size={18} />
      <span>{toastMessage}</span>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ScrollToTop />
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <ConsultationModal />
        <FloatingEditorBar />
        <CropModal />
        <ItemEditorModal />
        <ToastNotification />
      </div>
    </ShopProvider>
  );
}
