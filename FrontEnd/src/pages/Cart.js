import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BsTrash } from "react-icons/bs";
import BackButton from "../components/BackButton";
import "../styles/style.css";
import axios from "axios";
import API_BASE from "../config/api";
import CheckoutModal from "../components/CheckoutModal";
import { useAuth } from "../context/AuthContext";

import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, setShowLoginModal } = useAuth();
  const { items: cartItems, setItems, removeItem, clearCart, totalItems, updateItem, fetchCart } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [modalItems, setModalItems] = useState([]);

  const [loadingQty, setLoadingQty] = useState({});
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Sync selected items with cart items
  useEffect(() => {
    setSelectedItems(prev => {
      const newSelected = cartItems.map(item => {
        const existing = prev.find(p => p.id === item.id);
        return { id: item.id, selected: existing ? existing.selected : false };
      });
      return newSelected;
    });
  }, [cartItems]);

  // Loading state
  if (authLoading) {
    return (
      <>
        <AppNavbar />
        <div className="container cart-container text-center my-5">
          <h4>Loading cart...</h4>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AppNavbar />
        <div className="container cart-container text-center my-5">
          <h4>Your cart is empty</h4>
          <p>Please log in to view and manage your cart.</p>
          <button className="shop-btn" onClick={() => setShowLoginModal(true)}>
            Log In
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Select items
  const handleSelect = id =>
    setSelectedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );

  const handleSelectAll = checked =>
    setSelectedItems(prev => prev.map(item => ({ ...item, selected: checked })));

  const allSelected = selectedItems.length > 0 && selectedItems.every(item => item.selected);

  // Quantity change
  const handleQuantityChange = (cart_item_id, amount) => {
    const item = cartItems.find(ci => ci.id === cart_item_id);
    if (!item) return;
    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) return;

    setLoadingQty(prev => ({ ...prev, [cart_item_id]: true }));

    axios
      .patch(`${API_BASE}/cart/update-quantity/${cart_item_id}`, { quantity: newQuantity })
      .then(() => {
        console.log("Quantity update success");
        updateItem(cart_item_id, newQuantity);
      })
      .catch(err => {
        console.error("Failed to update quantity:", err);
        alert("Failed to update quantity. Please try again.");
      })
      .finally(() => setLoadingQty(prev => ({ ...prev, [cart_item_id]: false })));
  };

  // Delete selected
  const handleDeleteSelected = () => {
    const itemsToDelete = selectedItems.filter(item => item.selected).map(item => item.id);
    if (itemsToDelete.length === 0) return;

    setLoadingDelete(true);
    Promise.all(itemsToDelete.map(id => axios.delete(`${API_BASE}/cart/remove/${id}`)))
      .then(() => {
        // Remove from context
        itemsToDelete.forEach(id => removeItem(id));
      })
      .catch(err => console.error("Failed to delete items:", err))
      .finally(() => setLoadingDelete(false));
  };

  const subtotal = cartItems
    .filter(item => selectedItems.find(s => s.id === item.id && s.selected))
    .reduce((acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity, 0)
    .toFixed(2);



  const handleCheckout = () => {
    console.log("Checkout button clicked");
    setCheckoutError("");

    const selected = cartItems.filter(s =>
      selectedItems.find(sel => sel.id === s.id && sel.selected)
    );

    console.log("Selected items:", selected);

    if (selected.length === 0) {
      console.warn("No items selected for checkout");
      setCheckoutError("Please select at least one product to checkout.");
      // Clear error after 3 seconds
      setTimeout(() => setCheckoutError(""), 3000);
      return;
    }

    // Check stock availability
    for (const item of selected) {
      if (item.quantity > item.product.quantity) {
        setCheckoutError(`You are placing an order for ${item.product.name} more than the stock (Available: ${item.product.quantity})`);
        setTimeout(() => setCheckoutError(""), 5000);
        return;
      }
    }

    setModalItems(selected);
    setShowCheckout(true);
  };

  return (
    <>
      <AppNavbar />
      <div className="container cart-container">
        <div className="cart-header">
          <BackButton label="Cart" />
          {cartItems.length > 0 && (
            <div
              className={`trash-icon ${loadingDelete ? "disabled" : ""}`}
              onClick={!loadingDelete ? handleDeleteSelected : undefined}
            >
              <BsTrash size={22} />
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart text-center my-5">
            <div style={{ fontSize: "4rem" }}>:(</div>
            <p className="fs-5">Your cart is empty</p>
            <button className="shop-btn" onClick={() => navigate("/products")}>
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="list-group cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="list-group-item cart-item">
                  <div className="cart-item-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.find(s => s.id === item.id)?.selected || false}
                      onChange={() => handleSelect(item.id)}
                      disabled={loadingQty[item.id]}
                    />
                    <img
                      src={item.product?.image || "https://placehold.co/150x150?text=No+Image"}
                      alt={item.product?.name || "Product"}
                      style={{ width: "70px", height: "70px", objectFit: "cover", marginRight: "10px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x150?text=No+Image";
                      }}
                    />
                    <div>
                      <p className="mb-1">{item.product?.name || "Unnamed Product"}</p>
                      <p className="mb-0 text-muted">₱{Number(item.product?.price || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1 || loadingQty[item.id]}
                    >
                      {loadingQty[item.id] ? "..." : "−"}
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      disabled={loadingQty[item.id]}
                    >
                      {loadingQty[item.id] ? "..." : "+"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="select-all">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={e => handleSelectAll(e.target.checked)}
                  disabled={Object.values(loadingQty).some(Boolean)}
                />
                <span>Select All</span>
              </div>

              <div className="subtotal">
                <span className="fw-bold">
                  Subtotal: <span className="text-success">₱{subtotal}</span>
                </span>
                {checkoutError && <span className="text-danger ms-3 small">{checkoutError}</span>}
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={Object.values(loadingQty).some(Boolean) || loadingDelete}
                >
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />

      {showCheckout && (
        <CheckoutModal
          show={showCheckout}
          items={modalItems}
          onClose={() => setShowCheckout(false)}
          onCheckoutComplete={({ shippingAddress }) => {
            console.log("Sending checkout request...", { user_id: user.id, items: modalItems, shipping_address: shippingAddress });
            axios
              .post(`${API_BASE}/checkout`, { user_id: user.id, items: modalItems, shipping_address: shippingAddress })
              .then(() => {
                console.log("Checkout success");
                Promise.all(modalItems.map(item => axios.delete(`${API_BASE}/cart/remove/${item.id}`)))
                  .then(() => { fetchCart(); setShowCheckout(false); alert("Order Placed Successfully!"); });
              })
              .catch(err => {
                console.error("Checkout failed:", err);
                if (err.response) {
                  console.error("Server Error:", err.response.data);
                  alert(`Checkout Failed: ${err.response.data.message || "Server Error"}`);
                } else {
                  alert("Checkout Failed: Network Error or Server Unreachable");
                }
              });
          }}
        />
      )}
    </>
  );
};

export default Cart;
