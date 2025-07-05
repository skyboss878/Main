// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import your components
import Header from './components/Header';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Upgrade from './pages/Upgrade';
import MyCreations from './pages/MyCreations';

// Creator Tool Components
import VideoGenerator from './components/VideoGenerator';
import SocialMediaCreator from './components/SocialMediaCreator';
import TourCreatorPage from './pages/TourCreatorPage';
import RestaurantPromoCreator from './components/RestaurantPromoCreator';
import BlogCreator from './components/BlogCreator';
import FlyerGenerator from './pages/FlyerGenerator';
import TextToImage from './components/TextToImage';
import FoodPromos from './components/FoodPromos';
import RealEstateTour from './components/RealEstateTour';
import CreateCommercial from './components/CreateCommercial';
import TextToVideo from './components/TextToVideo';
import ImageRefinement from './components/ImageRefinement';
import CaptionGenerator from './components/CaptionGenerator';
import VoiceGenerator from './components/VoiceGenerator';
import AIServices from './pages/AIServices';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* --- Main App Routes --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/my-creations" element={<MyCreations />} />
          <Route path="/ai-services" element={<AIServices />} />

          {/* --- Creator Tool Routes --- */}
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
          <Route path="/create/image-refinement" element={<ImageRefinement />} />
          <Route path="/create/caption-generator" element={<CaptionGenerator />} />
          <Route path="/create/voice-generator" element={<VoiceGenerator />} />

          {/* --- Catch-all for 404 --- */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
