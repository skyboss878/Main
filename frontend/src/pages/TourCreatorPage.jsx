import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; // Import your API helper

const TourCreatorPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [tourTitle, setTourTitle] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => ({
      file, // Keep the actual file object
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (id) => {
    setSelectedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const generateTour = async () => {
    if (!tourTitle || selectedImages.length === 0) {
      alert('Please provide a title and upload at least one image');
      return;
    }

    setIsGenerating(true);

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('title', tourTitle);
    formData.append('description', tourDescription);

    // Append each image file to the form data
    for (const image of selectedImages) {
      formData.append('images', image.file);
    }

    try {
      // THIS IS THE CORRECTED LINE:
      const response = await API.post('/api/tours/create', formData);

      console.log('Tour created successfully:', response);
      // Assuming the response includes the URL to the new tour viewer
      if (response.viewerUrl) {
         alert(`Tour created! You can view it at: ${response.viewerUrl}`);
         // Optionally, open the tour in a new tab
         window.open(response.viewerUrl, '_blank');
      } else {
         alert('Tour assets uploaded! Check the server for the result.');
      }
      navigate('/dashboard');

    } catch (error) {
      console.error('Error creating tour:', error);
      alert('Failed to create tour. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Tour Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tour Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tour Title *</label>
            <input type="text" value={tourTitle} onChange={(e) => setTourTitle(e.target.value)} placeholder="Enter tour title (e.g., 'Downtown Restaurant Tour')" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={tourDescription} onChange={(e) => setTourDescription(e.target.value)} placeholder="Describe your tour experience..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
        </div>
      </div>
      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Panoramic Images</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB each)</p>
              </div>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {selectedImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Images ({selectedImages.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.url} alt="Tour snapshot" className="w-full h-32 object-cover rounded-lg border" />
                    <button onClick={() => removeImage(image.id)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={generateTour} disabled={isGenerating || !tourTitle || selectedImages.length === 0} className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Generating Tour...</span>
            </>
          ) : (
            <span>Generate 360° Tour</span>
          )}
        </button>
      </div>
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for Best Results:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use high-quality panoramic or 360° images</li>
          <li>• Ensure good lighting and clear visibility</li>
          <li>• Upload images in sequence for smooth navigation</li>
          <li>• Consider different angles and viewpoints</li>
        </ul>
      </div>
    </div>
  );
};

export default TourCreatorPage;
