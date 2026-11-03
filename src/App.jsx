import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ConsultationModal from './components/ConsultationModal';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import { CheckCircle2 } from 'lucide-react';

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
  const { pathname, search, key } = useLocation();
  const appShellRef = useRef(null);
  const edgeRef = useRef(null);
  const overshootRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const isAtFooterBottomRef = useRef(false);
  const lastScrollDirRef = useRef('down');
  const dirTimerRef = useRef(null);
  const [guardHeight, setGuardHeight] = useState(0);

  // Scroll to top on route change (works both standalone and inside Wix tall iframe)
  useEffect(() => {
    isNavigatingRef.current = true;
    isAtFooterBottomRef.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });

    const scrollParentToTop = () => {
      try {
        if (window.self !== window.top || window.innerHeight > 1400) {
          appShellRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      } catch {
        // ignore
      }
    };

    scrollParentToTop();
    const rafId = requestAnimationFrame(scrollParentToTop);
    const t1 = setTimeout(scrollParentToTop, 60);
    const t2 = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 260);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search, key]);

  // Measure actual page height vs Wix iframe viewport height
  useEffect(() => {
    const updateGuardHeight = () => {
      const shellEl = appShellRef.current;
      if (!shellEl) return;
      const isEmbedded = window.self !== window.top || window.innerHeight > 1400;
      if (!isEmbedded) {
        setGuardHeight(0);
        return;
      }
      const contentHeight = shellEl.offsetHeight;
      const extra = Math.max(0, Math.floor(window.innerHeight - contentHeight));
      setGuardHeight(extra);
    };

    updateGuardHeight();
    const ro = new ResizeObserver(updateGuardHeight);
    if (appShellRef.current) {
      ro.observe(appShellRef.current);
    }
    window.addEventListener('resize', updateGuardHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateGuardHeight);
    };
  }, [pathname, search]);

  // Observe footer bottom edge and overshoot zone inside Wix tall iframe
  useEffect(() => {
    if (guardHeight <= 0) {
      isAtFooterBottomRef.current = false;
      return;
    }

    const edgeEl = edgeRef.current;
    const overshootContainer = overshootRef.current;
    if (!edgeEl || !overshootContainer) return;

    const snapToFooterBottom = () => {
      if (isNavigatingRef.current || lastScrollDirRef.current === 'up') return;
      const footerEl = document.querySelector('.site-footer');
      if (footerEl) {
        footerEl.scrollIntoView({ block: 'end', behavior: 'instant' });
      }
    };

    const edgeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isAtFooterBottomRef.current = entry.isIntersecting;
        }
      },
      { root: null, threshold: 0 }
    );
    edgeObserver.observe(edgeEl);

    const overshootObserver = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current || lastScrollDirRef.current === 'up') return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isAtFooterBottomRef.current = true;
            snapToFooterBottom();
            break;
          }
        }
      },
      { root: null, threshold: 0 }
    );

    const strips = overshootContainer.querySelectorAll('.iframe-overshoot-strip');
    strips.forEach((s) => overshootObserver.observe(s));

    let lastTouchY = 0;

    const handleWheel = (e) => {
      if (e.target.closest?.('.cart-drawer, .auth-modal, .consultation-modal, .search-dropdown')) {
        return;
      }
      if (e.deltaY < 0) {
        lastScrollDirRef.current = 'up';
        clearTimeout(dirTimerRef.current);
        dirTimerRef.current = setTimeout(() => {
          lastScrollDirRef.current = 'down';
        }, 180);
        return;
      }
      if (e.deltaY > 0) {
        lastScrollDirRef.current = 'down';
        if (isAtFooterBottomRef.current && !isNavigatingRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.target.closest?.('.cart-drawer, .auth-modal, .consultation-modal, .search-dropdown')) {
        return;
      }
      if (!e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY; // positive when swiping up (scrolling down)
      lastTouchY = currentY;

      if (deltaY < 0) {
        lastScrollDirRef.current = 'up';
        return;
      }
      if (deltaY > 0) {
        lastScrollDirRef.current = 'down';
        if (isAtFooterBottomRef.current && !isNavigatingRef.current) {
          e.preventDefault();
        }
      }
    };

    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable) {
        return;
      }
      if (['ArrowUp', 'PageUp', 'Home'].includes(e.key)) {
        lastScrollDirRef.current = 'up';
        return;
      }
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key)) {
        lastScrollDirRef.current = 'down';
        if (isAtFooterBottomRef.current && !isNavigatingRef.current) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      edgeObserver.disconnect();
      overshootObserver.disconnect();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guardHeight, pathname, search]);

  const stripCount = guardHeight > 0 ? Math.ceil(guardHeight / 80) : 0;

  return (
    <ShopProvider>
      <div ref={appShellRef} className="app-shell">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <AuthModal />
        <ConsultationModal />
        <ToastNotification />
      </div>
      {guardHeight > 0 && (
        <div
          className="iframe-scroll-guard"
          style={{ height: `${guardHeight}px` }}
          aria-hidden="true"
        >
          <div ref={edgeRef} className="iframe-footer-edge-trigger" />
          <div ref={overshootRef} className="iframe-overshoot-zone">
            {Array.from({ length: stripCount }, (_, i) => (
              <div key={i} className="iframe-overshoot-strip" />
            ))}
          </div>
        </div>
      )}
    </ShopProvider>
  );
}
