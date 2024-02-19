import os
import cv2
def laplacian_blur(frame):
    variance_laplacian = cv2.Laplacian(frame, cv2.CV_64F).var()
    print("Laplacian variance: ", variance_laplacian)
    #cv2.imshow(f"Varance: {variance_laplacian}", frame)
    #cv2.waitKey(0)
    return variance_laplacian


if __name__ == "__main__":

    dirpath = "testimages"
    os.listdir(dirpath)

    for filename in os.listdir(dirpath):
        frame = cv2.imread(os.path.join(dirpath, filename))
        laplacian_blur(frame)

