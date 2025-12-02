import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, className = '' }) => {
  if (!product) return null;

  return (
    <Link
      to={`/product/${product.id}`}
      state={{ product }}
      className={`card product-card product-link ${className}`}
    >
      <img
        src={product.image}
        alt={product.name}
        className="card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            'https://placehold.co/600x400/f8f8f8/ccc?text=Image+Not+Found';
        }}
      />

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-description">{product.description}</p>
        <p className="card-price">
          {typeof product.price === 'number'
            ? `₱${product.price.toFixed(2)}`
            : product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
