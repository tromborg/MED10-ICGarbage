import os
import random
import shutil


def split_dataset(original_folder_path_img, original_folder_path_labels, destination_folder_path_img,
                  destination_folder_path_labels):
    # Define the names for train, test, and validation folders
    train_folder = "train"
    test_folder = "test"
    val_folder = "validation"

    # Create train, test, and validation folders
    train_path_img = os.path.join(destination_folder_path_img, train_folder)
    test_path_img = os.path.join(destination_folder_path_img, test_folder)
    val_path_img = os.path.join(destination_folder_path_img, val_folder)

    train_path_labels = os.path.join(destination_folder_path_labels, train_folder)
    test_path_labels = os.path.join(destination_folder_path_labels, test_folder)
    val_path_labels = os.path.join(destination_folder_path_labels, val_folder)

    os.makedirs(train_path_img, exist_ok=True)
    os.makedirs(test_path_img, exist_ok=True)
    os.makedirs(val_path_img, exist_ok=True)

    os.makedirs(train_path_labels, exist_ok=True)
    os.makedirs(test_path_labels, exist_ok=True)
    os.makedirs(val_path_labels, exist_ok=True)

    # Define the split ratios
    train_ratio = 0.8
    test_ratio = 0.1
    val_ratio = 0.1

    # Get the list of files in the original folder
    files = os.listdir(original_folder_path_img)
    random.shuffle(files)

    # Calculate the number of files for each split
    total_files = len(files)
    train_count = int(total_files * train_ratio)
    test_count = int(total_files * test_ratio)
    val_count = total_files - train_count - test_count

    # Copy files to train, test, and validation folders
    for i, file_name in enumerate(files):
        source_file_path_img = os.path.join(original_folder_path_img, file_name)
        print(file_name)
        label_file = file_name.split(".")[0]
        label_file = f"{label_file}.txt"

        source_file_path_labels = os.path.join(original_folder_path_labels, label_file)
        if i < train_count:
            destination_file_path_img = os.path.join(train_path_img, file_name)
            destination_file_path_labels = os.path.join(train_path_labels, label_file)
        elif i < train_count + test_count:
            destination_file_path_img = os.path.join(test_path_img, file_name)
            destination_file_path_labels = os.path.join(test_path_labels, label_file)
        else:
            destination_file_path_img = os.path.join(val_path_img, file_name)
            destination_file_path_labels = os.path.join(val_path_labels, label_file)

        shutil.copyfile(source_file_path_img, destination_file_path_img)
        shutil.copyfile(source_file_path_labels, destination_file_path_labels)


    print("Folder split into train, test, and validation sets successfully.")


if __name__ == "__main__":
    original_folder_path = "./grabberframes/images/"
    original_folder_path_labels = "./grabberframes/labels/"
    destination_folder_path_img = "./grapperyolosplit/images/"
    destination_folder_path_labels = "./grapperyolosplit/labels/"

    split_dataset(original_folder_path, original_folder_path_labels, destination_folder_path_img, destination_folder_path_labels)
