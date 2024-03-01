import os

RABBITMQ_CONNECTIONSTRING = os.environ.get('RABBITMQ_CONNECTIONSTRING')
REDIS_CONNECTIONSTRING = os.environ.get('REDIS_CONNECTIONSTRING')
APIKEY = os.environ.get('APIKEY')
WEB_URL = os.environ.get('WEB_URL')
WEB_ENDPOINT = os.environ.get('WEB_ENDPOINT')
PG_USER = os.environ.get('PG_USER')
PG_PASSWORD = os.environ.get('PG_PASSWORD')
PG_HOST = os.environ.get('PG_HOST')
PG_PORT = os.environ.get('PG_PORT')
PG_DATABASE = os.environ.get('PG_DATABASE')

try:
    from local_settings import *
except ImportError:
    pass