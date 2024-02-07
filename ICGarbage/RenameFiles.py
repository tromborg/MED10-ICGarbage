import os


def rename_files(folder_path, new_suffix):
    """
    Renames files in a folder by replacing old_suffix with new_suffix.

    Parameters:
    - folder_path: The path to the folder containing the files.
    - old_suffix: The suffix to be replaced.
    - new_suffix: The new suffix to replace old_suffix.
    """
    # Check if the folder path exists
    if not os.path.isdir(folder_path):
        print("Folder path does not exist.")
        return

    # Get a list of files in the folder
    files = os.listdir(folder_path)
    iterator = 0
    # Rename each file with the specified suffix
    for file_name in files:

        # Construct the new file name by replacing the old_suffix with new_suffix
        new_file_name = new_suffix + str(iterator) + ".jpg"
        # Join the folder path with the file name
        old_file_path = os.path.join(folder_path, file_name)
        new_file_path = os.path.join(folder_path, new_file_name)
        # Rename the file
        os.rename(old_file_path, new_file_path)
        print(f"Renamed: {file_name} -> {new_file_name}")
        iterator += 1


# Example usage
if __name__ == "__main__":
    folder_path = "grabberframes/city1/"
    new_suffix = "city1f"
    rename_files(folder_path, new_suffix)