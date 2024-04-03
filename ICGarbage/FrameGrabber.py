import cv2

if __name__ == "__main__":
    cap = cv2.VideoCapture('GX010079.MP4')
    train_data_folder = r'grabberframes/'
    ret, frame = cap.read()
    frameCount = 0
    while cap.isOpened():
        ret, frame = cap.read()
        frameCount += 1
        cv2.imshow('current', frame)
        if frameCount % 645 == 0:
            fps = cap.get(cv2.CAP_PROP_FPS)
            print("Saving frame: ", frameCount)
            cv2.imwrite(f'{train_data_folder}citynewframe%d.jpg' % frameCount, frame)
            print("Current FPS: ", fps)
        fps = cap.get(cv2.CAP_PROP_FPS)
        if frameCount % 100 == 0:
            print("Frame: ", frameCount)

        if cv2.waitKey(1) == ord('s'):
            break
