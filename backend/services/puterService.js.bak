const axios = require('axios');

class PuterService {
  constructor() {
    this.baseUrl = 'https://api.puter.com/v1';
    this.appName = process.env.PUTER_APP_NAME;
  }

  async generateText(prompt, options = {}) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/chat`, {
        message: prompt,
        model: options.model || 'gpt-4o',
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
          'App-Name': this.appName
        }
      });

      return response.data.choices[0]?.message?.content;
    } catch (error) {
      console.error('Puter text generation error:', error);
      throw new Error('Failed to generate text');
    }
  }

  async generateImage(prompt, options = {}) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/image`, {
        prompt,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'natural'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'App-Name': this.appName
        }
      });

      return response.data.data[0].url;
    } catch (error) {
      console.error('Puter image generation error:', error);
      throw new Error('Failed to generate image');
    }
  }

  async generateVoice(text, options = {}) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/speech`, {
        input: text,
        voice: options.voice || 'alloy',
        model: 'tts-1',
        response_format: 'mp3'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'App-Name': this.appName
        },
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Puter voice generation error:', error);
      throw new Error('Failed to generate voice');
    }
  }

  async generateVisionDescription(prompt, imageUrl, model = 'gpt-4o') {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/chat`, {
        message: prompt,
        image_url: imageUrl,
        model
      }, {
        headers: {
          'Content-Type': 'application/json',
          'App-Name': this.appName
        }
      });

      return response.data.choices[0]?.message?.content;
    } catch (error) {
      console.error('Puter vision description error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generateHashtags(prompt, count = 10) {
    try {
      const response = await axios.post(`${this.baseUrl}/ai/chat`, {
        message: `Generate ${count} viral hashtags for: ${prompt}. Return only the hashtags, separated by spaces.`,
        model: 'gpt-4o',
        max_tokens: 150,
        temperature: 0.9
      }, {
        headers: {
          'Content-Type': 'application/json',
          'App-Name': this.appName
        }
      });

      const raw = response.data.choices[0]?.message?.content || '';
      const tags = raw.match(/#[\w\d_]+/g) || [];
      return tags.slice(0, count);
    } catch (error) {
      console.error('Puter hashtag generation error:', error);
      throw new Error('Failed to generate hashtags');
    }
  }
}

module.exports = new PuterService();
