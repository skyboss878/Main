// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // NEW
// ... other imports

import { AuthProvider } from './contexts/AuthContext';

// --- Import all your page components ---
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// --- Import all your Creator Tool pages ---
import VideoGenerator from './pages/VideoGenerator';
import SocialMediaCreator from './pages/SocialMediaCreator';
import TourCreatorPage from './pages/TourCreatorPage';
import RestaurantPromoCreator from './pages/RestaurantPromoCreator';
import BlogCreator from './pages/BlogCreator';
import FlyerGenerator from './pages/FlyerGenerator';
import TextToImage from './pages/TextToImage';
import FoodPromos from './pages/FoodPromos';
import RealEstateTour from './pages/RealEstateTour';
import CreateCommercial from './pages/CreateCommercial';
import TextToVideo from './pages/TextToVideo';
import ImageToImage from './pages/ImageToImage';
import Upgrade from './pages/Upgrade';

// --- NEW: Import AI-specific pages that match your backend ---
import CaptionGenerator from './pages/CaptionGenerator'; // For /api/caption
import VoiceGenerator from './pages/VoiceGenerator';     // For /api/voice
import AIServices from './pages/AIServices';             // For /api/services

function App() {
  return (
    <Router>
      <AuthProvider> {/* NEW: Wrap with AuthProvider */}
        <Navbar />
        <Routes>
          {/* ... your routes */}
        </Routes>
      </AuthProvider> {/* NEW */}
      <Toaster position="bottom-right" />
    </Router>
  );
}

          {/* --- Main App Routes --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/upgrade" element={<Upgrade />} />

          {/* --- Creator Tool Routes --- */}
          {/* These paths MUST match the 'route' values in your Dashboard.jsx */}
          <Route path="/create/video-generator" element={<VideoGenerator />} />
          <Route path="/create/social-media-creator" element={<SocialMediaCreator />} />
          <Route path="/create/tour-creator" element={<TourCreatorPage />} />
          <Route path="/create/restaurant-promo-creator" element={<RestaurantPromoCreator />} />
          <Route path="/create/blog-creator" element={<BlogCreator />} />
          <Route path="/create/flyer-generator" element={<FlyerGenerator />} />
          <Route path="/create/text-to-image" element={<TextToImage />} />
          <Route path="/create/food-promos" element={<FoodPromos />} />
          <Route path="/create/real-estate-tour" element={<RealEstateTour />} />
          <Route path="/create/create-commercial" element={<CreateCommercial />} />
          <Route path="/create/text-to-video" element={<TextToVideo />} />
          <Route path="/create/image-to-image" element={<ImageToImage />} />

          {/* --- NEW: AI Service Routes (matching your backend APIs) --- */}
          <Route path="/create/caption-generator" element={<CaptionGenerator />} />
          <Route path="/create/voice-generator" element={<VoiceGenerator />} />
          <Route path="/ai-services" element={<AIServices />} />

          {/* --- Catch-all for 404 --- */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;





