import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { API_ORIGIN, addToCart, getCart, getProducts } from '../services/api';

// Category icons
const icons = {
  All:        () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Mobiles:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>,
  Laptops:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M0 21h24M7 21l2-4h6l2 4"/></svg>,
  Appliances: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>,
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  Watches:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>,
};

const CATEGORIES = ['All', 'Mobiles', 'Laptops', 'Appliances', 'Headphones', 'Watches'];
const PAGE_SIZE = 8;

export default function UserDashboard({ darkMode, toggleDark }) {
  const { user, setCartCount, cartCount } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [toast, setToast] = useState(null);

  const toAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300x150?text=No+Image';
    if (imageUrl.startsWith('/api/')) {
      return `${API_ORIGIN}${imageUrl}`;
    }
    return imageUrl;
  };

  useEffect(() => {
    const loadCartCount = async () => {
      const loggedInUserId = user?.id ?? user?.userId;
      if (!loggedInUserId) return;

      try {
        const { data } = await getCart(loggedInUserId);
        setCartCount(data.length);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [user?.id, user?.userId, setCartCount]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        // Pull all active products in one request and handle pagination on client.
        const { data } = await getProducts(0, 500);
        const mapped = (data?.content || []).map((p) => ({
          ...p,
          price: Number(p.price || 0),
          imageUrl: toAbsoluteImageUrl(p.imageUrl),
        }));
        setProducts(mapped);
      } catch (err) {
        setToast({ message: err.response?.data?.message || 'Failed to load products.', type: 'error' });
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products
  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleCategoryChange = cat => {
    setActiveCategory(cat);
    setPage(0);
  };

  const handleAddToCart = async (product) => {
    const loggedInUserId = user?.id ?? user?.userId;
    if (!loggedInUserId) {
      setToast({ message: 'Please login again to add items to cart.', type: 'error' });
      return;
    }

    try {
      await addToCart({ userId: loggedInUserId, productId: product.id, quantity: 1 });
      const { data } = await getCart(loggedInUserId);
      setCartCount(data.length);
      setToast({ message: `${product.name} added to cart!`, type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add item to cart.', type: 'error' });
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar darkMode={darkMode} toggleDark={toggleDark} cartCount={cartCount} />

      <div className="dashboard-content">
        <h2 className="welcome-heading">
          Welcome, <span>{user?.fullName || 'User'}</span>
        </h2>

        {/* Category tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => {
            const Icon = icons[cat];
            return (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {Icon && <Icon />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div className="products-grid">
          {!loadingProducts && paginated.map(product => (
            <div className="product-card" key={product.id}>
              <img
                className="product-card-img"
                src={product.imageUrl}
                alt={product.name}
                onError={e => { e.target.src = 'https://via.placeholder.com/300x150?text=' + product.name; }}
              />
              <div className="product-card-body">
                <div className="product-name">{product.name}</div>
                <div className="product-desc">{product.description}</div>
                <div className="product-footer">
                  <span className="product-price">₹{product.price.toLocaleString()}</span>
                  <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loadingProducts && paginated.length === 0 && (
            <div>No products found for this category.</div>
          )}
          {loadingProducts && <div>Loading products...</div>}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
              ‹
            </button>
            <span className="page-info">
              Page <span>{page + 1}</span> of <span>{totalPages}</span>
            </span>
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
              ›
            </button>
          </div>
        )}
      </div>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
