from ultralytics import YOLO
def train():

    # Load a pretrained YOLO model (recommended for training)
    model = YOLO('yolov8n.pt')

    # Train the model using the 'coco128.yaml' dataset for 3 epochs
    results = model.train(data='grabbertraining.yaml', epochs=100, imgsz=640, patience=10)

    # Evaluate the model's performance on the validation set
    results = model.val()
    print(results)

    
if __name__ == "__main__":
    train()
    pass
