import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden sweet-bg pt-20 pb-12">
      {/* Floating decorative elements */}
      <div className="fixed bottom-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed bottom-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-60 left-1/4 w-5 h-5 bg-gradient-to-r from-berry-300 to-berry-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6 animate-slideInLeft">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-berry-500 rounded-2xl flex items-center justify-center shadow-lg hover-lift transition-all duration-300">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h3 className="cursive text-3xl text-primary-700">Valentine Cake House</h3>
                <p className="text-gray-600 font-medium">Order fine touch bakes 🍰</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-md leading-relaxed font-medium">
              Creating unforgettable moments with our delicious, freshly baked cakes. 
              Serving Mombasa with love and sweetness since day one.
            </p>
          </div>

          {/* Contact Info */}
          <div className="animate-slideInLeft" style={{animationDelay: '0.1s'}}>
            <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
              Contact Us
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary-500 to-berry-500 rounded-full"></div>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group hover-lift p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-berry-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-white text-sm">📍</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">CBD Branch</p>
                  <a href="tel:+254707046351" className="text-primary-600 hover:text-berry-500 transition-colors font-medium">
                    +254 707 046 351
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3 group hover-lift p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-berry-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-white text-sm">📍</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Bamburi Branch</p>
                  <a href="tel:+254711799361" className="text-primary-600 hover:text-berry-500 transition-colors font-medium">
                    +254 711 799 361
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="animate-slideInLeft" style={{animationDelay: '0.2s'}}>
            <h4 className="text-lg font-semibold text-gray-800 mb-6 relative">
              Follow Us
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary-500 to-berry-500 rounded-full"></div>
            </h4>
            <div className="flex space-x-3">
              {[
                { 
                  name: 'TikTok', 
                  icon: '🎵', 
                  url: 'https://tiktok.com/@valentinecakemsa',
                  color: 'hover:bg-gradient-to-r from-black to-gray-800'
                },
                { 
                  name: 'WhatsApp', 
                  icon: '💬', 
                  url: 'https://wa.me/254707046351',
                  color: 'hover:bg-gradient-to-r from-green-500 to-green-600'
                },
                { 
                  name: 'Instagram', 
                  icon: '📷', 
                  url: '#',
                  color: 'hover:bg-gradient-to-r from-pink-500 to-purple-600'
                }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover-lift ${social.color} group shadow-lg`}
                  title={social.name}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm font-medium">
            &copy; {currentYear} Valentine Cake House. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;