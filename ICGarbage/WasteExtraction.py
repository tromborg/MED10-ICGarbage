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
