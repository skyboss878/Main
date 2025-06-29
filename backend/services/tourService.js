// services/tourService.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const PuterService = require('./puterService');

class TourService {
  constructor() {
    this.outputPath = path.join(__dirname, '../uploads/tours');
    this.tempPath = path.join(__dirname, '../temp');
  }

  async create360Tour(roomVideos, options = {}) {
    try {
      const tourId = `tour_${Date.now()}`;
      const outputDir = path.join(this.outputPath, tourId);
      await fs.mkdir(outputDir, { recursive: true });

      // Process each room video
      const processedRooms = [];
      for (let i = 0; i < roomVideos.length; i++) {
        const roomData = await this.processRoomVideo(roomVideos[i], i, outputDir);
        processedRooms.push(roomData);
      }

      // Generate tour narration
      const narration = await PuterService.generateText(
        `Create a welcoming virtual tour narration for a ${options.propertyType || 'property'}.
         Include: Welcome message, room highlights, key features, closing call-to-action.
         Rooms: ${processedRooms.map(r => r.name).join(', ')}.
         Tone: Professional but friendly, emphasizing unique selling points.`
      );

      // Generate narration audio
      const voiceBuffer = await PuterService.generateVoice(narration, {
        voice: 'nova'
      });
      
      const narrationFile = path.join(outputDir, 'narration.mp3');
      await fs.writeFile(narrationFile, voiceBuffer);

      // Create tour manifest
      const tourManifest = {
        id: tourId,
        title: options.title || 'Virtual Tour',
        description: options.description || 'Interactive 360° property tour',
        rooms: processedRooms,
        narration: narration,
        narrationFile: 'narration.mp3',
        createdAt: new Date().toISOString(),
        settings: {
          autoplay: options.autoplay || false,
          showControls: options.showControls !== false,
          allowFullscreen: options.allowFullscreen !== false
        }
      };

      await fs.writeFile(
        path.join(outputDir, 'manifest.json'),
        JSON.stringify(tourManifest, null, 2)
      );

      // Generate tour viewer HTML
      await this.generateTourViewer(tourId, tourManifest);

      return {
        tourId,
        viewerUrl: `/tours/${tourId}/viewer.html`,
        manifest: tourManifest,
        embedCode: this.generateEmbedCode(tourId)
      };
    } catch (error) {
      console.error('360 tour creation error:', error);
      throw error;
    }
  }

