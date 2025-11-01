import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2 border-b border-white/20' 
        : 'bg-transparent py-4'
    }`}>
      {/* Floating decorative elements for navbar background */}
      {!scrolled && (
        <>
          <div className="absolute top-4 left-1/4 w-4 h-4 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-6 right-1/3 w-3 h-3 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className={`w-12 h-12 bg-gradient-to-r from-primary-500 to-berry-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
              scrolled ? 'shadow-md' : 'shadow-xl'
            }`}>
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <span className={`cursive text-2xl font-bold transition-colors ${
                scrolled ? 'text-primary-700' : 'text-white drop-shadow-lg'
              }`}>
                Valentine
              </span>
              <span className={`block cursive text-lg -mt-2 transition-colors ${
                scrolled ? 'text-primary-600' : 'text-white/90 drop-shadow'
              }`}>
                Cake House
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {[
              { path: '/', name: 'Home' },
              { path: '/shop', name: 'Shop' },
              { path: '/custom-cake', name: 'Custom Cake' },
              { path: '/contact', name: 'Contact' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 font-semibold transition-all duration-300 group ${
                  isActive(item.path) 
                    ? 'text-primary-600' 
                    : scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200 drop-shadow'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-berry-500 rounded-full"></span>
                )}
                {!isActive(item.path) && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-berry-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                )}
              </Link>
            ))}
            <Link 
              to="/cart" 
              className="btn-primary flex items-center space-x-2 relative group hover-lift transition-all duration-300"
            >
              <span>🛒</span>
              <span>Cart ({getCartItemsCount()})</span>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-berry-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 rounded-2xl transition-all duration-300 hover-lift ${
                scrolled 
                  ? 'bg-white/80 text-gray-700 hover:bg-white' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t border-white/20 shadow-xl animate-slideInDown">
            <div className="px-4 py-6 space-y-3">
              {[
                { path: '/', name: 'Home' },
                { path: '/shop', name: 'Shop' },
                { path: '/custom-cake', name: 'Custom Cake' },
                { path: '/contact', name: 'Contact' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 rounded-2xl font-semibold transition-all duration-300 hover-lift ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-50 to-berry-50 text-primary-600 border-l-4 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block w-full btn-primary text-center relative py-4 rounded-2xl hover-lift transition-all duration-300"
              >
                🛒 Cart ({getCartItemsCount()})
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-berry-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;