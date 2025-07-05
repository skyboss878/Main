import React, { useState } from 'react';

const RealEstateTour = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    address: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    price: '',
    features: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTour, setGeneratedTour] = useState(null);

  const handleInputChange = (field, value) => {
    setPropertyDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!propertyDetails.address.trim() || !propertyDetails.propertyType.trim()) return;

    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setGeneratedTour({
        title: `360° Tour - ${propertyDetails.address}`,
        description: `Explore this beautiful ${propertyDetails.propertyType} featuring ${propertyDetails.bedrooms} bedrooms and ${propertyDetails.bathrooms} bathrooms.`,
        tourUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
      });
      setIsGenerating(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🏢 Real Estate 360° Tour</h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address:
              </label>
              <input
                type="text"
                value={propertyDetails.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street, City, State"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type:
              </label>
              <select
                value={propertyDetails.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Property Type</option>
                <option value="house">Single Family Home</option>
                <option value="condo">Condominium</option>
                <option value="townhouse">Townhouse</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms:
              </label>
              <input
                type="number"
                value={propertyDetails.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms:
              </label>
              <input
                type="number"
                step="0.5"
                value={propertyDetails.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="2.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Feet:
              </label>
              <input
                type="number"
                value={propertyDetails.squareFeet}
                onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                placeholder="2500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price:
              </label>
              <input
                type="text"
                value={propertyDetails.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="$450,000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Features:
            </label>
            <textarea
              value={propertyDetails.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              placeholder="Granite countertops, hardwood floors, updated kitchen..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!propertyDetails.address.trim() || !propertyDetails.propertyType.trim() || isGenerating}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Creating 360° Tour...' : 'Create 360° Tour'}
          </button>

          {generatedTour && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Generated 360° Tour:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{generatedTour.title}</h4>
                <p className="text-gray-700 mb-4">{generatedTour.description}</p>
                <img
                  src={generatedTour.tourUrl}
                  alt="Property Tour Preview"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default RealEstateTour;




