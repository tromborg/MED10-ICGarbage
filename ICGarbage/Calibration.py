import cv2
import numpy as np
from ultralytics import YOLO
import cv2

class Calibration():
    def __init__(self):
        self.left_grapper_basepoint = []
        self.right_grapper_basepoint = []
        self.confidences = []
        self.classifications = []
        self.left_bboxes = []
        self.right_bboxes = []
        self.framecount = 0
        self.model_path = "grabbermodelpt2.pt"
        self.grabber_model = YOLO(self.model_path)
        self.is_gathering_frames = True
    def get_grabber_preds(self, frame, framecount):
        if self.framecount == 0:
            self.framecount = framecount
        if framecount < self.framecount + 350:
            preds = self.grabber_model(frame, stream=True, verbose=False)
            iterator = 0

            for res in preds:
                if 0 in res.boxes.cls and 1 in res.boxes.cls:
                    temp_left = []
                    temp_right = []
                    temp_left_conf = []
                    temp_right_conf = []
                    temp_left_box = []
                    temp_right_box = []
                    for j in range(0, len(res.boxes.conf)):
                        if res.boxes.cls[j] == 0:
                            temp_left.append(res.boxes.cls[j])
                            temp_left_conf.append(res.boxes.conf[j])
                            temp_left_box.append(res.boxes.xyxy[j])

                        elif res.boxes.cls[j] == 1:
                            temp_right.append(res.boxes.cls[j])
                            temp_right_conf.append(res.boxes.conf[j])
                            temp_right_box.append(res.boxes.xyxy[j])


                    best_left_idx = temp_left_conf.index(max(temp_left_conf))
                    best_right_idx = temp_right_conf.index(max(temp_right_conf))
                    best_left_box = np.array(temp_left_box[best_left_idx])
                    best_right_box = np.array(temp_right_box[best_right_idx])
                    best_left_conf = np.float16(temp_left_conf[best_left_idx])
                    best_right_conf = np.float16(temp_right_conf[best_right_idx])

                    cv2.rectangle(frame, (int(best_left_box[0]), int(best_left_box[1])), (int(best_left_box[2]), int(best_left_box[3])), (0, 255, 0), thickness=2)
                    cv2.putText(frame, f'Left, Conf: {best_left_conf}', (int(best_left_box[0]), int(best_left_box[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 1)
                    cv2.rectangle(frame, (int(best_right_box[0]), int(best_right_box[1])), (int(best_right_box[2]), int(best_right_box[3])), (0, 255, 0), thickness=2)
                    cv2.putText(frame, f'Right, Conf{best_right_conf}', (int(best_right_box[0]), int(best_right_box[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 1)
                    cv2.imwrite("calibrationImages/img" + str(framecount) + ".png", frame)

                    self.left_bboxes.append(best_left_box)
                    self.right_bboxes.append(best_right_box)
                    print("LEFT: ", best_left_box)
                    print("RIGHT: ", best_right_box)
                    iterator += 1

        if framecount > self.framecount + 350:
            self.is_gathering_frames = False

    def get_tracking_roi(self, left_box, right_box):
        x1 = 0
        x2 = right_box[0]
        y1 = 0
        y2 = left_box[3]
        return [x1, y1, x2, y2]
    def end_calibration(self):
        best_left_x1 = 0
        best_left_y1 = 0
        best_left_x2 = 0
        best_left_y2 = 0
        best_right_x1 = 0
        best_right_y1 = 0
        best_right_x2 = 0
        best_right_y2 = 0
        for i in range(0, len(self.left_bboxes)):
            current_box = self.left_bboxes[i]
            best_left_x1 += int(current_box[0])
            best_left_y1 += int(current_box[1])
            best_left_x2 += int(current_box[2])
            best_left_y2 += int(current_box[3])

        for i in range(0, len(self.right_bboxes)):
            current_box = self.right_bboxes[i]
            best_right_x1 += int(current_box[0])
            best_right_y1 += int(current_box[1])
            best_right_x2 += int(current_box[2])
            best_right_y2 += int(current_box[3])

        best_left_box = [int(best_left_x1/len(self.left_bboxes)), int(best_left_y1/len(self.left_bboxes)), int(best_left_x2/len(self.left_bboxes)), int(best_left_y2/len(self.left_bboxes))]
        best_right_box = [int(best_right_x1/len(self.right_bboxes)), int(best_right_y1/len(self.right_bboxes)), int(best_right_x2/len(self.right_bboxes)), int(best_right_y2/len(self.right_bboxes))]
        print("Best box: ", best_left_box)

        print("x2: ", int(np.average(best_left_x2)))
        print("x1: ", int(np.average(best_left_x2)))
        tracking_roi = self.get_tracking_roi(left_box=best_left_box, right_box=best_right_box)
        print("tracking_roi: ", tracking_roi)

        return best_left_box, best_right_box, tracking_roi
    def calibrate(self, frame, framecount):
        print("self framcount: ", self.framecount)
        if self.is_gathering_frames:
            print("Gathering frames...")
            self.get_grabber_preds(frame=frame, framecount=framecount)
            return None, None
        if self.is_gathering_frames == False:
            print("Finishing calibration...")
            left_bbox, right_bbox, tracking_roi = self.end_calibration()
            region = frame[tracking_roi[1]:tracking_roi[3], tracking_roi[0]:tracking_roi[2]]
            cv2.imshow("roi", region)
            return left_bbox, right_bbox, region



if __name__ == "__main__":

    pass
