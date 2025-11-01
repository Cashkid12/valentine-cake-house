import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CustomCake = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    occasion: '',
    cakeSize: '',
    flavor: '',
    icing: '',
    color: '',
    message: '',
    designDescription: '',
    budget: '',
    deliveryDate: '',
    specialInstructions: ''
  });

  const [referenceImages, setReferenceImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (submitError) setSubmitError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + referenceImages.length > 5) {
      alert('Maximum 5 reference images allowed');
      return;
    }
    
    // Create preview URLs and store files
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setReferenceImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setReferenceImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);
    setSubmitError('');
    
    try {
      // Validate required fields
      const requiredFields = ['customerName', 'phone', 'occasion', 'cakeSize', 'flavor', 'icing', 'designDescription'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append reference images
      referenceImages.forEach(image => {
        formDataToSend.append('images', image.file);
      });

      console.log('📤 Submitting custom cake request...');
      console.log('Form data keys:', Array.from(formDataToSend.keys()));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('https://valentine-cake-house.onrender.com/api/custom-cakes', {
        method: 'POST',
        body: formDataToSend
        // Don't set Content-Type header for FormData - browser will set it with boundary
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('📨 Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to submit request';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('❌ Server error response:', errorData);
        } catch (parseError) {
          console.error('❌ Response parse error:', parseError);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Custom cake request submitted:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Request failed');
      }
      
      // Show success message
      alert('🎉 Your custom cake request has been submitted! We will contact you within 24 hours to discuss your design.');
      
      // Reset form
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        occasion: '',
        cakeSize: '',
        flavor: '',
        icing: '',
        color: '',
        message: '',
        designDescription: '',
        budget: '',
        deliveryDate: '',
        specialInstructions: ''
      });
      setReferenceImages([]);
      
    } catch (error) {
      console.error('❌ Error submitting custom cake request:', error);
      setSubmitError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const occasions = [
    'Birthday',
    'Wedding',
    'Anniversary',
    'Graduation',
    'Baby Shower',
    'Corporate Event',
    'Christening',
    'Gender Reveal',
    'Other'
  ];

  const cakeSizes = [
    { value: 'small', label: 'Small (Serves 10-15 people)', price: 'KSh 1,500 - 3,000' },
    { value: 'medium', label: 'Medium (Serves 20-25 people)', price: 'KSh 3,000 - 6,000' },
    { value: 'large', label: 'Large (Serves 30-40 people)', price: 'KSh 6,000 - 12,000' },
    { value: 'x-large', label: 'Extra Large (Serves 50+ people)', price: 'KSh 12,000+' }
  ];

  const flavors = [
    'Vanilla',
    'Chocolate',
    'Red Velvet',
    'Strawberry',
    'Lemon',
    'Carrot',
    'Coffee',
    'Coconut',
    'Marble (Vanilla & Chocolate)'
  ];

  const icingTypes = [
    'Buttercream',
    'Fondant',
    'Cream Cheese',
    'Whipped Cream',
    'Ganache',
    'Royal Icing',
    'Italian Meringue'
  ];

  return (
    <div className="min-h-screen sweet-bg py-12 overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      <div className="fixed bottom-40 left-20 w-5 h-5 bg-gradient-to-r from-berry-300 to-berry-400 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="fixed top-60 left-1/4 w-7 h-7 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full opacity-20 animate-float" style={{animationDelay: '3s'}}></div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="cursive text-5xl md:text-6xl text-primary-700 mb-4">Create Your Dream Cake</h1>
          <p className="text-xl text-gray-600 font-medium">
            Design a custom cake that perfectly matches your vision and occasion
          </p>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6 animate-slideInDown">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-3">
                <h3 className="text-red-800 font-semibold">Submission Error</h3>
                <p className="text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Cake Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-white/20 hover-lift transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slideInLeft" style={{animationDelay: '0.1s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="animate-slideInLeft" style={{animationDelay: '0.2s'}}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slideInLeft" style={{animationDelay: '0.3s'}}>
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
              
              <div className="animate-slideInLeft" style={{animationDelay: '0.4s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                />
              </div>
            </div>

            {/* Cake Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="animate-slideInLeft" style={{animationDelay: '0.5s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion *
                </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                >
                  <option value="">Select Occasion</option>
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>
              
              <div className="animate-slideInLeft" style={{animationDelay: '0.6s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cake Size *
                </label>
                <select
                  name="cakeSize"
                  value={formData.cakeSize}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                >
                  <option value="">Select Size</option>
                  {cakeSizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
                {formData.cakeSize && (
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {cakeSizes.find(s => s.value === formData.cakeSize)?.price}
                  </p>
                )}
              </div>
              
              <div className="animate-slideInLeft" style={{animationDelay: '0.7s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flavor *
                </label>
                <select
                  name="flavor"
                  value={formData.flavor}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                >
                  <option value="">Select Flavor</option>
                  {flavors.map(flavor => (
                    <option key={flavor} value={flavor}>{flavor}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Icing & Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slideInLeft" style={{animationDelay: '0.8s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icing Type *
                </label>
                <select
                  name="icing"
                  value={formData.icing}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                >
                  <option value="">Select Icing</option>
                  {icingTypes.map(icing => (
                    <option key={icing} value={icing}>{icing}</option>
                  ))}
                </select>
              </div>
              
              <div className="animate-slideInLeft" style={{animationDelay: '0.9s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Color Scheme
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  placeholder="e.g., Purple and gold, Pink and white, Blue and silver"
                />
              </div>
            </div>

            {/* Reference Images Upload */}
            <div className="animate-slideInLeft" style={{animationDelay: '1s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Reference Images/Sketches
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-300 hover:border-primary-400 hover:bg-primary-50/30">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="reference-images"
                />
                <label
                  htmlFor="reference-images"
                  className="cursor-pointer bg-gradient-to-r from-primary-500 to-berry-500 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center space-x-2 font-semibold"
                >
                  <span>📷</span>
                  <span>Choose Reference Images</span>
                </label>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  Upload photos, sketches, or inspiration images (Max 5 images, PNG, JPG, JPEG up to 5MB each)
                </p>
                
                {/* Image Previews */}
                {referenceImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 text-left">
                      Reference Images ({referenceImages.length}/5)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {referenceImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-primary-400 transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            title="Remove image"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg font-medium">
                            Ref {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Design Description */}
            <div className="animate-slideInLeft" style={{animationDelay: '1.1s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Description & Inspiration *
              </label>
              <textarea
                name="designDescription"
                value={formData.designDescription}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                placeholder="Describe your desired cake design, theme, decorations, any reference images you have, etc. Be as detailed as possible!"
              />
            </div>

            {/* Special Message & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slideInLeft" style={{animationDelay: '1.2s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Message on Cake
                </label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  placeholder="e.g., Happy Birthday Sarah!, Congratulations James!, Forever Together"
                />
              </div>
              
              <div className="animate-slideInLeft" style={{animationDelay: '1.3s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Budget (KSh)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                  placeholder="e.g., 5000"
                  min="0"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="animate-slideInLeft" style={{animationDelay: '1.4s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes or Special Requests
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows="3"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
                placeholder="Any allergies, dietary restrictions, or special instructions..."
              />
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div className="bg-gradient-to-r from-blue-50 to-primary-50 p-6 rounded-2xl border border-blue-200 animate-slideInLeft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-primary-700">Uploading your request...</span>
                  <span className="text-lg font-bold text-primary-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-berry-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-6 animate-slideInLeft">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary text-lg px-12 py-4 group relative ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading Your Design...
                  </span>
                ) : (
                  <span className="flex items-center">
                    🎨 Submit Custom Cake Request
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                )}
              </button>
              
              {submitError && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-red-700 text-sm">
                    <strong>Debug Info:</strong> Check browser console for detailed error information.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Quick Contact */}
        <div className="text-center mt-8">
          <p className="text-gray-600 font-medium">
            Need immediate assistance?{' '}
            <a 
              href="https://wa.me/254707046351" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold underline"
            >
              WhatsApp us directly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomCake;
