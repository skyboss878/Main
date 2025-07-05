import React, { useState } from 'react';

const RestaurantPromos = () => {
  const [selectedPromoType, setSelectedPromoType] = useState('special-offer');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [formData, setFormData] = useState({
    restaurantName: '',
    promoText: '',
    discount: '',
    validUntil: '',
    cuisine: '',
    location: ''
  });

  const promoTypes = [
    { id: 'special-offer', name: 'Special Offers', icon: '🏷️', description: 'Discounts & deals' },
    { id: 'new-menu', name: 'New Menu Items', icon: '🍽️', description: 'Feature new dishes' },
    { id: 'happy-hour', name: 'Happy Hour', icon: '🍺', description: 'Drink specials' },
    { id: 'grand-opening', name: 'Grand Opening', icon: '🎉', description: 'Launch promotions' },
    { id: 'seasonal', name: 'Seasonal Specials', icon: '🌟', description: 'Holiday & seasonal' },
    { id: 'delivery', name: 'Delivery Promos', icon: '🚚', description: 'Delivery & takeout' }
  ];

  const styles = [
    { id: 'modern', name: 'Modern Minimalist', preview: 'from-gray-900 to-gray-700' },
    { id: 'vibrant', name: 'Vibrant & Bold', preview: 'from-orange-500 to-red-600' },
    { id: 'elegant', name: 'Elegant Classic', preview: 'from-amber-800 to-amber-900' },
    { id: 'fresh', name: 'Fresh & Natural', preview: 'from-green-500 to-emerald-600' },
    { id: 'luxury', name: 'Luxury Gold', preview: 'from-yellow-400 to-amber-500' },
    { id: 'cozy', name: 'Cozy Warm', preview: 'from-orange-600 to-red-700' }
  ];

  const cuisineTypes = [
    '🍕 Italian', '🍜 Asian', '🌮 Mexican', '🍔 American', '🥘 Indian', 
    '🍣 Japanese', '🥗 Mediterranean', '🍖 BBQ', '☕ Cafe', '🍰 Bakery'
  ];

  const templates = [
    {
      id: 1,
      name: 'Flash Sale Special',
      type: 'special-offer',
      preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      description: '50% off all entrees - Limited time!'
    },
    {
      id: 2,
      name: 'New Menu Launch',
      type: 'new-menu',
      preview: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      description: 'Introducing our summer collection'
    },
    {
      id: 3,
      name: 'Happy Hour Drinks',
      type: 'happy-hour',
      preview: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
      description: 'Buy 1 Get 1 Free cocktails'
    },
    {
      id: 4,
      name: 'Grand Opening',
      type: 'grand-opening',
      preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      description: 'Free appetizers for first 100 customers'
    },
    {
      id: 5,
      name: 'Holiday Special',
      type: 'seasonal',
      preview: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
      description: 'Thanksgiving feast booking now open'
    },
    {
      id: 6,
      name: 'Free Delivery',
      type: 'delivery',
      preview: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      description: 'Free delivery on orders over $25'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStyleClasses = (styleId) => {
    const styleMap = {
      modern: 'from-gray-900 to-gray-700',
      vibrant: 'from-orange-500 to-red-600',
      elegant: 'from-amber-800 to-amber-900',
      fresh: 'from-green-500 to-emerald-600',
      luxury: 'from-yellow-400 to-amber-500',
      cozy: 'from-orange-600 to-red-700'
    };
    return styleMap[styleId] || styleMap.modern;
  };

  const handleGenerate = () => {
    if (!formData.restaurantName || !formData.promoText) {
      alert('Please fill in restaurant name and promo text');
      return;
    }
    
    // Create a preview of the generated promo
    const promoPreview = {
      restaurantName: formData.restaurantName,
      promoText: formData.promoText,
      discount: formData.discount,
      validUntil: formData.validUntil,
      cuisine: formData.cuisine,
      location: formData.location,
      style: selectedStyle,
      type: selectedPromoType
    };
    
    console.log('Generated Promo:', promoPreview);
    alert('Promo generated successfully! Check the preview section.');
  };

  const filteredTemplates = templates.filter(template => 
    selectedPromoType === 'all' || template.type === selectedPromoType
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            🍽️ Restaurant Promo Creator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create mouth-watering promotional content that drives customers to your restaurant
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Restaurant Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🏪</span>
                Restaurant Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleInputChange}
                    placeholder="e.g., Tony's Italian Kitchen"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select cuisine type</option>
                    {cuisineTypes.map((cuisine, index) => (
                      <option key={index} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Downtown, 123 Main St"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Promo Type Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Promo Type
              </h2>
              <div className="space-y-2">
                {promoTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedPromoType(type.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedPromoType === type.id
                        ? 'bg-orange-50 text-orange-700 border-orange-300'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">✨</span>
                Promo Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Text *
                  </label>
                  <textarea
                    name="promoText"
                    value={formData.promoText}
                    onChange={handleInputChange}
                    placeholder="e.g., 50% off all pasta dishes this weekend!"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (if applicable)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="e.g., 25% OFF, BOGO, $10 OFF"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🎨</span>
                Design Style
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedStyle === style.id
                        ? 'border-orange-300 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className={`w-full h-8 rounded bg-gradient-to-r ${style.preview} mb-2`}></div>
                    <div className="text-xs font-medium text-gray-700">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200"
            >
              🚀 Generate Promo
            </button>
          </div>

          {/* Right Panel - Templates and Preview */}
          <div className="lg:col-span-2">
            {/* Live Preview */}
            {(formData.restaurantName || formData.promoText) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">👁️</span>
                  Live Preview
                </h2>
                <div className={`bg-gradient-to-r ${getStyleClasses(selectedStyle)} text-white p-6 rounded-lg`}>
                  <div className="text-center">
                    {formData.restaurantName && (
                      <h3 className="text-2xl font-bold mb-2">{formData.restaurantName}</h3>
                    )}
                    {formData.cuisine && (
                      <p className="text-sm opacity-90 mb-3">{formData.cuisine}</p>
                    )}
                    {formData.discount && (
                      <div className="bg-white text-gray-900 px-4 py-2 rounded-full inline-block mb-4 font-bold text-lg">
                        {formData.discount}
                      </div>
                    )}
                    {formData.promoText && (
                      <p className="text-lg mb-4">{formData.promoText}</p>
                    )}
                    {formData.validUntil && (
                      <p className="text-sm opacity-80">Valid until {formData.validUntil}</p>
                    )}
                    {formData.location && (
                      <p className="text-sm opacity-80 mt-2">📍 {formData.location}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Templates */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">📋</span>
                  Ready-to-Use Templates
                </h2>
                <div className="text-sm text-gray-600">
                  {filteredTemplates.length} templates available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 relative">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <h4 className="text-white font-semibold text-center px-4">{template.name}</h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <button className="w-full bg-orange-100 text-orange-700 py-2 rounded-md hover:bg-orange-200 transition-colors duration-200 text-sm font-medium">
                        Use This Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-600">No templates found for this promo type.</p>
                  <p className="text-sm text-gray-500 mt-2">Try selecting a different promo type above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPromos;
