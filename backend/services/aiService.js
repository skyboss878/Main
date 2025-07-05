// backend/services/aiService.js
const axios = require('axios');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const puterService = require('./puterService'); // <--- ADDED: Import Puter Service

class AIService {
  constructor() {
    // API Keys
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    this.replicateApiKey = process.env.REPLICATE_API_KEY;
    this.stabilityApiKey = process.env.STABILITY_API_KEY;

    // API Endpoints
    this.elevenLabsEndpoint = 'https://api.elevenlabs.io/v1';
    this.replicateEndpoint = 'https://api.replicate.com/v1';
    this.stabilityEndpoint = 'https://api.stability.ai';

    // Initialize OpenAI
    this.openai = null; // Initialize to null
    if (this.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiApiKey
      });
    }

    // Reference to PuterService <--- ADDED: Puter service instance
    this.puterService = puterService;

    // Setup temp directory
    this.tempPath = path.join(__dirname, '../temp');
    this.ensureTempDirectory();
  }

  async ensureTempDirectory() {
    try {
      await fs.mkdir(this.tempPath, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  // Generate text using selected provider
  async generateText(prompt, options = {}) {
    const provider = options.provider || 'openai'; // Default to openai

    try {
      let generatedText;
      switch (provider) {
        case 'openai':
          console.log('🤖 Generating text using OpenAI for:', prompt.substring(0, 100) + '...');
          if (!this.openaiApiKey || !this.openai) {
            throw new Error('OpenAI API key not configured or client not initialized');
          }
          const openaiResponse = await this.openai.chat.completions.create({
            model: options.model || 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: options.systemPrompt || 'You are a helpful AI assistant that creates engaging content.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7
          });
          generatedText = openaiResponse.choices[0].message.content;
          break;
        case 'puter':
          console.log('🤖 Generating text using PuterService for:', prompt.substring(0, 100) + '...');
          const puterOptions = {
            model: options.model,
            maxTokens: options.maxTokens,
            temperature: options.temperature
          };
          generatedText = await this.puterService.generateText(prompt, puterOptions);
          break;
        default:
          throw new Error(`Unsupported text generation provider: ${provider}`);
      }
      console.log(`✅ Text generated successfully with ${provider}`);
      return generatedText;
    } catch (error) {
      console.error(`❌ Text generation error (${provider}):`, error.response?.data || error.message);
      throw new Error(`Text generation failed (${provider}): ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Generate image using selected provider
  async generateImage(prompt, options = {}) {
    const provider = options.provider || 'openai'; // Default to openai

    try {
      let imageUrl;
      let filePath;
      switch (provider) {
        case 'openai':
          console.log('🎨 Generating image using OpenAI DALL-E for:', prompt.substring(0, 100) + '...');
          if (!this.openaiApiKey || !this.openai) {
            throw new Error('OpenAI API key not configured or client not initialized');
          }
          const openaiResponse = await this.openai.images.generate({
            model: options.model || 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: options.size || '1024x1024',
            quality: options.quality || 'standard'
          });
          imageUrl = openaiResponse.data[0].url;
          break;
        case 'puter':
          console.log('🎨 Generating image using PuterService for:', prompt.substring(0, 100) + '...');
          const puterOptions = {
            size: options.size,
            quality: options.quality,
            style: options.style
          };
          imageUrl = await this.puterService.generateImage(prompt, puterOptions);
          break;
        default:
          throw new Error(`Unsupported image generation provider: ${provider}`);
      }

      // Download and save the image regardless of provider if a URL is returned
      if (imageUrl) {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data);
        const fileName = `${provider}_img_${Date.now()}.png`;
        filePath = path.join(this.tempPath, fileName);
        await fs.writeFile(filePath, imageBuffer);
        console.log(`✅ Image generated successfully with ${provider}:`, filePath);
        return filePath;
      } else {
        throw new Error('No image URL returned from the AI service.');
      }
    } catch (error) {
      console.error(`❌ Image generation error (${provider}):`, error.response?.data || error.message);
      throw new Error(`Image generation failed (${provider}): ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Generate voice using selected provider
  async generateVoice(text, options = {}) {
    const provider = options.provider || 'elevenlabs'; // Default to elevenlabs

    try {
      let audioBuffer;
      switch (provider) {
        case 'elevenlabs':
          console.log('🎤 Generating voice using ElevenLabs for text length:', text.length);
          if (!this.elevenLabsApiKey) {
            throw new Error('ElevenLabs API key not configured');
          }
          const elevenlabsVoiceId = options.voiceId || 'pNInz6obpgDQGcFmaJgB';
          const elevenlabsResponse = await axios.post(
            `${this.elevenLabsEndpoint}/text-to-speech/${elevenlabsVoiceId}`,
            {
              text: text,
              model_id: options.model || 'eleven_monolingual_v1',
              voice_settings: {
                stability: options.stability || 0.5,
                similarity_boost: options.similarityBoost || 0.5
              }
            },
            {
              headers: {
                'xi-api-key': this.elevenLabsApiKey,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
              },
              responseType: 'arraybuffer'
            }
          );
          audioBuffer = Buffer.from(elevenlabsResponse.data);
          break;
        case 'puter':
          console.log('🎤 Generating voice using PuterService for text length:', text.length);
          const puterOptions = {
            voice: options.voice,
            model: options.model
          };
          audioBuffer = await this.puterService.generateVoice(text, puterOptions);
          break;
        default:
          throw new Error(`Unsupported voice generation provider: ${provider}`);
      }

      const fileName = `${provider}_voice_${Date.now()}.mp3`;
      const filePath = path.join(this.tempPath, fileName);
      await fs.writeFile(filePath, audioBuffer);
      console.log(`✅ Voice generated successfully with ${provider}:`, filePath);
      return filePath;
    } catch (error) {
      console.error(`❌ Voice generation error (${provider}):`, error.response?.data || error.message);
      throw new Error(`Voice generation failed (${provider}): ${error.response?.data?.message || error.message}`);
    }
  }

  // Get available voices from ElevenLabs
  async getAvailableVoices() {
    try {
      console.log('🎤 Fetching available voices from ElevenLabs...');

      if (!this.elevenLabsApiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await axios.get(`${this.elevenLabsEndpoint}/voices`, {
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Voices fetched successfully');
      return response.data.voices || [];
    } catch (error) {
      console.error('❌ Error fetching voices:', error.response?.data || error.message);
      throw new Error(`Failed to fetch voices: ${error.response?.data?.message || error.message}`);
    }
  }

  // Generate video using Replicate
  async generateVideo(prompt, options = {}) {
    try {
      console.log('🎬 Generating AI video for:', prompt.substring(0, 100) + '...');

      if (!this.replicateApiKey) {
        throw new Error('Replicate API key not configured');
      }

      const response = await axios.post(
        `${this.replicateEndpoint}/predictions`,
        {
          version: options.model || 'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
          input: {
            prompt: prompt,
            width: options.width || 1024,
            height: options.height || 576,
            num_frames: options.frames || 24,
            num_inference_steps: options.steps || 50
          }
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Video generation started:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Video generation error:', error.response?.data || error.message);
      throw new Error(`Video generation failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  // Get video generation status
  async getVideoStatus(predictionId) {
    try {
      if (!this.replicateApiKey) {
        throw new Error('Replicate API key not configured');
      }

      const response = await axios.get(
        `${this.replicateEndpoint}/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${this.replicateApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error getting video status:', error.response?.data || error.message);
      throw new Error(`Failed to get video status: ${error.response?.data?.detail || error.message}`);
    }
  }

  // Image to Image transformation
  async imageToImage(imagePath, prompt, options = {}) {
    try {
      console.log('🖼️ Processing image-to-image for:', prompt.substring(0, 100) + '...');

      // Note: This current implementation of imageToImage still uses generateImage (which now supports Puter).
      // If you need a more advanced image-to-image using a specific AI's features,
      // you would add a switch here for providers similar to other methods.
      // For now, it delegates to generateImage, which will use the provider specified in options.
      const enhancedPrompt = `${prompt}. Style and composition similar to the provided reference image.`;
      return await this.generateImage(enhancedPrompt, options); // options can now include { provider: 'puter' }
    } catch (error) {
      console.error('❌ Image-to-image error:', error.message);
      throw new Error(`Image-to-image failed: ${error.message}`);
    }
  }

  // Caption generation for images
  async generateCaption(imagePath, options = {}) {
    try {
      console.log('📝 Generating caption for image:', imagePath);

      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }
      // Read image file
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: options.prompt || 'Generate a descriptive caption for this image.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: options.maxTokens || 300
      });

      const caption = response.choices[0].message.content;
      console.log('✅ Caption generated successfully');
      return caption;
    } catch (error) {
      console.error('❌ Caption generation error:', error.response?.data || error.message);
      throw new Error(`Caption generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // NEW: Puter-specific Vision Description <--- ADDED: Puter-only methods
  async generateVisionDescription(prompt, imageUrl, model = 'gpt-4o') {
    console.log('👀 Generating vision description using PuterService...');
    return await this.puterService.generateVisionDescription(prompt, imageUrl, model);
  }

  // NEW: Puter-specific Hashtag Generation <--- ADDED: Puter-only methods
  async generateHashtags(prompt, count = 10) {
    console.log('✨ Generating hashtags using PuterService...');
    return await this.puterService.generateHashtags(prompt, count);
  }
}

module.exports = new AIService();
