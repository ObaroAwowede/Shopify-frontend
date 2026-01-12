import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "../../common/SafeIcon";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const { FiShoppingCart, FiStar } = FiIcons;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      // Could add toast notification here
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative">
          <img
            src={product.images[0].image || "https://via.placeholder.com/300x200"}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {typeof product.average_rating === 'number' &&(
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon
                    key={i}
                    icon={FiStar}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.average_rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                (
                {(!product.review_count || Number(product.review_count) === 0)
                  ? "0 reviews"
                  : `${product.review_count} reviews`}
                )
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ₦{product.price}
              </span>
              {product.original_price &&
                product.original_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₦{product.original_price}
                  </span>
                )}
            </div>

            {isAuthenticated && (
              <motion.button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {product.stock !== undefined && (
            <div className="mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 10
                    ? "bg-green-100 text-green-800"
                    : product.stock > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `${product.stock} left`
                  : "Out of Stock"}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
