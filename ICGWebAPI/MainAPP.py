import functools
import os
import settings
from src.task_app import tasks
from src.task_app import create_app
import flask
from flask import request, jsonify

flask_app = create_app()
celery_app = flask_app.extensions["celery"]

def validate_key(f):
    @functools.wraps(f)
    def wrap(*args, **kwargs):
        KEY = settings.APIKEY

        if not request.headers['APIKey']:
            print("API KEY MISSING")
            return flask.abort(400)

        header = request.headers['APIKey']
        if KEY == header:
            return f(*args, **kwargs)

        if KEY != header:
            print("API KEY WRONG")
            return flask.abort(400)

    return wrap
@flask_app.get('/')
def test() -> dict[str, object]:
    result = tasks.temp.delay()
    return {"result_id": result.id}

@flask_app.post('/uploadvid')
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
    if chunk_num == total_chunks:
        final_filename = os.path.join(UPLOAD_FOLDER, filename)
        os.rename(os.path.join(UPLOAD_FOLDER, filename), final_filename)
        print("Renamed file: ", final_filename)
        upload_done = True
        response = tasks.video_analysis.delay(final_filename)
        return jsonify({'message': 'File uploaded successfully',
                        'filename': final_filename, 'chunk_num': chunk_num,
                        'total_chunks': total_chunks, 'upload_done': upload_done, "task_id": response.id}), 200


    return jsonify({'chunk_num': chunk_num, 'total_chunks': total_chunks, 'upload_done': upload_done}), 200


def start_icg_analysis(filename):
    path = filename
    print('Starting ICG analysis for: ', path)


if __name__ == '__main__':
    flask_app.run(debug=False)
