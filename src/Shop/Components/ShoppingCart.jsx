import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, Package, Trash2, Minus, Plus } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../UserContext";
import ShopHeader from "./ShopHeader";
import "../Css/ShoppingCart.css";

const ShoppingCart = () => {
  const { accessToken } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const syncGuestCartToUser = async (cartId) => {
      try {
        console.log("[ShoppingCart][syncGuestCartToUser] Start syncing with cartId:", cartId);
        const res = await axiosInstance.post(
          "/store/assignGuestCartToUser",
          { cartId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("[ShoppingCart][syncGuestCartToUser] Response:", res.data);
        localStorage.removeItem("guest_cart_id");
        localStorage.removeItem("guest_cart_items");
        await new Promise((resolve) => setTimeout(resolve, 400));
        console.log("[ShoppingCart][syncGuestCartToUser] Delay complete, returning from sync");
      } catch (err) {
        console.error("[ShoppingCart][syncGuestCartToUser] Error:", err);
      }
    };

const fetchCart = async () => {
  try {
    if (accessToken) {
      // Logged in user
      console.log("[ShoppingCart][fetchCart] Logged-in user detected");
      const guestCartId = localStorage.getItem("guest_cart_id");
      if (guestCartId) {
        await syncGuestCartToUser(guestCartId);
      }
    const cartId = localStorage.getItem("cart_id"); // get cartId from localStorage

      const res = await axiosInstance.get("/store/getCart", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { cartId },  // pass cartId as query param
      });

      console.log("[ShoppingCart][fetchCart] Backend /store/getCart response:", res.data);
      const items = res.data?.data?.items || [];
      setCartItems(items);
      console.log("[ShoppingCart][fetchCart] cartItems state updated");
    } else {
      // Guest user
      console.log("[ShoppingCart][fetchCart] Guest user detected");
      // Use 'cart_id' here (unified cart id)
      const cartId = localStorage.getItem("cart_id");  // <-- changed here
      if (cartId) {
        const res = await axiosInstance.get("/store/getCart", {
          params: { cartId },
        });
        console.log("[ShoppingCart][fetchCart] Guest /store/getCart response:", res.data);
        const items = res.data?.data?.items || [];
        setCartItems(items);
        console.log("[ShoppingCart][fetchCart] cartItems state updated for guest");
      } else {
        setCartItems([]);
        console.log("[ShoppingCart][fetchCart] No cart_id found for guest");
      }
    }
  } catch (err) {
    console.error("[ShoppingCart][fetchCart] Error loading cart:", err);
    setCartItems([]);
  }
};


    console.log("[ShoppingCart] useEffect triggered, calling fetchCart");
    fetchCart();
  }, [accessToken]);

  const toggleItemSelection = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeItem = async (id, productId) => {
    try {
      if (accessToken) {
        await axiosInstance.delete("/store/removeItemFromCart", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: { productId },
        });
      } else {
        const cartId = localStorage.getItem("guest_cart_id");
        if (!cartId) return;
        await axiosInstance.delete("/store/removeItemFromCart", {
          data: { cartId, productId },
        });
      }
      setCartItems((items) => items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("[ShoppingCart][removeItem] Failed to remove item:", err);
    }
  };

  const clearCart = async () => {
    try {
      if (accessToken) {
        await axiosInstance.delete("/store/clearCart", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        const cartId = localStorage.getItem("guest_cart_id");
        if (!cartId) return;
        await axiosInstance.delete("/store/clearCart", {
          data: { cartId },
        });
      }
      setCartItems([]);
    } catch (err) {
      console.error("[ShoppingCart][clearCart] Failed to clear cart:", err);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePlaceOrder = () => {
    if (!accessToken) {
      alert("Захиалахын тулд эхлээд нэвтэрнэ үү");
      return;
    }
    alert("Таны захиалга амжилттай боллоо!");
  };

  return (
    <>
      <ShopHeader />

      <div className="shopping-cart-container">
        <div className="shopping-cart-header">
          <ArrowLeft className="back-icon" />
          <h1 className="header-title">Continue shopping</h1>
        </div>

        <div className="main-content">
          <div className="cart-section">
            <h2 className="cart-title">Shopping cart</h2>
            <p className="cart-subtitle">You have {cartItems.length} items in your cart</p>

            <div className="cart-items">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => toggleItemSelection(item._id)}
                      className="cart-item-checkbox"
                    />

                    <div className="item-image">
                      <Package size={24} color="#000" />
                    </div>

                    <div className="item-name">
                      {item.productId?.title || "Unnamed product"}
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="quantity-button"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-button"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="item-price">
                      {item.productId?.price || "N/A"}₮
                    </div>

                    <button
                      onClick={() => removeItem(item._id, item.productId?._id)}
                      className="delete-button"
                    >
                      <Trash2 size={20} color="#007bff" />
                    </button>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>

            <div className="order-button-container">
              <button className="btn-place-order" onClick={handlePlaceOrder}>
                Захиалах
              </button>
            </div>

            {cartItems.length > 0 && (
              <div className="clear-cart-button-container" style={{ marginTop: "1rem" }}>
                <button className="btn-clear-cart" onClick={clearCart}>
                  Бүх барааг устгах
                </button>
              </div>
            )}
          </div>

          <div className="payment-section">
            <div className="payment-container">
              <h3 className="payment-title">Төлбөр төлөх сонголтоо хийнэ үү</h3>

              <div className="payment-methods">
                <div className="payment-method">
                  <div className="payment-icon">
                    <div className="transfer-icon"></div>
                  </div>
                  <div className="payment-method-text">
                    ДАНС
                    <br />
                    ШИЛЖҮҮЛЭГ
                  </div>
                </div>

                <div className="payment-method">
                  <div className="payment-icon">
                    <div className="qpay-icon"></div>
                  </div>
                  <div className="payment-method-text">QPAY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;