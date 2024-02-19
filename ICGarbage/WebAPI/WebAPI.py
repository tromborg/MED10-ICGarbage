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
def upload_file():
    UPLOAD_FOLDER = 'uploads'
    if 'videochunk' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['videochunk']
    print(file.filename)
    print(file.name)
    print(file.headers)
    print(file.stream)
    print(file.content_type)
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    chunk = request.files['videochunk'].read()
    filename = file.filename
    chunk_num = int(request.args.get('chunk', 0))
    total_chunks = int(request.args.get('total_chunks', 1))
    print("chunk num", chunk_num)
    print("total_chunks", total_chunks)
    # Create a file if it does not exist and append chunks
    with open(os.path.join(UPLOAD_FOLDER, filename), 'ab') as f:
        f.write(chunk)

    # If all chunks are received, finalize the file
    if chunk_num == total_chunks - 1:
        final_filename = os.path.join(UPLOAD_FOLDER, filename)
        os.rename(os.path.join(UPLOAD_FOLDER, filename), final_filename)
        return jsonify({'message': 'File uploaded successfully',
                        'filename': final_filename}), 200

    return jsonify({'message': f'Chunk {chunk_num + 1} of {total_chunks} uploaded successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)