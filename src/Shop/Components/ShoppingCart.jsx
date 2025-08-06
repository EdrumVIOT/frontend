import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, Package, Trash2 } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../UserContext";
import ShopHeader from "./ShopHeader";
import "../Css/ShoppingCart.css";

const ShoppingCart = () => {
  const { accessToken } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Sync guest cart to user cart only once per cartId
    const syncGuestCartToUser = async (cartId) => {
      try {
        console.debug("[syncGuestCartToUser] Starting sync for cartId:", cartId);
        if (!cartId || cartId === "undefined") {
          console.warn("[syncGuestCartToUser] Skipped: Invalid cartId");
          return;
        }

        const alreadySynced = localStorage.getItem("guest_cart_synced");
        const lastSyncedCartId = localStorage.getItem("last_synced_cart_id");

        console.debug(
          `[syncGuestCartToUser] alreadySynced=${alreadySynced}, lastSyncedCartId=${lastSyncedCartId}`
        );

        if (alreadySynced === "true" && lastSyncedCartId === cartId) {
          console.log("[syncGuestCartToUser] Already synced this cartId, skipping");
          return;
        }

        console.debug("[syncGuestCartToUser] Syncing guest cart to user cart...");
        const res = await axiosInstance.post(
          "/store/assignGuestCartToUser",
          { cartId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.debug("[syncGuestCartToUser] Response from server:", res.data);

        const userCartId = res.data?.data?._id;
        if (userCartId) {
          localStorage.setItem("cart_id", userCartId);
          console.debug("[syncGuestCartToUser] Updated localStorage cart_id:", userCartId);
        } else {
          console.warn("[syncGuestCartToUser] No userCartId returned from API");
        }

        localStorage.setItem("guest_cart_synced", "true");
        localStorage.setItem("last_synced_cart_id", cartId);
        console.debug("[syncGuestCartToUser] Sync flags updated in localStorage");
      } catch (err) {
        console.error("[syncGuestCartToUser] Error during sync:", err);
      }
    };

    const fetchCart = async () => {
      try {
        let cartId = localStorage.getItem("cart_id");

        if (accessToken) {
          // If guest cart exists in localStorage, sync it once
          if (cartId && cartId !== "undefined") {
            await syncGuestCartToUser(cartId);
            // After syncing, get the updated cartId again
            cartId = localStorage.getItem("cart_id");
          }

          // Fetch user cart (no cartId param, user identified by token)
          const res = await axiosInstance.get("/store/getCart", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = res.data?.data || {};
          if (data._id) {
            localStorage.setItem("cart_id", data._id);
          }
          setCartItems((data.items || []).map((item) => ({ ...item, selected: true })));
          console.log("[ShoppingCart][fetchCart] User cart loaded");
        } else {
          // Guest user: fetch cart by cartId from localStorage
          if (!cartId || cartId === "undefined") {
            setCartItems([]);
            console.log("[ShoppingCart][fetchCart] No guest cart_id found");
            return;
          }

          const res = await axiosInstance.get("/store/getCart", {
            params: { cartId },
          });

          const data = res.data?.data || {};
          if (data._id) {
            localStorage.setItem("cart_id", data._id);
          }
          setCartItems((data.items || []).map((item) => ({ ...item, selected: true })));
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
      if (!cartId || cartId === "undefined") return;

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
      if (!cartId || cartId === "undefined") return;

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

  const handlePlaceOrder = async () => {
    if (!accessToken) {
      alert("Захиалахын тулд эхлээд нэвтэрнэ үү");
      return;
    }

    const cartId = localStorage.getItem("cart_id");
    if (!cartId || cartId === "undefined") {
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

      // Clear localStorage except auth-related keys
      const keepKeys = ["accessToken", "user", "refreshToken"];
      const preserved = {};

      keepKeys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) preserved[key] = value;
      });

      localStorage.clear();

      Object.entries(preserved).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Remove cart_id so new cart can be created on next add
      localStorage.removeItem("cart_id");

      // Reset sync flags after order so next new cart can sync
      localStorage.removeItem("guest_cart_synced");
      localStorage.removeItem("last_synced_cart_id");
    } catch (err) {
      console.error("[ShoppingCart][handlePlaceOrder] Error:", err);
      alert("Захиалга хийхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  // Calculate selected items and totals including quantity
  const selectedItems = cartItems.filter((item) => item.selected);
  const totalCount = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 1),
    0
  );

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

            {totalCount > 0 && (
              <p className="cart-selected-summary">
                Сонгосон: {totalCount} ширхэг – Нийт: {totalAmount.toLocaleString()}₮
              </p>
            )}

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
  {item.productId?.photo?.length > 0 ? (
    <img
      src={item.productId.photo[0]}
      alt={item.productId.title || "Product image"}
      className="product-image"
    />
  ) : (
    <Package size={24} color="#000" />
  )}
</div>


                    <div className="item-name">
                      {item.productId?.title || "Unnamed product"}
                    </div>

                    <div className="item-quantity">
                      {item.quantity} ширхэг
                    </div>

                    <div className="item-price">
                      {item.productId?.price.toLocaleString() || "N/A"}₮
                    </div>

                    <div className="item-total-price">
                      {(item.productId?.price * (item.quantity || 1)).toLocaleString() || "N/A"}₮
                    </div>

                    <button
                      onClick={() => removeItem(item._id, item.productId?._id)}
                      className="delete-button"
                      title="Remove item"
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

            <div
              className="clear-cart-button-container"
              style={{ marginTop: "1rem" }}
            >
              <button className="btn-clear-cart" onClick={clearCart}>
                Бүх барааг устгах
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
