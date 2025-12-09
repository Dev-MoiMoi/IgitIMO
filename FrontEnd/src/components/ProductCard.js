import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, className = '', showQuantity = false, onClick }) => {
  if (!product) return null;

  // Helper for image URLs
  const BASE_IMAGE_URL = 'http://localhost:8082';
  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/600x400/f8f8f8/ccc?text=Image+Not+Found';

    if (img.startsWith('http')) return img; // absolute URL
    if (img.startsWith('/')) return img;    // browser-relative path

    return `${BASE_IMAGE_URL}/${img}`;      // backend-relative path
  };

  const imageUrl = getImageUrl(product.image);

  const content = (
    <div
      className={`card product-card ${className} h-100`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <img
        src={imageUrl}
        alt={product.name}
        className="card-image"
        style={product.quantity <= 0 ? { filter: 'grayscale(100%)' } : {}}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            'https://placehold.co/600x400/f8f8f8/ccc?text=Image+Not+Found';
        }}
      />

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        {showQuantity && (
          <span className="badge bg-secondary d-block mb-1">
            Stocks: {product.quantity}
          </span>
        )}
        <p className="card-price">
          ₱
          {typeof product.price === 'number'
            ? product.price.toFixed(2)
            : Number(product.price || 0).toFixed(2)}
        </p>
      </div>
    </div>
  );

  return onClick ? (
    content
  ) : (
    <Link
      to={`/product/${product.id}`}
      state={{ product }}
      className="product-link"
    >
      {content}
    </Link>
  );
};

export default ProductCard;
