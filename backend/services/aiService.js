// services/aiService.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.stabilityApiKey = process.env.STABILITY_API_KEY;
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    this.replicateApiKey = process.env.REPLICATE_API_KEY;

    this.openaiEndpoint = 'https://api.openai.com/v1';
    this.stabilityEndpoint = 'https://api.stability.ai/v1';
    this.elevenLabsEndpoint = 'https://api.elevenlabs.io/v1';
    this.replicateEndpoint = 'https://api.replicate.com/v1';

    // Paths for temporary and permanent outputs
    this.tempPath = path.join(__dirname, '../temp'); // For temporary AI-generated outputs
    this.uploadsPath = path.join(__dirname, '../uploads'); // For final, user-facing outputs

    this.initDirectories();
  }

  async initDirectories() {
    try {
      await fs.mkdir(this.tempPath, { recursive: true });
      await fs.mkdir(this.uploadsPath, { recursive: true });
      // Create subdirectories within uploads if needed, e.g., for videos
      await fs.mkdir(path.join(this.uploadsPath, 'videos'), { recursive: true });
      console.log('✅ AI Service directories initialized');
    } catch (error) {
      console.error('❌ Failed to create AI directories:', error);
    }
  }

  // Generate text using OpenAI GPT
  async generateText(prompt, options = {}) {
    try {
      console.log('🤖 Generating text for:', prompt.substring(0, 100) + '...');

      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await axios.post(
        `${this.openaiEndpoint}/chat/completions`,
        {
          model: options.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: options.systemPrompt || 'You are a helpful AI assistant that creates engaging content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data.choices[0].message.content;
      console.log('✅ Text generated successfully');
      return generatedText;
    } catch (error) {
      console.error('❌ Text generation error:', error.response?.data || error.message);
      throw new Error(`Text generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Generate image using Stability AI or OpenAI DALL-E
  async generateImage(prompt, options = {}) {
    try {
      console.log('🎨 Generating image for:', prompt.substring(0, 100) + '...');

      // Try Stability AI first if key is available
      if (this.stabilityApiKey) {
        console.log('Using Stability AI for image generation.');
        return await this.generateImageStability(prompt, options);
      }

      // Fallback to OpenAI DALL-E if Stability AI not configured or preferred
      if (this.openaiApiKey) {
        console.log('Using OpenAI DALL-E for image generation.');
        return await this.generateImageOpenAI(prompt, options);
      }

      throw new Error('No image generation API keys configured (Stability AI or OpenAI)');
    } catch (error) {
      console.error('❌ Image generation orchestration error:', error.message);
      throw error;
    }
  }

  async generateImageStability(prompt, options = {}) {
    try {
      const response = await axios.post(
        `${this.stabilityEndpoint}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: options.cfgScale || 7,
          height: options.height || 1024,
          width: options.width || 1024,
          samples: 1,
          steps: options.steps || 30
        },
        {
          headers: {
            'Authorization': `Bearer ${this.stabilityApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.artifacts && response.data.artifacts.length > 0) {
        const imageData = response.data.artifacts[0].base64;
        const imageBuffer = Buffer.from(imageData, 'base64');

        const fileName = `stability_img_${Date.now()}.png`;
        const filePath = path.join(this.tempPath, fileName); // Save to temp
        await fs.writeFile(filePath, imageBuffer);

        console.log('✅ Image generated with Stability AI:', filePath);
        return filePath;
      }

      throw new Error('No image data received from Stability AI');
    } catch (error) {
      console.error('❌ Stability AI generation error:', error.response?.data || error.message);
      throw new Error(`Stability AI image generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async generateImageOpenAI(prompt, options = {}) {
    try {
      const response = await axios.post(
        `${this.openaiEndpoint}/images/generations`,
        {
          model: options.model || 'dall-e-2', // Use dall-e-3 if you have access and want higher quality
          prompt: prompt,
          n: 1,
          size: options.size || '1024x1024',
          response_format: 'url'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const imageUrl = response.data.data[0].url;

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data);

      const fileName = `dall_e_img_${Date.now()}.png`;
      const filePath = path.join(this.tempPath, fileName); // Save to temp
      await fs.writeFile(filePath, imageBuffer);

      console.log('✅ Image generated with OpenAI DALL-E:', filePath);
      return filePath;
    } catch (error) {
      console.error('❌ OpenAI image generation error:', error.response?.data || error.message);
      throw new Error(`OpenAI image generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Generate voice using ElevenLabs
  async generateVoice(text, options = {}) {
    try {
      console.log('🎤 Generating voice for text length:', text.length);

      if (!this.elevenLabsApiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const voiceId = options.voiceId || 'pNInz6obpgDQGcFmaJgB'; // Default: Bella
      const response = await axios.post(
        `${this.elevenLabsEndpoint}/text-to-speech/${voiceId}`,
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
            'Authorization': `Bearer ${this.elevenLabsApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      );

      const audioBuffer = Buffer.from(response.data);
      const fileName = `voice_${Date.now()}.mp3`;
      const filePath = path.join(this.tempPath, fileName); // Save to temp
      await fs.writeFile(filePath, audioBuffer);

      console.log('✅ Voice generated successfully:', filePath);
      return filePath;
    } catch (error) {
      console.error('❌ Voice generation error:', error.response?.data || error.message);
      throw new Error(`Voice generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Generate video using AI (Replicate)
  async generateVideo(prompt, options = {}) {
    try {
      console.log('🎬 Generating AI video for:', prompt.substring(0, 100) + '...');

      if (!this.replicateApiKey) {
        throw new Error('Replicate API key not configured for video generation');
      }
      // Using Zeroscope v2 XL model (a good general-purpose model)
      const response = await axios.post(
        `${this.replicateEndpoint}/predictions`,
        {
          version: "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", // Zeroscope v2 XL
          input: {
            prompt: prompt,
            num_frames: options.numFrames || 24,
            fps: options.fps || 8,
            model: options.model || "xl"
          }
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const predictionId = response.data.id;
      console.log('🎬 Video generation started, prediction ID:', predictionId);

      // Poll for completion
      const videoUrl = await this.pollVideoGeneration(predictionId);

      // Download the video from the Replicate URL
      const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const videoBuffer = Buffer.from(videoResponse.data);
      const fileName = `ai_video_${Date.now()}.mp4`;
      const filePath = path.join(this.tempPath, fileName); // Save to temp
      await fs.writeFile(filePath, videoBuffer);

      console.log('✅ AI video generated successfully:', filePath);
      return filePath;
    } catch (error) {
      console.error('❌ AI video generation error:', error.response?.data || error.message);
      throw new Error(`AI video generation failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  async pollVideoGeneration(predictionId, maxAttempts = 60, interval = 5000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get(
          `${this.replicateEndpoint}/predictions/${predictionId}`,
          {
            headers: {
              'Authorization': `Token ${this.replicateApiKey}`
            }
          }
        );
        const { status, output, error } = response.data;

        if (status === 'succeeded' && output) {
          console.log('✅ Video generation completed');
          return Array.isArray(output) ? output[0] : output;
        }

        if (status === 'failed') {
          throw new Error(`Video generation failed: ${error}`);
        }
        console.log(`⏳ Video generation in progress... (${attempt + 1}/${maxAttempts}) Status: ${status}`);
        await new Promise(resolve => setTimeout(resolve, interval)); // Wait 5 seconds
      } catch (error) {
        console.error('❌ Error polling video generation:', error.message);
        throw error;
      }
    }
    throw new Error('Video generation timed out');
  }

  // Enhanced script generation for videos
  async generateVideoScript(prompt, type = 'social', duration = 30) {
    try {
      console.log(`📝 Generating ${type} video script for ${duration}s`);

      let systemPrompt = '';
      let userPrompt = '';
      switch (type) {
        case 'social':
          systemPrompt = `You are a viral social media content creator. Create engaging, trendy scripts that hook viewers in the first 3 seconds and keep them watching.`;
          userPrompt = `Create a ${duration}-second social media video script for: "${prompt}".
Format the response as:
[Scene 1: Description of visual for 5s]
[Voice: Engaging hook/opening line for 5s]

[Scene 2: Description of visual for 10s]
[Voice: Main content for 10s]

[Scene 3: Description of visual for 15s]
[Voice: Call to action for 15s]

Make it trendy, engaging, and optimized for social media platforms.`;
          break;

        case 'commercial':
          systemPrompt = `You are a professional commercial scriptwriter. Create persuasive, clear scripts that communicate value propositions effectively.`;
          userPrompt = `Create a ${duration}-second commercial script for: "${prompt}".

Structure:
- Hook (0-5s): Attention grabber
- Problem (5-20s): Pain point identification
- Solution (20-50s): Product/service benefits
- CTA (50-60s): Clear call to action

Format with [Scene] and [Voice] tags for each segment, indicating estimated time.`;
          break;
        case 'explainer':
          systemPrompt = `You are an educational content creator. Make complex topics simple and engaging.`;
          userPrompt = `Create a ${duration}-second explainer video script for: "${prompt}".

Break down the topic into digestible segments with clear visual descriptions and easy-to-understand narration. Use [Scene] and [Voice] tags.`;
          break;

        default:
          systemPrompt = `You are a versatile video content creator.`;
          userPrompt = `Create a ${duration}-second video script for: "${prompt}".`;
      }

      const script = await this.generateText(userPrompt, {
        systemPrompt,
        maxTokens: 1500,
        temperature: 0.8
      });
      console.log('✅ Video script generated successfully');
      return script;
    } catch (error) {
      console.error('❌ Script generation error:', error.message);
      throw error;
    }
  }

  // Generate trending hashtags
  async generateHashtags(prompt, platform = 'general', count = 20) {
    try {
      console.log(`🏷️ Generating ${count} hashtags for ${platform}`);
      const hashtagPrompt = `Generate ${count} trending and relevant hashtags for this content: "${prompt}".

Platform: ${platform}
Requirements:
- Mix of popular and niche hashtags
- Include trending hashtags if relevant
- Avoid banned or problematic hashtags
- Focus on discoverability and engagement

Return as a comma-separated list without # symbols.`;
      const hashtagsText = await this.generateText(hashtagPrompt, {
        maxTokens: 500,
        temperature: 0.6
      });

      const hashtags = hashtagsText
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0)
        .slice(0, count);
      console.log('✅ Hashtags generated:', hashtags.length);
      return hashtags;
    } catch (error) {
      console.error('❌ Hashtag generation error:', error.message);
      return [];
    }
  }

  // Clean up temporary files
  async cleanupTempFiles(maxAge = 3600000) { // 1 hour default
    try {
      const files = await fs.readdir(this.tempPath);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.tempPath, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log('🗑️ Cleaned up old temp file:', file);
        }
      }
    } catch (error) {
      console.error('❌ Cleanup error:', error.message);
    }
  }

  // Get available voices for TTS
  async getAvailableVoices() {
    try {
      if (!this.elevenLabsApiKey) {
        console.warn('ElevenLabs API key not configured, cannot fetch voices.');
        return [];
      }

      const response = await axios.get(`${this.elevenLabsEndpoint}/voices`, {
        headers: {
          'Authorization': `Bearer ${this.elevenLabsApiKey}`
        }
      });

      return response.data.voices.map(voice => ({
        id: voice.voice_id,
        name: voice.name,
        gender: voice.labels?.gender || 'unknown',
        accent: voice.labels?.accent || 'unknown'
      }));
    } catch (error) {
      console.error('❌ Error fetching voices from ElevenLabs:', error.response?.data || error.message);
      return [];
    }
  }

  // Helper to parse scripts from generateVideoScript (moved from VideoService)
  parseVideoScript(script) {
    const scenes = [];
    const lines = script.split('\n').filter(line => line.trim());
    let currentScene = null;

    for (const line of lines) {
      if (line.includes('[Scene') && line.includes(']')) {
        const sceneMatch = line.match(/\[Scene[^:]*:\s*(.*?)\]/i);
        if (sceneMatch) {
            if (currentScene) {
                scenes.push(currentScene);
            }
            currentScene = {
                description: sceneMatch[1].trim(),
                voiceover: ''
            };
        }
      } else if (line.includes('[Voice') && line.includes(']')) {
        const voiceMatch = line.match(/\[Voice[^:]*:\s*(.*?)\]/i);
        if (voiceMatch && currentScene) {
          currentScene.voiceover = voiceMatch[1].trim();
        }
      } else if (currentScene && line.trim() && !line.includes('[')) {
        currentScene.voiceover += ' ' + line.trim(); // Append additional lines as part of voiceover
      }
    }
    if (currentScene) {
      scenes.push(currentScene);
    }
    // Fallback if no specific scene/voice tags were parsed
    if (scenes.length === 0) {
      scenes.push({
        description: 'Generic scene related to the content',
        voiceover: script.replace(/\[.*?\]/g, '').trim() // Use the whole script as voiceover
      });
    }
    console.log('✅ Parsed scenes from script:', scenes.length);
    return scenes;
  }
}

module.exports = new AIService();























