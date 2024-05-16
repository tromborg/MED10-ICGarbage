import cv2
import numpy as np
import imagehash
from PIL import Image

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
        self.minBlurVal = 0
        self.prevImg = []
        self.hashVal = 6
        self.count = 0
        self.closingEvent = 0



    def getROI(self, currentFrame):
        leftRegionIMG = currentFrame[int(currentFrame.shape[0] / 2):currentFrame.shape[0],
                        0:int(currentFrame.shape[1] / 2)]
        rightRegionIMG = currentFrame[int(currentFrame.shape[0] / 2): currentFrame.shape[0],
                         int(currentFrame.shape[1] / 2):currentFrame.shape[1]]

        return leftRegionIMG, rightRegionIMG


    def get_waste_frame(self, fiftyFrame, model, leftbbox, rightbbox, grabberXArray, grabberStartX):
        print("We closing!")
        # Save image from 70 frames ago as picture of garbage. Makes ROI of the image, to filter out unnecessary noise.
        screenSize = fiftyFrame[0].shape[1] / 3
        imageArray = fiftyFrame
        grabberXArrayminus40 = grabberXArray
        yoloResults = model(imageArray, conf=0.6)
        frameNumber = 0
        validResults = []
        validFrames = []
        validFramesNumber = 0
        validPairs = []
        resultsArray = []
        finalImage = None
        index = 0
        frameNumber1 = 0
        failCounter = 0

        self.closingEvent += 1
        print("closings: ", self.closingEvent)

        #imageroi = imageArray[1][0:leftbbox[3],0:imageArray[1].shape[1]]

        print("framenumber1111: ", frameNumber1)
        for result in yoloResults:
            print("yololength: ", len(yoloResults))
            frameNumber1 += 1
            if len(result.boxes) > 0:
                for i in range(0,len(result.boxes)):

                    if int(result.boxes.xyxy[i][0]) < leftbbox[2] - 30 and int(result.boxes.xyxy[i][3]) > leftbbox[1]:
                        frameNumber += 1
                        self.count += 1
                        failCounter += 1
                        print("hej1: ", self.count)
                        cv2.rectangle(imageArray[index], (int(result.boxes.xyxy[0][0]), int(result.boxes.xyxy[0][1])),
                                      (int(result.boxes.xyxy[0][2]), int(result.boxes.xyxy[0][3])), (0, 0, 255),
                                      thickness=2)
                        cv2.imwrite("fails/fail" + str(self.imNum) + "n" + str(self.count) + ".png", imageArray[index])
                        continue
                    if int(result.boxes.xyxy[i][2]) > rightbbox[0] + 30 and int(result.boxes.xyxy[i][3]) > rightbbox[1]:
                        frameNumber += 1
                        self.count += 1
                        failCounter += 1
                        print("hej2", self.count)
                        cv2.rectangle(imageArray[index], (int(result.boxes.xyxy[0][0]), int(result.boxes.xyxy[0][1])),
                                      (int(result.boxes.xyxy[0][2]), int(result.boxes.xyxy[0][3])), (0, 0, 255),
                                      thickness=2)
                        cv2.imwrite("fails/fail" + str(self.imNum) + "n" + str(self.count) + ".png", imageArray[index])
                        continue
                    if grabberXArrayminus40[frameNumber1 - 1] - 30 > grabberStartX:
                        frameNumber += 1
                        self.count += 1
                        failCounter += 1
                        print("hej3", self.count)
                        cv2.rectangle(imageArray[index], (int(result.boxes.xyxy[0][0]), int(result.boxes.xyxy[0][1])),
                                      (int(result.boxes.xyxy[0][2]), int(result.boxes.xyxy[0][3])), (0, 0, 255),
                                      thickness=2)
                        cv2.imwrite("fails/fail" + str(self.imNum) + "n" + str(self.count) + ".png", imageArray[index])
                        continue
                    if int(result.boxes.xyxy[i][0]) > screenSize and int(result.boxes.xyxy[i][2]) < fiftyFrame[0].shape[1] - screenSize and int(result.boxes.xyxy[i][3]) < fiftyFrame[i].shape[0]-80 and int(result.boxes.xyxy[i][1]) > 80:
                        resultsPair = (result, fiftyFrame[frameNumber1 - 1])
                        validPairs.append(resultsPair)
                        validResults.append(result)
                        validFrames.append(fiftyFrame[frameNumber1 - 1])
            frameNumber += 1
            index += 1
            if failCounter >= 420:
                cv2.imwrite("failedTrash/fail" + str(self.imNum) + ".png", imageArray[410])
        if len(validResults) > 0:
            print("length: ", len(validResults))
            for i in range(0,len(validResults)):
                boxWidth = int(validPairs[i][0].boxes.xyxy[0][2]) - int(validPairs[i][0].boxes.xyxy[0][0])
                boxHeight = int(validPairs[i][0].boxes.xyxy[0][3]) - int(validPairs[i][0].boxes.xyxy[0][1])
                boxArea = boxWidth * boxHeight
                allResults = (validPairs[i][0], validPairs[i][1], boxArea)
                resultsArray.append(allResults)
                if boxArea > self.minBoundingVal:
                    self.minBoundingVal = boxArea
                validFramesNumber += 1
                # Resets the minBoundingVal variable so it is ready for a new image segmentation. Also sets movement to tru to start the timer.
            self.minBoundingVal = 0
            sorted_results = sorted(resultsArray, key=lambda x: x[2], reverse=True)
            top10 = sorted_results
            for i in range(0,len(top10)):
                variance_laplacian = cv2.Laplacian(top10[i][1], cv2.CV_64F).var()
                if variance_laplacian > self.minBlurVal:
                    self.minBlurVal = variance_laplacian
                    biggestbox = top10[i][0]
                    print("biggestbox: ", biggestbox.boxes.xyxy)
                    finalImage = top10[i][1]
            self.minBlurVal = 0
            if self.imNum == 0:
                self.prevImg = finalImage[int(biggestbox.boxes.xyxy[0][1]):int(biggestbox.boxes.xyxy[0][3]),
                            int(biggestbox.boxes.xyxy[0][0]):int(biggestbox.boxes.xyxy[0][2])]
            else:
                finalImageROI = []
                finalImageROI = finalImage[int(biggestbox.boxes.xyxy[0][1]):int(biggestbox.boxes.xyxy[0][3]),
                            int(biggestbox.boxes.xyxy[0][0]):int(biggestbox.boxes.xyxy[0][2])]
                hash1 = imagehash.dhash(Image.fromarray(finalImageROI))
                hash2 = imagehash.dhash(Image.fromarray(self.prevImg))
                self.hashVal = hash2 - hash1
                print("hashVal: ", self.hashVal)
                self.prevImg = finalImage[int(biggestbox.boxes.xyxy[0][1]):int(biggestbox.boxes.xyxy[0][3]),
                            int(biggestbox.boxes.xyxy[0][0]):int(biggestbox.boxes.xyxy[0][2])]
            print("finaliamge: ", finalImage)
            if finalImage is not None and self.hashVal > 5:
                cv2.rectangle(finalImage, (int(biggestbox.boxes.xyxy[0][0]), int(biggestbox.boxes.xyxy[0][1])),
                              (int(biggestbox.boxes.xyxy[0][2]), int(biggestbox.boxes.xyxy[0][3])), (0, 0, 255), thickness=2)
                cv2.imwrite("testImages/test" + str(self.imNum) + ".png", finalImage)
                f1 = open("yolotxt/" + str(self.imNum) + ".txt", "w+")
                f1.write("bbox: " + str(biggestbox.boxes.xyxy[0][0]) + " " + str(biggestbox.boxes.xyxy[0][1]) + " " + str(biggestbox.boxes.xyxy[0][2]) + " " + str(biggestbox.boxes.xyxy[0][3]))
                f1.close()
                self.imNum += 1
                self.hashVal = 0
            else:
                print("get hashed")
                self.hashVal = 0
        self.movement = True
