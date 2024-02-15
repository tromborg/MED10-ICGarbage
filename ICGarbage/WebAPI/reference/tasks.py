import base64
import json
import cv2
import numpy as np
import io
import urllib3
from ImagePredictor import ImagePredictor
from UrlController import UrlController
from celery import shared_task
from PIL import Image
from functools import cache
import settings

@cache
def load_vtr_model():
    model = ImagePredictor()
    return model


@cache
def load_url_controller():
    url_controller = UrlController()
    return url_controller

def return_task_response(res):
    url = settings.EBAS_URL
    endpoint = settings.EBAS_ENDPOINT
    http = urllib3.PoolManager()
    print("Returning images to job manager...")
    r = http.request('POST', f'{url}{endpoint}', headers={"Content-Type": "application/json"}, body=res)
    #req = urllib.request.Request(f'{url}/ebasblur', data={res}, headers={"Content-Type": "application/json"})

def decode_request(req):
    encoded = req["image"]
    image_id = req["imageId"]
    vtr_id = req["vtrId"]
    first_letter = req["firstLetter"]
    decoded = base64.b64decode(encoded)
    imgStream = io.BytesIO(decoded)
    img = Image.open(imgStream)
    return img, image_id, vtr_id, first_letter


@shared_task(bind=True, ignore_result=False)
def blurLP(self, req):
    print("[+] request received")
    try:
        vtrCheck = load_vtr_model()
        image, image_id, vtr_id, first_letter = decode_request(req)
        print("[+] request decoded")
        np_img = np.array(image)
        cv_img = cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR)
        blurredImg, is_face, is_lp = vtrCheck.check_image(cv_img, image_id, vtr_id)
        color_converted = cv2.cvtColor(blurredImg, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(color_converted)
        buffer = io.BytesIO()
        pil_image.save(buffer, format="JPEG")
        img_str = base64.b64encode(buffer.getvalue())
        print("[+] request encoded")
        response = {'response': str(img_str) + "!",
                    'is_face': is_face,
                    'is_lp': is_lp,
                    'task_id': self.request.id,
                    'image_id': image_id,
                    'vtr_id': vtr_id,
                    'first_letter': first_letter}
        json_res = json.dumps(response)
        #print("JSON response: ", json_res)
        # Return POST request til ebas endpoint
        return return_task_response(json_res.encode())

    except Exception as err:
        print(f"Error: {err}")


@shared_task(bind=True, ignore_result=False)
def check_vtr_errors(self, url):
    missing_markers = 0
    missing_images = 0
    url_controller = load_url_controller()
    missing_images += url_controller.get_grid_images(url)
    missing_markers += url_controller.check_marker_count(url)
    response = {
        'missing_markers': missing_markers,
        'missing_images': missing_images,
        'task_id': self.request.id
    }
    return response


@shared_task(ignore_result=False)
def temp():
    return {'res': "Hello Celeryman!"}
