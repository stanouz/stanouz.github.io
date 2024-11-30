import dropbox
import os
import requests

def get_new_access_token(app_key, app_secret, refresh_token):
   """Fetch a new access token using the refresh token."""
   url = "https://api.dropbox.com/oauth2/token" 
   payload = { "grant_type": "refresh_token", "refresh_token": refresh_token, }
   # Use app key and secret for basic authentication 
   response = requests.post(url, data=payload, auth=(app_key, app_secret))
   if response.status_code == 200: 
        data = response.json() 
        return data["access_token"]
   else:
        raise Exception(f"Failed to refresh token: {response.status_code} - {response.text}")


APP_KEY = os.environ['DROPBOX_APP_KEY'] 
APP_SECRET = os.environ['DROPBOX_APP_SECRET'] 
REFRESH_TOKEN = os.environ['DROPBOX_REFRESH_TOKEN']

ACCESS_TOKEN = get_new_access_token(APP_KEY, APP_SECRET, REFRESH_TOKEN)



# Initialize Dropbox Client
dbx = dropbox.Dropbox(ACCESS_TOKEN)

def save_file(file_metadata, local_folder):
    """
    Download a file from Dropbox and save it to the local folder.
    """
    file_path = file_metadata.path_lower
    local_file_path = os.path.join(local_folder, file_metadata.name)

    # Download the file
    with open(local_file_path, "wb") as f:
        metadata, response = dbx.files_download(path=file_path)
        f.write(response.content)
        print(f"Saved: {local_file_path}")



def list_and_download_files(folder_path, local_folder):
    """
    Recursively list and download all files in the specified Dropbox folder.
    """
    try:
        # Ensure the local folder exists
        os.makedirs(local_folder, exist_ok=True)

        # List the contents of the current folder
        response = dbx.files_list_folder(path=folder_path)

        # Iterate through each entry in the folder
        for entry in response.entries:
            if isinstance(entry, dropbox.files.FileMetadata):
                print(f"File: {entry.name}")
                save_file(entry, local_folder)
            elif isinstance(entry, dropbox.files.FolderMetadata):
                print(f"Folder: {entry.name}")
                # Recursive call for subfolders
                subfolder_local = os.path.join(local_folder, entry.name)
                list_and_download_files(entry.path_lower, subfolder_local)

        # Handle pagination if there are more files
        while response.has_more:
            response = dbx.files_list_folder_continue(response.cursor)
            for entry in response.entries:
                if isinstance(entry, dropbox.files.FileMetadata):
                    print(f"File: {entry.name}")
                    save_file(entry, local_folder)
                elif isinstance(entry, dropbox.files.FolderMetadata):
                    print(f"Folder: {entry.name}")
                    subfolder_local = os.path.join(local_folder, entry.name)
                    list_and_download_files(entry.path_lower, subfolder_local)

    except dropbox.exceptions.ApiError as e:
        print(f"Error accessing {folder_path}: {e}")

folder_path = ""  # Replace with your Dropbox folder path
local_folder = "data"  # Local folder to save files

print(f"Downloading files from Dropbox folder: {folder_path}")
list_and_download_files(folder_path, local_folder)
print(f"Files downloaded to local folder: {local_folder}")

