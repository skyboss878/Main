#!/bin/bash
node workers/textWorker.js &
node workers/videoWorker.js &
node workers/voiceWorker.js &
node workers/allJobsWorker.js &
echo "✅ All workers and tracker started!"
