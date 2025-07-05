// Updated video service using consolidated API
import { videoApi } from '../utils/api';

export const generateSocialVideo = async ({ prompt, category, image }) => {
  return await videoApi.generateSocialVideo({ prompt, category, image });
};

export const generateProductVideo = async ({ prompt, productImages = [], options }) => {
  return await videoApi.generateProductVideo({ prompt, productImages, options });
};

export const getVideoStatus = async (videoId) => {
  return await videoApi.getVideoStatus(videoId);
};

// Re-export for backward compatibility
export { videoApi as default };



