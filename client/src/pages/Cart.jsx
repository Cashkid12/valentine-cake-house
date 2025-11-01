import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    deliveryLocation: '',
    message: '',
    branch: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveFromCart = (id, name) => {
    if (window.confirm(`Remove ${name} from cart?`)) {
      removeFromCart(id);
    }
  };

  const handleFormChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Order submitted:', { items: cartItems, ...orderForm });
      alert('🎉 Order placed successfully! We will contact you via WhatsApp to confirm your order and arrange payment.');
      clearCart();
      setOrderForm({
        customerName: '',
        phone: '',
        deliveryLocation: '',
        message: '',
        branch: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const totalAmount = getCartTotal();
  const itemsCount = getCartItemsCount();

  const deliveryLocations = [
    'Mombasa CBD',
    'Bamburi',
    'Nyali',
    'Mikindani',
    'Kisauni',
    'Likoni',
    'Other (Specify in message)'
  ];

  return (
    <div className="min-h-screen sweet-bg py-12 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-40 left-20 w-5 h-5 bg-gradient-to-r from-berry-300 to-berry-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>

      <div className="max-w-6xl mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="cursive text-5xl md:text-6xl text-primary-700 mb-4">Your Shopping Cart</h1>
          <p className="text-xl text-gray-600 font-medium">Review your items and complete your order</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover-lift transition-all duration-300">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg font-medium">Add some delicious cakes to your cart and make your celebration sweeter!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="btn-primary text-lg px-8 py-4 group"
              >
                <span className="flex items-center">
                  🎂 Start Shopping
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                to="/custom-cake"
                className="btn-gold text-lg px-8 py-4 group"
              >
                <span className="flex items-center">
                  🎨 Custom Cake
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 hover-lift transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Cart Items ({itemsCount})
                  </h2>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all items from cart?')) {
                        clearCart();
                      }
                    }}
                    className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                  >
                    <span>🗑️</span>
                    <span>Clear Cart</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div 
                      key={item._id} 
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-primary-50 rounded-2xl border border-primary-100 hover-lift transition-all duration-300 animate-slideInLeft"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-berry-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">🎂</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg group-hover:text-primary-600 transition-colors">{item.name}</h3>
                          <p className="text-primary-600 font-bold text-lg">KSh {item.price.toLocaleString()}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full font-medium">
                              {item.flavor || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 bg-white rounded-full p-1 border border-gray-200 hover:border-primary-300 transition-colors">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 font-semibold hover:scale-110"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 font-semibold hover:scale-110"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right min-w-20">
                          <p className="font-semibold text-lg text-gray-800">
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromCart(item._id, item.name)}
                          className="text-red-400 hover:text-red-600 p-2 transition-all duration-300 hover:scale-110"
                          title="Remove from cart"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="mt-8 pt-6 border-t border-gray-200 animate-slideInLeft" style={{animationDelay: '0.5s'}}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 font-medium">Subtotal:</span>
                      <span className="font-semibold">KSh {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 font-medium">Delivery Fee:</span>
                      <span className="font-semibold">KSh 300</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-gray-200">
                      <span>Total Amount:</span>
                      <span className="text-primary-600">KSh {(totalAmount + 300).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 hover-lift transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Details</h2>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="animate-slideInLeft" style={{animationDelay: '0.6s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={orderForm.customerName}
                    onChange={handleFormChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="animate-slideInLeft" style={{animationDelay: '0.7s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>

                <div className="animate-slideInLeft" style={{animationDelay: '0.8s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Branch
                  </label>
                  <select
                    name="branch"
                    value={orderForm.branch}
                    onChange={handleFormChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  >
                    <option value="">Select Branch</option>
                    <option value="cbd">CBD Branch</option>
                    <option value="bamburi">Bamburi Branch</option>
                  </select>
                </div>

                <div className="animate-slideInLeft" style={{animationDelay: '0.9s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location *
                  </label>
                  <select
                    name="deliveryLocation"
                    value={orderForm.deliveryLocation}
                    onChange={handleFormChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  >
                    <option value="">Select Location</option>
                    {deliveryLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="animate-slideInLeft" style={{animationDelay: '1s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="message"
                    value={orderForm.message}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                    placeholder="Any special delivery instructions, cake preferences, allergies, or additional requests..."
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-2xl border border-gold-200 animate-slideInLeft" style={{animationDelay: '1.1s'}}>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
                    <span className="mr-2">📦</span>
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700 font-medium">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{itemsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>KSh {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>KSh 300</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gold-200">
                      <span>Total:</span>
                      <span className="text-primary-600">KSh {(totalAmount + 300).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">
                    * Payment will be arranged via WhatsApp after order confirmation
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 animate-slideInLeft ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'btn-primary hover:scale-105'
                  }`}
                  style={{animationDelay: '1.2s'}}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </span>
                  ) : (
                    'Place Order & Proceed to WhatsApp'
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm font-medium animate-slideInLeft" style={{animationDelay: '1.3s'}}>
                  We'll contact you via WhatsApp to confirm your order and arrange payment
                </p>
              </form>

              {/* Continue Shopping */}
              <div className="mt-6 text-center animate-slideInLeft" style={{animationDelay: '1.4s'}}>
                <Link
                  to="/shop"
                  className="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors duration-300"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;