import cv2
from ultralytics import YOLO
from Calibration import Calibration
from WasteExtraction import WasteExtraction
from Tracking import Tracking


def getROI(currentFrame):
    leftRegionIMG = currentFrame[int(currentFrame.shape[0] / 2):currentFrame.shape[0], 0:int(currentFrame.shape[1] / 2)]
    rightRegionIMG = currentFrame[int(currentFrame.shape[0] / 2): currentFrame.shape[0],
                     int(currentFrame.shape[1] / 2):currentFrame.shape[1]]

    return leftRegionIMG, rightRegionIMG

def icg_analysis(videopath):
    # ---VARIABLES---#
    frameCount = 0
    check = True
    cap = cv2.VideoCapture(videopath)
    fps = int(round(cap.get(cv2.CAP_PROP_FPS), 0))
    ret, frame = cap.read()
    fiftyFrame = []
    we = WasteExtraction()
    ca = Calibration()
    tracking = Tracking(fps=fps)
    model = YOLO("best.pt")
    # ---VARIABLES---#
    while cap.isOpened():
        frameCount += 1
        ret, frame = cap.read()
        #cv2.imshow('current', frame)
        left, right = getROI(frame)
        fiftyFrame.append(frame)

        if frameCount > 150:
            if frameCount > (fps * 7):
                fiftyFrame.pop(0)
            if frameCount > 150 and frameCount < 503:
                ca.get_grabber_preds(frame, frameCount)
            if frameCount > 503:
                print(frameCount)
                # if statement used to make sure the code in the if statement only gets run once.
                if check:
                    leftbbox, region = ca.end_calibration()
                    check = False
                leftRegion = frame[region[1]:region[3], region[0]:region[2]]
                #cv2.imshow("region", leftRegion)
                # cv2.rectangle(frame, (int(leftbbox[0]), int(leftbbox[1])),(int(leftbbox[2]),int(leftbbox[3])),(0,255,0), thickness=2)
                # cv2.imshow("grabber", frame)
                getFrame = tracking.trackGrabber(leftRegion, leftbbox[2])
                if getFrame:
                    we.get_waste_frame(fiftyFrame, model=model)

                # shows some images
                # cv2.imshow('hsvtreshRight', flowThreshRight)
                # cv2.imshow('flowRight', draw_flow(maskedRightGray, flow2))

        if cv2.waitKey(1) == ord('s'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    # ---VARIABLES---#
    frameCount = 0
    check = True
    cap = cv2.VideoCapture('City_All.mp4')
    fps = int(round(cap.get(cv2.CAP_PROP_FPS),0))
    ret, frame = cap.read()
    fiftyFrame = []
    we = WasteExtraction()
    ca = Calibration()
    tracking = Tracking(fps=fps)
    model = YOLO("best.pt")
    grabberXArray = []
    # ---VARIABLES---#
    while cap.isOpened():
        frameCount += 1
        ret, frame = cap.read()
        cv2.imshow('current', frame)
        left, right = getROI(frame)
        fiftyFrame.append(frame)

        if frameCount > 150:
            if frameCount > (fps * 7):
                fiftyFrame.pop(0)
            if frameCount > 150 and frameCount < 503:
                ca.get_grabber_preds(frame, frameCount)
            if frameCount > 503:
                print(frameCount)
                # if statement used to make sure the code in the if statement only gets run once.
                if check:
                    leftbbox, rightbbox, region = ca.end_calibration()
                    check = False
                    print("leftbbox: ", leftbbox)
                    print("rightbbox: ", rightbbox)
                leftRegion = frame[region[1]:region[3], region[0]:region[2]]
                cv2.imshow("region", leftRegion)
                # cv2.rectangle(frame, (int(leftbbox[0]), int(leftbbox[1])),(int(leftbbox[2]),int(leftbbox[3])),(0,255,0), thickness=2)
                # cv2.imshow("grabber", frame)
                grabberX, getFrame = tracking.trackGrabber(leftRegion, leftbbox[2])
                grabberXArray.append(grabberX)
                if len(grabberXArray) > (fps * 7):
                    grabberXArray.pop(0)
                if getFrame and len(grabberXArray) >= (fps*7 - 1):
                    we.get_waste_frame(fiftyFrame,model=model,leftbbox=leftbbox, rightbbox=rightbbox, grabberXArray=grabberXArray, grabberStartX=leftbbox[2])

                # shows some images
                #cv2.imshow('hsvtreshRight', flowThreshRight)
                #cv2.imshow('flowRight', draw_flow(maskedRightGray, flow2))

        if cv2.waitKey(1) == ord('s'):
            break

    cap.release()
    cv2.destroyAllWindows()
