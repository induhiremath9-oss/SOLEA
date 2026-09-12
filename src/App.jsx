import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Admin from "./Admin";
import FormalShoes from "./FormalShoes";
import Slippers from "./Slippers";
import Sneakers from "./Sneakers";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
  return JSON.parse(localStorage.getItem("soleaCart")) || [];
});
  const [addedProducts, setAddedProducts] = useState(() => {
  const savedCart =
    JSON.parse(localStorage.getItem("soleaCart")) || [];

  return savedCart.map(
    (item) => item._id || item.id
  );
});

  const [wishlist, setWishlist] = useState(() => {
  return JSON.parse(localStorage.getItem("soleaWishlist")) || [];
});
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState(() => {
  return JSON.parse(localStorage.getItem("soleaQuantities")) || {};
});
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Load customer's saved orders
useEffect(() => {
  const savedOrders = JSON.parse(
    localStorage.getItem("soleaOrders")
  ) || [];

  setMyOrders(savedOrders);
}, []);

// Keep cart saved between Home and Formal Collection
useEffect(() => {
  localStorage.setItem(
    "soleaCart",
    JSON.stringify(cart)
  );
}, [cart]);

useEffect(() => {
  localStorage.setItem(
    "soleaQuantities",
    JSON.stringify(quantities)
  );
}, [quantities]);

