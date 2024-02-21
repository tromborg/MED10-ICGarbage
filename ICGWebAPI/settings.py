import os

RABBITMQ_CONNECTIONSTRING = os.environ.get('RABBITMQ_CONNECTIONSTRING')
REDIS_CONNECTIONSTRING = os.environ.get('REDIS_CONNECTIONSTRING')
APIKEY = os.environ.get('APIKEY')
WEB_URL = os.environ.get('WEB_URL')
WEB_ENDPOINT = os.environ.get('WEB_ENDPOINT')
try:
    from local_settings import *
except ImportError:
    pass