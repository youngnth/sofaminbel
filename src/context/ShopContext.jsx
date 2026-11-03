import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  products as initialProducts,
  featuredCollections as initialCollections,
  wixPortfolioItems as initialPortfolio,
  whyPerfaServices as initialServices,
  materialSwatches as initialMaterials,
  testimonials as initialTestimonials
} from '../data/products';

const initialHero = {
  title: 'Unique Elegance for Everyday Family Life',
  subtitle:
    'Crafting spaces where luxury meets family comfort. Durable, scratch-resistant, and machine-washable sofas thoughtfully designed for Hanoi households with young children and pets.',
  ctaPrimary: 'Shop Now',
  ctaSecondary: 'Experience Perfa',
  bgImage:
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85',
  featuredProductName: 'Sage Tufted 3-Seater Sofa',
  featuredProductPrice: '41,900,000 ₫ • Algodão Organic Cotton'
};

const STORAGE_VERSION = 'v6_testimonials_update';

if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('perfa_data_version');
    if (currentVer !== STORAGE_VERSION) {
      if (currentVer !== 'v5_15_products') {
        localStorage.removeItem('perfa_react_products');
        localStorage.removeItem('perfa_react_materials');
        localStorage.removeItem('perfa_react_collections');
      }
      localStorage.removeItem('perfa_react_testimonials');
      localStorage.setItem('perfa_data_version', STORAGE_VERSION);
    }
  } catch (e) {
    console.warn('Storage check failed:', e);
  }
}

