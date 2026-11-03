import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  X,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { searchProducts } from '../utils/searchProducts';
import ProductCard from '../components/ProductCard';
import SectionToolbar from '../components/SectionToolbar';
import { useShop } from '../context/ShopContext';

const PRICE_RANGES = [
  { label: 'Under 20M', min: 0, max: 19999999 },
  { label: '20–35M', min: 20000000, max: 35000000 },
  { label: '35–50M', min: 35000001, max: 50000000 },
  { label: 'Over 50M', min: 50000001, max: Infinity }
];

const MATERIALS = [
  'Modal',
  'Liocel',
  'Ecovero',
  'Algodão'
];

const COLORS = [
  { name: 'Beige', hex: '#E6DEC8' },
  { name: 'Grey', hex: '#9A9A96' },
  { name: 'Green', hex: '#556B57' },
  { name: 'Navy', hex: '#2E4057' },
  { name: 'Brown', hex: '#8B5A3C' }
];

const SEAT_COUNTS = [2, 3, 4];

export default function ShopPage() {
  const { products, isEditMode, addProduct } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync initial filters from URL query parameters if present
  useEffect(() => {
    const matParam = searchParams.get('material');
    const seatParam = searchParams.get('seatCount');
    const searchParam = searchParams.get('search');

    if (matParam && MATERIALS.includes(matParam)) {
      setSelectedMaterials([matParam]);
    }
    if (seatParam && SEAT_COUNTS.includes(Number(seatParam))) {
      setSelectedSeats([Number(seatParam)]);
    }
    if (searchParam !== null) {
      setKeywordFilter(searchParam);
    }
  }, [searchParams]);

  const toggleItem = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedSeats([]);
    setKeywordFilter('');
    setSearchParams({});
  };

  const filteredAndSortedProducts = useMemo(() => {
    // Start with keyword/price search if entered
    let result = keywordFilter.trim()
      ? searchProducts(products, keywordFilter)
      : [...products];

    // 1. Filter by Price Range
    if (selectedPriceRanges.length > 0) {
      result = result.filter((product) =>
        selectedPriceRanges.some((label) => {
          const rangeObj = PRICE_RANGES.find((r) => r.label === label);
          if (!rangeObj) return false;
          return product.price >= rangeObj.min && product.price <= rangeObj.max;
        })
      );
    }

    // 2. Filter by Material
    if (selectedMaterials.length > 0) {
      result = result.filter((product) =>
        selectedMaterials.includes(product.material)
      );
    }

    // 3. Filter by Color
    if (selectedColors.length > 0) {
      result = result.filter((product) => selectedColors.includes(product.color));
    }

    // 4. Filter by Seat Count
    if (selectedSeats.length > 0) {
      result = result.filter((product) =>
        selectedSeats.includes(product.seatCount)
      );
    }

    // 5. Sort
    const sorted = [...result];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return sorted;
  }, [
    keywordFilter,
    selectedPriceRanges,
    selectedMaterials,
    selectedColors,
    selectedSeats,
    sortBy
  ]);

  const totalActiveFilters =
    selectedPriceRanges.length +
    selectedMaterials.length +
    selectedColors.length +
    selectedSeats.length +
    (keywordFilter.trim() ? 1 : 0);

  return (
    <div className="shop-page">
      {/* Shop Page Banner matching Wix Catalog Header */}
      <section className="shop-hero-banner">
        <SectionToolbar
          sectionKey="products"
          sectionName="Shop Catalog"
        />
        <div className="container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Shop Product Catalog</span>
          </nav>
          <h1 className="shop-page-title">Family &amp; Pet-Friendly Sofa Collection</h1>
          <p className="shop-page-subtitle">
            Browse our full Hanoi collection — priced from VND 11,000,000 to VND 60,000,000 with washable covers, pet-resistant fabrics, and free home assembly.
          </p>
        </div>
      </section>

      <section className="section shop-content-section">
        <div className="container shop-layout">
          {/* LEFT SIDEBAR: Real-Time Filters */}
          <aside
            className={`shop-filters-sidebar ${
              mobileFiltersOpen ? 'mobile-open' : ''
            }`}
            aria-label="Product Filters"
          >
            <div className="filters-sidebar-header">
              <div className="filters-title-group">
                <SlidersHorizontal size={18} />
                <h2>Filters</h2>
                {totalActiveFilters > 0 && (
                  <span className="active-filter-count">{totalActiveFilters}</span>
                )}
              </div>
              {totalActiveFilters > 0 && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={clearAllFilters}
                >
                  <RotateCcw size={13} /> Clear All
                </button>
              )}
              <button
                type="button"
                className="mobile-filter-close"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick In-Shop Search */}
            <div className="filter-group">
              <h3 className="filter-group-title">Quick Filter by Name / Price</h3>
              <div className="shop-inline-search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="e.g. Luna, 25 million..."
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  aria-label="Filter by name or price"
                />
                {keywordFilter && (
                  <button
                    type="button"
                    onClick={() => setKeywordFilter('')}
                    aria-label="Clear keyword"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* 1. Price Range Filter */}
            <div className="filter-group">
              <h3 className="filter-group-title">Price Range (VND)</h3>
              <div className="filter-options-list">
                {PRICE_RANGES.map((range) => {
                  const isChecked = selectedPriceRanges.includes(range.label);
                  return (
                    <label key={range.label} className="filter-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleItem(
                            selectedPriceRanges,
                            setSelectedPriceRanges,
                            range.label
                          )
                        }
                      />
                      <span className="custom-checkbox">
                        {isChecked && <Check size={12} />}
                      </span>
                      <span className="filter-label-text">{range.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Material Filter */}
            <div className="filter-group">
              <h3 className="filter-group-title">Material</h3>
              <div className="filter-options-list">
                {MATERIALS.map((material) => {
                  const isChecked = selectedMaterials.includes(material);
                  return (
                    <label key={material} className="filter-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleItem(
                            selectedMaterials,
                            setSelectedMaterials,
                            material
                          )
                        }
                      />
                      <span className="custom-checkbox">
                        {isChecked && <Check size={12} />}
                      </span>
                      <span className="filter-label-text">{material}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Color Filter */}
            <div className="filter-group">
              <h3 className="filter-group-title">Color</h3>
              <div className="filter-color-grid">
                {COLORS.map((colorObj) => {
                  const isSelected = selectedColors.includes(colorObj.name);
                  return (
                    <button
                      key={colorObj.name}
                      type="button"
                      className={`color-filter-chip ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() =>
                        toggleItem(
                          selectedColors,
                          setSelectedColors,
                          colorObj.name
                        )
                      }
                      aria-pressed={isSelected}
                    >
                      <span
                        className="color-swatch-circle"
                        style={{ backgroundColor: colorObj.hex }}
                      />
                      <span>{colorObj.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Seat Count Filter */}
            <div className="filter-group">
              <h3 className="filter-group-title">Seat Count</h3>
              <div className="seat-filter-row">
                {SEAT_COUNTS.map((seat) => {
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      type="button"
                      className={`seat-filter-btn ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() =>
                        toggleItem(selectedSeats, setSelectedSeats, seat)
                      }
                      aria-pressed={isSelected}
                    >
                      {seat} Seats
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN AREA: Toolbar + Product Grid */}
          <div className="shop-main-area">
            <div className="shop-toolbar">
              <div className="shop-results-summary">
                <button
                  type="button"
                  className="btn btn-outline btn-sm mobile-filter-trigger"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal size={15} /> Filters ({totalActiveFilters})
                </button>
                <span>
                  Showing <strong>{filteredAndSortedProducts.length}</strong> of{' '}
                  {products.length} sofas
                </span>
              </div>

              <div className="shop-sort-control">
                <label htmlFor="shop-sort-select" className="sort-label">
                  <ArrowUpDown size={15} /> Sort by:
                </label>
                <select
                  id="shop-sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills */}
            {totalActiveFilters > 0 && (
              <div className="active-filters-bar">
                <span className="active-filters-label">Active Filters:</span>
                {keywordFilter.trim() && (
                  <button
                    type="button"
                    className="active-filter-pill"
                    onClick={() => setKeywordFilter('')}
                  >
                    Search: "{keywordFilter}" <X size={13} />
                  </button>
                )}
                {selectedPriceRanges.map((pr) => (
                  <button
                    type="button"
                    key={pr}
                    className="active-filter-pill"
                    onClick={() =>
                      toggleItem(selectedPriceRanges, setSelectedPriceRanges, pr)
                    }
                  >
                    {pr} <X size={13} />
                  </button>
                ))}
                {selectedMaterials.map((mat) => (
                  <button
                    type="button"
                    key={mat}
                    className="active-filter-pill"
                    onClick={() =>
                      toggleItem(selectedMaterials, setSelectedMaterials, mat)
                    }
                  >
                    {mat} <X size={13} />
                  </button>
                ))}
                {selectedColors.map((col) => (
                  <button
                    type="button"
                    key={col}
                    className="active-filter-pill"
                    onClick={() =>
                      toggleItem(selectedColors, setSelectedColors, col)
                    }
                  >
                    Color: {col} <X size={13} />
                  </button>
                ))}
                {selectedSeats.map((seat) => (
                  <button
                    type="button"
                    key={seat}
                    className="active-filter-pill"
                    onClick={() =>
                      toggleItem(selectedSeats, setSelectedSeats, seat)
                    }
                  >
                    {seat}-Seater <X size={13} />
                  </button>
                ))}
                <button
                  type="button"
                  className="clear-all-inline-btn"
                  onClick={clearAllFilters}
                >
                  Reset All
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="shop-product-grid" data-testid="shop-product-grid">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {isEditMode && (
                  <div
                    className="perfa-add-item-card"
                    onClick={() => {
                      const newId = String(Date.now());
                      addProduct({
                        id: newId,
                        name: 'New Custom Sofa',
                        price: 26000000,
                        material: 'Liocel',
                        color: 'Beige',
                        colorHex: '#E6DEC8',
                        seatCount: 3,
                        dimensions: '220 cm (W) × 94 cm (D) × 84 cm (H)',
                        isWashable: true,
                        isBestSeller: true,
                        createdAt: new Date().toISOString(),
                        wixCategory: 'Sofa & Daybeds',
                        tags: ['Liocel Weave', 'Washable Cover'],
                        description: 'Handcrafted luxury family sofa.',
                        images: [
                          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
                          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
                        ]
                      });
                    }}
                  >
                    <div className="perfa-add-icon">+</div>
                    <span>Thêm Sofa Mới</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="shop-empty-state">
                <h3>No Sofas Match Your Exact Filter Combination</h3>
                <p>
                  Try removing one or more filters to explore more family and pet-friendly sofas in our catalog.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearAllFilters}
                >
                  <RotateCcw size={16} /> Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
