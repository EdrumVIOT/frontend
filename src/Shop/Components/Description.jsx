import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import "../css/Description.css";
import { UserContext } from "../../UserContext";
import ShopHeader from "./ShopHeader";

const Description = () => {
  const { kitId } = useParams();
  const { accessToken } = useContext(UserContext);

  const [kit, setKit] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!kitId) return;

    axiosInstance
      .post("/store/getProductById", { productId: kitId })
      .then((res) => {
        const data = res.data?.data;
        if (res.data.success && data) {
          setKit(data);
          setMainImage(data.image || data.images?.[0] || null);
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [kitId]);

const handleAddToCart = async () => {
  if (!kit) return;

  if (quantity < 1) {
    alert("Quantity must be at least 1");
    return;
  }

  // Update localStorage cart items for guest
  if (!accessToken) {
    const existingCart = JSON.parse(localStorage.getItem("guest_cart_items") || "[]");
    const index = existingCart.findIndex((item) => item.productId === kit._id);
    if (index !== -1) {
      existingCart[index].quantity += quantity;
    } else {
      existingCart.push({ productId: kit._id, quantity });
    }
    localStorage.setItem("guest_cart_items", JSON.stringify(existingCart));
    console.log("[Description] LocalStorage updated (guest_cart_items):", existingCart);
  }

  const storedCartId = localStorage.getItem("cart_id");

  const body = {
    productId: kit._id,
    quantity,
    ...(storedCartId ? { cartId: storedCartId } : {}),
  };

  const headers = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    console.log("[Description] Sending addItemToCart with body:", body);
    const res = await axiosInstance.post("/store/addItemToCart", body, { headers });
    console.log("[Description] /store/addItemToCart response:", res.data);

    const newCartId = res.data?.cartId;

    if (newCartId && !storedCartId) {
      localStorage.setItem("cart_id", newCartId);
      console.log("[Description] Saved cart_id to localStorage:", newCartId);
    } else {
      console.log("[Description] cart_id already exists in localStorage, not overwriting.");
    }

    alert("Added to cart!");
  } catch (err) {
    console.error("[Description] Error adding to cart:", err);
    alert("Failed to add to cart.");
  }
};
;

  if (!kit) return <div className="description-loading">Loading...</div>;

  return (
    <div className="description-container">
      <ShopHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="main-content">
        <div className="product-images">
          <div className="main-image">
            {mainImage ? (
              <img src={mainImage} alt={kit.name} className="product-main-img" />
            ) : (
              <div>No image available</div>
            )}
          </div>
          <div className="thumbnail-images">
            {kit.images && kit.images.length > 0
              ? kit.images.map((imgUrl, idx) => (
                  <div key={idx} className="thumbnail" onClick={() => setMainImage(imgUrl)}>
                    <img src={imgUrl} alt={`thumbnail ${idx + 1}`} className="thumbnail-img" />
                  </div>
                ))
              : kit.image && (
                  <div className="thumbnail">
                    <img src={kit.image} alt="thumbnail" className="thumbnail-img" />
                  </div>
                )}
          </div>
        </div>

        <div className="product-details">
          <h2 className="product-title">{kit.name}</h2>

          <div className="price">
            <span className="price-label">Price:</span>
            <span className="price-value">{kit.price}₮</span>
          </div>

          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="specifications">{kit.description}</p>
          </div>

          <div className="product-actions">
            <div className="quantity-control">
              <label htmlFor="quantity" className="quantity-label">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  width: "60px",
                  padding: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="action-buttons">
              <button className="btn-buy" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;