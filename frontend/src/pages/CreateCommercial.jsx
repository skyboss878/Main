import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Share2, Edit3, Video, Music, Type, Palette, Sparkles, Upload, Eye, Settings } from 'lucide-react';

const CreateCommercial = () => {
  const [commercialData, setCommercialData] = useState({
    businessName: '',
    businessType: '',
    targetAudience: '',
    keyMessage: '',
    callToAction: '',
    duration: '30',
    style: 'modern',
    mood: 'energetic'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCommercial, setGeneratedCommercial] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoSettings, setVideoSettings] = useState({
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#00d4ff',
    musicTrack: 'upbeat',
    animations: 'smooth'
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const businessTypes = [
    'Restaurant', 'Retail Store', 'Fitness Center', 'Beauty Salon', 'Tech Company',
    'Real Estate', 'Healthcare', 'Education', 'Automotive', 'Travel & Tourism',
    'Fashion', 'Food & Beverage', 'Professional Services', 'E-commerce'
  ];

  const videoStyles = [
    { name: 'Modern Minimal', value: 'modern', desc: 'Clean, sleek design with smooth transitions' },
    { name: 'Dynamic Energy', value: 'energetic', desc: 'Fast-paced with vibrant colors and effects' },
    { name: 'Professional', value: 'professional', desc: 'Corporate look with elegant transitions' },
    { name: 'Creative Art', value: 'creative', desc: 'Artistic with unique visual elements' },
    { name: 'Retro Vintage', value: 'retro', desc: '80s/90s inspired with nostalgic feel' }
  ];

  const colorThemes = [
    { name: 'Ocean Blue', bg: '#1a1a2e', text: '#ffffff', accent: '#00d4ff' },
    { name: 'Sunset Orange', bg: '#2d1b69', text: '#ffffff', accent: '#ff6b35' },
    { name: 'Forest Green', bg: '#0f3460', text: '#ffffff', accent: '#16db93' },
    { name: 'Royal Purple', bg: '#1a0033', text: '#ffffff', accent: '#a855f7' },
    { name: 'Fire Red', bg: '#1a0000', text: '#ffffff', accent: '#ff4444' }
  ];

  const musicTracks = [
    { name: 'Upbeat Corporate', value: 'upbeat', mood: 'energetic' },
    { name: 'Inspiring Ambient', value: 'inspiring', mood: 'motivational' },
    { name: 'Modern Electronic', value: 'electronic', mood: 'tech' },
    { name: 'Acoustic Warm', value: 'acoustic', mood: 'friendly' },
    { name: 'Cinematic Epic', value: 'cinematic', mood: 'dramatic' }
  ];

  const handleInputChange = (field, value) => {
    setCommercialData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAIScript = () => {
    const hooks = [
      "Are you ready to transform your",
      "Discover the secret to",
      "What if we told you there's a better way to",
      "Stop settling for ordinary",
      "The future of"
    ];

    const benefits = [
      "Save time and money",
      "Get professional results",
      "Stand out from the competition",
      "Boost your success",
      "Transform your business"
    ];

    const urgency = [
      "Don't wait - act now!",
      "Limited time offer!",
      "Join thousands of satisfied customers!",
      "Your success starts today!",
      "Take action before it's too late!"
    ];

    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
    const randomBenefit = benefits[Math.floor(Math.random() * benefits.length)];
    const randomUrgency = urgency[Math.floor(Math.random() * urgency.length)];

    return {
      hook: `${randomHook} ${commercialData.businessType?.toLowerCase() || 'business'} experience?`,
      problem: `At ${commercialData.businessName}, we understand your needs.`,
      solution: `${commercialData.keyMessage || 'We provide the perfect solution.'}`,
      benefit: randomBenefit,
      cta: commercialData.callToAction || 'Contact us today!',
      urgency: randomUrgency
    };
  };

  const generateCommercial = async () => {
    if (!commercialData.businessName.trim() || !commercialData.keyMessage.trim()) return;

    setIsGenerating(true);
    setGeneratedCommercial(null);

    // Simulate AI video generation
    setTimeout(() => {
      const script = generateAIScript();
      const scenes = [
        {
          id: 1,
          type: 'intro',
          duration: 5,
          text: script.hook,
          animation: 'fadeIn',
          background: 'gradient'
        },
        {
          id: 2,
          type: 'problem',
          duration: 7,
          text: script.problem,
          animation: 'slideLeft',
          background: 'video'
        },
        {
          id: 3,
          type: 'solution',
          duration: 8,
          text: script.solution,
          animation: 'zoomIn',
          background: 'split'
        },
        {
          id: 4,
          type: 'benefit',
          duration: 6,
          text: script.benefit,
          animation: 'slideUp',
          background: 'overlay'
        },
        {
          id: 5,
          type: 'cta',
          duration: 4,
          text: script.cta,
          animation: 'pulse',
          background: 'solid'
        }
      ];

      setGeneratedCommercial({
        id: `commercial_${Date.now()}`,
        businessName: commercialData.businessName,
        script,
        scenes,
        duration: parseInt(commercialData.duration),
        style: commercialData.style,
        mood: commercialData.mood,
        videoUrl: 'generated_video.mp4', // In real app, this would be actual video URL
        thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
        createdAt: new Date().toISOString()
      });

      setIsGenerating(false);
    }, 3000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const downloadVideo = async () => {
    // In a real implementation, this would generate and download the actual video
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Create a simple preview frame
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, videoSettings.backgroundColor);
    gradient.addColorStop(1, videoSettings.accentColor + '40');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = videoSettings.textColor;
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(commercialData.businessName, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '60px Arial';
    ctx.fillText(commercialData.keyMessage, canvas.width / 2, canvas.height / 2 + 150);
    
    // Download as image (in real app, would be video)
    const link = document.createElement('a');
    link.download = `${commercialData.businessName}-commercial-preview.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    // Show success message
    alert('Video preview downloaded! In the full version, this would be a complete MP4 video file.');
  };

  const shareCommercial = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${commercialData.businessName} Commercial`,
          text: `Check out this awesome commercial for ${commercialData.businessName}! ${commercialData.keyMessage}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(`Check out this commercial for ${commercialData.businessName}: ${commercialData.keyMessage}`);
      alert('Commercial details copied to clipboard!');
    }
  };

  const updateVideoSettings = (setting, value) => {
    setVideoSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Simulate video progress
  useEffect(() => {
    let interval;
    if (isPlaying && generatedCommercial) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= generatedCommercial.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, generatedCommercial]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
            <Video className="w-12 h-12 mr-4 text-cyan-400" />
            AI Commercial Creator
          </h1>
          <p className="text-xl text-gray-300">Create stunning video commercials with AI in minutes</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Edit3 className="w-6 h-6 mr-3 text-cyan-400" />
              Commercial Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={commercialData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="TechFlow Solutions"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Type *</label>
                  <select
                    value={commercialData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={commercialData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Small business owners, entrepreneurs, professionals..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Key Message *</label>
                <textarea
                  value={commercialData.keyMessage}
                  onChange={(e) => handleInputChange('keyMessage', e.target.value)}
                  placeholder="We help businesses streamline their operations with cutting-edge technology solutions..."
                  rows="3"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Call to Action *</label>
                <input
                  type="text"
                  value={commercialData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  placeholder="Visit our website today! Call now! Get started free!"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <select
                    value={commercialData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                    <option value="90">90 seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                  <select
                    value={commercialData.style}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  >
                    {videoStyles.map(style => (
                      <option key={style.value} value={style.value}>{style.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateCommercial}
                disabled={isGenerating || !commercialData.businessName.trim() || !commercialData.keyMessage.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>AI is creating your commercial...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Generate AI Commercial</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Eye className="w-6 h-6 mr-3 text-cyan-400" />
                Video Preview
              </h2>
              {generatedCommercial && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    title="Edit Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={downloadVideo}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Download Video"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={shareCommercial}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Share Commercial"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {generatedCommercial ? (
              <div className="space-y-6">
                {/* Video Settings Editor */}
                {editMode && (
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Customize Video
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Color Theme</label>
                        <div className="space-y-2">
                          {colorThemes.map((theme, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                updateVideoSettings('backgroundColor', theme.bg);
                                updateVideoSettings('textColor', theme.text);
                                updateVideoSettings('accentColor', theme.accent);
                              }}
                              className="flex items-center space-x-3 w-full p-2 rounded-lg border border-gray-600 hover:border-cyan-500 transition-colors"
                            >
                              <div className="flex space-x-1">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.bg }} />
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accent }} />
                              </div>
                              <span className="text-white text-sm">{theme.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Music Track</label>
                        <div className="space-y-2">
                          {musicTracks.map((track) => (
                            <button
                              key={track.value}
                              onClick={() => updateVideoSettings('musicTrack', track.value)}
                              className={`w-full p-2 text-left rounded-lg border transition-colors ${
                                videoSettings.musicTrack === track.value
                                  ? 'border-cyan-500 bg-cyan-500/20'
                                  : 'border-gray-600 hover:border-cyan-500'
                              }`}
                            >
                              <div className="text-white text-sm font-medium">{track.name}</div>
                              <div className="text-gray-400 text-xs">{track.mood}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${videoSettings.backgroundColor}, ${videoSettings.accentColor}40)`
                    }}
                  >
                    <div className="text-center space-y-4 p-8">
                      <div className="text-4xl font-bold" style={{ color: videoSettings.textColor }}>
                        {commercialData.businessName}
                      </div>
                      <div className="text-xl" style={{ color: videoSettings.textColor }}>
                        {commercialData.keyMessage}
                      </div>
                      <div 
                        className="inline-block px-6 py-3 rounded-full font-bold text-lg"
                        style={{ 
                          backgroundColor: videoSettings.accentColor,
                          color: videoSettings.backgroundColor
                        }}
                      >
                        {commercialData.callToAction}
                      </div>
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlayPause}
                      className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-cyan-400 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${(currentTime / generatedCommercial.duration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-white text-xs mt-1">
                      <span>{Math.floor(currentTime)}s</span>
                      <span>{generatedCommercial.duration}s</span>
                    </div>
                  </div>
                </div>

                {/* Scene Timeline */}
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Scene Timeline</h3>
                  <div className="space-y-2">
                    {generatedCommercial.scenes.map((scene, index) => (
                      <div 
                        key={scene.id}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 border border-gray-600"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <div className="text-white font-medium capitalize">{scene.type}</div>
                          <div className="text-gray-400 text-sm">{scene.text}</div>
                        </div>
                        <div className="text-cyan-400 text-sm">{scene.duration}s</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={downloadVideo}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download MP4</span>
                  </button>
                  <button
                    onClick={shareCommercial}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Video</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Video className="w-24 h-24 mb-6 opacity-50" />
                <p className="text-xl font-medium mb-2">Ready to Create Your Commercial?</p>
                <p className="text-center">Fill in your business details and let AI create a professional video commercial for you!</p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Canvas for Export */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a 
            href="/dashboard" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium text-lg"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default CreateCommercial;
