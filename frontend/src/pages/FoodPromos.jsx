import React, { useState, useRef } from 'react';
import { Download, Share2, Edit3, Palette, Type, Image, Star, Utensils, Coffee, Pizza, Wand2, Save, X, Plus, Trash2 } from 'lucide-react';

const FoodPromos = () => {
  const [promoDetails, setPromoDetails] = useState({
    restaurantName: '',
    foodType: '',
    specialOffer: '',
    promoType: '',
    duration: '',
    aiPrompt: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlyer, setGeneratedFlyer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);
  const [editableElements, setEditableElements] = useState({});
  const [flyerStyle, setFlyerStyle] = useState({
    backgroundColor: '#FF6B35',
    textColor: '#FFFFFF',
    accentColor: '#FFD23F',
    font: 'Poppins'
  });
  const [useAIPrompt, setUseAIPrompt] = useState(false);
  const canvasRef = useRef(null);

  const foodTypeIcons = {
    pizza: <Pizza className="w-16 h-16" />,
    burgers: <Utensils className="w-16 h-16" />,
    asian: <Utensils className="w-16 h-16" />,
    mexican: <Utensils className="w-16 h-16" />,
    italian: <Utensils className="w-16 h-16" />,
    seafood: <Utensils className="w-16 h-16" />,
    desserts: <Coffee className="w-16 h-16" />,
    other: <Utensils className="w-16 h-16" />
  };

  const colorThemes = [
    { name: 'Spicy Red', bg: '#FF6B35', text: '#FFFFFF', accent: '#FFD23F' },
    { name: 'Fresh Green', bg: '#4ECDC4', text: '#FFFFFF', accent: '#45B7AA' },
    { name: 'Royal Purple', bg: '#6A0572', text: '#FFFFFF', accent: '#AB83A1' },
    { name: 'Sunset Orange', bg: '#FF9F1C', text: '#FFFFFF', accent: '#2EC4B6' },
    { name: 'Ocean Blue', bg: '#011627', text: '#FFFFFF', accent: '#2EC4B6' },
    { name: 'Golden Yellow', bg: '#F7B801', text: '#2C3E50', accent: '#E74C3C' },
    { name: 'Deep Forest', bg: '#27AE60', text: '#FFFFFF', accent: '#F39C12' }
  ];

  const aiPromptSuggestions = [
    "Create an eye-catching promo for a cozy family restaurant with warm, inviting colors and appetizing food imagery",
    "Design a modern, trendy flyer for a hip burger joint targeting young adults with bold colors and urban vibes",
    "Generate an elegant promotional material for an upscale Italian restaurant with sophisticated typography and classic elements",
    "Create a fun, colorful promo for a Mexican food truck with festive decorations and vibrant imagery",
    "Design a minimalist, clean flyer for a healthy cafe focusing on fresh ingredients and wellness",
    "Generate a nostalgic, retro-style promo for a classic diner with vintage colors and typography"
  ];

  const handleInputChange = (field, value) => {
    setPromoDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAIFlyer = () => {
    if (useAIPrompt && promoDetails.aiPrompt) {
      // Enhanced AI generation based on prompt
      const aiGeneratedContent = generateFromAIPrompt(promoDetails.aiPrompt);
      return aiGeneratedContent;
    } else {
      // Standard template generation
      const templates = [
        {
          layout: 'modern',
          elements: {
            title: `${promoDetails.restaurantName}`,
            subtitle: promoDetails.foodType ? `Authentic ${promoDetails.foodType}` : 'Delicious Food',
            offer: promoDetails.specialOffer,
            duration: promoDetails.duration || 'Limited Time Only!',
            callToAction: 'Order Now!',
            description: 'Experience the best flavors in town!'
          }
        }
      ];
      return templates[0];
    }
  };

  const generateFromAIPrompt = (prompt) => {
    // Simulate AI content generation based on prompt
    const promptKeywords = prompt.toLowerCase();
    
    // Analyze prompt for style and content suggestions
    let generatedTitle = promoDetails.restaurantName;
    let generatedSubtitle = promoDetails.foodType ? `Authentic ${promoDetails.foodType}` : 'Delicious Food';
    let generatedOffer = promoDetails.specialOffer;
    let generatedDescription = 'Experience amazing flavors!';
    let generatedCallToAction = 'Order Now!';
    let generatedDuration = promoDetails.duration || 'Limited Time Only!';

    // AI-enhanced content based on prompt analysis
    if (promptKeywords.includes('cozy') || promptKeywords.includes('family')) {
      generatedSubtitle = 'Family Recipes, Made with Love';
      generatedDescription = 'Where every meal feels like home';
      generatedCallToAction = 'Join Our Family Table';
    } else if (promptKeywords.includes('modern') || promptKeywords.includes('trendy') || promptKeywords.includes('hip')) {
      generatedSubtitle = 'Bold Flavors, Fresh Vibes';
      generatedDescription = 'Where taste meets style';
      generatedCallToAction = 'Taste the Trend';
    } else if (promptKeywords.includes('elegant') || promptKeywords.includes('upscale') || promptKeywords.includes('sophisticated')) {
      generatedSubtitle = 'Fine Dining Excellence';
      generatedDescription = 'An extraordinary culinary journey';
      generatedCallToAction = 'Reserve Your Table';
    } else if (promptKeywords.includes('fun') || promptKeywords.includes('colorful') || promptKeywords.includes('festive')) {
      generatedSubtitle = 'Fiesta of Flavors!';
      generatedDescription = 'Every bite is a celebration';
      generatedCallToAction = '¡Vamos a Comer!';
    } else if (promptKeywords.includes('healthy') || promptKeywords.includes('fresh') || promptKeywords.includes('wellness')) {
      generatedSubtitle = 'Fresh • Healthy • Delicious';
      generatedDescription = 'Nourish your body, delight your taste';
      generatedCallToAction = 'Fuel Your Day';
    } else if (promptKeywords.includes('nostalgic') || promptKeywords.includes('retro') || promptKeywords.includes('vintage')) {
      generatedSubtitle = 'Classic Recipes Since 1950';
      generatedDescription = 'Bringing back the good old days';
      generatedCallToAction = 'Step Back in Time';
    }

    // Additional AI-generated promotional lines based on food type and prompt
    const additionalLines = [];
    if (promptKeywords.includes('appetizing') || promptKeywords.includes('delicious')) {
      additionalLines.push('Made fresh daily with premium ingredients');
    }
    if (promptKeywords.includes('special') || promptKeywords.includes('exclusive')) {
      additionalLines.push('Exclusive limited-time offer');
    }

    return {
      layout: 'ai-enhanced',
      elements: {
        title: generatedTitle,
        subtitle: generatedSubtitle,
        offer: generatedOffer,
        duration: generatedDuration,
        callToAction: generatedCallToAction,
        description: generatedDescription,
        additionalLines: additionalLines
      }
    };
  };

  const handleGenerate = async () => {
    if (!promoDetails.restaurantName.trim() || !promoDetails.specialOffer.trim()) return;
    if (useAIPrompt && !promoDetails.aiPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedFlyer(null);

    // Simulate AI generation with realistic delay
    setTimeout(() => {
      const aiFlyer = generateAIFlyer();
      setGeneratedFlyer(aiFlyer);
      setEditableElements(aiFlyer.elements);
      setIsGenerating(false);
    }, 2500);
  };

  const handleElementEdit = (elementKey, newValue) => {
    setEditableElements(prev => ({
      ...prev,
      [elementKey]: newValue
    }));
  };

  const addNewElement = () => {
    const newKey = `custom_${Date.now()}`;
    setEditableElements(prev => ({
      ...prev,
      [newKey]: 'New text element'
    }));
  };

  const removeElement = (elementKey) => {
    setEditableElements(prev => {
      const updated = { ...prev };
      delete updated[elementKey];
      return updated;
    });
  };

  const saveTextEdits = () => {
    setGeneratedFlyer(prev => ({
      ...prev,
      elements: editableElements
    }));
    setTextEditMode(false);
  };

  const downloadFlyer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;

    // Draw background
    ctx.fillStyle = flyerStyle.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements
    ctx.fillStyle = flyerStyle.accentColor;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(700, 900, 60, 0, Math.PI * 2);
    ctx.fill();

    // Add text elements
    const elements = editableElements;
    let yPosition = 180;

    ctx.fillStyle = flyerStyle.textColor;
    ctx.textAlign = 'center';

    // Title
    ctx.font = 'bold 48px Arial';
    ctx.fillText(elements.title || '', 400, yPosition);
    yPosition += 60;

    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillText(elements.subtitle || '', 400, yPosition);
    yPosition += 80;

    // Special Offer
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = flyerStyle.accentColor;
    ctx.fillText(elements.offer || '', 400, yPosition);
    yPosition += 80;

    // Description
    ctx.fillStyle = flyerStyle.textColor;
    ctx.font = '20px Arial';
    ctx.fillText(elements.description || '', 400, yPosition);
    yPosition += 60;

    // Additional lines
    if (elements.additionalLines && elements.additionalLines.length > 0) {
      ctx.font = '18px Arial';
      elements.additionalLines.forEach(line => {
        ctx.fillText(line, 400, yPosition);
        yPosition += 30;
      });
      yPosition += 40;
    }

    // Duration
    ctx.font = '20px Arial';
    ctx.fillText(elements.duration || '', 400, yPosition);
    yPosition += 80;

    // Call to Action
    ctx.font = 'bold 28px Arial';
    ctx.fillText(elements.callToAction || '', 400, yPosition);

    // Download
    const link = document.createElement('a');
    link.download = `${promoDetails.restaurantName}-promo.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareFlyer = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${promoDetails.restaurantName} Special Offer`,
          text: promoDetails.specialOffer,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Check out this amazing offer from ${promoDetails.restaurantName}: ${promoDetails.specialOffer}`);
      alert('Promo details copied to clipboard!');
    }
  };

  const updateTheme = (theme) => {
    setFlyerStyle({
      ...flyerStyle,
      backgroundColor: theme.bg,
      textColor: theme.text,
      accentColor: theme.accent
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🍕 AI Food Promo Generator</h1>
          <p className="text-gray-600">Create stunning restaurant promos with AI-powered design and full editing control</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Edit3 className="w-6 h-6 mr-2 text-orange-500" />
              Promo Details
            </h2>

            <div className="space-y-4">
              {/* AI Prompt Toggle */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={useAIPrompt}
                    onChange={(e) => setUseAIPrompt(e.target.checked)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="useAI" className="flex items-center font-medium text-purple-700">
                    <Wand2 className="w-4 h-4 mr-1" />
                    Use AI Creative Prompt
                  </label>
                </div>
                
                {useAIPrompt && (
                  <div className="space-y-3">
                    <textarea
                      value={promoDetails.aiPrompt}
                      onChange={(e) => handleInputChange('aiPrompt', e.target.value)}
                      placeholder="Describe the style and vibe you want for your promo (e.g., 'Create a modern, trendy flyer with bold colors for a hip burger joint targeting young adults')"
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                    
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">💡 AI Prompt Suggestions:</p>
                      <div className="space-y-1">
                        {aiPromptSuggestions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleInputChange('aiPrompt', suggestion)}
                            className="block w-full text-left p-2 bg-white rounded border hover:bg-purple-50 transition-colors text-xs"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                <input
                  type="text"
                  value={promoDetails.restaurantName}
                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  placeholder="Tony's Pizza Palace"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                <select
                  value={promoDetails.foodType}
                  onChange={(e) => handleInputChange('foodType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Food Type</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Asian Cuisine">Asian Cuisine</option>
                  <option value="Mexican Food">Mexican Food</option>
                  <option value="Italian Cuisine">Italian Cuisine</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Coffee & Cafe">Coffee & Cafe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Offer *</label>
                <input
                  type="text"
                  value={promoDetails.specialOffer}
                  onChange={(e) => handleInputChange('specialOffer', e.target.value)}
                  placeholder="50% OFF All Large Pizzas!"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={promoDetails.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="This Weekend Only!"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !promoDetails.restaurantName.trim() || !promoDetails.specialOffer.trim() || (useAIPrompt && !promoDetails.aiPrompt.trim())}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{useAIPrompt ? 'AI is crafting your custom flyer...' : 'AI is creating your flyer...'}</span>
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    <span>{useAIPrompt ? 'Generate AI Custom Flyer' : 'Generate AI Flyer'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Image className="w-6 h-6 mr-2 text-orange-500" />
                Live Preview
              </h2>
              {generatedFlyer && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {setEditMode(!editMode); setTextEditMode(false);}}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Design Editor"
                  >
                    <Palette className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {setTextEditMode(!textEditMode); setEditMode(false);}}
                    className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    title="Text Editor"
                  >
                    <Type className="w-5 h-5" />
                  </button>
                  <button
                    onClick={downloadFlyer}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareFlyer}
                    className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {generatedFlyer ? (
              <div className="space-y-4">
                {/* Color Theme Editor */}
                {editMode && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Choose Color Theme:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {colorThemes.map((theme, index) => (
                        <button
                          key={index}
                          onClick={() => updateTheme(theme)}
                          className="flex items-center space-x-2 p-2 rounded-lg border hover:shadow-md transition-all"
                          style={{ backgroundColor: theme.bg + '20', borderColor: theme.bg }}
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.bg }}
                          />
                          <span className="text-sm">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Editor */}
                {textEditMode && (
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Edit Text Elements:</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={addNewElement}
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          title="Add Text Element"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={saveTextEdits}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="Save Changes"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTextEditMode(false)}
                          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          title="Close Editor"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(editableElements).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={Array.isArray(value) ? value.join(', ') : value}
                            onChange={(e) => handleElementEdit(key, e.target.value)}
                            className="flex-1 p-2 border rounded text-sm"
                            placeholder={`Edit ${key}...`}
                          />
                          <button
                            onClick={() => removeElement(key)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Remove Element"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flyer Preview */}
                <div
                  className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${flyerStyle.backgroundColor}, ${flyerStyle.backgroundColor}dd)`
                  }}
                >
                  {/* Decorative Elements */}
                  <div
                    className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-30"
                    style={{ backgroundColor: flyerStyle.accentColor }}
                  />
                  <div
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full opacity-30"
                    style={{ backgroundColor: flyerStyle.accentColor }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                    {/* Food Icon */}
                    <div
                      className="mb-4 opacity-80"
                      style={{ color: flyerStyle.accentColor }}
                    >
                      {foodTypeIcons[promoDetails.foodType.toLowerCase()] || <Utensils className="w-16 h-16" />}
                    </div>

                    {/* Restaurant Name */}
                    <h1
                      className="text-3xl md:text-4xl font-bold mb-2"
                      style={{ color: flyerStyle.textColor }}
                    >
                      {editableElements.title}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className="text-lg mb-4 opacity-90"
                      style={{ color: flyerStyle.textColor }}
                    >
                      {editableElements.subtitle}
                    </p>

                    {/* Special Offer */}
                    <div
                      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-4 border"
                      style={{ borderColor: flyerStyle.accentColor }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: flyerStyle.accentColor }}
                      >
                        {editableElements.offer}
                      </p>
                    </div>

                    {/* Description */}
                    {editableElements.description && (
                      <p
                        className="text-sm mb-3 opacity-80"
                        style={{ color: flyerStyle.textColor }}
                      >
                        {editableElements.description}
                      </p>
                    )}

                    {/* Additional Lines */}
                    {editableElements.additionalLines && editableElements.additionalLines.length > 0 && (
                      <div className="mb-4">
                        {editableElements.additionalLines.map((line, index) => (
                          <p
                            key={index}
                            className="text-xs opacity-70 mb-1"
                            style={{ color: flyerStyle.textColor }}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Duration */}
                    <p
                      className="text-sm mb-4 opacity-80"
                      style={{ color: flyerStyle.textColor }}
                    >
                      {editableElements.duration}
                    </p>

                    {/* Call to Action */}
                    <button
                      className="px-8 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: flyerStyle.accentColor,
                        color: flyerStyle.backgroundColor
                      }}
                    >
                      {editableElements.callToAction}
                    </button>

                    {/* Custom Elements */}
                    {Object.entries(editableElements).filter(([key]) => key.startsWith('custom_')).map(([key, value]) => (
                      <p
                        key={key}
                        className="text-sm mt-2 opacity-75"
                        style={{ color: flyerStyle.textColor }}
                      >
                        {value}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={downloadFlyer}
                    className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={shareFlyer}
                    className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Promo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Utensils className="w-16 h-16 mb-4" />
                <p className="text-lg">Fill in the details and click "Generate AI Flyer"</p>
                <p className="text-sm">Your awesome promo will appear here!</p>
                {useAIPrompt && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-purple-700 font-medium">AI Creative Mode Active</span>
                    </div>
                    <p className="text-purple-600 text-sm">
                      Your AI prompt will enhance the design with custom styling and messaging!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hidden Canvas for Download */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">💡 Pro Tips for Amazing Food Promos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Use AI Prompts</h3>
              <p className="text-gray-600 text-sm">
                Enable AI Creative Mode and describe your desired style for personalized designs that match your brand perfectly.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Customize Colors</h3>
              <p className="text-gray-600 text-sm">
                Use the color theme editor to match your restaurant's branding and create eye-catching combinations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Type className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Edit All Text</h3>
              <p className="text-gray-600 text-sm">
                Fine-tune every word using the text editor. Add custom elements, adjust messaging, and make it uniquely yours.
              </p>
            </div>
          </div>
        </div>

        {/* AI Prompt Examples */}
        {useAIPrompt && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
            <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
              🎨 AI Prompt Inspiration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPromptSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleInputChange('aiPrompt', suggestion)}
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                  <div className="mt-2 text-xs text-purple-600 font-medium">
                    Click to use this prompt →
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-purple-700 font-medium mb-2">✨ Tips for Better AI Prompts:</p>
              <div className="text-sm text-purple-600 space-y-1">
                <p>• Describe the mood and atmosphere you want (cozy, modern, elegant, fun)</p>
                <p>• Mention your target audience (families, young adults, professionals)</p>
                <p>• Include style preferences (vintage, minimalist, bold, colorful)</p>
                <p>• Specify any special themes or occasions (holidays, grand opening, anniversary)</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Built with AI-powered design generation • Create unlimited promos • Download in high quality
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPromos;




