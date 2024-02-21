import base64
import json
import cv2
import numpy as np
import io
import urllib3
from celery import shared_task
from PIL import Image
from functools import cache
import settings
from ICG_Analysis import ICGAnalysis

@cache
def load_icg_instance():
    # instantiate models and cache their instances
    icg_instance = ICGAnalysis()
    return icg_instance

def return_task_response(res):
    url = settings.WEB_URL
    endpoint = settings.WEB_ENDPOINT
    http = urllib3.PoolManager()
    print("Returning response to web app...")
    r = http.request('POST', f'{url}{endpoint}', headers={"Content-Type": "application/json"}, body=res)
    #req = urllib.request.Request(f'{url}/ebasblur', data={res}, headers={"Content-Type": "application/json"})

@shared_task(bind=True, ignore_result=False)
def video_analysis(self, filepath):
    print("[+] request received")

    try:
        icg = load_icg_instance()
        task_id = self.request.id
        print(filepath)
        response = {'response': "resss"}
        json_res = json.dumps(response)
        print("[+] request handled for task: ", task_id)
        return task_id #return_task_response(json_res.encode())

    except Exception as err:
        print(f"Error: {err}")


@shared_task(ignore_result=False)
def temp():
    return {'res': "Hello Celeryman!"}