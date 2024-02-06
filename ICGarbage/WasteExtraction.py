import cv2
import numpy as np
from collections import Counter
from skimage.morphology import area_opening
from skimage.morphology import area_closing
from skimage.measure import label, regionprops_table
import pandas as pd
from pixellib.torchbackend.instance import instanceSegmentation


class WasteExtraction:
    def __init__(self, contourval=80):
        self.properties = ['area', 'bbox', 'bbox_area']
        self.leftCnts = []
        self.rightCnts = []
        self.contourVal = contourval
        self.kernel1 = np.ones((5, 5), np.uint8)
        self.closing = False
        self.closeCounter = 0
        self.closeTimer = 0
        self.movementTimer = 0
        self.stillClosedBool = False
        self.fakeCloseCounter = 0
        self.movement = False
        self.imNum = 0
        self.minBoundingVal = 0


    def getROI(self, currentFrame):
        leftRegionIMG = currentFrame[int(currentFrame.shape[0] / 2):currentFrame.shape[0],
                        0:int(currentFrame.shape[1] / 2)]
        rightRegionIMG = currentFrame[int(currentFrame.shape[0] / 2): currentFrame.shape[0],
                         int(currentFrame.shape[1] / 2):currentFrame.shape[1]]

        return leftRegionIMG, rightRegionIMG

    def get_initial_blob(self, leftRegionIMG, rightRegionIMG):
        kernelClose = np.ones((5, 5), np.uint8)
        leftCanny = cv2.Canny(leftRegionIMG, threshold1=50, threshold2=150, apertureSize=3, L2gradient=True)
        leftCanny = cv2.morphologyEx(leftCanny, cv2.MORPH_CLOSE, kernelClose, iterations=2)
        rightCanny = cv2.Canny(rightRegionIMG, threshold1=50, threshold2=150, apertureSize=3, L2gradient=True)
        rightCanny = cv2.morphologyEx(rightCanny, cv2.MORPH_CLOSE, kernelClose, iterations=2)
        xR, yR = np.where(rightCanny < 1)
        blobsR = np.zeros_like(rightCanny)
        blobsR[xR, yR] = 255
        # blobsR = cv2.erode(blobsR, kernelErode)
        biggestBlob = []
        xL, yL = np.where(leftCanny < 1)
        blobsL = np.zeros_like(leftCanny)
        blobsL[xL, yL] = 255
        return blobsL, blobsR

    def getContourCoordinates(self, leftRegionIMG, rightRegionIMG):
        blobsL, blobsR = self.get_initial_blob(leftRegionIMG, rightRegionIMG)

        blobsAnaR = label(blobsR > 0)
        blobsAnaL = label(blobsL > 0)
        dfRight = pd.DataFrame(regionprops_table(blobsAnaR, properties=self.properties))
        dfLeft = pd.DataFrame(regionprops_table(blobsAnaL, properties=self.properties))
        maxAreaR = max(dfRight['area'])
        maxAreaL = max(dfLeft['area'])
        if maxAreaR > maxAreaL:
            biggestBlob = np.copy(blobsR)
        else:
            biggestBlob = np.copy(blobsL)

        contoursR, hierarchy = cv2.findContours(blobsR, cv2.RETR_LIST, cv2.CHAIN_APPROX_TC89_KCOS)
        contoursL, hierarchy = cv2.findContours(blobsL, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

        largestCntR = contoursR[0]
        largestCntL = contoursL[0]

        if len(contoursR) > 1:
            for i in range(0, len(contoursR)):
                if len(largestCntR) < len(contoursR[i]):
                    largestCntR = contoursR[i]

        if len(contoursL) > 1:
            for i in range(0, len(contoursL)):
                if len(largestCntL) < len(contoursL[i]):
                    largestCntL = contoursL[i]
        else:
            largestCntL = contoursL[0]

        return largestCntL, largestCntR

    def maskOff(self, inputImg, mask):
        newImg1 = np.zeros((inputImg.shape[0], inputImg.shape[1], 3), np.uint8)
        for y in range(inputImg.shape[0]):
            for x in range(inputImg.shape[1]):
                if mask[y][x] == 255:
                    newImg1[y][x] = inputImg[y][x]
                else:
                    newImg1[y][x] = 0
        return newImg1

    def findMostCommonContour(self, contourCoordinates, image, val):
        coordsArray = []
        mostCommonCnt = []

        for i in range(0, len(contourCoordinates)):
            tempCnt = contourCoordinates[i]
            for w in range(0, len(contourCoordinates[i])):
                temp = tempCnt[w][0]
                coordsArray.append(temp)

        repeatedCoords = tuple(map(tuple, coordsArray))
        counter = Counter(repeatedCoords)

        for coord in counter:
            if counter[coord] > val:
                mostCommonCnt.append(coord)

        mostCommonCnt = [np.asarray(mostCommonCnt)]
        mask = np.zeros_like(image)

        for i in range(0, len(mostCommonCnt)):
            cv2.drawContours(mask, mostCommonCnt, i, (255, 255, 255), thickness=cv2.FILLED)

        mask = mask[:, :, 0]

        out = np.zeros_like(image)
        out[mask == 255] = image[mask == 255]

        yI, xI = np.where(mask == 255)

        (topy, topx) = (np.min(yI), np.min(xI))
        (bottomy, bottomx) = (np.max(yI), np.max(xI))
        out = out[topy:bottomy + 1, topx:bottomx + 1]
        out = out[:, :, 0]
        yII, xII = np.where(out > 0)
        out[yII, xII] = 255

        cv2.imshow('out', out)

        return mostCommonCnt, out, topy, topx, bottomy, bottomx
    def calibrate(self, frame):
        # colorSeg(motion, previousFrame, frame)
        left, right = self.getROI(frame)
        leftcnt, rightcnt = self.getContourCoordinates(left, right)
        _, blobsR = self.get_initial_blob(left, right)
        # print(leftcnt)
        # cv2.waitKey(0)
        self.leftCnts.append(leftcnt)
        self.rightCnts.append(rightcnt)

    def end_calibration(self, frame):

        left, right = self.getROI(frame)
        _, blobsR = self.get_initial_blob(left, right)
        # Code to find the most common contour, as well as finding the coordinates to make a bounding box around the grabber.
        leftcontour1, leftout1, leftYTop1, leftXTop1, leftYBottom1, leftXBottom1 = self.findMostCommonContour(
            self.leftCnts,
            left,
            self.contourVal)
        # Same as above but for the right grabber.
        rightcontour1, rightout1, rightYTop1, rightXTop1, rightYBottom1, rightXBottom1 = self.findMostCommonContour(
            self.rightCnts, right, self.contourVal)
        # Making ROI's for the left grabber.
        prevRoiLeft = left[leftYTop1:leftYBottom1 + 1, leftXTop1:leftXBottom1 + 1]
        prevRoiRight = right[rightYTop1:rightYBottom1 + 1, rightXTop1:rightXBottom1 + 1]

        cv2.imshow("blobsr", blobsR)
        print("top coordinates: " + str(leftYTop1) + " " + str(leftXBottom1))
        print("bottom coordinates: " + str(rightYBottom1) + " " + str(rightXTop1 + (frame.shape[1] / 2)))
        # label is sklearns function for doing blob analysis of a binary image

        # Fixes the ROI for the blobsL image, so it is the same size as the ones before, where we also made ROI's
        blobsRReal = blobsR[rightYTop1:rightYBottom1 + 1, rightXTop1:rightXBottom1 + 1]
        blobsRAnal = label(blobsRReal > 0)
        cv2.imshow("bloblsrreal", blobsRReal)

        dfR = pd.DataFrame(regionprops_table(blobsRAnal, properties=self.properties))
        # Area_opening is sklearns function for removing any unwanted blobs. Here we say all blobs under the threshold value of 200 less than the
        # biggest blob in the image should be removed, so we are only left with the biggest blob which should be the grabber.
        f2 = area_opening(blobsRReal, max(dfR['area']), 1)
        cv2.imshow("f2", f2)

        # Erode makes the threshold image smaller
        erodeF2 = cv2.erode(f2, self.kernel1, iterations=2)

        # maskOff function, uses the binary image of the grabber to make a new image, where only the white parts of the binary image
        # is saved from the prevRoiLeft image.
        maskedRightPrev = self.maskOff(prevRoiRight, erodeF2)
        # make a gray version, as this is needed for the optical flow function.
        maskedRightPrevGray = cv2.cvtColor(maskedRightPrev, cv2.COLOR_BGR2GRAY)

        left_bbox = [leftYTop1, leftXTop1, leftYBottom1, leftXBottom1]
        right_bbox = [rightYTop1, rightXTop1, rightYBottom1, rightXBottom1]
        return left_bbox, right_bbox, erodeF2, maskedRightPrevGray

    # Optical flow function that maps opencv optical flow function outputs to hsv values for a visual image.
    def draw_hsv(sef, flow):
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

    def opticalFlowHSV(self, right_img, right_bbox, erodeF2, maskedRightPrevGray):
        # Making ROI's again, this time in the while loop so it keeps updating, and not just doing it onee as once again, we need it for the
        # optical flow function
        rightYTop1, rightXTop1, rightYBottom1, rightXBottom1 = right_bbox
        roiRight = right_img[rightYTop1:rightYBottom1 + 1, rightXTop1:rightXBottom1 + 1]

        # New maskoff, only difference is this is agai in the while loop, so it keeps updating.
        maskedRight = self.maskOff(roiRight, erodeF2)
        # Gray version again, needed for optical flow
        maskedRightGray = cv2.cvtColor(maskedRight, cv2.COLOR_BGR2GRAY)

        # The optical flow function! Uses gray images of the current frame and the frame from just before
        flow2 = cv2.calcOpticalFlowFarneback(maskedRightPrevGray, maskedRightGray, None, 0.5, 3, 25, 3, 5, 1.2,
                                             0)
        # Sets the previous frame to the current so it is ready for the next frame.
        maskedRightPrevGray = maskedRightGray

        # Makes the hsv representation of the optical flow.
        flowHSVRight = self.draw_hsv(flow2)

        # Makes binary image of the hsv image of the optical flow
        flowThreshRight = cv2.inRange(flowHSVRight, (0, 0, 5), (180, 255, 255))
        # Blob analysis again to find the biggest blob
        blobsRight = label(flowThreshRight > 0)
        cv2.imshow("optical treshold", flowThreshRight)
        dfRight = pd.DataFrame(regionprops_table(blobsRight, properties=self.properties))

        return dfRight, maskedRightPrevGray

    def is_closing_over(self):
        if self.movement:
            self.closing = False
            self.stillClosedBool = True
            self.movementTimer += 1

        # if the timer goes over 100 the grabbers have closed and we can start detecting for movement again.
        if self.movementTimer > 80:
            self.closeCounter = 0
            self.movement = False
            self.stillClosedBool = False

    def get_waste_frame(self, fiftyFrame, leftXBottom1, rightXTop1, instance_segmenter):
        print("We closing!")
        # Save image from 70 frames ago as picture of garbage. Makes ROI of the image, to filter out unnecessary noise.

        saveImg = fiftyFrame[500 - 70]
        saveImgRoi = saveImg[0:saveImg.shape[0],
                     leftXBottom1:int(rightXTop1 + (saveImg.shape[1] / 2))]
        resize = cv2.resize(saveImgRoi, (250, 250))
        # Save the chosen image on the pc.
        cv2.imwrite("savedImg/garbage" + str(self.imNum) + ".png", resize)
        # The code line for the neural network segmentation of the image.
        results, output = instance_segmenter.segmentImage("savedImg/garbage" + str(self.imNum) + ".png",
                                           show_bboxes=True,
                                           output_image_name="savedImg/segmented" + str(
                                               self.imNum) + ".png")
        # Goes through all the bounding boxes that is found by the NN on the image and chooses the one closest to the grabbers position.
        for i in range(0, len(results['boxes'])):
            boxWidth = results['boxes'][i][2] - results['boxes'][i][0]
            boxHeight = results['boxes'][i][3] - results['boxes'][i][1]
            boxArea = boxWidth * boxHeight
            if boxArea > self.minBoundingVal:
                self.minBoundingVal = boxArea
                print("val: " + str(self.minBoundingVal))
                print(self.imNum)
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
            cv2.imwrite("savedImg/bbox" + str(self.imNum) + ".png", resize)
            f1 = open("yolotxt/" + str(self.imNum) + ".txt", "w+")
            f1.write(
                "Class here " + str(ncenterX) + " " + str(ncenterY) + " " + str(nwidth) + " " + str(
                    nheight))
            f1.close()
            # Resets the minBoundingVal variable so it is ready for a new image segmentation. Also sets movement to tru to start the timer.
            self.minBoundingVal = 1000
            self.imNum += 1
        self.movement = True
    def closing_event_handler(self, dfRight, fiftyFrame, leftBottomX1, rightTopX1, instance_segmenter):
        # If the biggest blob is over 400, the grabbers are moving!!
        if len(dfRight) != 0 and max(dfRight['area']) > 400:
            self.closing = True
            self.closeCounter += 1
            print(self.closeCounter)

        # A bunch of if statements that checks whether we got a fake closing detection or not
        if self.closing:
            self.closeTimer += 1
            self.movementTimer = 0
            # if it only makes 2 or less detection from the first detection after 10 frames, save as false detection. Also resets detection variables
            if self.closeTimer > 10 and self.closeCounter <= 3 and self.stillClosedBool == False:
                self.closing = False
                self.closeCounter = 0
                self.closeTimer = 0
                # print("fake close")
                self.fakeCloseCounter += 1

                print("Fake Close Counter: " + str(self.fakeCloseCounter))
            # If it makes 3 or more detection in the last 10 frames from the first detection save as correct detection. Also resets detection variables
            if self.closeTimer > 10 and self.closeCounter > 3 and self.stillClosedBool == False and len(fiftyFrame) > 495:
                self.closing = False
                self.closeCounter = 0
                self.closeTimer = 0

                print("We closing!")
                # Save image from 70 frames ago as picture of garbage. Makes ROI of the image, to filter out unnecessary noise.

                self.get_waste_frame(fiftyFrame, leftBottomX1, rightTopX1, instance_segmenter=instance_segmenter)

        self.is_closing_over()
