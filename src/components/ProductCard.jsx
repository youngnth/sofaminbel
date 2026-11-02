import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Sparkles, ArrowUpRight } from 'lucide-react';
import { formatVND, formatVNDWithCode } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart } = useShop();

  const primaryTag =
    product.tags && product.tags.length > 0 ? product.tags[0] : 'Family Safe';

  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-card-image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-badges">
          <span className="badge badge-tag">
            <Sparkles size={11} /> {primaryTag}
          </span>
          {product.isWashable && primaryTag !== 'Washable Cover' && (
            <span className="badge badge-washable">Washable Cover</span>
          )}
        </div>
        <span className="product-card-hover-cta">
          View Details <ArrowUpRight size={15} />
        </span>
      </Link>

      <div className="product-card-body">
        <div className="product-card-meta-row">
          <span className="product-material-pill">{product.material}</span>
          <span className="product-seat-pill">
            <Users size={12} /> {product.seatCount}-Seater
          </span>
        </div>

        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="product-card-color-row">
          <span
            className="color-dot"
            style={{ backgroundColor: product.colorHex || '#D8CFC2' }}
            aria-hidden="true"
          />
          <span className="color-label">{product.color}</span>
          <span className="meta-dot">•</span>
          <span className="washable-label">
            {product.isWashable ? 'Removable Washable Cover' : 'Wipe-Clean Surface'}
          </span>
        </div>

        <div className="product-card-footer">
          <div className="product-price-block">
            <span className="product-price-vnd">{formatVND(product.price)}</span>
            <span className="product-price-code">
              {formatVNDWithCode(product.price)}
            </span>
          </div>

          <div className="product-card-actions">
            <button
              type="button"
              className="btn-card-cart"
              onClick={() => addToCart(product, 1)}
              aria-label={`Add ${product.name} to cart`}
              title="Add to Cart"
            >
              <ShoppingBag size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
