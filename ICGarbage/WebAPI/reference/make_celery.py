import functools
import flask
import settings
from WebAPI import create_app
from WebAPI.reference import tasks
from flask import request, jsonify, Response
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


@flask_app.post('/blur')
@validate_key
def process_blur_request() -> dict[str, object]:
    req = request.get_json(force=True)
    response = tasks.blurLP.delay(req=req)

    return {"task_id": response.id}


@flask_app.get("/result/<task_id>")
@validate_key
def task_result(task_id: str) -> Response:
    result = celery_app.AsyncResult(id=task_id)

    return jsonify({
        "ready": result.ready(),
        "state": result.state,
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    })


@flask_app.post("/urlcheck")
@validate_key
def process_urlcheck_request() -> dict[str, object]:
    req = request.get_json(force=True)
    url = req['report']
    response = tasks.check_vtr_errors.delay(url=url)

    return {'task_id': response.id}

if __name__ == "__main__":
    flask_app.run(debug=False)
