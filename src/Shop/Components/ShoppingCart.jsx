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
        const alreadySynced = localStorage.getItem("guest_cart_synced");
        if (alreadySynced === "true") return;

        console.log("[ShoppingCart][syncGuestCartToUser] Syncing cartId:", cartId);
        await axiosInstance.post(
          "/store/assignGuestCartToUser",
          { cartId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        localStorage.setItem("guest_cart_synced", "true");
        console.log("[ShoppingCart][syncGuestCartToUser] Sync complete");
      } catch (err) {
        console.error("[ShoppingCart][syncGuestCartToUser] Error:", err);
      }
    };

    const fetchCart = async () => {
      try {
        const cartId = localStorage.getItem("cart_id");

        if (accessToken) {
          if (cartId) {
            await syncGuestCartToUser(cartId);
          }

          const res = await axiosInstance.get("/store/getCart", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = res.data?.data || {};
          localStorage.setItem("cart_id", data._id);
          setCartItems(data.items || []);
          console.log("[ShoppingCart][fetchCart] User cart loaded");
        } else {
          if (!cartId) {
            setCartItems([]);
            console.log("[ShoppingCart][fetchCart] No guest cart_id found");
            return;
          }

          const res = await axiosInstance.get("/store/getCart", {
            params: { cartId },
          });

          const data = res.data?.data || {};
          localStorage.setItem("cart_id", data._id);
          setCartItems(data.items || []);
          console.log("[ShoppingCart][fetchCart] Guest cart loaded");
        }
      } catch (err) {
        console.error("[ShoppingCart][fetchCart] Error:", err);
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
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) return;

      if (accessToken) {
        await axiosInstance.delete("/store/removeItemFromCart", {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { productId },
        });
      } else {
        await axiosInstance.delete("/store/removeItemFromCart", {
          data: { cartId, productId },
        });
      }

      setCartItems((items) => items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("[ShoppingCart][removeItem] Error:", err);
    }
  };

  const clearCart = async () => {
    try {
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) return;

      if (accessToken) {
        await axiosInstance.delete("/store/clearCart", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await axiosInstance.delete("/store/clearCart", {
          data: { cartId },
        });
      }

      setCartItems([]);
    } catch (err) {
      console.error("[ShoppingCart][clearCart] Error:", err);
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

const handlePlaceOrder = async () => {
  if (!accessToken) {
    alert("Захиалахын тулд эхлээд нэвтэрнэ үү");
    return;
  }

  const cartId = localStorage.getItem("cart_id");
  if (!cartId) {
    alert("Таны сагс хоосон байна.");
    return;
  }

  try {
    const res = await axiosInstance.post(
      "/store/makeOrder",
      { cartId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("[ShoppingCart][handlePlaceOrder] Order success:", res.data);

    alert("Таны захиалга амжилттай хийгдлээ!");
    setCartItems([]); // clear UI
  } catch (err) {
    console.error("[ShoppingCart][handlePlaceOrder] Error:", err);
    alert("Захиалга хийхэд алдаа гарлаа. Дахин оролдоно уу.");
  }
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
            <p className="cart-subtitle">
              You have {cartItems.length} items in your cart
            </p>

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
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="quantity-button"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="quantity-button"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="item-price">
                      {item.productId?.price || "N/A"}₮
                    </div>

                    <button
                      onClick={() =>
                        removeItem(item._id, item.productId?._id)
                      }
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
              <div
                className="clear-cart-button-container"
                style={{ marginTop: "1rem" }}
              >
                <button className="btn-clear-cart" onClick={clearCart}>
                  Бүх барааг устгах
                </button>
              </div>
            )}
          </div>

          <div className="payment-section">
            <div className="payment-container">
              <h3 className="payment-title">
                Төлбөр төлөх сонголтоо хийнэ үү
              </h3>

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