  async processRoomVideo(videoPath, index, outputDir) {
    const roomId = `room_${index}`;
    const roomDir = path.join(outputDir, roomId);
    await fs.mkdir(roomDir, { recursive: true });

    // Extract frames for 360° viewer
    const framesDir = path.join(roomDir, 'frames');
    await fs.mkdir(framesDir, { recursive: true });

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-vf', 'fps=1/2', // Extract frame every 2 seconds
          '-q:v', '2' // High quality
        ])
        .output(path.join(framesDir, 'frame_%03d.jpg'))
        .on('end', async () => {
          try {
            // Get room info using AI
            const roomInfo = await this.analyzeRoom(videoPath);
            
            const roomData = {
              id: roomId,
              name: roomInfo.name,
              description: roomInfo.description,
              highlights: roomInfo.highlights,
              framesPath: `${roomId}/frames`,
              videoPath: path.basename(videoPath),
              hotspots: roomInfo.hotspots || []
            };

            await fs.writeFile(
              path.join(roomDir, 'info.json'),
              JSON.stringify(roomData, null, 2)
            );

            resolve(roomData);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject)
        .run();
    });
  }

  async analyzeRoom(videoPath) {
    // Use AI to analyze the room and generate descriptions
    const analysisPrompt = `Analyze this room video and provide:
      1. Room name/type (bedroom, kitchen, living room, etc.)
      2. Brief description highlighting key features
      3. 3-5 notable highlights or selling points
      4. Suggested hotspot locations for interactive elements
      
      Format as JSON: {
        "name": "Room Name",
        "description": "Brief description",
        "highlights": ["highlight1", "highlight2", "highlight3"],
        "hotspots": [{"x": 0.3, "y": 0.4, "label": "Feature name", "description": "Detail"}]
      }`;

    try {
      const analysis = await PuterService.generateText(analysisPrompt);
      return JSON.parse(analysis);
    } catch (error) {
      // Fallback if AI analysis fails
      return {
        name: `Room ${Date.now()}`,
        description: 'Beautiful room with great features',
        highlights: ['Spacious layout', 'Natural lighting', 'Modern design'],
        hotspots: []
      };
    }
  }

  async generateTourViewer(tourId, manifest) {
    const viewerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${manifest.title} - Virtual Tour</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #000; color: white; overflow: hidden; }
        
        .tour-container { position: relative; width: 100vw; height: 100vh; }
        
        .room-viewer { 
            width: 100%; 
            height: 100%; 
            background-size: cover; 
            background-position: center;
            cursor: grab;
            position: relative;
        }
        
        .room-viewer:active { cursor: grabbing; }
        
        .controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            padding: 15px 30px;
            border-radius: 50px;
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .room-nav {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.8);
            padding: 20px;
            border-radius: 10px;
            max-width: 300px;
        }
        
        .room-list { list-style: none; }
        .room-item {
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
            margin: 5px 0;
            transition: background 0.3s;
        }
        .room-item:hover { background: rgba(255,255,255,0.1); }
        .room-item.active { background: rgba(66, 153, 225, 0.5); }
        
        .hotspot {
            position: absolute;
            width: 30px;
            height: 30px;
            background: rgba(66, 153, 225, 0.8);
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            animation: pulse 2s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .info-panel {
            position: absolute;
            right: 20px;
            top: 20px;
            background: rgba(0,0,0,0.9);
            padding: 20px;
            border-radius: 10px;
            max-width: 350px;
            transform: translateX(100%);
            transition: transform 0.3s;
        }
        
        .info-panel.open { transform: translateX(0); }
        
        .play-btn, .pause-btn, .fullscreen-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 10px;
            border-radius: 5px;
            transition: background 0.3s;
        }
        
        .play-btn:hover, .pause-btn:hover, .fullscreen-btn:hover {

// services/tourService.js (continued)
            background: rgba(255,255,255,0.1);
        }
        
        .audio-controls {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="tour-container">
        <div class="room-viewer" id="roomViewer"></div>
        
        <div class="room-nav">
            <h3>Tour Navigation</h3>
            <ul class="room-list" id="roomList"></ul>
        </div>
        
        <div class="controls">
            <button class="play-btn" id="playBtn">▶️</button>
            <button class="pause-btn" id="pauseBtn" style="display:none;">⏸️</button>
            <button class="fullscreen-btn" id="fullscreenBtn">⛶</button>
        </div>
        
        <div class="audio-controls">
            <audio id="narrationAudio" controls>
                <source src="narration.mp3" type="audio/mpeg">
            </audio>
        </div>
        
        <div class="info-panel" id="infoPanel">
            <h3 id="roomTitle">Room Title</h3>
            <p id="roomDescription">Room description will appear here</p>
            <ul id="roomHighlights"></ul>
        </div>
    </div>

    <script>
        const manifest = ${JSON.stringify(manifest)};
        let currentRoom = 0;
        let isPlaying = false;
        let currentFrame = 0;
        
        class TourViewer {
            constructor() {
                this.init();
            }
            
            init() {
                this.setupRoomNavigation();
                this.setupControls();
                this.loadRoom(0);
                this.startAutoPlay();
            }
            
            setupRoomNavigation() {
                const roomList = document.getElementById('roomList');
                manifest.rooms.forEach((room, index) => {
                    const li = document.createElement('li');
                    li.className = 'room-item' + (index === 0 ? ' active' : '');
                    li.textContent = room.name;
                    li.onclick = () => this.loadRoom(index);
                    roomList.appendChild(li);
                });
            }
            
            setupControls() {
                document.getElementById('playBtn').onclick = () => this.play();
                document.getElementById('pauseBtn').onclick = () => this.pause();
                document.getElementById('fullscreenBtn').onclick = () => this.toggleFullscreen();
                
                // Mouse/touch controls for 360° view
                let isDragging = false;
                let lastX = 0;
                const viewer = document.getElementById('roomViewer');
                
                viewer.onmousedown = (e) => {
                    isDragging = true;
                    lastX = e.clientX;
                };
                
                document.onmousemove = (e) => {
                    if (isDragging) {
                        const deltaX = e.clientX - lastX;
                        this.rotateView(deltaX);
                        lastX = e.clientX;
                    }
                };
                
                document.onmouseup = () => {
                    isDragging = false;
                };
            }
            
            loadRoom(index) {
                currentRoom = index;
                const room = manifest.rooms[index];
                
                // Update active room in navigation
                document.querySelectorAll('.room-item').forEach((item, i) => {
                    item.classList.toggle('active', i === index);
                });
                
                // Load room frames
                this.loadRoomFrames(room);
                
                // Update info panel
                this.updateInfoPanel(room);
                
                // Load hotspots
                this.loadHotspots(room);
            }
            
            loadRoomFrames(room) {
                const viewer = document.getElementById('roomViewer');
                // In a real implementation, you'd load the 360° image sequence
                viewer.style.backgroundImage = \`url(\${room.framesPath}/frame_001.jpg)\`;
            }
            
            updateInfoPanel(room) {
                document.getElementById('roomTitle').textContent = room.name;
                document.getElementById('roomDescription').textContent = room.description;
                
                const highlights = document.getElementById('roomHighlights');
                highlights.innerHTML = '';
                room.highlights.forEach(highlight => {
                    const li = document.createElement('li');
                    li.textContent = highlight;
                    highlights.appendChild(li);
                });
            }
            
            loadHotspots(room) {
                // Clear existing hotspots
                document.querySelectorAll('.hotspot').forEach(h => h.remove());
                
                // Add new hotspots
                room.hotspots.forEach((hotspot, index) => {
                    const spot = document.createElement('div');
                    spot.className = 'hotspot';
                    spot.innerHTML = '!';
                    spot.style.left = (hotspot.x * 100) + '%';
                    spot.style.top = (hotspot.y * 100) + '%';
                    spot.onclick = () => this.showHotspotInfo(hotspot);
                    document.getElementById('roomViewer').appendChild(spot);
                });
            }
            
            showHotspotInfo(hotspot) {
                alert(\`\${hotspot.label}: \${hotspot.description}\`);
                // In production, use a proper modal/tooltip
            }
            
            play() {
                isPlaying = true;
                document.getElementById('playBtn').style.display = 'none';
                document.getElementById('pauseBtn').style.display = 'block';
                document.getElementById('narrationAudio').play();
            }
            
            pause() {
                isPlaying = false;
                document.getElementById('playBtn').style.display = 'block';
                document.getElementById('pauseBtn').style.display = 'none';
                document.getElementById('narrationAudio').pause();
            }
            
            toggleFullscreen() {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            }
            
            rotateView(deltaX) {
                // Simulate 360° rotation
                currentFrame += Math.floor(deltaX / 10);
                const room = manifest.rooms[currentRoom];
                const frameCount = 36; // Assuming 36 frames for 360°
                const frameIndex = ((currentFrame % frameCount) + frameCount) % frameCount + 1;
                const framePath = \`\${room.framesPath}/frame_\${frameIndex.toString().padStart(3, '0')}.jpg\`;
                document.getElementById('roomViewer').style.backgroundImage = \`url(\${framePath})\`;
            }
            
            startAutoPlay() {
                if (manifest.settings.autoplay) {
                    setTimeout(() => this.play(), 1000);
                }
            }
        }
        
        // Initialize tour viewer
        new TourViewer();
    </script>
</body>
</html>`;

    const viewerPath = path.join(this.outputPath, tourId, 'viewer.html');
    await fs.writeFile(viewerPath, viewerHTML);
  }

  generateEmbedCode(tourId) {
    return `<iframe src="/tours/${tourId}/viewer.html" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
  }
}

module.exports = new TourService();
