import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Sparkles, ArrowUpRight, Edit2, Image, Trash2 } from 'lucide-react';
import { formatVND, formatVNDWithCode } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const {
    addToCart,
    isEditMode,
    updateProduct,
    deleteProduct,
    openCropModal,
    openItemEditor
  } = useShop();

  const primaryTag =
    product.tags && product.tags.length > 0 ? product.tags[0] : 'Family Safe';

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openItemEditor({
      title: `Chỉnh sửa: ${product.name}`,
      fields: [
        { label: 'Tên Sản Phẩm (Name)', key: 'name', type: 'text' },
        { label: 'Giá (VND Số, ví dụ: 25000000)', key: 'price', type: 'number' },
        { label: 'Chất Liệu (Material)', key: 'material', type: 'text' },
        { label: 'Màu Sắc (Color)', key: 'color', type: 'text' },
        { label: 'Số Ghế (Seat Count: 2, 3, 4)', key: 'seatCount', type: 'number' },
        { label: 'Kích Thước (Dimensions)', key: 'dimensions', type: 'text' },
        { label: 'Mô Tả Sản Phẩm (Description)', key: 'description', type: 'textarea' }
      ],
      initialValues: {
        name: product.name,
        price: product.price,
        material: product.material,
        color: product.color,
        seatCount: product.seatCount,
        dimensions: product.dimensions,
        description: product.description
      },
      onSave: (vals) => {
        updateProduct(product.id, {
          name: vals.name,
          price: parseInt(vals.price, 10) || product.price,
          material: vals.material,
          color: vals.color,
          seatCount: parseInt(vals.seatCount, 10) || product.seatCount,
          dimensions: vals.dimensions,
          description: vals.description
        });
      }
    });
  };

  const handleCrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openCropModal({
      initialUrl: product.images[0],
      aspectRatio: 1, // Square or 4:3
      title: `Cắt & Thay ảnh: ${product.name}`,
      onApply: (croppedDataUrl) => {
        const newImages = [...product.images];
        newImages[0] = croppedDataUrl;
        updateProduct(product.id, { images: newImages });
      }
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteProduct(product.id);
  };

  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      {/* Edit Mode Overlays */}
      {isEditMode && (
        <div className="perfa-card-actions">
          <button type="button" className="perfa-card-btn" onClick={handleEdit} title="Sửa thông tin">
            <Edit2 size={12} /> Sửa
          </button>
          <button type="button" className="perfa-card-btn btn-crop" onClick={handleCrop} title="Cắt & Thay ảnh">
            <Image size={12} /> Cắt
          </button>
          <button type="button" className="perfa-card-btn btn-delete" onClick={handleDelete} title="Xóa sofa này">
            <Trash2 size={12} /> Xóa
          </button>
        </div>
      )}

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
