import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function FormalShoes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState("Men");
  const [addedProducts, setAddedProducts] = useState([]);

  useEffect(() => {
  window.scrollTo(0, 0);

  const fetchFormalShoes = async () => {
      try {
        const response = await fetch(
          "/api/products"
        );

        const data = await response.json();

        if (data.success) {
          const formalProducts = data.products.filter(
            (product) =>
              product.category &&
              product.category.toLowerCase().includes("formal")
          );

          setProducts(formalProducts);
        }
      } catch (error) {
        console.error("Formal Shoes Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormalShoes();
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
      {/* FORMAL HERO */}
      <section
        className="formal-hero"
        style={{
          backgroundImage:
            "url(https://alfagentlemenoutfit.com/assets/sapatos-oxford-w2qNbpsO.jpg)",
        }}
      >
        <div className="formal-hero-overlay">
          <p>FORMAL COLLECTION</p>

          <h1>
            Step Into
            <br />
            Confidence
          </h1>

          <span>
            Timeless formal footwear for a sharper tomorrow.
          </span>

          <button
            className="formal-hero-button"
            onClick={() =>
              document
                .querySelector(".collection-products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            SHOP ALL SHOES →
          </button>
        </div>
      </section>

      {/* GENDER OPTIONS */}
      <section className="slipper-gender-section">

        <div className="section-heading">
          <p>CHOOSE YOUR STYLE</p>

          <h2>Shop Formal Shoes</h2>
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
            👨 MEN'S FORMAL
          </button>

          <button
            className={
              selectedGender === "Women"
                ? "gender-button active"
                : "gender-button"
            }
            onClick={() => setSelectedGender("Women")}
          >
            👩 WOMEN'S FORMAL
          </button>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="collection-products">

        {loading ? (
          <p className="collection-message">
            Loading formal shoes...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="collection-message">
            No {selectedGender.toLowerCase()} formal shoes available yet.
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
                      {selectedGender.toUpperCase()}'S FORMAL
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

export default FormalShoes;