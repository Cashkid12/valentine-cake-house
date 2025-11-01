import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    branch: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      alert('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        branch: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen sweet-bg py-12 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-40 left-20 w-5 h-5 bg-gradient-to-r from-berry-300 to-berry-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="cursive text-5xl md:text-6xl text-primary-700 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 font-medium">Get in touch with Valentine Cake House - we'd love to hear from you!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 hover-lift transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-slideInLeft">Our Locations</h2>
            
            {/* CBD Branch */}
            <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-berry-50 rounded-2xl border border-primary-200 hover-lift transition-all duration-300 animate-slideInLeft" style={{animationDelay: '0.1s'}}>
              <h3 className="text-xl font-semibold text-primary-700 mb-3 flex items-center">
                <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
                CBD Branch
              </h3>
              <div className="space-y-3 text-gray-700 font-medium">
                <p className="flex items-center">
                  <span className="mr-3 text-primary-500">📞</span>
                  <a href="tel:+254707046351" className="hover:text-primary-600 transition-colors duration-300">
                    +254 707 046 351
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="mr-3 text-primary-500">📍</span>
                  Mombasa CBD, Kenya
                </p>
                <p className="flex items-center">
                  <span className="mr-3 text-primary-500">🕒</span>
                  Mon - Sun: 8:00 AM - 8:00 PM
                </p>
              </div>
              <div className="mt-4">
                <a 
                  href="https://wa.me/254707046351"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  💬 WhatsApp CBD
                </a>
              </div>
            </div>

            {/* Bamburi Branch */}
            <div className="mb-8 p-6 bg-gradient-to-r from-berry-50 to-primary-50 rounded-2xl border border-berry-200 hover-lift transition-all duration-300 animate-slideInLeft" style={{animationDelay: '0.2s'}}>
              <h3 className="text-xl font-semibold text-berry-700 mb-3 flex items-center">
                <span className="w-3 h-3 bg-berry-500 rounded-full mr-2"></span>
                Bamburi Branch
              </h3>
              <div className="space-y-3 text-gray-700 font-medium">
                <p className="flex items-center">
                  <span className="mr-3 text-berry-500">📞</span>
                  <a href="tel:+254711799361" className="hover:text-berry-600 transition-colors duration-300">
                    +254 711 799 361
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="mr-3 text-berry-500">📍</span>
                  Bamburi, Mombasa, Kenya
                </p>
                <p className="flex items-center">
                  <span className="mr-3 text-berry-500">🕒</span>
                  Mon - Sun: 8:00 AM - 8:00 PM
                </p>
              </div>
              <div className="mt-4">
                <a 
                  href="https://wa.me/254711799361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  💬 WhatsApp Bamburi
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 animate-slideInLeft" style={{animationDelay: '0.3s'}}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow & Connect</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://tiktok.com/@valentinecakemsa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-4 rounded-2xl hover:bg-black transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold flex-1 justify-center"
                >
                  <span>🎵</span>
                  <span>TikTok</span>
                </a>
                <a 
                  href="https://wa.me/254707046351" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-4 rounded-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold flex-1 justify-center"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-500 text-white p-4 rounded-2xl hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold flex-1 justify-center"
                >
                  <span>📷</span>
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gold-50 to-yellow-50 rounded-2xl border border-gold-200 hover-lift transition-all duration-300 animate-slideInLeft" style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Hours</h3>
              <div className="space-y-2 text-gray-700 font-medium">
                <p className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>8:00 AM - 8:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday - Sunday:</span>
                  <span>8:00 AM - 8:00 PM</span>
                </p>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  * Delivery available during business hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 hover-lift transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-slideInLeft">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slideInLeft" style={{animationDelay: '0.5s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-slideInLeft" style={{animationDelay: '0.6s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="animate-slideInLeft" style={{animationDelay: '0.7s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
              </div>

              <div className="animate-slideInLeft" style={{animationDelay: '0.8s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                >
                  <option value="">Select Branch</option>
                  <option value="cbd">CBD Branch</option>
                  <option value="bamburi">Bamburi Branch</option>
                  <option value="both">Both Branches</option>
                </select>
              </div>

              <div className="animate-slideInLeft" style={{animationDelay: '0.9s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  placeholder="Tell us about your cake needs, any questions, or special requests..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 animate-slideInLeft ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'btn-primary hover:scale-105'
                }`}
                style={{animationDelay: '1s'}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            {/* Quick Response Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 animate-slideInLeft" style={{animationDelay: '1.1s'}}>
              <p className="text-sm text-blue-700 font-medium text-center">
                💌 We typically respond within 2-4 hours during business hours
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/254707046351"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-bounce-gentle"
          >
            <span className="text-2xl">💬</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;