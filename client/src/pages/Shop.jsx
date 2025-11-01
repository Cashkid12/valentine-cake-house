import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cakesAPI } from '../services/api';

const Shop = () => {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    flavor: '',
    priceRange: ''
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsVisible(true);
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await cakesAPI.getAll();
      console.log('📦 API Response:', response.data);
      
      // Handle both response formats
      if (response.data && response.data.success) {
        // New format: { success: true, cakes: [...] }
        setCakes(response.data.cakes || []);
        setFilteredCakes(response.data.cakes || []);
      } else if (Array.isArray(response.data)) {
        // Old format: direct array
        setCakes(response.data);
        setFilteredCakes(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setCakes([]);
        setFilteredCakes([]);
      }
    } catch (error) {
      console.error('❌ Error fetching cakes:', error);
      setCakes([]);
      setFilteredCakes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (newFilters) => {
    let filtered = cakes;
    
    if (newFilters.category) {
      filtered = filtered.filter(cake => cake.category === newFilters.category);
    }
    if (newFilters.flavor) {
      filtered = filtered.filter(cake => cake.flavor === newFilters.flavor);
    }
    if (newFilters.priceRange) {
      switch (newFilters.priceRange) {
        case '0-2000':
          filtered = filtered.filter(cake => cake.price <= 2000);
          break;
        case '2000-5000':
          filtered = filtered.filter(cake => cake.price > 2000 && cake.price <= 5000);
          break;
        case '5000-10000':
          filtered = filtered.filter(cake => cake.price > 5000 && cake.price <= 10000);
          break;
        case '10000+':
          filtered = filtered.filter(cake => cake.price > 10000);
          break;
        default:
          break;
      }
    }
    
    setFilteredCakes(filtered);
  };

  const handleAddToCart = (cake) => {
    addToCart(cake);
    alert(`🎉 ${cake.name} added to cart!`);
  };

  const clearFilters = () => {
    setFilters({ category: '', flavor: '', priceRange: '' });
    setFilteredCakes(cakes);
  };

  if (loading) {
    return (
      <div className="min-h-screen sweet-bg py-8">
        <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
        <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading skeleton for cakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-white/20">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sweet-bg py-8 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-40 left-20 w-5 h-5 bg-gradient-to-r from-berry-300 to-berry-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="cursive text-5xl md:text-6xl text-primary-700 mb-4">Our Cake Collection</h1>
          <p className="text-xl text-gray-600 font-medium">
            {cakes.length > 0 
              ? `Discover our ${cakes.length} delicious freshly baked cakes` 
              : 'Discover our delicious range of freshly baked cakes'
            }
          </p>
        </div>

        {/* Empty State - No Cakes Added Yet */}
        {cakes.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-8xl mb-6">🎂</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Cakes Available Yet</h2>
              <p className="text-gray-600 mb-8 text-lg font-medium">
                Our cake collection is being prepared! Check back soon or contact us for custom orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/custom-cake"
                  className="btn-primary text-lg px-8 py-4 group"
                >
                  <span className="flex items-center">
                    🎨 Order Custom Cake
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
                <a
                  href="https://wa.me/254707046351"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-lg px-8 py-4 group"
                >
                  <span className="flex items-center">
                    💬 WhatsApp Inquiry
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section (Hidden when no cakes) */}
        {cakes.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg mb-8 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filter Cakes</h3>
              <button 
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="kids">Kids</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="graduation">Graduation</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flavor</label>
                <select 
                  value={filters.flavor}
                  onChange={(e) => handleFilterChange('flavor', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">All Flavors</option>
                  <option value="vanilla">Vanilla</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="strawberry">Strawberry</option>
                  <option value="red-velvet">Red Velvet</option>
                  <option value="lemon">Lemon</option>
                  <option value="carrot">Carrot</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">All Prices</option>
                  <option value="0-2000">Under KSh 2,000</option>
                  <option value="2000-5000">KSh 2,000 - 5,000</option>
                  <option value="5000-10000">KSh 5,000 - 10,000</option>
                  <option value="10000+">Over KSh 10,000</option>
                </select>
              </div>
            </div>
            {filteredCakes.length !== cakes.length && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredCakes.length} of {cakes.length} cakes
              </div>
            )}
          </div>
        )}

        {/* Cake Grid (Only shows when cakes exist) */}
        {cakes.length > 0 && (
          <>
            {filteredCakes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No cakes match your filters</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <button 
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCakes.map(cake => (
                  <div key={cake._id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover-lift border border-white/20 group cake-card">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-berry-100 flex items-center justify-center relative overflow-hidden">
                      {cake.images && cake.images.length > 0 ? (
                        <img 
                          src={cake.images[0]} 
                          alt={cake.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <>
                          <div className="w-32 h-32 bg-white/30 rounded-full absolute"></div>
                          <span className="text-5xl z-10 transform group-hover:scale-110 transition-transform duration-500">🎂</span>
                        </>
                      )}
                      {cake.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          Featured
                        </div>
                      )}
                      {!cake.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {cake.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium">{cake.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-primary-600">KSh {cake.price?.toLocaleString()}</span>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full font-medium">
                              {cake.flavor?.replace('-', ' ')}
                            </span>
                            <span className="text-xs text-primary-600 capitalize bg-primary-50 px-2 py-1 rounded-full font-medium">
                              {cake.category}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(cake)}
                          disabled={!cake.available}
                          className={`px-4 py-2 rounded-full transition-all transform hover:scale-105 flex items-center space-x-1 font-semibold ${
                            cake.available 
                              ? 'bg-gradient-to-r from-primary-500 to-berry-500 text-white hover:shadow-xl' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <span>+</span>
                          <span>Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;