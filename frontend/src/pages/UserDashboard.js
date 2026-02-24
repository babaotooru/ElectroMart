import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

// Category icons
const icons = {
  All:        () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Mobiles:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>,
  Laptops:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M0 21h24M7 21l2-4h6l2 4"/></svg>,
  Appliances: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>,
  Headphones: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  Watches:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>,
};

// Mock product data using actual uploaded images
const MOCK_PRODUCTS = [
  { id: 1, name: 'Ear Phone',       description: 'Boat Latest Ear Phone',       price: 399,    category: 'Headphones', imageUrl: '/images/earphone2.png' },
  { id: 2, name: 'Acer Laptop',     description: 'Latest Acer Laptops',         price: 39999,  category: 'Laptops',    imageUrl: '/images/acer.jpeg' },
  { id: 3, name: 'Rice Cooker',     description: 'Latest Home Appliances',      price: 999,    category: 'Appliances', imageUrl: '/images/Rice Cooker.jpg' },
  { id: 4, name: 'Apple I Phone',   description: 'Latest I Phones',             price: 129999, category: 'Mobiles',    imageUrl: '/images/iphone.jpeg' },
  { id: 5, name: 'Asus Laptop',     description: 'Asus Latest Laptop',          price: 29999,  category: 'Laptops',    imageUrl: '/images/Asus.jpeg' },
  { id: 6, name: 'Boat BT EarPhone',description: 'Latest Best Headphones in BT',price: 1999,  category: 'Headphones', imageUrl: '/images/earphone1.png' },
  { id: 7, name: 'Lenovo Laptop',   description: 'Latest Lenovo Laptop',        price: 19999,  category: 'Laptops',    imageUrl: '/images/Lenovo.jpeg' },
  { id: 8, name: 'One Plus 5G',     description: 'Latest One Plus 5G Phone',    price: 39999,  category: 'Mobiles',    imageUrl: '/images/oneplus.jpeg' },
  { id: 9, name: 'Apple MacBook',   description: 'Latest Apple MacBook',        price: 99999,  category: 'Laptops',    imageUrl: '/images/MacBook.jpg' },
  { id: 10,name: 'Realme 5G Phone', description: 'Best Segment 5G Phone',       price: 19999,  category: 'Mobiles',    imageUrl: '/images/realme.jpeg' },
  { id: 11,name: 'Redmi Laptop',    description: 'Latest Redmi Laptop',         price: 69999,  category: 'Laptops',    imageUrl: '/images/redmi.jpeg' },
  { id: 12,name: 'BT Speaker',      description: 'Best Bluetooth Speaker',      price: 5999,   category: 'Headphones', imageUrl: '/images/BT Speaker1.jpg' },
  { id: 13,name: 'Coffee Machine',  description: 'Premium Coffee Machine',      price: 3599,   category: 'Appliances', imageUrl: '/images/Coffee Machine.jpg' },
  { id: 14,name: 'HP Laptop',       description: 'Latest HP Laptop',            price: 55999,  category: 'Laptops',    imageUrl: '/images/Hp Laptop.jpeg' },
  { id: 15,name: 'Induction Stove', description: 'Smart Induction Stove',       price: 2499,   category: 'Appliances', imageUrl: '/images/Induction Stove.jpg' },
];

const CATEGORIES = ['All', 'Mobiles', 'Laptops', 'Appliances', 'Headphones', 'Watches'];
const PAGE_SIZE = 8;

export default function UserDashboard({ darkMode, toggleDark }) {
  const { user, setCartCount, cartCount } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('em_cart') || '[]'));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart, setCartCount]);

  // Filter products
  const filtered = activeCategory === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleCategoryChange = cat => {
    setActiveCategory(cat);
    setPage(0);
  };

  const handleAddToCart = (product) => {
    const existing = cart.find(c => c.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updated);
    localStorage.setItem('em_cart', JSON.stringify(updated));
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
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
          {paginated.map(product => (
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
