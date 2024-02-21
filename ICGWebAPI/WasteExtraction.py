import cv2
import numpy as np

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


    def get_waste_frame(self, fiftyFrame, model):
        print("We closing!")
        # Save image from 70 frames ago as picture of garbage. Makes ROI of the image, to filter out unnecessary noise.
        screenSize = fiftyFrame[0].shape[1] / 3
        yoloResults = model(fiftyFrame[:-40], conf=0.4)
        frameNumber = 0
        validResults = []
        validFrames = []
        validFramesNumber = 0
        for result in yoloResults:
            if len(result.boxes) > 0 and int(result.boxes.xyxy[0][0]) > screenSize and int(result.boxes.xyxy[0][2]) < fiftyFrame[0].shape[1] - screenSize and int(result.boxes.xyxy[0][3]) < fiftyFrame[0].shape[0]-80 and int(result.boxes.xyxy[0][1]) > 80:
                validResults.append(result)
                validFrames.append(fiftyFrame[frameNumber])
            frameNumber += 1
        if len(validResults) > 0:
            for i in range(0,len(validResults)):
                boxWidth = int(validResults[i].boxes.xyxy[0][2]) - int(validResults[i].boxes.xyxy[0][0])
                boxHeight = int(validResults[i].boxes.xyxy[0][3]) - int(validResults[i].boxes.xyxy[0][1])
                boxArea = boxWidth * boxHeight
                if boxArea > self.minBoundingVal:
                    self.minBoundingVal = boxArea
                    biggestbox = validResults[i]
                    finalImage = validFrames[validFramesNumber]
                validFramesNumber += 1
                # Resets the minBoundingVal variable so it is ready for a new image segmentation. Also sets movement to tru to start the timer.
                self.minBoundingVal = 0
            cv2.rectangle(finalImage, (int(biggestbox.boxes.xyxy[0][0]), int(biggestbox.boxes.xyxy[0][1])),
                          (int(biggestbox.boxes.xyxy[0][2]), int(biggestbox.boxes.xyxy[0][3])), (0, 255, 0), thickness=2)
            cv2.imwrite("testImages/test" + str(self.imNum) + ".png", finalImage)
            self.imNum += 1
        self.movement = True

