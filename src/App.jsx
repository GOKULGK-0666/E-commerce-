import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://localhost:5000/api/products';

const initialCart = [
  {
    id: 1,
    name: 'Paneer Tikka Bowl',
    price: 189,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
  },
];

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState(initialCart);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {
        setProducts([]);
      });
  }, []);

  const categories = useMemo(() => {
    const names = ['All', ...new Set(products.map((product) => product.category))];
    return names;
  }, [products]);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal > 0 ? subtotal * 0.15 : 0;
  const delivery = subtotal > 0 ? 40 : 0;
  const total = Math.max(subtotal - discount + delivery, 0);
  const offerDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="logo-wrap">
          <div className="logo-badge">TB</div>
          <div>
            <span className="brand-name">TastyBite</span>
            <small>Fresh & Flavorful</small>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#intro">Home</a>
          <a href="#menu">Menu</a>
          <a href="#offers">Offers</a>
          <a href="#about">About</a>
        </nav>

        <button className="cart-button" onClick={() => setShowCart((value) => !value)}>
          Cart <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      </header>

      <main>
        <section id="intro" className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">CookWithComali-style Food Experience</p>
            <h1>Fresh food, fiery flavors, and happy cravings.</h1>
            <p className="lead">
              Veg classics, sizzling non-veg picks, and chilled desserts—all prepared fresh and delivered fast.
            </p>
            <div className="cta-row">
              <a className="primary-btn" href="#menu">Order Now</a>
              <a className="secondary-btn" href="#offers">View Offers</a>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>4.9/5</strong>
                <span>Customer rating</span>
              </div>
              <div>
                <strong>25 min</strong>
                <span>Average delivery</span>
              </div>
              <div>
                <strong>1200+</strong>
                <span>Orders today</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dish-card large">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
                alt="Royal biryani"
              />
              <div className="dish-badge">Chef's Special</div>
            </div>
            <div className="mini-cards">
              <div className="dish-card small">
                <img
                  src="https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80"
                  alt="Fish curry"
                />
              </div>
              <div className="dish-card small icecream">
                <img
                  src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80"
                  alt="Ice cream"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="offers" className="promo-band">
          <div className="promo-item">
            <span>🔥</span>
            <div>
              <strong>Flat 15% OFF</strong>
              <small>On first order above ₹499</small>
            </div>
          </div>
          <div className="promo-item">
            <span>🥬</span>
            <div>
              <strong>Veg Combo</strong>
              <small>Save up to ₹200</small>
            </div>
          </div>
          <div className="promo-item">
            <span>🍦</span>
            <div>
              <strong>Free Dessert</strong>
              <small>With non-veg family combo</small>
            </div>
          </div>
        </section>

        <section className="offer-spotlight" aria-label="Today's offer">
          <img
            src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=85"
            alt="Spiced chicken platter"
          />
          <div className="offer-content">
            <p className="eyebrow">Today only · {offerDate}</p>
            <h2>Royal Feast, 20% off</h2>
            <p>
              Treat yourself to a premium main course, seafood or Italian twist and unlock
              instant savings on orders above ₹699.
            </p>
            <div className="offer-details">
              <span>Code: <strong>ROYAL20</strong></span>
              <span>Valid until midnight</span>
            </div>
            <a className="primary-btn" href="#menu">Shop the offer</a>
          </div>
        </section>

        <section id="menu" className="menu-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular Picks</p>
              <h2>Trending foods</h2>
            </div>
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={category === selectedCategory ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'All' ? 'See all collections' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                  </div>
                  <div className="product-body">
                    <div className="product-meta-row">
                      <span className={`food-type ${product.type}`}>
                        {product.type === 'veg' ? 'Veg' : product.type === 'nonveg' ? 'Non-Veg' : 'Dessert'}
                      </span>
                      <span className="rating">★ {product.rating}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-footer">
                      <div>
                        <strong>₹{product.price}</strong>
                        <small>{product.prepTime}</small>
                      </div>
                      <button onClick={() => addToCart(product)}>Add to cart</button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">Loading delicious food items...</div>
            )}
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="about-card">
            <div>
              <p className="eyebrow">Why choose us</p>
              <h2>Healthy, homemade taste with a restaurant feel.</h2>
            </div>
            <ul>
              <li>Fresh ingredients and chef-crafted recipes</li>
              <li>Fast delivery across the city</li>
              <li>Special combos for family dinners and parties</li>
              <li>Veg, non-veg and dessert options in one place</li>
            </ul>
          </div>
        </section>
      </main>

      {showCart && (
        <aside className="cart-panel">
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button onClick={() => setShowCart(false)}>×</button>
          </div>

          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>₹{item.price}</span>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="checkout-box">
                <div>
                  <span>Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong>-₹{discount.toFixed(0)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>₹{delivery}</strong>
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <strong>₹{total.toFixed(0)}</strong>
                </div>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
}

export default App;
