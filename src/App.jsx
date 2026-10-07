import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const defaultCategories = [
  { name: 'Veg', badge: 'Fresh Picks', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' },
  { name: 'Non-Veg', badge: 'Chef Favorites', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80' },
  { name: 'Chef Specials', badge: 'Signature', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80' },
  { name: 'Juices & Shakes', badge: 'Refreshing', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80' },
  { name: 'Ice Creams', badge: 'Cold Treats', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80' },
  { name: 'Combos', badge: 'Value Meals', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80' },
];

const reviews = [
  {
    name: 'Aarav M.',
    title: 'Amazing family dinner',
    text: 'The biryani was aromatic, the service was quick, and the whole family loved the dessert platter. Perfect for celebrations.',
    rating: 5,
  },
  {
    name: 'Nisha K.',
    title: 'Fresh and satisfying',
    text: 'The veg platter and fresh lime soda were excellent. Everything felt homemade, well-seasoned, and delivered hot.',
    rating: 5,
  },
  {
    name: 'Vikram S.',
    title: 'Best combo deals',
    text: 'I ordered a combo meal for my office team and saved a lot. The packaging, taste, and quantity exceeded expectations.',
    rating: 4,
  },
];

const steps = [
  { title: 'Choose your craving', description: 'Browse veg, non-veg, combos and chef specials by mood or appetite.' },
  { title: 'Customize your order', description: 'Add spice level, drinks, sides, desserts, or birthday meal combos.' },
  { title: 'Track in real time', description: 'Follow your order through confirmation, kitchen prep, and delivery status.' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState('delivery');
  const [checkoutForm, setCheckoutForm] = useState({
    name: 'Guest Customer',
    phone: '9876543210',
    address: '12 Green Park Road, Chennai',
    city: 'Chennai',
    notes: 'Please leave at the door if away.',
  });
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', role: 'customer', email: 'guest@spiceandsip.com' });
  const [adminMode, setAdminMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'admin@spiceandsip.com', password: 'admin123', role: 'admin' });
  const [dashboard, setDashboard] = useState({
    revenue: 128400,
    orders: 248,
    avgTicket: 518,
    rating: 4.9,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch (error) {
      setCategories(defaultCategories);
    }
  };

  const categoryNames = useMemo(() => {
    const source = categories.length ? categories.map((category) => category.name) : [...new Set(products.map((product) => product.category))];
    return ['All', ...source];
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const featuredProducts = products.filter((product) => product.featured || product.isBestseller).slice(0, 4);
  const vegProducts = products.filter((product) => product.type === 'veg').slice(0, 4);
  const nonVegProducts = products.filter((product) => product.type === 'non-veg').slice(0, 4);
  const beverageProducts = products.filter((product) => product.category === 'Juices & Shakes').slice(0, 4);
  const dessertProducts = products.filter((product) => product.category === 'Ice Creams').slice(0, 4);
  const comboProducts = products.filter((product) => product.category === 'Combos').slice(0, 4);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const found = currentCart.find((item) => item.id === product.id);
      if (found) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setShowCart(true);
    setMessage(`${product.name} added to cart.`);
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
  const discountAmount = subtotal > 0 ? Math.min(subtotal * 0.12, 280) : 0;
  const deliveryFee = subtotal > 0 && checkoutMethod === 'delivery' ? 45 : 0;
  const total = Math.max(subtotal - discountAmount + deliveryFee, 0);

  const handleCheckout = async () => {
    if (!cart.length) {
      setMessage('Add at least one item before checkout.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: checkoutForm.name, phone: checkoutForm.phone },
          address: checkoutForm.address,
          city: checkoutForm.city,
          notes: checkoutForm.notes,
          fulfillmentMethod: checkoutMethod,
          items: cart,
          subtotal,
          discount: discountAmount,
          deliveryFee,
          total,
        }),
      });
      const data = await response.json();
      setMessage(data.message || `Order placed: ${data.orderNumber}`);
      setCart([]);
      setShowCart(false);
    } catch (error) {
      setMessage('Checkout failed. Please try again.');
    }
  };

  const handleLogin = async (role = loginForm.role) => {
    const email = loginForm.email || `${role}@spiceandsip.com`;
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: loginForm.password, role }),
      });
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user);
        setAdminMode(role === 'admin');
        setMessage(`${data.user.name} signed in successfully.`);
      } else {
        setMessage('Login failed. Try admin@spiceandsip.com / admin123 or customer@spiceandsip.com / customer123.');
      }
    } catch (error) {
      setCurrentUser({ name: role === 'admin' ? 'Admin' : 'Customer', role, email });
      setAdminMode(role === 'admin');
      setMessage('Demo login used successfully.');
    }
  };

  const orderStats = [
    { label: 'Revenue', value: formatCurrency(dashboard.revenue) },
    { label: 'Orders', value: dashboard.orders.toString() },
    { label: 'Avg. ticket', value: formatCurrency(dashboard.avgTicket) },
    { label: 'Rating', value: `${dashboard.rating}/5` },
  ];

  return (
    <div className="app-shell">
      <div className="announcement-bar">
        <p>Fresh flavours, special prices — discover today&apos;s deals!</p>
      </div>

      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">S&amp;S</div>
          <div>
            <div className="brand-name">Spice &amp; Sip</div>
            <small>Big Flavours. Fresh Sips.</small>
          </div>
        </div>

        <nav className="nav-menu">
          <a href="#home">Home</a>
          <a href="#explore">Explore Menu</a>
          <a href="#veg">Veg</a>
          <a href="#nonveg">Non-Veg</a>
          <a href="#offers">Offers</a>
          <a href="#admin">Admin</a>
        </nav>

        <div className="nav-actions">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search dishes..."
              aria-label="Search menu items"
            />
          </div>
          <button className="ghost-btn">Wishlist</button>
          <button className="cart-button" onClick={() => setShowCart((value) => !value)}>
            Cart <span>{cart.reduce((count, item) => count + item.quantity, 0)}</span>
          </button>
        </div>
      </header>

      <main className="page-content">
        <section id="home" className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">WELCOME TO SPICE &amp; SIP</p>
            <h1>Good Food. Great Mood.</h1>
            <p>
              Fresh vegetarian classics, chef-crafted non-veg favourites, signature shakes, and indulgent desserts — all made for easy home delivery or pickup.
            </p>
            <div className="cta-row">
              <a className="primary-btn" href="#explore">Order Now</a>
              <a className="secondary-btn" href="#offers">Explore Our Menu</a>
            </div>
            <div className="trust-row">
              <span>Fresh ingredients</span>
              <span>90+ menu items</span>
              <span>Fast delivery</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-large">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Premium biryani platter"
              />
              <div className="floating-badge">Chef&apos;s Special</div>
            </div>
            <div className="hero-stack">
              <div className="hero-card small">
                <img
                  src="https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80"
                  alt="Fish curry"
                />
              </div>
              <div className="hero-card small cream-card">
                <img
                  src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80"
                  alt="Ice cream"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="promo-strip" aria-label="Promotions">
          <div className="promo-pill"><span>🔥</span> Flat 15% OFF on first order above ₹499</div>
          <div className="promo-pill"><span>🥬</span> Veg combo savings up to ₹200</div>
          <div className="promo-pill"><span>🍦</span> Free dessert with family combo</div>
        </section>

        <section className="category-showcase">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular food categories</p>
              <h2>Find your perfect flavour</h2>
            </div>
          </div>

          <div className="category-grid">
            {categoryNames.filter((category) => category !== 'All').map((category) => (
              <button
                key={category}
                className={`category-card ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <img
                  src={
                    defaultCategories.find((item) => item.name === category)?.image ||
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'
                  }
                  alt={category}
                />
                <div className="category-overlay">
                  <strong>{category}</strong>
                  <span>{defaultCategories.find((item) => item.name === category)?.badge || 'Fresh picks'}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="explore" className="menu-section">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Explore menu</p>
              <h2>Trending today</h2>
            </div>
            <div className="category-filter">
              {categoryNames.map((category) => (
                <button
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.length ? (
              filteredProducts.slice(0, 8).map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                  </div>
                  <div className="product-body">
                    <div className="meta-row">
                      <span className={`food-type ${product.type}`}>{product.type === 'veg' ? 'Veg' : product.type === 'non-veg' ? 'Non-Veg' : 'Special'}</span>
                      <span className="rating">★ {product.rating}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-footer">
                      <div>
                        <strong>{formatCurrency(product.price)}</strong>
                        <small>{product.prepTime}</small>
                      </div>
                      <button onClick={() => addToCart(product)}>Add to cart</button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">No dishes match your search just yet.</div>
            )}
          </div>
        </section>

        <section id="offers" className="offer-spotlight">
          <div className="offer-image">
            <img
              src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80"
              alt="Royal feast"
            />
          </div>
          <div className="offer-copy">
            <p className="eyebrow">Today only · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <h2>Royal Feast, 20% off</h2>
            <p>Enjoy a premium family spread with biryani, kebabs, breads, and dessert. Unlock instant savings on orders above ₹699.</p>
            <div className="coupon-row">
              <span>Code: <strong>ROYAL20</strong></span>
              <span>Valid until midnight</span>
            </div>
            <a className="primary-btn" href="#explore">Shop the offer</a>
          </div>
        </section>

        <section id="veg" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Best selling vegetarian</p>
              <h2>Veg favourites</h2>
            </div>
          </div>
          <div className="product-grid compact-grid">{vegProducts.map((product) => ( <ProductCard key={product.id} product={product} onAddToCart={addToCart} /> ))}</div>
        </section>

        <section id="nonveg" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Crowd favourites</p>
              <h2>Non-veg specialities</h2>
            </div>
          </div>
          <div className="product-grid compact-grid">{nonVegProducts.map((product) => ( <ProductCard key={product.id} product={product} onAddToCart={addToCart} /> ))}</div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fresh & chilled</p>
              <h2>Juices and milkshakes</h2>
            </div>
          </div>
          <div className="product-grid compact-grid">{beverageProducts.map((product) => ( <ProductCard key={product.id} product={product} onAddToCart={addToCart} /> ))}</div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sweet cravings</p>
              <h2>Ice creams & desserts</h2>
            </div>
          </div>
          <div className="product-grid compact-grid">{dessertProducts.map((product) => ( <ProductCard key={product.id} product={product} onAddToCart={addToCart} /> ))}</div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Budget friendly</p>
              <h2>Combo meals</h2>
            </div>
          </div>
          <div className="product-grid compact-grid">{comboProducts.map((product) => ( <ProductCard key={product.id} product={product} onAddToCart={addToCart} /> ))}</div>
        </section>

        <section className="feature-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Order in three easy steps</h2>
            </div>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Customer reviews</p>
              <h2>What diners say</h2>
            </div>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <div className="review-card" key={review.name}>
                <div className="review-stars">{'★'.repeat(review.rating)}</div>
                <h3>{review.title}</h3>
                <p>{review.text}</p>
                <strong>{review.name}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="info-section">
          <div className="info-card">
            <p className="eyebrow">Restaurant info</p>
            <h2>Fresh meals, honest flavours, and warm hospitality.</h2>
            <ul>
              <li>Open daily: 10:30 AM – 11:30 PM</li>
              <li>Free delivery above ₹499 in selected zones</li>
              <li>Pickup available from 32,DC Street, Salem</li>
            </ul>
          </div>
          <div className="newsletter-card">
            <p className="eyebrow">Stay in the loop</p>
            <h3>Get weekly offers and chef specials</h3>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="primary-btn">Join now</button>
            </div>
          </div>
        </section>

        <section id="admin" className="admin-section">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Admin dashboard</p>
              <h2>Restaurant control center</h2>
            </div>
            <button className="primary-btn small-btn" onClick={() => setAdminMode((value) => !value)}>
              {adminMode ? 'Hide dashboard' : 'Open dashboard'}
            </button>
          </div>

          <div className="admin-panel">
            <div className="login-card">
              <label>
                Email
                <input type="email" value={loginForm.email} onChange={(event) => setLoginForm((form) => ({ ...form, email: event.target.value }))} />
              </label>
              <label>
                Password
                <input type="password" value={loginForm.password} onChange={(event) => setLoginForm((form) => ({ ...form, password: event.target.value }))} />
              </label>
              <label>
                Role
                <select value={loginForm.role} onChange={(event) => setLoginForm((form) => ({ ...form, role: event.target.value }))}>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </label>
              <button className="primary-btn" onClick={() => handleLogin(loginForm.role)}>Sign in</button>
            </div>

            {adminMode && (
              <div className="dashboard-grid">
                {orderStats.map((item) => (
                  <div key={item.label} className="stat-card">
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </div>
                ))}
                <div className="table-card">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Stock</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.inventoryCount || 48}</td>
                          <td>{formatCurrency(product.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {message && <div className="toast">{message}</div>}
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
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <span>{formatCurrency(item.price)}</span>
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-form">
                <div className="radio-row">
                  <label><input type="radio" checked={checkoutMethod === 'delivery'} onChange={() => setCheckoutMethod('delivery')} /> Delivery</label>
                  <label><input type="radio" checked={checkoutMethod === 'pickup'} onChange={() => setCheckoutMethod('pickup')} /> Pickup</label>
                </div>

                <input value={checkoutForm.name} onChange={(event) => setCheckoutForm((form) => ({ ...form, name: event.target.value }))} placeholder="Customer name" />
                <input value={checkoutForm.phone} onChange={(event) => setCheckoutForm((form) => ({ ...form, phone: event.target.value }))} placeholder="Phone number" />
                {checkoutMethod === 'delivery' && (
                  <>
                    <input value={checkoutForm.address} onChange={(event) => setCheckoutForm((form) => ({ ...form, address: event.target.value }))} placeholder="Delivery address" />
                    <input value={checkoutForm.city} onChange={(event) => setCheckoutForm((form) => ({ ...form, city: event.target.value }))} placeholder="City" />
                  </>
                )}
                <textarea value={checkoutForm.notes} onChange={(event) => setCheckoutForm((form) => ({ ...form, notes: event.target.value }))} placeholder="Delivery notes" rows="3" />
              </div>

              <div className="checkout-box">
                <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
                <div><span>Discount</span><strong>- {formatCurrency(discountAmount)}</strong></div>
                <div><span>Delivery</span><strong>{formatCurrency(deliveryFee)}</strong></div>
                <div className="total-row"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
                <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
              </div>
            </>
          )}
        </aside>
      )}

      <footer className="site-footer">
        <div>
          <div className="brand-name">Spice &amp; Sip</div>
          <p>Big Flavours. Fresh Sips. Happy Moments.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <a href="#explore">Menu</a>
          <a href="#offers">Offers</a>
          <a href="#admin">Admin</a>
        </div>
        <div>
          <h4>Contact</h4>
          <span>32, Harbour Street, Chennai</span>
          <span>+91 98765 43210</span>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card" key={product.id}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>
      <div className="product-body">
        <div className="meta-row">
          <span className={`food-type ${product.type}`}>{product.type === 'veg' ? 'Veg' : product.type === 'non-veg' ? 'Non-Veg' : 'Special'}</span>
          <span className="rating">★ {product.rating}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <div>
            <strong>{formatCurrency(product.price)}</strong>
            <small>{product.prepTime}</small>
          </div>
          <button onClick={() => onAddToCart(product)}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}

export default App;
