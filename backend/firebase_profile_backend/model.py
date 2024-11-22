import os
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, storage

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("missioncapstone-21b12-firebase-adminsdk-9p748-0a02dc3abd.json")  # Replace with your JSON key file path
firebase_admin.initialize_app(cred, {
    "storageBucket": "missioncapstone-21b12.appspot.com"  # Correct the bucket name syntax
})

# Define the directories to upload (use absolute paths if needed)
UPLOAD_FOLDERS = ["Images"]  # Ensure these directories exist and have files

@app.route('/upload-folders', methods=['POST'])
def upload_folders():
    try:
        # Get Firebase bucket
        bucket = storage.bucket()
        uploaded_files = []

        # Iterate through each folder to upload its files
        for folder in UPLOAD_FOLDERS:
            if not os.path.exists(folder):
                return jsonify({"error": f"Folder not found: {folder}"}), 404

            for root, _, files in os.walk(folder):  # Recursively list files
                for file_name in files:
                    local_path = os.path.join(root, file_name)
                    
                    # Define the storage path in Firebase
                    relative_path = os.path.relpath(local_path, start=folder)
                    firebase_path = f"{folder}/{relative_path}"
                    
                    # Upload the file to Firebase Storage
                    blob = bucket.blob(firebase_path)
                    blob.upload_from_filename(local_path)
                    uploaded_files.append(firebase_path)
        
        if not uploaded_files:
            return jsonify({"message": "No files found to upload", "files": []}), 200
        
        return jsonify({"message": "Folders uploaded successfully", "files": uploaded_files}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
