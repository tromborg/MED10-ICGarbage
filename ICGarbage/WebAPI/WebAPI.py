from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import urllib3

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
@app.route('/uploadvid', methods=['POST'])
def upload():
    UPLOAD_FOLDER = 'uploads'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if 'video' not in request.files:
        return 'No file part', 400

    video_file = request.files['video']
    print(video_file.filename)
    print(video_file.name)
    print(video_file.headers)
    print(video_file.stream)
    print(video_file.content_type)
    if video_file.filename == '':
        return 'No selected file', 400

    # Save the received chunk to the server
    video_file.save(os.path.join(UPLOAD_FOLDER, video_file.filename))
    response = jsonify({'some': 'data'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)