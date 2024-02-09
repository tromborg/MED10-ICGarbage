import cv2
import numpy as np
from collections import Counter
from skimage.morphology import area_opening
from skimage.morphology import area_closing
from skimage.measure import label, regionprops_table
import pandas as pd
from pixellib.torchbackend.instance import instanceSegmentation
from ultralytics import YOLO
from Calibration import Calibration
from WasteExtraction import WasteExtraction


def getROI(currentFrame):
    leftRegionIMG = currentFrame[int(currentFrame.shape[0] / 2):currentFrame.shape[0], 0:int(currentFrame.shape[1] / 2)]
    rightRegionIMG = currentFrame[int(currentFrame.shape[0] / 2): currentFrame.shape[0],
                     int(currentFrame.shape[1] / 2):currentFrame.shape[1]]

    return leftRegionIMG, rightRegionIMG


# Takes a mask and an image to make a new image, that is just the mask of the original image.
def maskOff(inputImg, mask):
    newImg1 = np.zeros((inputImg.shape[0], inputImg.shape[1], 3), np.uint8)
    for y in range(inputImg.shape[0]):
        for x in range(inputImg.shape[1]):
            if mask[y][x] == 255:
                newImg1[y][x] = inputImg[y][x]
            else:
                newImg1[y][x] = 0
    return newImg1


# draws the flow of the image, dont really understand it.
def draw_flow(img, flow, step=16):
    h, w = img.shape[:2]
    y, x = np.mgrid[step / 2:h:step, step / 2:w:step].reshape(2, -1).astype(int)
    fx, fy = flow[y, x].T

    lines = np.vstack([x, y, x - fx, y - fy]).T.reshape(-1, 2, 2)
    lines = np.int32(lines + 0.5)

    img_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    cv2.polylines(img_bgr, lines, 0, (0, 255, 0))

    for (x1, y1), (_x2, _y2) in lines:
        cv2.circle(img_bgr, (x1, y1), 1, (0, 255, 0), -1)

    return img_bgr


if __name__ == '__main__':
    # ---VARIABLES---#
    frameCount = 0
    check = True
    cap = cv2.VideoCapture('mergedPark.mp4')
    ret, frame = cap.read()
    fiftyFrame = []
    we = WasteExtraction()
    ca = Calibration()
    model = YOLO("best.pt")
    isCalibrating = True
    # ---VARIABLES---#
    while cap.isOpened():
        frameCount += 1
        ret, frame = cap.read()
        cv2.imshow('current', frame)
        left, right = getROI(frame)
        fiftyFrame.append(frame)

        if frameCount > 150:
            if frameCount > 200:
                fiftyFrame.pop(0)
            if frameCount > 150 and frameCount < 500:
                we.calibrate(frame)
                ca.calibrate(frame, frameCount)
            if frameCount > 500:
                print(frameCount)
                # if statement used to make sure the code in the if statement only gets run once.
                if check:
                    left_bbox, right_bbox, erodeF2, maskedRightPrevGray = we.end_calibration(frame)
                    leftYTop1, leftXTop1, leftYBottom1, leftXBottom1 = left_bbox
                    rightYTop1, rightXTop1, rightYBottom1, rightXBottom1 = right_bbox
                    check = False

                dfRight, new_prev_gray = we.opticalFlowHSV(right_img=right, right_bbox=right_bbox, erodeF2=erodeF2, maskedRightPrevGray=maskedRightPrevGray)
                maskedRightPrevGray = new_prev_gray
                we.closing_event_handler(dfRight=dfRight, fiftyFrame=fiftyFrame, leftBottomX1=leftXBottom1, rightTopX1=rightXTop1, model=model)

                # shows some images
                #cv2.imshow('hsvtreshRight', flowThreshRight)
                #cv2.imshow('flowRight', draw_flow(maskedRightGray, flow2))

        if cv2.waitKey(1) == ord('s'):
            break

    cap.release()
    cv2.destroyAllWindows()