const initialAbout = {
  sectionTitle: 'Built for Homes with Active Kids & Beloved Pets',
  visionTitle: 'Our Vision',
  visionText:
    'To make durable, family-friendly furniture accessible and affordable for households with children and pets, helping them create safe, comfortable, and functional homes.',
  missionTitle: 'Our Mission',
  missionText:
    'To become a trusted mid-range furniture e-commerce brand in Hanoi for young families, recognized for practical design, pet- and child-friendly materials, and reliable service.',
  image:
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80'
};

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Cart & Consultation State (persisted in LocalStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartView, setCartView] = useState('cart'); // 'cart' | 'checkout' | 'success' | 'orders'
  const [consultationProduct, setConsultationProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit Mode & Dynamic Site Data State
  const [isEditMode, setIsEditMode] = useState(false);

  // Load saved edits from LocalStorage or fall back to factory defaults
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [heroData, setHeroData] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_hero');
      return saved ? JSON.parse(saved) : initialHero;
    } catch {
      return initialHero;
    }
  });

  const [aboutData, setAboutData] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_about');
      return saved ? JSON.parse(saved) : initialAbout;
    } catch {
      return initialAbout;
    }
  });

  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_collections');
      return saved ? JSON.parse(saved) : initialCollections;
    } catch {
      return initialCollections;
    }
  });

  const [portfolioItems, setPortfolioItems] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_portfolio');
      return saved ? JSON.parse(saved) : initialPortfolio;
    } catch {
      return initialPortfolio;
    }
  });

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [materials, setMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_materials');
      return saved ? JSON.parse(saved) : initialMaterials;
    } catch {
      return initialMaterials;
    }
  });

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const saved = localStorage.getItem('perfa_react_testimonials');
      return saved ? JSON.parse(saved) : initialTestimonials;
    } catch {
      return initialTestimonials;
    }
  });

  // Modal states for Item Editor & Crop Engine
  const [cropSession, setCropSession] = useState(null);
  const [itemEditorSession, setItemEditorSession] = useState(null);

  // Auto-persist changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('perfa_react_products', JSON.stringify(products));
      localStorage.setItem('perfa_react_hero', JSON.stringify(heroData));
      localStorage.setItem('perfa_react_about', JSON.stringify(aboutData));
      localStorage.setItem('perfa_react_collections', JSON.stringify(collections));
      localStorage.setItem('perfa_react_portfolio', JSON.stringify(portfolioItems));
      localStorage.setItem('perfa_react_services', JSON.stringify(services));
      localStorage.setItem('perfa_react_materials', JSON.stringify(materials));
      localStorage.setItem('perfa_react_testimonials', JSON.stringify(testimonials));
      localStorage.setItem('perfa_react_cart', JSON.stringify(cartItems));
      localStorage.setItem('perfa_react_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [products, heroData, aboutData, collections, portfolioItems, services, materials, testimonials, cartItems, orders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Cart Handlers
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartView('cart');
    showToast(`✓ Đã thêm "${product.name}" vào giỏ hàng!`);
    setIsCartOpen(true);
  };

  const buyNow = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartView('checkout');
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const placeOrder = (customerInfo) => {
    const newOrder = {
      id: `PF-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toLocaleString('vi-VN'),
      customer: customerInfo,
      items: [...cartItems],
      total: cartTotal,
      status: 'Confirmed • Preparing for Delivery'
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    showToast(`🎉 Đặt hàng thành công! Mã đơn: #${newOrder.id}`);
    return newOrder;
  };

  const openConsultationModal = (product = null) => {
    setConsultationProduct(product || { name: 'General Home Sofa Consultation' });
  };

  const closeConsultationModal = () => {
    setConsultationProduct(null);
  };

  // Content Modification Functions
  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('✓ Đã cập nhật thông tin sản phẩm.');
  };

  const deleteProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    if (confirm(`Bạn có chắc muốn XÓA sofa "${prod ? prod.name : id}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('✓ Đã xóa sản phẩm.');
    }
  };

  const addProduct = (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast('✓ Đã thêm 1 sofa mới vào danh mục!');
  };

  const updateHero = (updated) => {
    setHeroData((prev) => ({ ...prev, ...updated }));
    showToast('✓ Đã cập nhật phần Hero Banner.');
  };

  const updateAbout = (updated) => {
    setAboutData((prev) => ({ ...prev, ...updated }));
    showToast('✓ Đã cập nhật phần About Us.');
  };

  const updatePortfolioItem = (id, updated) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('✓ Đã cập nhật dự án.');
  };

  const deletePortfolioItem = (id) => {
    if (confirm('Bạn có chắc muốn XÓA dự án này?')) {
      setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
      showToast('✓ Đã xóa dự án.');
    }
  };

  const updateService = (id, updated) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast('✓ Đã cập nhật dịch vụ.');
  };

  const updateTestimonial = (id, updated) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    showToast('✓ Đã cập nhật đánh giá.');
  };

  const deleteTestimonial = (id) => {
    if (confirm('Bạn có chắc muốn XÓA đánh giá này?')) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast('✓ Đã xóa đánh giá.');
    }
  };

  const updateMaterial = (name, updated) => {
    setMaterials((prev) =>
      prev.map((m) => (m.name === name ? { ...m, ...updated } : m))
    );
    showToast('✓ Đã cập nhật chất liệu.');
  };

  // Restoration Handlers (Per Section & All)
  const restoreSection = (sectionKey) => {
    const names = {
      hero: 'Hero Banner',
      about: 'About Us',
      products: 'Danh mục Sản phẩm',
      collections: 'Bộ sưu tập',
      portfolio: 'Portfolio',
      services: 'Dịch vụ',
      materials: 'Chất liệu',
      testimonials: 'Đánh giá khách hàng'
    };

    if (
      !confirm(
        `Bạn có chắc muốn KHÔI PHỤC NỘI DUNG GỐC cho phần "${names[sectionKey] || sectionKey}"?`
      )
    )
      return;

    switch (sectionKey) {
      case 'hero':
        setHeroData(initialHero);
        localStorage.removeItem('perfa_react_hero');
        break;
      case 'about':
        setAboutData(initialAbout);
        localStorage.removeItem('perfa_react_about');
        break;
      case 'products':
        setProducts(initialProducts);
        localStorage.removeItem('perfa_react_products');
        break;
      case 'collections':
        setCollections(initialCollections);
        localStorage.removeItem('perfa_react_collections');
        break;
      case 'portfolio':
        setPortfolioItems(initialPortfolio);
        localStorage.removeItem('perfa_react_portfolio');
        break;
      case 'services':
        setServices(initialServices);
        localStorage.removeItem('perfa_react_services');
        break;
      case 'materials':
        setMaterials(initialMaterials);
        localStorage.removeItem('perfa_react_materials');
        break;
      case 'testimonials':
        setTestimonials(initialTestimonials);
        localStorage.removeItem('perfa_react_testimonials');
        break;
      default:
        break;
    }

    showToast(`↺ Đã khôi phục nội dung ban đầu cho ${names[sectionKey] || sectionKey}!`);
  };

  const restoreAll = () => {
    if (
      !confirm(
        'CẢNH BÁO: Bạn có chắc chắn muốn KHÔI PHỤC TOÀN BỘ WEBSITE về dữ liệu ban đầu? Mọi ảnh đã cắt và chữ đã sửa sẽ quay về mặc định.'
      )
    )
      return;

    setHeroData(initialHero);
    setAboutData(initialAbout);
    setProducts(initialProducts);
    setCollections(initialCollections);
    setPortfolioItems(initialPortfolio);
    setServices(initialServices);
    setMaterials(initialMaterials);
    setTestimonials(initialTestimonials);

    localStorage.removeItem('perfa_react_hero');
    localStorage.removeItem('perfa_react_about');
    localStorage.removeItem('perfa_react_products');
    localStorage.removeItem('perfa_react_collections');
    localStorage.removeItem('perfa_react_portfolio');
    localStorage.removeItem('perfa_react_services');
    localStorage.removeItem('perfa_react_materials');
    localStorage.removeItem('perfa_react_testimonials');

    showToast('↺ Đã khôi phục toàn bộ website về nội dung gốc!');
  };

  // Export Data as JSON
  const exportData = () => {
    const fullData = {
      hero: heroData,
      about: aboutData,
      products,
      collections,
      portfolio: portfolioItems,
      services,
      materials,
      testimonials
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfa-website-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Đã xuất file dữ liệu website!');
  };

  // Crop & Item Modals
  const openCropModal = ({ initialUrl, aspectRatio = 16 / 9, title = 'Cắt & Thay ảnh', onApply }) => {
    setCropSession({ initialUrl, aspectRatio, title, onApply });
  };

  const closeCropModal = () => setCropSession(null);

  const openItemEditor = ({ title, fields, initialValues, onSave }) => {
    setItemEditorSession({ title, fields, initialValues, onSave });
  };

  const closeItemEditor = () => setItemEditorSession(null);

  return (
    <ShopContext.Provider
      value={{
        // Cart & Orders
        cartItems,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        cartView,
        setCartView,
        orders,
        placeOrder,
        consultationProduct,
        openConsultationModal,
        closeConsultationModal,
        toastMessage,
        showToast,

        // Edit Mode
        isEditMode,
        setIsEditMode,

        // Dynamic Data
        products,
        heroData,
        aboutData,
        collections,
        portfolioItems,
        services,
        materials,
        testimonials,

        // Updaters & Deletion
        updateProduct,
        deleteProduct,
        addProduct,
        updateHero,
        updateAbout,
        updatePortfolioItem,
        deletePortfolioItem,
        updateService,
        updateTestimonial,
        deleteTestimonial,
        updateMaterial,

        // Restore & Export
        restoreSection,
        restoreAll,
        exportData,

        // Modals
        cropSession,
        openCropModal,
        closeCropModal,
        itemEditorSession,
        openItemEditor,
        closeItemEditor
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
