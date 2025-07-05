import React, { useState } from 'react';

const SocialTools = () => {
  const [selectedTool, setSelectedTool] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const tools = [
    { id: 'hashtags', name: 'Hashtag Generator', icon: '#️⃣' },
    { id: 'captions', name: 'Caption Writer', icon: '📝' },
    { id: 'scheduler', name: 'Post Scheduler', icon: '📅' },
    { id: 'analytics', name: 'Analytics Dashboard', icon: '📊' }
  ];

  const handleGenerate = async () => {
    if (!selectedTool || !content.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      let result = {};
      switch (selectedTool) {
        case 'hashtags':
          result = {
            title: 'Generated Hashtags',
            content: '#FoodieLife #RestaurantLife #Delicious #YummyEats #FoodLover #ChefSpecial #TastyTreats #FoodieFinds #LocalEats #FreshFood'
          };
          break;
        case 'captions':
          result = {
            title: 'Generated Caption',
            content: '🍽️ Experience culinary perfection at its finest! Our chefs craft each dish with passion and precision. Come taste the difference that quality ingredients make. Book your table today! ✨'
          };
          break;
        case 'scheduler':
          result = {
            title: 'Scheduled Posts',
            content: 'Your content has been scheduled for optimal engagement times: 12:00 PM, 6:00 PM, and 8:00 PM today.'
          };
          break;
        case 'analytics':
          result = {
            title: 'Analytics Summary',
            content: 'Engagement Rate: 4.2% | Reach: 12,450 | Impressions: 23,890 | Best Performing Time: 7:00 PM'
          };
          break;
        default:
          result = { title: 'Generated Content', content: 'Content generated successfully!' };
      }
      setGeneratedContent(result);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📲 Social Media Toolkit</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTool === tool.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="text-sm font-medium">{tool.name}</div>
              </button>
            ))}
          </div>
          
          {selectedTool && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedTool === 'hashtags' ? 'Describe your content:' : 
                 selectedTool === 'captions' ? 'What do you want to post about?' :
                 selectedTool === 'scheduler' ? 'Enter your post content:' :
                 'Enter your business details:'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  selectedTool === 'hashtags' ? 'Delicious pizza at our restaurant...' : 
                  selectedTool === 'captions' ? 'New menu items, special events...' :
                  selectedTool === 'scheduler' ? 'Your social media post content...' :
                  'Restaurant name, location, specialty...'
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={!selectedTool || !content.trim() || isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : `Generate ${tools.find(t => t.id === selectedTool)?.name || 'Content'}`}
          </button>
          
          {generatedContent && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">{generatedContent.title}:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{generatedContent.content}</p>
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

export default SocialTools;
