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

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, setShowLoginModal } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [modalItems, setModalItems] = useState([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingQty, setLoadingQty] = useState({});
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Load cart from backend
  const loadCart = () => {
    if (!user) return;
    setLoadingCart(true);
    axios
      .get(`${API_BASE}/cart/${user.id}`)
      .then(res => {
        const cart = Array.isArray(res.data.cart)
          ? res.data.cart
          : (Array.isArray(res.data) ? res.data : []);
        setCartItems(cart);
        setSelectedItems(cart.map(item => ({ id: item.id, selected: false })));
      })
      .catch(err => console.error("Failed to load cart:", err))
      .finally(() => setLoadingCart(false));
  };

  useEffect(() => {
    if (isAuthenticated && user) loadCart();
  }, [isAuthenticated, user]);

  // Loading state
  if (authLoading || loadingCart) {
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

    setCartItems(prev =>
      prev.map(ci => (ci.id === cart_item_id ? { ...ci, quantity: newQuantity } : ci))
    );

    axios
      .patch(`${API_BASE}/cart/update/${cart_item_id}`, { quantity: newQuantity })
      .then(() => loadCart())
      .catch(err => console.error("Failed to update quantity:", err))
      .finally(() => setLoadingQty(prev => ({ ...prev, [cart_item_id]: false })));
  };

  // Delete selected
  const handleDeleteSelected = () => {
    const itemsToDelete = selectedItems.filter(item => item.selected).map(item => item.id);
    if (itemsToDelete.length === 0) return;

    setLoadingDelete(true);
    Promise.all(itemsToDelete.map(id => axios.delete(`${API_BASE}/cart/remove/${id}`)))
      .then(() => loadCart())
      .catch(err => console.error("Failed to delete items:", err))
      .finally(() => setLoadingDelete(false));
  };

  const subtotal = cartItems
    .filter(item => selectedItems.find(s => s.id === item.id && s.selected))
    .reduce((acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = () => {
    const selected = cartItems.filter(s =>
      selectedItems.find(sel => sel.id === s.id && sel.selected)
    );
    if (selected.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
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
            axios
              .post(`${API_BASE}/checkout`, { user_id: user.id, items: modalItems, shipping_address: shippingAddress })
              .then(() => {
                Promise.all(modalItems.map(item => axios.delete(`${API_BASE}/cart/remove/${item.id}`)))
                  .then(() => { loadCart(); setShowCheckout(false); alert("Order Placed Successfully!"); });
              })
              .catch(err => console.error("Checkout failed:", err));
          }}
        />
      )}
    </>
  );
};

export default Cart;
