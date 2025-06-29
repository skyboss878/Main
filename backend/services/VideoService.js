// services/VideoService.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const AIService = require('./aiService'); // Use our AI service

// Set FFmpeg path for Termux (only once) - IMPORTANT: Adjust if not Termux
ffmpeg.setFfmpegPath('/data/data/com.termux/files/usr/bin/ffmpeg');
ffmpeg.setFfprobePath('/data/data/com.termux/files/usr/bin/ffprobe');

class VideoService {
  constructor() {
    this.outputPath = path.join(__dirname, '../uploads/videos'); // Final video outputs
    this.tempPath = path.join(__dirname, '../temp'); // Temporary assets (images, audio)
    this.initDirectories();
  }

  async initDirectories() {
    try {
      await fs.mkdir(this.outputPath, { recursive: true });
      await fs.mkdir(this.tempPath, { recursive: true });
      console.log('✅ Video directories initialized');
    } catch (error) {
      console.error('❌ Failed to create video directories:', error);
    }
  }

  async generateSocialMediaVideo(prompt, options = {}) {
    try {
      console.log('📹 Starting social media video generation for:', prompt.substring(0, 50) + '...');

      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt is required and cannot be empty');
      }

      const videoId = `social_${Date.now()}`;
      const outputFile = path.join(this.outputPath, `${videoId}.mp4`);

      // --- Step 1: Generate Script (always needed for video structure) ---
      console.log('📝 Generating script...');
      const script = await AIService.generateVideoScript(prompt, options.videoStyle || 'social', options.duration || 30);
      console.log('🎬 Generated script:', script);

      const scenes = AIService.parseVideoScript(script); // Use AIService's parser
      if (scenes.length === 0) {
          throw new Error("Failed to parse any scenes from the generated script. Cannot create video.");
      }
      console.log('🎭 Parsed scenes:', scenes.length);

      // --- Step 2: Generate Images for Scenes ---
      const imagePaths = [];
      for (let i = 0; i < Math.min(scenes.length, 5); i++) { // Limit to 5 images for social videos
        const scene = scenes[i];
        console.log(`🖼️ Generating image ${i + 1}/${scenes.length} for scene: "${scene.description.substring(0, 30)}..."`);
        try {
          const imagePath = await AIService.generateImage(
            `${scene.description}, trending social media style, vibrant colors, high quality, 16:9 aspect ratio`
          );
          imagePaths.push(imagePath);
          console.log(`✅ Image ${i + 1} generated:`, imagePath);
        } catch (imageError) {
          console.warn(`❌ Failed to generate image ${i + 1} for scene "${scene.description.substring(0, 30)}...": ${imageError.message}. Skipping this image.`);
        }
      }

      if (imagePaths.length === 0) {
        throw new Error('No images were generated successfully for the video. Cannot create video without visuals.');
      }

      // --- Step 3: Generate Voiceover (if enabled or specified) ---
      let voiceFile = null;
      let generatedVoiceoverText = '';
      if (options.voiceover) {
        generatedVoiceoverText = options.voiceover.text || scenes.map(s => s.voiceover).filter(Boolean).join(' '); // Use custom text or generated script voiceovers
        if (generatedVoiceoverText.trim()) {
          console.log('🎤 Generating voiceover...');
          voiceFile = await AIService.generateVoice(generatedVoiceoverText, {
            voiceId: options.voiceover.voiceId || 'pNInz6obpgDQGcFmaJgB', // Default voice
            stability: 0.6,
            similarityBoost: 0.8
          });
          console.log('✅ Voiceover saved:', voiceFile);
        } else {
            console.log('Voiceover requested, but no text provided or generated. Skipping voiceover.');
        }
      }

      // --- Step 4: Add Background Music (Mock for now) ---
      let musicInfo = null;
      if (options.music) {
        // In a real app, you'd integrate with a music library API or generate AI music
        musicInfo = {
            id: options.music.trackId,
            name: MOCK_MUSIC_OPTIONS.find(m => m.id === options.music.trackId)?.name || 'Custom Music'
        };
        // For now, we don't have a real music file to pass to ffmpeg, so this is just metadata.
        // If you had music files, you'd fetch them here and pass to createVideoFromAssets.
        console.log(`🎶 Adding mock music: ${musicInfo.name}`);
      }

      // --- Step 5: Generate Captions/Text Overlays (Logic for this needs to be applied by ffmpeg filters) ---
      let captionsToOverlay = [];
      if (options.captions) {
        if (options.captions.customText && options.captions.customText.trim()) {
            captionsToOverlay = options.captions.customText.split('\n').map(line => line.trim()).filter(Boolean);
            console.log('💬 Using custom captions.');
        } else {
            // Generate captions based on the script or voiceover text
            const textForCaptions = generatedVoiceoverText || script;
            if (textForCaptions.trim()) {
                const generatedCaptionsRaw = await AIService.generateText(
                    `Generate concise captions for a video based on this content: "${textForCaptions}". Format as short, distinct lines, suitable for on-screen display.`,
                    { maxTokens: 500 }
                );
                captionsToOverlay = generatedCaptionsRaw.split('\n').map(line => line.trim()).filter(Boolean);
                console.log('💬 AI-generated captions:', captionsToOverlay.length, 'lines');
            }
        }
      }

      // --- Step 6: Generate Hashtags ---
      let hashtags = [];
      if (options.hashtags) {
        console.log('🏷️ Generating hashtags...');
        hashtags = await AIService.generateHashtags(prompt, 'instagram', options.hashtags.count || 15);
        console.log('✅ Hashtags generated:', hashtags.length);
      }

      // --- Step 7: Generate Description ---
      let description = '';
      if (options.description) {
        console.log('✍️ Generating description...');
        const descriptionPrompt = `Write an ${options.description.tone || 'engaging'} social media video description for content about: "${prompt}". Make it compelling, with a call to action, and fit for platforms like Instagram/TikTok. Max 500 characters.`;
        description = await AIService.generateText(descriptionPrompt, { maxTokens: 100, temperature: 0.7 }); // Keep short for social
        console.log('✅ Description generated.');
      }

      // --- Step 8: Create Video from Assets ---
      console.log('🎬 Creating video from assets...');
      await this.createVideoFromAssets(
        imagePaths,
        voiceFile,
        outputFile,
        {
          duration: options.duration || 30,
          style: options.videoStyle || 'social',
          captions: captionsToOverlay, // Pass captions to ffmpeg
          captionStyle: options.captions?.style || 'dynamic' // Pass caption style
          // In future, pass musicFile if real music integration is done
        }
      );

      console.log('✅ Social media video generation completed');
      return {
        videoUrl: `/uploads/videos/${videoId}.mp4`,
        script,
        hashtags,
        description,
        musicInfo, // Metadata about music used
        duration: options.duration || 30,
        type: options.videoStyle || 'social'
      };
    } catch (error) {
      console.error('❌ Social media video generation error:', error);
      throw error;
    }
  }

  async generateCommercialVideo(prompt, options = {}) {
    try {
      console.log('📺 Starting commercial video generation for:', prompt.substring(0, 50) + '...');

      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt is required and cannot be empty');
      }

      const videoId = `commercial_${Date.now()}`;
      const outputFile = path.join(this.outputPath, `${videoId}.mp4`);

      console.log('📝 Generating commercial script...');
      const script = await AIService.generateVideoScript(prompt, 'commercial', options.duration || 60);
      console.log('🎬 Generated commercial script:', script);

      const scenes = AIService.parseVideoScript(script);
      if (scenes.length === 0) {
          throw new Error("Failed to parse any scenes from the generated script. Cannot create commercial video.");
      }
      console.log('🎭 Parsed scenes:', scenes.length);

      const imagePaths = [];
      for (let i = 0; i < Math.min(scenes.length, 6); i++) { // Limit to 6 images for commercials
        const scene = scenes[i];
        console.log(`🖼️ Generating commercial image ${i + 1}/${scenes.length} for scene: "${scene.description.substring(0, 30)}..."`);
        try {
          const imagePath = await AIService.generateImage(
            `${scene.description}, professional commercial photography, cinematic lighting, high-end production value, 4K quality`,
            { quality: 'hd', style: 'cinematic' }
          );
          imagePaths.push(imagePath);
          console.log(`✅ Commercial image ${i + 1} generated:`, imagePath);
        } catch (imageError) {
          console.warn(`❌ Failed to generate commercial image ${i + 1} for scene "${scene.description.substring(0, 30)}...": ${imageError.message}. Skipping this image.`);
        }
      }

      if (imagePaths.length === 0) {
        throw new Error('No commercial images were generated successfully for the video.');
      }

      console.log('🎤 Generating professional voiceover...');
      const voiceText = scenes.map(s => s.voiceover).filter(Boolean).join(' ');
      let voiceFile = null;
      if (voiceText.trim()) {
        voiceFile = await AIService.generateVoice(voiceText, {
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Daniel - Professional voice
          stability: 0.5,
          similarityBoost: 0.7
        });
        console.log('✅ Professional voiceover saved:', voiceFile);
      } else {
          console.log('No voiceover text generated for commercial. Proceeding without audio.');
      }

      console.log('🎬 Creating commercial video...');
      await this.createVideoFromAssets(imagePaths, voiceFile, outputFile, {
        duration: options.duration || 60,
        style: 'commercial'
      });

      console.log('✅ Commercial video generation completed');
      return {
        videoUrl: `/uploads/videos/${videoId}.mp4`,
        script,
        duration: options.duration || 60,
        type: 'commercial'
      };
    } catch (error) {
      console.error('❌ Commercial video generation error:', error);
      throw error;
    }
  }

  async generateProductShowcase(prompt, productImages = [], options = {}) {
    try {
      console.log('🛍️ Starting product showcase generation for:', prompt.substring(0, 50) + '...');
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt is required and cannot be empty');
      }
      const videoId = `product_${Date.now()}`;
      const outputFile = path.join(this.outputPath, `${videoId}.mp4`);

      console.log('📝 Generating product script...');
      const script = await AIService.generateVideoScript(
        `Product showcase for: ${prompt}. Highlight features, benefits, and call-to-action.`,
        'explainer',
        options.duration || 45
      );
      console.log('🎬 Generated product script:', script);
      const scenes = AIService.parseVideoScript(script);
      if (scenes.length === 0) {
          throw new Error("Failed to parse any scenes from the generated script. Cannot create product showcase video.");
      }

      let imagePaths = [];

      // Use provided product images if available
      // For a production ready app, if productImages are URLs, you'd download them first
      if (productImages && productImages.length > 0) {
        console.log('📸 Using provided product images:', productImages.length);
        // Assuming productImages are already local file paths accessible by FFmpeg
        // If they are URLs, you'd need a helper to download them to tempPath:
        // for (const imageUrl of productImages) {
        //   const tempImgPath = await this.downloadUrlToTemp(imageUrl);
        //   imagePaths.push(tempImgPath);
        // }
        imagePaths = productImages; // Assuming these are valid local paths
      } else {
        // Generate product showcase images if no external ones provided
        console.log('🖼️ Generating product showcase images...');
        for (let i = 0; i < Math.min(scenes.length, 4); i++) {
          const scene = scenes[i];
          try {
            const imagePath = await AIService.generateImage(
              `${scene.description}, product photography, clean background, professional lighting, e-commerce style`
            );
            imagePaths.push(imagePath);
            console.log(`✅ Product image ${i + 1} generated:`, imagePath);
          } catch (imageError) {
            console.warn(`❌ Failed to generate product image ${i + 1} for scene "${scene.description.substring(0, 30)}...": ${imageError.message}. Skipping this image.`);
          }
        }
      }

      if (imagePaths.length === 0) {
        throw new Error('No product images available or generated for showcase. Cannot create video without visuals.');
      }

      console.log('🎤 Generating product voiceover...');
      const voiceText = scenes.map(s => s.voiceover).filter(Boolean).join(' ');
      let voiceFile = null;
      if (voiceText.trim()) {
        voiceFile = await AIService.generateVoice(voiceText, {
          voiceId: 'pNInz6obpgDQGcFmaJgB', // Bella
          stability: 0.4,
          similarityBoost: 0.8
        });
        console.log('✅ Product voiceover saved:', voiceFile);
      } else {
          console.log('No voiceover text generated for product showcase. Proceeding without audio.');
      }

      console.log('🎬 Creating product showcase video...');
      await this.createVideoFromAssets(imagePaths, voiceFile, outputFile, {
        duration: options.duration || 45,
        style: 'product'
      });

      console.log('✅ Product showcase generation completed');
      return {
        videoUrl: `/uploads/videos/${videoId}.mp4`,
        script,
        duration: options.duration || 45,
        type: 'product'
      };
    } catch (error) {
      console.error('❌ Product showcase generation error:', error);
      throw error;
    }
  }

  async createVideoFromAssets(imagePaths, audioFile, outputFile, options = {}) {
    return new Promise((resolve, reject) => {
      console.log('🎬 Starting FFmpeg process to create video...');
      console.log(`Images: ${imagePaths.length}, Audio: ${audioFile ? 'Yes' : 'No'}, Output: ${outputFile}`);

      if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
          return reject(new Error("No valid image paths provided for video creation."));
      }

      const targetDuration = options.duration || 30; // Total video duration
      const singleImageDuration = targetDuration / imagePaths.length; // Duration for each image slide

      let command = ffmpeg();

      // Add images as inputs with a loop and duration for each
      imagePaths.forEach((imagePath, index) => {
        command = command.input(imagePath).inputOptions([
          '-loop', '1',
          '-t', singleImageDuration.toString() // Set duration for each image
        ]);
      });

      // Add audio file if provided
      if (audioFile) {
        command = command.input(audioFile);
      }

      // Generate FFmpeg complex filters for scaling, transitions, and captions
      const complexFilters = this.getVideoFilters(
          options.style,
          imagePaths.length,
          singleImageDuration,
          options.captions,
          options.captionStyle
      );

      command
        .complexFilter(complexFilters)
        .outputOptions([
          '-map', '[final_video]', // Map the named output video stream
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p', // Pixel format for broad compatibility
          '-r', '30', // Frame rate (30fps)
          '-preset', 'medium', // Encoding preset (faster=larger, slower=smaller)
          '-crf', '23', // Constant Rate Factor (lower=higher quality, larger file)
          '-movflags', 'faststart', // Enable streaming playback for web
          '-y' // Overwrite output file
        ]);

      // Add audio map and options only if audio file exists
      if (audioFile) {
          command.outputOptions([
              '-map', '[final_audio]', // Map the named output audio stream
              '-c:a', 'aac',
              '-b:a', '128k', // Audio bitrate
              '-shortest' // Finish encoding when the shortest input stream ends (usually audio)
          ]);
      }

      command
        .output(outputFile)
        .on('start', (commandLine) => {
          console.log('🎬 FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          if (progress.percent !== undefined) {
              console.log(`📊 FFmpeg progress: ${Math.round(progress.percent)}% done`);
          }
        })
        .on('end', () => {
          console.log('✅ Video processing finished successfully.');
          this.cleanupTempFiles(imagePaths, audioFile); // Clean up temp assets
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('❌ FFmpeg error:', err.message);
          console.error('FFmpeg stdout:', stdout);
          console.error('FFmpeg stderr:', stderr);
          this.cleanupTempFiles(imagePaths, audioFile); // Clean up temp assets even on error
          reject(new Error(`Video creation failed: ${err.message}. Check backend logs for more details.`));
        })
        .run();
    });
  }

  // Helper to clean up specific temp files after processing
  async cleanupTempFiles(imagePaths, audioFile) {
    try {
      // Remove images
      for (const imagePath of imagePaths) {
        // Only delete if it's a temporary file we created in the temp directory
        if (path.dirname(imagePath) === this.tempPath) {
          await fs.unlink(imagePath).catch(e => console.warn(`Could not delete temp image ${imagePath}: ${e.message}`));
        }
      }
      // Remove audio
      if (audioFile && path.dirname(audioFile) === this.tempPath) {
        await fs.unlink(audioFile).catch(e => console.warn(`Could not delete temp audio ${audioFile}: ${e.message}`));
      }
      console.log('🗑️ Cleaned up temporary video assets.');
    } catch (error) {
      console.error('❌ Error during video asset cleanup:', error.message);
    }
  }

  getVideoFilters(style, imageCount, singleImageDuration, captions = [], captionStyle = 'dynamic') {
    console.log(`🎨 Creating ${style} filters for ${imageCount} images, each ${singleImageDuration.toFixed(2)}s`);
    const filters = [];
    const outputResolution = "1920x1080"; // Standard HD for all videos
    const fps = 30; // Frames per second for zoompan duration

    // Step 1: Scale and pad all images
    for (let i = 0; i < imageCount; i++) {
      filters.push(`[${i}:v]scale=${outputResolution}:force_original_aspect_ratio=decrease,pad=${outputResolution}:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}]`);
    }

    // Step 2: Apply style-specific effects (zoompan, transitions)
    let concatenatedVideoInput = '';
    let finalVideoChain = '';

    if (imageCount === 1) {
        // If only one image, apply any style effects directly and label it for final concatenation.
        switch (style) {
            case 'product':
                const zoomPanEffect = `zoompan=z='min(zoom+0.0005,1.5)':d=${Math.round(singleImageDuration * fps)}:s=${outputResolution}`;
                filters.push(`[v0]${zoomPanEffect}[final_styled_video]`);
                break;
            case 'social': // Apply a subtle, continuous pan/zoom for single social image
                const socialPanZoom = `zoompan=z='min(zoom+0.0002,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.round(singleImageDuration * fps)}:s=${outputResolution}`;
                filters.push(`[v0]${socialPanZoom}[final_styled_video]`);
                break;
            case 'commercial': // Static for commercial single image
            default:
                filters.push(`[v0]setsar=1[final_styled_video]`);
                break;
        }
        finalVideoChain = '[final_styled_video]';
    } else {
        // For multiple images, apply transitions and then concatenate
        let xfadeChains = [];
        let currentOutputLabel = `v0_processed`;
        filters.push(`[v0]setsar=1[${currentOutputLabel}]`); // Initial processed image

        for (let i = 0; i < imageCount - 1; i++) {
            const nextInputLabel = `v${i+1}`;
            const nextOutputLabel = `v${i+1}_processed`;
            const transitionOutput = `xfade_out${i}`;
            const transitionDuration = style === 'commercial' ? 0.7 : 0.5; // Commercial has slower transitions
            const transitionType = style === 'commercial' ? (i % 2 === 0 ? 'dissolve' : 'slideleft') : 'fade';
            const offset = (i + 1) * singleImageDuration - transitionDuration;

            // Apply zoompan if style is 'product' to each individual image stream before xfade
            let styleFilterForNext = `setsar=1`;
            if (style === 'product') {
                const zoomPanEffect = `zoompan=z='min(zoom+0.0005,1.5)':d=${Math.round(singleImageDuration * fps)}:s=${outputResolution}`;
                styleFilterForNext = `${zoomPanEffect},setsar=1`;
            } else if (style === 'social') {
                 const socialPanZoom = `zoompan=z='min(zoom+0.0002,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.round(singleImageDuration * fps)}:s=${outputResolution}`;
                styleFilterForNext = `${socialPanZoom},setsar=1`;
            }

            filters.push(`[${nextInputLabel}]${styleFilterForNext}[${nextOutputLabel}]`); // Apply style filter to next image

            // Crossfade current processed image with the next processed image
            xfadeChains.push(`[${currentOutputLabel}][${nextOutputLabel}]xfade=transition=${transitionType}:duration=${transitionDuration}:offset=${offset}[${transitionOutput}]`);
            currentOutputLabel = transitionOutput; // The output of this xfade becomes the input for the next
        }
        filters.push(...xfadeChains); // Add all xfade filter strings
        finalVideoChain = `[${currentOutputLabel}]`; // The final output from the last xfade
    }

    // Step 3: Add captions/text overlays
    let finalOutputVideoLabel = 'final_video';
    if (captions && captions.length > 0) {
        const drawtextFilters = [];
        let currentCaptionOffset = 0; // Time offset for captions

        for (let i = 0; i < captions.length; i++) {
            const captionText = captions[i].replace(/'/g, "\\'"); // Escape single quotes for ffmpeg
            let x = '(w-text_w)/2'; // Center horizontally
            let y = 'h-th-20'; // Bottom of screen, 20px padding

            let fontcolor = 'white';
            let box = 1;
            let boxcolor = 'black@0.5';
            let fontsize = '48';
            let bold = 1; // 1 for bold, 0 for normal
            let enable = `enable='between(t,${currentCaptionOffset},${currentCaptionOffset + singleImageDuration})'`; // Show caption for each image duration

            switch (captionStyle) {
                case 'dynamic':
                    fontsize = '60';
                    fontcolor = 'yellow';
                    box = 1;
                    boxcolor = 'black@0.7';
                    y = 'h*0.8'; // Higher up
                    break;
                case 'minimal':
                    fontsize = '40';
                    fontcolor = 'white';
                    box = 0;
                    y = 'h-th-10'; // Closer to bottom
                    break;
                case 'classic':
                default: // Uses defaults defined above
                    break;
            }
            // Add an outline for better readability
            let bordercolor = 'black';
            let borderw = '2';

            // Calculate a simple duration for each caption line (can be refined with actual voiceover timing)
            const captionDuration = singleImageDuration; // Display each caption line for duration of its scene image

            drawtextFilters.push(
                `drawtext=text='${captionText}':x=${x}:y=${y}:fontfile=/system/fonts/Roboto-Regular.ttf:fontsize=${fontsize}:fontcolor=${fontcolor}:bordercolor=${bordercolor}:borderw=${borderw}:box=${box}:boxcolor=${boxcolor}:fix_bounds=true:enable='between(t,${currentCaptionOffset},${currentCaptionOffset + captionDuration})'`
            );
            currentCaptionOffset += captionDuration;
        }

        // Apply all drawtext filters to the final video chain
        filters.push(`${finalVideoChain}${drawtextFilters.map(f => `,${f}`).join('')}[${finalOutputVideoLabel}]`);
    } else {
        finalOutputVideoLabel = finalVideoChain.replace('[', '').replace(']', ''); // Use the video stream from previous step directly
    }


    // Final output maps
    // [0:v], [1:v]... are video inputs, [imageCount]:a is the audio input (if present)
    // If captions were added, the video stream is now named [final_video].
    // If no captions, it's whatever the concatenated/xfaded output was, so we map that.
    // We also need a placeholder for final_audio if there's no audio input
    if (audioFile) {
         // If there's an audio file, it's the (imageCount)th input
        // and we map the audio directly as the final_audio output stream.
        filters.push(`[${imageCount}:a]anull[final_audio]`); // Simplest audio pass-through
    } else {
        // If no audio file, create a silent audio stream (or let ffmpeg handle it)
        // A simple way is to not map an audio input, which will result in a silent video.
        // For explicitly ensuring an audio stream exists (even if silent), more filters would be needed.
        // For now, if no audioFile, ffmpeg will default to no audio output stream, which is fine.
    }

    console.log('✅ Full FFmpeg complex filter array:', filters.map(f => f.split('[')[0].substring(0, 100) + '...'));
    return filters;
  }
}

// MOCK Music Options (for frontend display) - ideally fetched from a backend service later
const MOCK_MUSIC_OPTIONS = [
  { id: 'upbeat_pop', name: 'Upbeat Pop' },
  { id: 'inspirational_ambient', name: 'Inspirational Ambient' },
  { id: 'energetic_electronic', name: 'Energetic Electronic' },
  { id: 'no_music', name: 'No Music' },
];


module.exports = new VideoService();
