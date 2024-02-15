from ultralytics import YOLO
import cv2

class Tracking():
    def __init__(self, fps):
        self.model = YOLO("grappermodel.pt")
        self.closeCounter = 0
        self.closeTimer = 0
        self.closed = False
        self.timer = 0
        self.grabbersClosing = False
        self.getFrame = False
        self.downtime = 6 * fps

    def grabbersClosedChecker(self):
        if self.closed == True:
            self.timer += 1
            self.grabbersClosing = False
        if self.timer > self.downtime:
            self.closed = False
            self.timer = 0
    def closingEvent(self):
        if self.closeCounter > 3 and self.closeTimer > 10 and self.closed == False:
            print("closing?")
            self.getFrame = True
            self.closeCounter = 0
            self.closeTimer = 0
            self.closed = True
            return True
        if self.closeCounter <= 3 and self.closeTimer > 10 and self.closed == False:
            print("not closing")
            self.closeCounter = 0
            self.closeTimer = 0
            return False

    def trackGrabber(self, frame, startX):
        self.getFrame = False
        x2 = 0
        bbox = self.model(frame, stream=True, conf=0.8, verbose=False)
        for result in bbox:
            if len(result) > 0:
                x2 = int(result.boxes.xyxy[0][2])
        if x2 > startX + 30 and self.closed == False:
            self.grabbersClosing = True
            self.closeCounter += 1
            print("clsocunter: ", self.closeCounter)
        if self.grabbersClosing:
            self.closeTimer += 1
            self.closingEvent()
        self.grabbersClosedChecker()
        return self.getFrame

