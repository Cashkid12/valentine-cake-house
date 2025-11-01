import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '🎂',
      title: 'Freshly Baked Daily',
      description: 'Made with love and premium ingredients every single day'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick delivery across Mombasa CBD and Bamburi areas'
    },
    {
      icon: '🎨',
      title: 'Custom Designs',
      description: 'Personalized cakes that tell your unique story'
    },
    {
      icon: '⭐',
      title: 'Premium Quality',
      description: 'Only the finest ingredients for exceptional taste'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Mombasa CBD',
      text: 'The most delicious birthday cake I have ever had! Beautiful and tasted amazing.',
      rating: 5
    },
    {
      name: 'James K.',
      location: 'Bamburi',
      text: 'Fast delivery and the cake was exactly as pictured. Highly recommended!',
      rating: 5
    },
    {
      name: 'Fatima A.',
      location: 'Nyali',
      text: 'My wedding cake was absolutely stunning. Everyone was asking for your contact!',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="overflow-hidden sweet-bg">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-40 left-20 w-5 h-5 bg-gradient-to-r from-berry-300 to-berry-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="fixed top-60 left-1/4 w-7 h-7 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full opacity-20 animate-float" style={{animationDelay: '3s'}}></div>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>
        
        <div className={`relative z-10 max-w-4xl mx-auto px-4 text-center text-white transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="cursive text-6xl md:text-8xl lg:text-7xl mb-6 leading-tight drop-shadow-lg">
            Valentine Cake House
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            The perfect cake every time
          </p>

          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/shop"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl group"
            >
              <span className="flex items-center">
                Place Order
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link
              to="/custom-cake"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all transform hover:scale-105 group"
            >
              <span className="flex items-center">
                Custom Cake
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto glass-dark rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-white/80 text-sm font-medium">Cake Designs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-white/80 text-sm font-medium">Branches</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 section-sweet relative overflow-hidden">
        <div className="absolute inset-0 sweet-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span className="gradient-text">Valentine Cake House</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              We bring sweetness to your celebrations with quality, creativity, and care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group text-center p-8 rounded-3xl cake-card hover-lift transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-berry-50 opacity-50"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-berry-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl text-white">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 section-berry relative overflow-hidden">
        <div className="absolute inset-0 sweet-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Sweet <span className="gold-text">Reviews</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">Don't just take our word for it - hear from our happy customers!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg hover-lift border-cream group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-berry-500"></div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-berry-400 rounded-full flex items-center justify-center text-white font-semibold mr-4 shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm font-medium">{testimonial.location}</p>
                  </div>
                </div>
                <div className="text-yellow-400 mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 italic font-medium">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-berry-500 to-purple-500"></div>
        <div className="absolute inset-0 cake-pattern opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Sweeten Your Celebration?
          </h2>
          <p className="text-xl mb-8 text-white/90 font-medium drop-shadow">
            Order your perfect cake today and experience the Valentine Cake House difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl font-bold"
            >
              🎂 Browse Cakes
            </Link>
            <a
              href="https://wa.me/254707046351"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all transform hover:scale-105 font-bold"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;