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
    upload_done = False
    UPLOAD_FOLDER = 'uploads'
    if 'videochunk' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['videochunk']
    print(file.filename)
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    chunk = request.files['videochunk'].read()
    info_string = file.filename.split(',')
    filename = info_string[0]
    print("filename: ", filename)
    print("chunknum: ", info_string[1])
    print("total: ", info_string[2])
    print(info_string)
    chunk_num = int(info_string[1].split(':')[1].strip())
    total_chunks = int(info_string[2].split(':')[1].strip())
    # Create a file if it does not exist and append chunks
    with open(os.path.join(UPLOAD_FOLDER, filename), 'ab') as f:
        f.write(chunk)

    # If all chunks are received, finalize the file
    if chunk_num == total_chunks - 1:
        final_filename = os.path.join(UPLOAD_FOLDER, filename)
        os.rename(os.path.join(UPLOAD_FOLDER, filename), final_filename)
        upload_done = True
        return jsonify({'message': 'File uploaded successfully',
                        'filename': final_filename, 'chunk_num': chunk_num,
                        'total_chunks': total_chunks, 'upload_done': upload_done}), 200


    return jsonify({'chunk_num': chunk_num, 'total_chunks': total_chunks, 'upload_done': upload_done}), 200


if __name__ == '__main__':
    app.run(debug=True)
