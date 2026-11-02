# PERFA — Family & Pet-Friendly Sofas in Hanoi (React + Vite)

A complete, responsive React + Vite e-commerce application modeled directly after the existing [Perfa Wix website (`perfacorp.wixsite.com/website`)](https://perfacorp.wixsite.com/website) layout, section order, color palette, and typography — enhanced with real-time search, multi-attribute filtering, sorting, an interactive product gallery with zoom lightbox, and material cross-linking.

---

## Brand Context

**PERFA** is a direct-to-consumer furniture e-commerce brand in Hanoi specializing in durable, easy-to-clean, pet-friendly, and child-safe sofas for modern households.
- **Price Range**: `11,000,000 ₫ – 60,000,000 ₫` (`VND 11,000,000 – 60,000,000`)
- **Key Selling Points**:
  - 100,000-rub scratch-resistant **Pet-Friendly Fabric** & hydro-repellent **Stain-Resistant Linen**
  - Removable, machine-washable cushion covers (`30°C` gentle cycle)
  - Child-safe rounded corners & solid kiln-dried timber frames
  - Complimentary interior design consultation, flexible `0%` installment financing, and white-glove delivery & assembly across Hanoi
- **Language**: 100% English UI across all pages, components, products, filters, and messages.

---

## Getting Started (Install & Run Instructions)

### Prerequisites
- **Node.js** `v18+` and **npm**

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## Project Structure

```text
├── index.html                    # Entry HTML with Cormorant Garamond & DM Sans fonts
├── package.json                  # Scripts and dependencies (React 18, React Router 6, Lucide, Vite)
├── vite.config.js                # Vite configuration
├── README.md                     # Documentation & run instructions
└── src/
    ├── main.jsx                  # Application bootstrap with BrowserRouter
    ├── App.jsx                   # Route definitions, Header, Footer, CartDrawer, ConsultationModal
    ├── index.css                 # Complete Wix-matched design system & responsive CSS
    ├── context/
    │   └── ShopContext.jsx       # Cart state, Consultation Modal state, and Toast notifications
    ├── data/
    │   └── products.js           # 12 sofa products (3 verified Unsplash URLs each), collections, services, testimonials
    ├── utils/
    │   └── searchProducts.js     # Smart search matching product names ("Luna Sofa") & prices ("25 million", "25000000")
    ├── components/
    │   ├── Header.jsx            # Sticky Wix-matched header with navigation, live search dropdown & cart badge
    │   ├── Footer.jsx            # Wix-matched 4-column footer with newsletter signup, social icons & Hanoi address
    │   ├── ProductCard.jsx       # Reusable product card with VND price, material badge, seat count & hover effects
    │   ├── CartDrawer.jsx        # Interactive slide-over shopping cart drawer
    │   └── ConsultationModal.jsx # Interactive Free Design Consultation booking modal
    └── pages/
        ├── HomePage.jsx          # 1. Homepage (Hero, Featured Collections, Best Sellers, Wix Catalog/Portfolio, Why Perfa/Services/Materials, Testimonials, Contact)
        ├── ShopPage.jsx          # 2. Shop Page (/shop) with real-time Price, Material, Color, Seat Count filters & Sort
        ├── ProductDetailPage.jsx # 3. Product Detail Page (/product/:id) with 3-angle gallery, Zoom Lightbox & Material cross-linking
        ├── AboutPage.jsx         # 4. About Us Page (/about) with Vision, Mission, Brand Story & Material Science
        └── ContactPage.jsx       # 5. Contact Page (/contact) with validated form, Hotline, Hanoi Showroom & Map
```

---

## Key Features & Wix Template Alignment

1. **Wix Color Palette & Typography Match**:
   - **Deep Sage Green (`#4B6355` / `rgb(75, 99, 85)`)**: Sticky header, hero banner, about/portfolio showcase, and footer matching the live Wix site.
   - **Warm Beige (`#F5F0E8`) & Soft Stone (`#E8E5E1`)**: Alternating section backgrounds.
   - **Muted Green (`#7A8B6F`) & Warm Taupe (`#584B47`)**: Badges, borders, and accents.
   - **Editorial Serif (`Cormorant Garamond` / `Times`) + Clean Sans-Serif (`DM Sans`)**: Mirrors the Wix heading and body font hierarchy.
2. **Global Live Search Bar (Header)**:
   - Works across all 5 pages.
   - Supports product name queries (e.g. `"Luna Sofa"`, `"Cloud"`, `"Sage"`) and price queries (e.g. `"25 million"`, `"25000000"`, `"13,500,000"`).
3. **Shop Page (`/shop`)**:
   - Real-time filtering by **Price Range** (`Under 20M`, `20–35M`, `35–50M`, `Over 50M`), **Material** (`Pet-Friendly Fabric`, `Stain-Resistant Linen`, `Fabric`, `Leather`), **Color** (`Beige`, `Grey`, `Green`, `Navy`, `Brown`), and **Seat Count** (`2`, `3`, `4`), plus **Sort** (`Newest`, `Price Low to High`, `Price High to Low`).
4. **Product Detail Page (`/product/:id`)**:
   - **3-Image Gallery** (`Front View`, `Side Angle`, `Fabric Close-Up`): Click any thumbnail to swap the main image.
   - **Lightbox with Zoom**: Click the main image to open the full-screen lightbox with `100% / 185% / 250%` zoom controls.
   - **Clickable Material Cross-Linking**: Clicking the material name (e.g. `Pet-Friendly Fabric` or `Stain-Resistant Linen`) reveals other Perfa sofas crafted with the exact same material, each linking directly to its own product page.
