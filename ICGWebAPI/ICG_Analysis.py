import cv2
from ultralytics import YOLO
import settings
from Calibration import Calibration
from WasteExtraction import WasteExtraction
from Tracking import Tracking
import json
import psycopg2 as ps
from psycopg2 import Error


class ICGAnalysis:
    def __init__(self):
        self.grabber_model = YOLO("grappermodel.pt", verbose=False)
        self.segmentation_model = YOLO("best.pt", verbose=False)

    def getROI(self, currentFrame):
        leftRegionIMG = currentFrame[int(currentFrame.shape[0] / 2):currentFrame.shape[0],
                        0:int(currentFrame.shape[1] / 2)]
        rightRegionIMG = currentFrame[int(currentFrame.shape[0] / 2): currentFrame.shape[0],
                         int(currentFrame.shape[1] / 2):currentFrame.shape[1]]

        return leftRegionIMG, rightRegionIMG

    def perform_icg_analysis(self, videopath, filename, userid):
        print("Starting ICG analysis...")
        img_points = 0
        frameCount = 0
        check = True
        cap = cv2.VideoCapture(videopath)
        fps = int(round(cap.get(cv2.CAP_PROP_FPS), 0))
        ret, frame = cap.read()
        fiftyFrame = []
        we = WasteExtraction()
        ca = Calibration(self.grabber_model)
        tracking = Tracking(fps=fps)
        model = self.segmentation_model
        grabberXArray = []
        print("Variables set, starting video analysis...")
        while cap.isOpened():
            frameCount += 1
            ret, frame = cap.read()
            # cv2.imshow('current', frame)
            if type(frame) == type(None):
                self.update_points(user_id=userid, points=img_points)
                print("ICG analysis complete.")
                cap.release()
            left, right = self.getROI(frame)
            fiftyFrame.append(frame)
            if frameCount > 150:
                if frameCount > (fps * 7):
                    fiftyFrame.pop(0)
                if frameCount > 150 and frameCount < 503:
                    ca.get_grabber_preds(frame, frameCount)
                if frameCount > 503:
                    # print(frameCount)
                    # if statement used to make sure the code in the if statement only gets run once.
                    if check:
                        leftbbox, rightbbox, region = ca.end_calibration()
                        print("Calibration finished.")
                        print("Starting tracking...")
                        check = False
                    leftRegion = frame[region[1]:region[3], region[0]:region[2]]
                    # cv2.imshow("region", leftRegion)
                    # cv2.rectangle(frame, (int(leftbbox[0]), int(leftbbox[1])),(int(leftbbox[2]),int(leftbbox[3])),(0,255,0), thickness=2)
                    # cv2.imshow("grabber", frame)

                    grabberX, getFrame = tracking.trackGrabber(leftRegion, leftbbox[2])
                    grabberXArray.append(grabberX)
                    if len(grabberXArray) > (fps * 7):
                        grabberXArray.pop(0)
                    if getFrame and len(grabberXArray) >= (fps*7 - 1):
                        print("Waste pickup detected, finding optimal frame...")
                        img_points = we.get_waste_frame(fiftyFrame, filename=filename, model=model, leftbbox=leftbbox,
                                           rightbbox=rightbbox,
                                           grabberXArray=grabberXArray, grabberStartX=leftbbox[2])
                        print("Waste frame saved.")

                    # shows some images
                    # cv2.imshow('hsvtreshRight', flowThreshRight)
                    # cv2.imshow('flowRight', draw_flow(maskedRightGray, flow2))

            if cv2.waitKey(1) == ord('s'):
                break
        print("ICG analysis complete.")
        cap.release()
        cv2.destroyAllWindows()


    # Function to update points for a specific user ID
    def update_points(self, user_id, points):
        try:
            # Database connection parameters
            db_params = {
                'host': f'{settings.PG_HOST}',
                'port': f'{settings.PG_PORT}',
                'database': f'{settings.PG_DATABASE}',
                'user': f'{settings.PG_USER}',
                'password': f'{settings.PG_PASSWORD}'
            }

            connection = ps.connect(**db_params)

            # Create a cursor object using the cursor() method
            cursor = connection.cursor()

            # Retrieve the current points for the user with the given ID
            select_query = "SELECT points FROM users WHERE userid = %s"
            cursor.execute(select_query, (user_id,))
            current_points = cursor.fetchone()[0]

            # Calculate the new points
            new_points = current_points + points

            # Update the points for the user with the given ID
            update_query = "UPDATE users SET points = %s WHERE userid = %s"
            cursor.execute(update_query, (new_points, user_id))

            # Commit the transaction
            connection.commit()

            # Print success message
            print(f"Points updated successfully for user ID {user_id}")

        except (Exception, Error) as error:
            print("Error while updating points:", error)

        finally:
            # Closing database connection.
            if connection:
                cursor.close()
                connection.close()
                print("PostgreSQL connection is closed")

    def test_connection(self):
        connection = None
        try:
            db_params = {
                'host': f'{settings.PG_HOST}',
                'port': f'{settings.PG_PORT}',
                'database': f'{settings.PG_DATABASE}',
                'user': f'{settings.PG_USER}',
                'password': f'{settings.PG_PASSWORD}'
            }

            connection = ps.connect(**db_params)
            cursor = connection.cursor()
            cursor.execute('SELECT version()')
            print(f"POSTGRES_VERSION: {cursor.fetchone()}")
            cursor.close()
        except (Exception, ps.DatabaseError) as error:
            print(error)
        finally:
            if connection is not None:
                connection.close()
                print('Database connection closed.')