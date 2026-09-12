import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Slippers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState("Men");
  const [addedProducts, setAddedProducts] = useState([]);

  useEffect(() => {
  window.scrollTo(0, 0);

  const fetchSlippers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (data.success) {
          const slipperProducts = data.products.filter(
            (product) =>
              product.category &&
              product.category.toLowerCase().includes("slipper")
          );

          setProducts(slipperProducts);
        }
      } catch (error) {
        console.error("Slippers Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlippers();
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
            "url(https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1800&q=85)",
        }}
      >
        <div className="formal-hero-overlay">
          <p>SLIPPERS COLLECTION</p>

          <h1>
            Step Into
            <br />
            Comfort
          </h1>

          <span>
            Easygoing footwear made for everyday comfort.
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
          <h2>Shop Slippers</h2>
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
            👨 MEN'S SLIPPERS
          </button>

          <button
            className={
              selectedGender === "Women"
                ? "gender-button active"
                : "gender-button"
            }
            onClick={() => setSelectedGender("Women")}
          >
            👩 WOMEN'S SLIPPERS
          </button>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="collection-products">

        {loading ? (
          <p className="collection-message">
            Loading slippers...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="collection-message">
            No {selectedGender.toLowerCase()} slippers available yet.
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
                      {selectedGender.toUpperCase()}'S SLIPPERS
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

export default Slippers;