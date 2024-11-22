from flask import Flask, jsonify, request
from skimage import color
from skimage.io import imread
from skimage.transform import resize
from skimage.metrics import structural_similarity
from skimage.filters import gaussian, threshold_otsu
from skimage import measure
import pandas as pd
import os
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.externals import joblib  # If you're using joblib for loading models
from firebase_admin import credentials, initialize_app, storage

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate('path/to/your/firebase/credentials.json')  # Update path to your credentials
initialize_app(cred, {'storageBucket': 'your-firebase-bucket-name'})  # Replace with your bucket name

# Load the model
loaded_model = joblib.load('final_model.pkl')  # Adjust if you use a different method

@app.route('/predict', methods=['POST'])
def predict_ecg():
    # Fetch the image from Firebase Storage
    image_url = request.json['image_url']  # Expecting the image URL to be passed in the request
    image_path = download_image(image_url)

    # Process the image
    image = imread(image_path)
    image_gray = color.rgb2gray(image)
    image_gray = resize(image_gray, (1572, 2213))

    # Load reference images and process them
    reference_images = [
        'PMI(1).jpg',
        'HB(1).jpg',
        'Normal(1).jpg',
        'MI(1).jpg'
    ]
    processed_references = []

    for ref in reference_images:
        ref_image = imread(ref)
        ref_image_gray = color.rgb2gray(ref_image)
        ref_image_resized = resize(ref_image_gray, (1572, 2213))
        processed_references.append(ref_image_resized)

    # Calculate similarity score between uploaded and reference images
    similarity_scores = [
        structural_similarity(image_gray, ref_img, data_range=1)
        for ref_img in processed_references
    ]
    similarity_score = max(similarity_scores)

    # Check similarity score threshold
    if similarity_score < 0.70:
        return jsonify({"error": "Image similarity is below threshold"}), 400

    # Dividing the ECG into leads with resizing for consistency
    Leads = []
    for i in range(13):  # Adjust indices if needed
        y_start = 300 + (i // 3) * 300
        y_end = y_start + 300
        x_start = 150 + (i % 3) * 496
        x_end = x_start + 493  # Adjust based on your image layout
        lead = resize(image[y_start:y_end, x_start:x_end], (300, 450))
        Leads.append(lead)

    # Preprocess leads
    for lead_no, lead in enumerate(Leads[:12]):
        grayscale = color.rgb2gray(lead)
        blurred_image = gaussian(grayscale, sigma=0.9)
        global_thresh = threshold_otsu(blurred_image)
        binary_global = blurred_image < global_thresh
        binary_global = resize(binary_global, (300, 450))

        # Signal extraction from leads
        contours = measure.find_contours(binary_global, 0.8)
        contours_shape = sorted([c.shape for c in contours])[::-1][0:1]
        test = None

        for contour in contours:
            if contour.shape in contours_shape:
                test = resize(contour, (255, 2))

        # Scaling the data
        scaler = MinMaxScaler()
        fit_transform_data = scaler.fit_transform(test)
        normalized_scaled = pd.DataFrame(fit_transform_data[:, 0], columns=['X']).T

        # Save scaled data to CSV
        csv_file = f'Scaled_1DLead_{lead_no + 1}.csv'
        normalized_scaled.to_csv(csv_file, mode='a' if os.path.isfile(csv_file) else 'w', index=False)

    # Combining all 12 leads
    test_final = combine_lead_signals()

    # Ensure `test_final` has the expected number of features
    num_expected_features = loaded_model.n_features_in_
    if test_final.shape[1] > num_expected_features:
        test_final = test_final.iloc[:, :num_expected_features]  # Truncate if there are extra columns
    elif test_final.shape[1] < num_expected_features:
        missing_columns = num_expected_features - test_final.shape[1]
        for _ in range(missing_columns):
            test_final[test_final.shape[1]] = 0

    # Predict ECG condition
    result = loaded_model.predict(test_final)

    # Interpret the prediction result
    diagnoses = {
        0: "Myocardial Infarction",
        1: "Abnormal Heartbeat",
        2: "Normal",
        3: "History of Myocardial Infarction"
    }
    diagnosis = diagnoses.get(result[0], "Unknown Condition")

    # Return the diagnosis as a response in the Flask app context
    return jsonify({
        "diagnosis": diagnosis,
        "similarity_score": similarity_score
    }), 200

def download_image(url):
    # Implement the logic to download the image from Firebase Cloud Storage
    bucket = storage.bucket()
    blob = bucket.blob(url)
    local_file_path = f'temp_image.jpg'  # Temporary file path for storing the image
    blob.download_to_filename(local_file_path)
    return local_file_path

def combine_lead_signals():
    test_final = pd.read_csv('Scaled_1DLead_1.csv')
    location = './'  # Update the location if needed

    for file in os.listdir(location):
        if file.endswith(".csv") and file != 'Scaled_1DLead_1.csv':
            df = pd.read_csv(os.path.join(location, file))
            test_final = pd.concat([test_final, df], axis=1, ignore_index=True)

    test_final = test_final.fillna(0)
    return test_final

if __name__ == '__main__':
    app.run(debug=True)
