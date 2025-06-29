from flask import Blueprint, request, jsonify

ai_routes = Blueprint('ai_routes', __name__)

@ai_routes.route('/api/text-to-video', methods=['POST'])
def generate_text_to_video():
    data = request.get_json()
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    # Replace this with actual AI video logic later
    sample_video = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
    
    return jsonify({ "video_url": sample_video })
