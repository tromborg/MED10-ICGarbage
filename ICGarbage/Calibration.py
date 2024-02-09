import cv2
import numpy as np


class waste_extraction():
    def __init__(self):
        self.left_grapper_basepoint = (0, 0)
        self.right_grapper_basepoint = (0, 0)

    def get_calibration_bboxes(self):
        preds = []
        for bboxes in preds:
            x1, y1, x2, y2 = bboxes
            left_box = bboxes[0]
            right_box = bboxes[1]
            centerpoint = (x1 + (x2 / 2)), (y1 + (y2 / 2))
        pass

    def get_euclidean_distance(self, centerpoint_left, centerpoint_right):
        left_movement = np.linalg.norm(centerpoint_left - self.left_grapper_basepoint)
        right_movement = np.linalg.norm(centerpoint_right - self.right_grapper_basepoint)
        pass

    def calibrate(self):
        pass


if __name__ == "__main__":
    pass
