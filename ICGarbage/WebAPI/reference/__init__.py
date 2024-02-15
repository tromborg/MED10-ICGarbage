from celery import Celery, Task
from flask import Flask
import settings

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_mapping(
        CELERY=dict(
            broker=f"{settings.RABBITMQ_CONNECTIONSTRING}",
            backend=f"{settings.REDIS_CONNECTIONSTRING}",
            include=[f'{app.name}.tasks'],
        ),
    )
    app.config.from_prefixed_env()
    celery_init_app(app)
    print(f"Broker: {settings.RABBITMQ_CONNECTIONSTRING}")
    print(f"Backend: {settings.REDIS_CONNECTIONSTRING}")
    return app

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name,
        broker=f"{settings.RABBITMQ_CONNECTIONSTRING}",
        backend=f"{settings.REDIS_CONNECTIONSTRING}",
        include=[f'{app.name}.tasks'],
    )
    celery_app.conf.CELERY_IGNORE_RESULT = False
    celery_app.conf.CELERY_TASK_RESULT_EXPIRES = 1800
    celery_app.conf.CELERY_RESULT_PERSISTENT = True
    celery_app.config_from_object(app.config["CELERY"])


    celery_app.Task = FlaskTask
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
