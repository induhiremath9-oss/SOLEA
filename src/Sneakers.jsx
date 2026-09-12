import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Sneakers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState("Men");
  const [addedProducts, setAddedProducts] = useState([]);

  useEffect(() => {
  window.scrollTo(0, 0);

  const fetchSneakers = async () => {
      try {
        const response = await fetch(
          "http:///api/products"
        );

        const data = await response.json();

        if (data.success) {
          const sneakerProducts = data.products.filter(
            (product) =>
              product.category &&
              product.category.toLowerCase().includes("sneaker")
          );

          setProducts(sneakerProducts);
        }
      } catch (error) {
        console.error("Sneakers Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;

    const savedCart =
      JSON.parse(localStorage.getItem("soleaCart")) || [];

    const alreadyAdded = savedCart.some(
      (item) => (item._id || item.id) === productId
    );

    if (!alreadyAdded) {
      savedCart.push(product);

      localStorage.setItem(
        "soleaCart",
        JSON.stringify(savedCart)
      );
    }

    setAddedProducts((prev) =>
      prev.includes(productId)
        ? prev
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      product.gender &&
      product.gender.toLowerCase() ===
        selectedGender.toLowerCase()
  );

  return (
    <div className="collection-page">

      {/* NAVBAR */}
      <nav className="collection-navbar">
        <Link to="/" className="collection-logo">
          SOLEA
        </Link>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </nav>

      {/* HERO */}
      <section
        className="formal-hero"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85)",
        }}
      >
        <div className="formal-hero-overlay">
          <p>SNEAKERS COLLECTION</p>

          <h1>
            Move With
            <br />
            Confidence
          </h1>

          <span>
            Modern sneakers designed for everyday movement and style.
          </span>

          <Link
            to="/"
            className="formal-hero-button"
          >
            SHOP ALL SHOES →
          </Link>
        </div>
      </section>

      {/* GENDER OPTIONS */}
      <section className="slipper-gender-section">

        <div className="section-heading">
          <p>CHOOSE YOUR STYLE</p>
          <h2>Shop Sneakers</h2>
        </div>

        <div className="slipper-gender-buttons">

          <button
            className={
              selectedGender === "Men"
                ? "gender-button active"
                : "gender-button"
            }
            onClick={() => setSelectedGender("Men")}
          >
            👨 MEN'S SNEAKERS
          </button>

          <button
            className={
              selectedGender === "Women"
                ? "gender-button active"
                : "gender-button"
            }
            onClick={() => setSelectedGender("Women")}
          >
            👩 WOMEN'S SNEAKERS
          </button>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="collection-products">

        {loading ? (
          <p className="collection-message">
            Loading sneakers...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="collection-message">
            No {selectedGender.toLowerCase()} sneakers available yet.
          </p>
        ) : (
          <div className="collection-grid">

            {filteredProducts.map((product) => {
              const productId =
                product._id || product.id;

              const isAdded =
                addedProducts.includes(productId);

              return (
                <div
                  className="collection-card"
                  key={productId}
                >

                  <div className="collection-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=SOLEA";
                      }}
                    />
                  </div>

                  <div className="collection-info">

                    <p className="collection-category">
                      {selectedGender.toUpperCase()}'S SNEAKERS
                    </p>

                    <h3>{product.name}</h3>

                    <strong>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </strong>

                    <button
                      className={
                        isAdded
                          ? "add-cart added"
                          : "add-cart"
                      }
                      onClick={() =>
                        handleAddToCart(product)
                      }
                    >
                      {isAdded
                        ? "✓ ADDED TO CART"
                        : "ADD TO CART"}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
}

export default Sneakers;