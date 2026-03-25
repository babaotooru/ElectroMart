import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { getCart, updateCartQty, removeFromCart } from '../services/api';

export default function CartPage({ darkMode, toggleDark }) {
  const { user, cartCount, setCartCount } = useAuth();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      const loggedInUserId = user?.id ?? user?.userId;
      if (!loggedInUserId) {
        setCart([]);
        setCartCount(0);
        return;
      }

      try {
        const { data } = await getCart(loggedInUserId);
        setCart(data);
        setCartCount(data.length);
      } catch {
        setToast({ message: 'Failed to load cart', type: 'error' });
      }
    };

    loadCart();
  }, [user?.id, user?.userId, setCartCount]);

  const updateQty = async (id, delta) => {
    const current = cart.find(item => item.id === id);
    if (!current) return;

    const newQty = current.quantity + delta;
    if (newQty < 1) return;

    try {
      await updateCartQty(id, newQty);
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    } catch {
      setToast({ message: 'Failed to update quantity', type: 'error' });
    }
  };

  const removeItem = async (id) => {
    try {
      await removeFromCart(id);
      setCart(prev => {
        const updated = prev.filter(item => item.id !== id);
        setCartCount(updated.length);
        return updated;
      });
      setToast({ message: 'Item removed from cart', type: 'error' });
    } catch {
      setToast({ message: 'Failed to remove item', type: 'error' });
    }
  };

  const total = cart.reduce((sum, item) => sum + Number(item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="cart-page">
      <Navbar darkMode={darkMode} toggleDark={toggleDark} cartCount={cartCount} />

      <div className="cart-content">
        <h2 className="cart-title">Cart</h2>

        {cart.length === 0 ? (
          <div className="cart-empty">
            🛒 Your cart is empty. Go to dashboard to add products!
          </div>
        ) : (
          <>
            <div className="cart-container">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <h4>{item.product?.name}</h4>
                    <p>₹{Number(item.product?.price || 0).toLocaleString()}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                    <button className="btn-remove" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              Total: ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
