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

// ✅ Debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, setShowLoginModal } = useAuth();
  const { items: cartItems, removeItem, updateItem, fetchCart } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [modalItems, setModalItems] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // ------------------------------
  // Sync selected item checkboxes
  // ------------------------------
  useEffect(() => {
    setSelectedItems(prev => {
      const newSelected = cartItems.map(item => {
        const existing = prev.find(p => p.id === item.id);
        return { id: item.id, selected: existing ? existing.selected : false };
      });
      return newSelected;
    });
  }, [cartItems]);

  // -----------------------------------
  // Optimistic & Debounced quantity save
  // -----------------------------------
  const sendQtyUpdate = debounce((id, qty) => {
    axios.patch(`${API_BASE}/cart/update-quantity/${id}`, { quantity: qty })
      .catch(err => console.error("Failed to update quantity:", err));
  }, 300);

  const handleQuantityChange = (cart_item_id, amount) => {
    const item = cartItems.find(ci => ci.id === cart_item_id);
    if (!item) return;

    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) return;

    // 🔥 Optimistic UI
    updateItem(cart_item_id, newQuantity);

    // 🔥 Send to server in background (debounced)
    sendQtyUpdate(cart_item_id, newQuantity);
  };

  // ----------------------------
  // Select / Select All handlers
  // ----------------------------
  const handleSelect = id =>
    setSelectedItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );

  const handleSelectAll = checked =>
    setSelectedItems(prev =>
      prev.map(item => ({ ...item, selected: checked }))
    );

  const allSelected =
    selectedItems.length > 0 &&
    selectedItems.every(item => item.selected);

  // ---------------------
  // Delete selected items
  // ---------------------
  const handleDeleteSelected = () => {
  const itemsToDelete = selectedItems.filter(item => item.selected).map(item => item.id);
  if (itemsToDelete.length === 0) return;

  // 🔥 Optimistic UI (remove immediately)
  itemsToDelete.forEach(id => removeItem(id));

  // 🔥 Background delete (non-blocking)
  Promise.allSettled(
    itemsToDelete.map(id => axios.delete(`${API_BASE}/cart/remove/${id}`))
  ).then(results => {
    const failed = results
      .map((res, index) => ({ res, id: itemsToDelete[index] }))
      .filter(r => r.res.status === "rejected");

    if (failed.length > 0) {
      alert("Some items failed to delete due to a network/server error.");
      
      // Optional: restore failed items to cart (if important)
      // fetchCart();
    }
  });
};


  // ---------------------
  // Subtotal calculation
  // ---------------------
  const subtotal = cartItems
    .filter(item => selectedItems.find(s => s.id === item.id && s.selected))
    .reduce((acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity, 0)
    .toFixed(2);

  // ---------------------
  // Checkout
  // ---------------------
  const handleCheckout = () => {
    setCheckoutError("");

    const selected = cartItems.filter(s =>
      selectedItems.find(sel => sel.id === s.id && sel.selected)
    );

    if (selected.length === 0) {
      setCheckoutError("Please select at least one product to checkout.");
      setTimeout(() => setCheckoutError(""), 3000);
      return;
    }

    // Stock check
    for (const item of selected) {
      if (item.quantity > item.product.quantity) {
        setCheckoutError(
          `You are ordering ${item.product.name} more than available stock (Available: ${item.product.quantity})`
        );
        setTimeout(() => setCheckoutError(""), 5000);
        return;
      }
    }

    setModalItems(selected);
    setShowCheckout(true);
  };

  // ----------------------------
  // Auth loading / not logged in
  // ----------------------------
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
      </>
    );
  }

  // --------------------
  // MAIN RETURN UI
  // --------------------
  return (
    <>
      <AppNavbar />

      <div className="container cart-container">
        <div className="cart-header">
          <BackButton label="" />

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
            <div className="empty-cart-icon">:(</div>
            <p className="fs-5">Your cart is empty</p>
            <button className="shop-btn" onClick={() => navigate("/products")}>
              Start Shopping
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
                    />

                    <img
                      src={item.product?.image || "https://placehold.co/150x150?text=No+Image"}
                      alt={item.product?.name || "Product"}
                      className="cart-item-img"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x150?text=No+Image";
                      }}
                    />

                    <div>
                      <p className="mb-1">{item.product?.name || "Unnamed Product"}</p>
                      <p className="mb-0 text-muted">
                        ₱{Number(item.product?.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
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
                />
                <span>Select All</span>
              </div>

              <div className="subtotal">
                <span className="fw-bold">
                  Subtotal: <span className="text-success">₱{subtotal}</span>
                </span>

                {checkoutError && (
                  <span className="text-danger ms-3 small">{checkoutError}</span>
                )}

                <button className="checkout-btn" onClick={handleCheckout}>
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          show={showCheckout}
          items={modalItems}
          onClose={() => setShowCheckout(false)}
          onCheckoutComplete={({ shippingAddress }) => {
            axios
              .post(`${API_BASE}/checkout`, {
                user_id: user.id,
                items: modalItems,
                shipping_address: shippingAddress,
              })
              .then(() => {
                Promise.all(
                  modalItems.map(item =>
                    axios.delete(`${API_BASE}/cart/remove/${item.id}`)
                  )
                ).then(() => {
                  fetchCart();
                  setShowCheckout(false);
                  alert("Order Placed Successfully!");
                });
              })
              .catch(err => {
                if (err.response) {
                  alert(
                    `Checkout Failed: ${err.response.data.message || "Server Error"}`
                  );
                } else {
                  alert("Checkout Failed: Network Error or Server Unreachable");
                }
              });
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default Cart;
