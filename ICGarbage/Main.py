import cv2
import numpy as np
from collections import Counter
from skimage.morphology import area_opening
from skimage.morphology import area_closing
from skimage.measure import label, regionprops_table
import pandas as pd
from pixellib.torchbackend.instance import instanceSegmentation

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


# Optical flow function that maps opencv optical flow function outputs to hsv values for a visual image.
def draw_hsv(flow):
    h, w = flow.shape[:2]
    fx, fy = flow[:, :, 0], flow[:, :, 1]

    ang = np.arctan2(fy, fx) + np.pi
    v = np.sqrt(fx * fx + fy * fy)

    hsv = np.zeros((h, w, 3), np.uint8)
    hsv[..., 0] = ang * (180 / np.pi / 2)
    hsv[..., 1] = 255
    hsv[..., 2] = np.minimum(v * 4, 255)
    bgr = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    return bgr


if __name__ == '__main__':
    # ---VARIABLES---#
    frameCount = 0
    calibrating = True
    check = True
    cap = cv2.VideoCapture('GL010031.mp4')
    ret, frame = cap.read()
    closing = False
    closeCounter = 0
    closeTimer = 0
    movement = False
    movementTimer = 0
    stillClosedBool = False
    imNum = 0
    fiftyFrame = []
    minBoundingVal = 0
    fakeCloseCounter = 0
    properties = ['area', 'bbox', 'bbox_area']
    ins = instanceSegmentation()
    we = WasteExtraction()
    ins.load_model("pointrend_resnet50.pkl", confidence=0.2)
    # ---VARIABLES---#
    while cap.isOpened():
        frameCount += 1
        ret, frame = cap.read()
        cv2.imshow('current', frame)
        left, right = getROI(frame)
        fiftyFrame.append(frame)

        if frameCount > 150:
            if frameCount > 150 and frameCount < 500:
                we.calibrate(frame)

            if frameCount > 500:
                print(frameCount)
                fiftyFrame.pop(0)
                # if statement used to make sure the code in the if statement only gets run once.
                if check:
                    left_bbox, right_bbox, erodeF2, maskedRightPrevGray = we.end_calibration(frame)
                    leftYTop1, leftXTop1, leftYBottom1, leftXBottom1 = left_bbox
                    rightYTop1, rightXTop1, rightYBottom1, rightXBottom1 = right_bbox
                    check = False

                # Making ROI's again, this time in the while loop so it keeps updating, and not just doing it onee as once again, we need it for the
                # optical flow function
                roiLeft = left[leftYTop1:leftYBottom1 + 1, leftXTop1:leftXBottom1 + 1]
                roiRight = right[rightYTop1:rightYBottom1 + 1, rightXTop1:rightXBottom1 + 1]

                # New maskoff, only difference is this is agai in the while loop, so it keeps updating.
                maskedRight = maskOff(roiRight, erodeF2)
                # Gray version again, needed for optical flow
                maskedRightGray = cv2.cvtColor(maskedRight, cv2.COLOR_BGR2GRAY)

                # The optical flow function! Uses gray images of the current frame and the frame from just before
                flow2 = cv2.calcOpticalFlowFarneback(maskedRightPrevGray, maskedRightGray, None, 0.5, 3, 25, 3, 5, 1.2,
                                                     0)
                # Sets the previous frame to the current so it is ready for the next frame.
                maskedRightPrevGray = maskedRightGray

                # Makes the hsv representation of the optical flow.
                flowHSVRight = draw_hsv(flow2)

                # Makes binary image of the hsv image of the optical flow
                flowThreshRight = cv2.inRange(flowHSVRight, (0, 0, 5), (180, 255, 255))
                # Blob analysis again to find the biggest blob
                blobsRight = label(flowThreshRight > 0)
                cv2.imshow("optical treshold", flowThreshRight)
                dfRight = pd.DataFrame(regionprops_table(blobsRight, properties=properties))
                # If the biggest blob is over 400, the grabbers are moving!!
                if len(dfRight) != 0 and max(dfRight['area']) > 400:
                    closing = True
                    closeCounter += 1
                    print(closeCounter)

                # A bunch of if statements that checks whether we got a fake closing detection or not
                if closing:
                    closeTimer += 1
                    movementTimer = 0
                    # if it only makes 2 or less detection from the first detection after 10 frames, save as false detection. Also resets detection variables
                    if closeTimer > 10 and closeCounter <= 3 and stillClosedBool == False:
                        closing = False
                        closeCounter = 0
                        closeTimer = 0
                        # print("fake close")
                        fakeCloseCounter += 1

                        print("Fake Close Counter: " + str(fakeCloseCounter))
                    # If it makes 3 or more detection in the last 10 frames from the first detection save as correct detection. Also resets detection variables
                    if closeTimer > 10 and closeCounter > 3 and stillClosedBool == False and len(fiftyFrame) > 495:
                        closing = False
                        closeCounter = 0
                        closeTimer = 0

                        print("We closing!")
                        # Save image from 70 frames ago as picture of garbage. Makes ROI of the image, to filter out unnecessary noise.

                        saveImg = fiftyFrame[500 - 70]
                        saveImgRoi = saveImg[0:saveImg.shape[0],
                                     leftXBottom1:int(rightXTop1 + (saveImg.shape[1] / 2))]
                        resize = cv2.resize(saveImgRoi, (250, 250))
                        # Save the chosen image on the pc.
                        cv2.imwrite("savedImg/garbage" + str(imNum) + ".png", resize)
                        # The code line for the neural network segmentation of the image.
                        results, output = ins.segmentImage("savedImg/garbage" + str(imNum) + ".png",
                                                           show_bboxes=True,
                                                           output_image_name="savedImg/segmented" + str(
                                                               imNum) + ".png")
                        # Goes through all the bounding boxes that is found by the NN on the image and chooses the one closest to the grabbers position.
                        for i in range(0, len(results['boxes'])):
                            boxWidth = results['boxes'][i][2] - results['boxes'][i][0]
                            boxHeight = results['boxes'][i][3] - results['boxes'][i][1]
                            boxArea = boxWidth * boxHeight
                            if boxArea > minBoundingVal:
                                minBoundingVal = boxArea
                                print("val: " + str(minBoundingVal))
                                print(imNum)
                                bbx1 = results['boxes'][i][0]
                                bby1 = results['boxes'][i][1]
                                bbx2 = results['boxes'][i][2]
                                bby2 = results['boxes'][i][3]
                        # Draws the chosen bounding box on a new image and saves it on the pc.
                        if len(results['boxes']) != 0:
                            centerX = (bbx1 + bbx2) / 2
                            centerY = (bby1 + bby2) / 2
                            width = bbx2 - bbx1
                            height = bby2 - bby1
                            ncenterX = centerX / resize.shape[1]
                            ncenterY = centerY / resize.shape[0]
                            nwidth = width / resize.shape[1]
                            nheight = height / resize.shape[0]

                            cv2.rectangle(resize, (bbx1, bby1), (bbx2, bby2), (0, 255, 0), thickness=2)
                            cv2.imwrite("savedImg/bbox" + str(imNum) + ".png", resize)
                            f1 = open("yolotxt/" + str(imNum) + ".txt", "w+")
                            f1.write(
                                "Class here " + str(ncenterX) + " " + str(ncenterY) + " " + str(nwidth) + " " + str(
                                    nheight))
                            f1.close()
                            # Resets the minBoundingVal variable so it is ready for a new image segmentation. Also sets movement to tru to start the timer.
                            minBoundingVal = 1000
                            imNum += 1
                        movement = True
                # If correct detection happens, start a timer that resets everytime a detection happens after the first one,
                # until 100 frames passes without a new detection, so we know that the grabbers have closed
                if movement:
                    closing = False
                    stillClosedBool = True
                    movementTimer += 1

                # if the timer goes over 100 the grabbers have closed and we can start detecting for movement again.
                if movementTimer > 80:
                    closeCounter = 0
                    movement = False
                    stillClosedBool = False

                # shows some images
                cv2.imshow('hsvtreshRight', flowThreshRight)
                cv2.imshow('flowRight', draw_flow(maskedRightGray, flow2))

        if cv2.waitKey(1) == ord('s'):
            break

    cap.release()
    cv2.destroyAllWindows()
