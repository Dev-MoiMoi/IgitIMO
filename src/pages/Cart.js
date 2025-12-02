import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BsTrash } from "react-icons/bs";
import BackButton from "../components/BackButton";
import "../styles/style.css";
import { useCart } from "../context/CartContext";
import CheckoutModal from "../components/CheckoutModal"; // IMPORT MODAL

const Cart = () => {
  const navigate = useNavigate();
  const { items: cartItems, addItem, removeItem } = useCart();

  const [selectedItems, setSelectedItems] = useState(() =>
    cartItems.map((item) => ({ id: item.id, selected: false }))
  );

  const [showCheckout, setShowCheckout] = useState(false); // FOR MODAL
  const [modalItems, setModalItems] = useState([]); // SELECTED ITEMS FOR MODAL

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedItems((prev) =>
      prev.map((item) => ({ ...item, selected: checked }))
    );
  };

  const handleQuantityChange = (id, amount) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) addItem(item, amount);
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((item) => {
      if (item.selected) removeItem(item.id);
    });
    setSelectedItems((prev) => prev.filter((item) => !item.selected));
  };

  const allSelected =
    selectedItems.length > 0 && selectedItems.every((item) => item.selected);

  const subtotal = cartItems
    .filter((item) =>
      selectedItems.find((s) => s.id === item.id && s.selected)
    )
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    setSelectedItems((prev) => {
      const ids = cartItems.map((item) => item.id);
      const newSelected = ids
        .filter((id) => !prev.some((p) => p.id === id))
        .map((id) => ({ id, selected: false }));
      return [...prev, ...newSelected];
    });
  }, [cartItems]);

  return (
    <>
      <AppNavbar />

      <div className="container cart-container">
        <div className="cart-header">
          <BackButton label="Cart" />
          {cartItems.length > 0 && (
            <div className="trash-icon" onClick={handleDeleteSelected}>
              <BsTrash size={22} />
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart text-center my-5">
            <div style={{ fontSize: "4rem" }}>:(</div>
            <p className="fs-5">Your cart is feeling empty... give it some sugar</p>
            <button
              className="shop-btn"
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="list-group cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="list-group-item cart-item">
                  <div className="cart-item-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.find((s) => s.id === item.id)?.selected ||
                        false
                      }
                      onChange={() => handleSelect(item.id)}
                    />
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p className="mb-1">{item.name}</p>
                      <p className="mb-0 text-muted">₱{item.price}</p>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
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
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span>Select All</span>
              </div>

              <div className="subtotal">
                <span className="fw-bold">
                  Subtotal: <span className="text-success">₱{subtotal}</span>
                </span>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    const selected = cartItems.filter((item) =>
                      selectedItems.find(
                        (s) => s.id === item.id && s.selected
                      )
                    );
                    if (selected.length === 0) {
                      alert("Please select at least one product to checkout.");
                      return;
                    }
                    setModalItems(selected);
                    setShowCheckout(true);
                  }}
                >
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal
          show={showCheckout}
          items={modalItems}
          onClose={() => setShowCheckout(false)}
          onCheckoutComplete={() => {
            modalItems.forEach((item) => removeItem(item.id));
            setSelectedItems((prev) =>
              prev.filter(
                (selected) => !modalItems.some((m) => m.id === selected.id)
              )
            );
            setShowCheckout(false);
            // Maybe navigate to a success page or show a success message?
            alert("Order Placed Successfully!");
          }}
        />
      )}
    </>
  );
};

export default Cart;