// Keep wishlist saved after refresh
useEffect(() => {
  localStorage.setItem(
    "soleaWishlist",
    JSON.stringify(wishlist)
  );
}, [wishlist]);

  // Fetch products from SOLEA backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http:///api/products");

        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setError("Unable to fetch products");
        }
      } catch (err) {
        console.error("Fetch Products Error:", err);
        setError("Backend is not connected");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Track order
const trackOrder = async () => {
  if (!trackingId.trim()) {
    setTrackingError("Please enter Tracking ID");
    setTrackedOrder(null);
    return;
  }

  try {
    const response = await fetch(
      `http:///api/orders/track/${trackingId}`
    );

    const data = await response.json();

    if (response.ok && data.success) {
      setTrackedOrder(data.order);
      setTrackingError("");
    } else {
      setTrackedOrder(null);
      setTrackingError(data.message || "Order not found");
    }
  } catch (error) {
    console.error("Tracking Error:", error);
    setTrackedOrder(null);
    setTrackingError("Unable to track order");
  }
};

  const handlePlaceOrder = async () => {

  if (!name.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (!phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  if (!address.trim()) {
    alert("Please enter your delivery address.");
    return;
  }

  if (!city.trim()) {
    alert("Please enter your city.");
    return;
  }

  if (!/^[0-9]{6}$/.test(pincode)) {
    alert("Please enter a valid 6-digit pincode.");
    return;
  }

    try {
      const response = await fetch("http:///api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
    name: name,
    phone: phone,
    address: address,
    city: city,
    pincode: pincode,
},
          products: cart.map((item) => ({
  ...item,
  quantity: quantities[item._id || item.id] || 1,
})),
          totalAmount: cart.reduce(
  (sum, item) =>
    sum + Number(item.price) * (quantities[item._id || item.id] || 1),
  0
),
          paymentMethod: "Cash on Delivery",
        }),
      });

      const data = await response.json();

      if (response.ok) {

  // Save order automatically for this customer
  const savedOrders =
    JSON.parse(localStorage.getItem("soleaOrders")) || [];

  savedOrders.push({
    orderId: data.order.orderId,
    trackingId: data.order.trackingId,
  });

  localStorage.setItem(
    "soleaOrders",
    JSON.stringify(savedOrders)
  );
  setMyOrders(savedOrders);

  setOrderSuccess({
  orderId: data.order.orderId,
  trackingId: data.order.trackingId,
});

  setCart([]);
  setAddedProducts([]);
  setQuantities({});
  setShowCheckout(false);

} else {
  alert(data.message || "Failed to place order.");
}
    } catch (error) {
      console.error("Order Error:", error);
      alert("Unable to place order. Please try again.");
    }
  };

  return (
    <div className="solea-app">

      {/* NAVBAR */}
<nav className="navbar">

  <div className="logo">
    SOLEA
  </div>

  <div className="nav-search">
    <span className="search-icon">⌕</span>
    <input
  type="text"
  placeholder="Search for shoes"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
  </div>

  <div className="nav-links">
    <a href="#products">Products</a>
    <a href="#my-orders">My Orders</a>
    <a href="#about">About</a>
  </div>

  <div className="nav-icons">

    <button
  className="nav-icon"
  onClick={() => {
    document
      .getElementById("wishlist")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  {wishlist.length > 0 ? "♥" : "♡"}
  {wishlist.length > 0 && (
    <span className="icon-count">
      {wishlist.length}
    </span>
  )}
</button>

    <button
      className="nav-icon"
      onClick={() => {
        document.getElementById("cart")?.scrollIntoView({
          behavior: "smooth"
        });
      }}
    >
      🛍️
      {cart.length > 0 && (
        <span className="icon-count">
          {cart.length}
        </span>
      )}
    </button>

  </div>

</nav>

      {/* HERO SECTION */}
<section className="hero">
  <div className="hero-content">
    <p className="hero-small">WELCOME TO SOLEA</p>

    <h1>
      Step Into
      <br />
      Your Style
    </h1>

    <p>
      Discover footwear designed for comfort,
      confidence and everyday style.
    </p>

    <a href="#products" className="shop-button">
      SHOP NOW
    </a>
  </div>
</section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <div className="section-heading">
          <p>OUR COLLECTION</p>
          <h2>Featured Products</h2>
        </div>

        {loading && (
          <div className="status">
            Loading products...
          </div>
        )}

        {error && (
          <div className="status error">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="status">
            No products available.
          </div>
        )}

        <div className="product-grid">
          {products.filter((product) =>
  product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
).map((product) => (
            <div className="product-card" key={product._id || product.id}>

              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=SOLEA";
                  }}
                />

                <button
  className="wishlist"
  onClick={() => {
    const productId = product._id || product.id;

    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }}
>
  {wishlist.includes(product._id || product.id) ? "♥" : "♡"}
</button>
              </div>

              <div className="product-info">
                <p className="product-category">
                  {product.category}
                </p>

                <h3>{product.name}</h3>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-bottom">
                  <span className="price">
                    ₹{product.price}
                  </span>

                  <span className="rating">
                    ★ {product.rating}
                  </span>
                </div>

                <button
  className={`add-cart ${
    addedProducts.includes(product._id || product.id) ? "added" : ""
  }`}
  onClick={() => {
    const productId = product._id || product.id;

    if (!addedProducts.includes(productId)) {
      setCart((prevCart) => [...prevCart, product]);
      setAddedProducts((prev) => [...prev, productId]);
    }
  }}
>
  {addedProducts.includes(product._id || product.id)
    ? "✓ ADDED TO CART"
    : "ADD TO CART"}
</button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT CATEGORIES */}
      <section className="categories-section">

        <div className="section-heading">
          <p>EXPLORE SOLEA</p>
          <h2>Shop by Category</h2>
        </div>

        <div className="category-grid">

          <Link to="/formal" className="category-card">
  <img
    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    alt="Formal Shoes"
  />

  <div className="category-overlay">
    <h3>Formal</h3>
    <span>EXPLORE COLLECTION</span>
  </div>
</Link>

          <Link to="/slippers" className="category-card">
  <img
    src="https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85"
    alt="Slippers"
  />

  <div className="category-overlay">
    <h3>Slippers</h3>
    <span>EXPLORE COLLECTION</span>
  </div>
</Link>

          <Link to="/sneakers" className="category-card">
            <img
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85"
              alt="Sneakers"
            />
            <div className="category-overlay">
              <h3>Sneakers</h3>
              <span>EXPLORE COLLECTION</span>
            </div>
          </Link>

        </div>

      </section>

      {/* WISHLIST */}
<section className="wishlist-section" id="wishlist">

  <div className="section-heading">
    <p>YOUR FAVOURITES</p>
    <h2>Wishlist</h2>
  </div>

  {wishlist.length === 0 ? (
    <p className="empty-wishlist">
      Your wishlist is empty.
    </p>
  ) : (
    <div className="wishlist-grid">

      {products
        .filter((product) =>
          wishlist.includes(product._id || product.id)
        )
        .map((product) => {

          const productId =
            product._id || product.id;

          return (
            <div
              className="wishlist-card"
              key={productId}
            >

              <div className="wishlist-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=SOLEA";
                  }}
                />
              </div>

              <div className="wishlist-info">

                <p className="product-category">
                  {product.category}
                </p>

                <h3>{product.name}</h3>

                <p className="wishlist-price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <div className="wishlist-actions">

                  <button
                    className="wishlist-add-cart"
                    onClick={() => {
                      if (!addedProducts.includes(productId)) {
                        setCart((prevCart) => [
                          ...prevCart,
                          product
                        ]);

                        setAddedProducts((prev) => [
                          ...prev,
                          productId
                        ]);
                      }
                    }}
                  >
                    {addedProducts.includes(productId)
                      ? "✓ ADDED TO CART"
                      : "ADD TO CART"}
                  </button>

                  <button
                    className="wishlist-remove"
                    onClick={() => {
                      setWishlist((prev) =>
                        prev.filter(
                          (id) => id !== productId
                        )
                      );
                    }}
                  >
                    REMOVE
                  </button>

                </div>

              </div>

            </div>
          );
        })}

    </div>
  )}

</section>

      {/* MY ORDERS */}
<section className="my-orders-section" id="my-orders">
  <div className="section-heading">
    <p>YOUR ORDERS</p>
    <h2>My Orders</h2>
  </div>

  {myOrders.length === 0 ? (
    <p className="empty-orders">
      You haven't placed any orders yet.
    </p>
  ) : (
    <div className="my-orders-list">
      {myOrders.map((order, index) => (
        <div className="my-order-card" key={index}>
          <div>
            <p>
              <strong>Order ID:</strong>{" "}
              {order.orderId}
            </p>

            <p>
              <strong>Tracking ID:</strong>{" "}
              {order.trackingId}
            </p>
          </div>


          <button
  className="track-my-order"
  onClick={async () => {
    try {
      const response = await fetch(
        `http:///api/orders/track/${order.trackingId}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setTrackingId(order.trackingId);
        setTrackedOrder(data.order);
        setTrackingError("");

        // Scroll to Order Details
        setTimeout(() => {
          document
            .querySelector(".track-section")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }, 100);
      } else {
        setTrackedOrder(null);
        setTrackingError(
          data.message || "Order not found"
        );
      }
    } catch (error) {
      console.error("Tracking Error:", error);
      setTrackedOrder(null);
      setTrackingError("Unable to track order");
    }
  }}
>
  TRACK ORDER
</button>
        </div>
      ))}
    </div>
  )}
</section>

{/* CART */}
<section className="cart-section" id="cart">
  <h2>Your Cart</h2>

  {cart.length === 0 ? (
    <p className="empty-cart">Your cart is empty.</p>
  ) : (
    <>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div className="cart-item" key={index}>

            <img src={item.image} alt={item.name} />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div className="quantity-control">
  <button
    onClick={() =>
      setQuantities((prev) => ({
        ...prev,
        [item._id || item.id]: Math.max(
          1,
          (prev[item._id || item.id] || 1) - 1
        ),
      }))
    }
  >
    −
  </button>

  <span>{quantities[item._id || item.id] || 1}</span>

  <button
    onClick={() =>
      setQuantities((prev) => ({
        ...prev,
        [item._id || item.id]: (prev[item._id || item.id] || 1) + 1,
      }))
    }
  >
    +
  </button>
</div>
            </div>

            <button
              className="remove-cart"
              onClick={() => {
                setCart((prevCart) =>
                  prevCart.filter((_, i) => i !== index)
                );

                setAddedProducts((prev) =>
                  prev.filter(
                    (id) => id !== (item._id || item.id)
                  )
                );
              }}
            >
              REMOVE
            </button>

          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>
  Total: ₹
  {cart.reduce(
  (total, item) =>
    total + Number(item.price) * (quantities[item._id || item.id] || 1),
  0
)}
</h3>

       <button
  className="checkout"
  onClick={() => setShowCheckout(true)}
>
  CHECKOUT
</button>
      </div>
    </>
  )}
</section>

{showCheckout && (
  <section className="checkout-section">
    <div className="checkout-box">

      <div className="checkout-header">
        <p>SOLEA CHECKOUT</p>
        <h2>Complete Your Order</h2>
        <span>Enter your details to place your order.</span>
      </div>

      <div className="checkout-form">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="checkout-row">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>

      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>

        <p>
          <span>Items</span>
          <span>{cart.length}</span>
        </p>

        <p className="checkout-total">
          <span>Total</span>
          <strong>
            ₹
            {cart.reduce(
              (total, item) =>
                total +
                Number(item.price) *
                  (quantities[item._id || item.id] || 1),
              0
            )}
          </strong>
        </p>
      </div>

      <div className="payment-section">
        <h3>Payment Method</h3>

        <label>
          <input
            type="radio"
            name="payment"
            defaultChecked
          />
          <span>Cash on Delivery</span>
        </label>

        <label>
          <input
            type="radio"
            name="payment"
          />
          <span>Online Payment</span>
        </label>
      </div>

      <button
        className="place-order"
        onClick={handlePlaceOrder}
      >
        PLACE ORDER
      </button>

      <button
        className="checkout-back"
        onClick={() => setShowCheckout(false)}
      >
        ← BACK TO CART
      </button>

    </div>
  </section>
)}

{/* TRACK ORDER */}
<section className="track-section" id="track-order">
  <div className="track-box">
    <p>ORDER TRACKING</p>

    <h2>Track Your Order</h2>

    <input
      type="text"
      placeholder="Enter Tracking ID"
      value={trackingId}
      onChange={(e) => setTrackingId(e.target.value)}
    />

    <button
      className="track-button"
      onClick={trackOrder}
    >
      TRACK ORDER
    </button>

    {trackingError && (
      <p className="tracking-error">
        {trackingError}
      </p>
    )}

    {trackedOrder && (
      <div className="tracked-order">

        <h3>Order Details</h3>

        <p>
          <strong>Order ID:</strong>{" "}
          {trackedOrder.orderId}
        </p>

        <p>
          <strong>Tracking ID:</strong>{" "}
          {trackedOrder.trackingId}
        </p>

        <p>
          <strong>Customer:</strong>{" "}
          {trackedOrder.customer.name}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {trackedOrder.status}
        </p>

        <p>
          <strong>Total Amount:</strong>{" "}
          ₹{trackedOrder.totalAmount}
        </p>

        <p>
          <strong>Payment:</strong>{" "}
          {trackedOrder.paymentMethod}
        </p>

      </div>
    )}
  </div>
</section>

{/* ABOUT */}
<section className="about" id="about">
        <p>ABOUT SOLEA</p>

        <h2>
          Walk with confidence.
        </h2>

        <p>
          SOLEA brings together comfort, style and
          quality to create footwear for everyday life.
        </p>
      </section>

      {/* FOOTER */}
<footer>
  <div className="footer-logo">SOLEA</div>

  <p>
    © 2026 SOLEA. All rights reserved.
  </p>
</footer>

{/* ORDER SUCCESS MODAL */}
{orderSuccess && (
  <div className="success-overlay">
    <div className="success-modal">
      <div className="success-icon">✓</div>

      <p className="success-label">ORDER CONFIRMED</p>

      <h2>Thank you for shopping with SOLEA.</h2>

      <p className="success-message">
        Your order has been placed successfully.
      </p>

      <div className="success-details">
        <div>
          <span>Order ID</span>
          <strong>{orderSuccess.orderId}</strong>
        </div>

        <div>
          <span>Tracking ID</span>
          <strong>{orderSuccess.trackingId}</strong>
        </div>
      </div>

      <div className="success-actions">
        <button
          onClick={() => {
            setTrackingId(orderSuccess.trackingId);
            setTrackedOrder(null);
            setTrackingError("");
            setOrderSuccess(null);

            setTimeout(() => {
              document
                .getElementById("track-order")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          TRACK MY ORDER
        </button>

        <button
          className="secondary-success-button"
          onClick={() => setOrderSuccess(null)}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  </div>
)}

</div>
);
}

function MainApp() {
  return (
    <Routes>
  <Route path="/" element={<App />} />
  <Route path="/home" element={<App />} />
  <Route path="/formal" element={<FormalShoes />} />
  <Route path="/slippers" element={<Slippers />} />
  <Route path="/sneakers" element={<Sneakers />} />
  <Route path="/admin" element={<Admin />} />
</Routes>
  );
}

export default MainApp;