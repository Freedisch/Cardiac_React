from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import firebase_admin
from fastapi.middleware.cors import CORSMiddleware  # Correct import for CORSMiddleware
from firebase_admin import credentials, storage, firestore
import os
import requests
from scipy.signal import find_peaks, savgol_filter
from skimage.io import imread
from skimage.color import rgb2gray
from skimage.filters import threshold_otsu
import joblib
import tempfile
import cv2
import numpy as np
import pickle
import aiohttp
from skimage import img_as_ubyte
from skimage.restoration import denoise_wavelet
from skimage.transform import resize
from scipy.ndimage import gaussian_filter  # Correct import for Gaussian filter
from skimage.filters import threshold_otsu
from scipy.signal import savgol_filter
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
import io
from fastapi import FastAPI, HTTPException
from tensorflow.keras.models import load_model





# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with the allowed origins you want
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (including OPTIONS)
    allow_headers=["*"],  # Allows all headers
)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./missioncapstone-21b12-firebase-adminsdk-9p748-0a02dc3abd.json')  # Update this path
firebase_admin.initialize_app(cred, {
    "storageBucket": 'missioncapstone-21b12.appspot.com'  # Replace with your Firebase bucket name
})

# -------------------- Section 1: ECG Prediction --------------------

def fetch_image_from_firebase(image_name):
    """Fetch the specified image from Firebase Storage."""
    print(f"Fetching image: {image_name}")  # Debugging output
    bucket = storage.bucket()
    blob = bucket.blob(image_name)

    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
        temp_image_path = tmp_file.name

    try:
        blob.download_to_filename(temp_image_path)
        print(f"Image downloaded to temporary path: {temp_image_path}")  # Debugging output
        return temp_image_path
    except Exception as e:
        print(f"Error downloading image '{image_name}': {e}")
        return None

def fetch_most_recent_image():
    """Fetch the most recent image from Firebase Storage."""
    print("Fetching the most recent image...")
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix='images/')  # Adjust prefix as necessary

    images = [(blob.name, blob.updated) for blob in blobs if blob.name.endswith('.jpg')]
    print(f"Found images: {images}")  # Debugging output

    if not images:
        print("No images found in the specified path.")
        return None

    most_recent_image = max(images, key=lambda x: x[1])[0]
    print(f"Most recent image: {most_recent_image}")  # Debugging output

    return fetch_image_from_firebase(most_recent_image)


# Load pre-trained model
def load_model():
    try:
        # Replace with the correct path to your model
        model_path = "stacked_model.pkl"
        return joblib.load(model_path)
    except Exception as e:
        print(f"Error loading model: {e}")
        return None



def process_image_for_ecg(filepath, output_folder_path, filename):
    """
    Process an ECG image to extract features, apply denoising, normalization, resizing,
    and return the smoothed signal.
    """
    try:
        # Step 1: Read the image
        image = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)  # Read as grayscale directly
        if image is None:
            raise ValueError("Image could not be read. Check the file path.")
        
        print(f"Original image shape: {image.shape}")  # Debugging output
        
        # Step 2: Denoise the image
        # Apply Gaussian blur
        gaussian_blurred = gaussian_filter(image, sigma=1)
        print(f"Gaussian blurred image shape: {gaussian_blurred.shape}")  # Debugging output
        
        # Apply wavelet denoising
        wavelet_denoised = denoise_wavelet(
            gaussian_blurred, method='BayesShrink', mode='soft', rescale_sigma=True
        )
        wavelet_denoised = np.clip(wavelet_denoised, 0, 1)  # Ensure pixel values are between 0 and 1
        wavelet_denoised = img_as_ubyte(wavelet_denoised)  # Convert to 8-bit unsigned integers
        print(f"Wavelet denoised image shape: {wavelet_denoised.shape}")  # Debugging output
        
        # Save denoised images for debugging/inspection
        cv2.imwrite(f"{output_folder_path}/denoised_{filename}", wavelet_denoised)

        # Step 3: Normalize the image
        normalized_image = (wavelet_denoised - np.min(wavelet_denoised)) / (np.max(wavelet_denoised) - np.min(wavelet_denoised))
        
        # Step 4: Resize the image to 224x224 (This is the key part)
        resized_image = resize(normalized_image, (224, 224), anti_aliasing=True)
        resized_image = img_as_ubyte(resized_image)  # Convert to 8-bit unsigned integers
        print(f"Resized image shape: {resized_image.shape}")  # Debugging output
        
        # Save resized image for debugging/inspection
        cv2.imwrite(f"{output_folder_path}/resized_{filename}", resized_image)

        # Step 5: Apply Otsu's thresholding
        threshold = threshold_otsu(resized_image)
        binary_image = resized_image > threshold
        print(f"Threshold value: {threshold}")  # Debugging output

        # Step 6: Flatten and smooth the signal
        flattened_signal = binary_image.flatten()
        print(f"Flattened signal length: {len(flattened_signal)}")  # Debugging output

        # Apply Savitzky-Golay smoothing filter
        smoothed_signal = savgol_filter(flattened_signal, window_length=41, polyorder=2)
        print(f"Smoothed signal length: {len(smoothed_signal)}")  # Debugging output

        # Ensure the smoothed signal is returned
        return smoothed_signal

    except Exception as e:
        print(f"Error during image processing: {e}")
        return None  # If there's any error, return None


def extract_ecg_metrics(smoothed_signal):
    """
    Extract ECG metrics like RR intervals and heart rate from the smoothed signal.
    """
    try:
        if smoothed_signal is None:
            raise ValueError("The smoothed signal is None.")
        
        print(f"Smoothed signal length: {len(smoothed_signal)}")  # Debugging output

        # Detect R-peaks
        r_peaks, _ = find_peaks(smoothed_signal, height=0.5, distance=50)
        print(f"Detected R-peaks: {r_peaks}")  # Debugging output
        
        rr_intervals = np.diff(r_peaks)
        print(f"RR intervals: {rr_intervals}")  # Debugging output

        # Calculate metrics
        avg_rr_interval = np.mean(rr_intervals) if len(rr_intervals) > 0 else 0
        rr_interval_std = np.std(rr_intervals) if len(rr_intervals) > 0 else 0
        heart_rate = 60 / avg_rr_interval if avg_rr_interval else 0

        # QRS detection (placeholder logic)
        avg_qrs_duration = np.mean([s - q for q, s in zip(r_peaks[:-1], r_peaks[1:])]) if len(r_peaks) > 1 else 0

        # Prepare features for scaling
        X = np.array([[avg_rr_interval, rr_interval_std, heart_rate, avg_qrs_duration]])

        # Initialize the scaler
        scaler = StandardScaler()

        # Apply scaling
        X_scaled = scaler.fit_transform(X)

        return {
            'avgRRInterval': X_scaled[0, 0],
            'rrIntervalStd': X_scaled[0, 1],
            'heartRate': X_scaled[0, 2],
            'avgQRSDuration': X_scaled[0, 3],
        }

    except Exception as e:
        print(f"Error extracting ECG metrics: {e}")
        return None  # If there's an error extracting metrics, return None



def predict_ecg_label(features):
    """
    Predict the ECG class using a locally saved pre-trained model.
    """
    try:
        # Load the trained model locally
        rf_model = load_model()

        if rf_model is None:
            print("Model could not be loaded.")
            return "Unknown"
        
        # Label mapping
        label_mapping = {0: 'Abnormal', 1: 'HMI', 2: 'MI', 3: 'Normal'}
        
        print(f"Predicting ECG label with features: {features}")  # Debugging output
        
        # Make the prediction
        predicted_class = rf_model.predict([features])[0]
        print(f"Predicted class: {predicted_class}")  # Debugging output

        # Return the predicted label
        return label_mapping.get(predicted_class, "Unknown")

    except Exception as e:
        print(f"Error during model prediction: {e}")  # Debugging output
        return "Unknown"



def get_ecg_result_details(predicted_label):
    """
    Get detailed ECG results based on the predicted label.
    """
    result_mapping = {
        'Normal': {
            'ECGResult': 'Normal ECG Image',
            'Notes': 'A normal ECG shows a regular rhythm with normal P waves, QRS complexes, and T waves.'
        },
        'Abnormal': {
            'ECGResult': 'Abnormal ECG Image',
            'Notes': 'An abnormal ECG shows irregular rhythms, absent P waves, or prolonged QT intervals.'
        },
        'MI': {
            'ECGResult': 'Myocardial Infarction (MI) ECG Image',
            'Notes': 'An ECG showing ST elevation, T wave inversion, and pathological Q waves.'
        },
        'History of MI': {
            'ECGResult': 'History of Myocardial Infarction (MI) ECG Image',
            'Notes': 'An ECG with persistent Q waves and T wave inversion, indicating past heart damage.'
        }
    }
    return result_mapping.get(predicted_label, {
        'ECGResult': 'Abnormal Heartbeat',
        'Notes': 'An abnormal ECG shows irregular rhythms, absent P waves, or prolonged QT intervals.'
    })
    
# Final Prediction Endpoint
@app.post("/predict-ecg")
def predict_ecg():
    try:
        # Step 1: Fetch the most recent image from Firebase
        image_path = fetch_most_recent_image()
        if image_path is None:
            raise ValueError("No recent ECG image found in Firebase.")
        print(f"Image path: {image_path}")  # Debugging output

        # Step 2: Process the image and obtain the smoothed signal
        smoothed_signal = process_image_for_ecg(image_path, output_folder_path="outputs", filename="processed_image.jpg")
        if smoothed_signal is None:
            raise ValueError("Error processing the image. The smoothed signal is None.")
        print(f"Smoothed signal: {smoothed_signal[:10]}")  # Debugging output

        # Step 3: Extract features (metrics) from the smoothed signal
        metrics = extract_ecg_metrics(smoothed_signal)
        if metrics is None:
            raise ValueError("Error extracting ECG metrics. The metrics are None.")
        print(f"Extracted metrics: {metrics}")  # Debugging output

        # Prepare features for prediction
        features = [
            metrics.get('heartRate', 0),
            metrics.get('avgRRInterval', 0),
            metrics.get('rrIntervalStd', 0),
            metrics.get('avgQRSDuration', 0)
        ]

        print(f"Prepared features: {features}")  # Debugging output

        # Step 4: Load the pre-trained model and predict
        rf_model = load_model()
        if rf_model is None:
            raise ValueError("Model could not be loaded.")
        
        # Label mapping
        label_mapping = {0: 'Abnormal', 1: 'HMI', 2: 'MI', 3: 'Normal'}
        
        # Predict the class
        predicted_class = rf_model.predict([features])[0]
        predicted_label = label_mapping.get(predicted_class, "Unknown")
        print(f"Predicted label: {predicted_label}")  # Debugging output

        # Step 5: Get detailed result based on predicted label
        result_details = get_ecg_result_details(predicted_label)

        return {
            "predicted_label": predicted_label,
            "ECGResults": result_details['ECGResult'],
            "Notes": result_details['Notes']
        }

    except Exception as e:
        # Log the error for debugging
        print(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    
# -------------------- Section 2: Heart Disease Prediction --------------------

# Patient data model
class PatientData(BaseModel):
    Smoking: str
    AlcoholDrinking: str
    Stroke: str
    DiffWalking: str
    Sex: str
    Diabetic: str
    PhysicalActivity: str
    Asthma: str
    KidneyDisease: str
    SkinCancer: str
    AgeCategory: str
    Race: str
    GenHealth: str
    BMI: float
    PhysicalHealth: float
    MentalHealth: float
    SleepTime: float

# Function to download files from Firebase
def download_file(firebase_path, local_path):
    print(f"Attempting to download {firebase_path} to {local_path}...")
    
    try:
        bucket = storage.bucket()  # Access the default bucket from your initialized Firebase app
        blob = bucket.blob(firebase_path)
        
        # Download the file to the local path
        blob.download_to_filename(local_path)
        print(f"Successfully downloaded {firebase_path} to {local_path}")
    except Exception as e:
        print(f"Error downloading {firebase_path}: {e}")
        return False
    
    # Confirm that the file now exists locally
    return os.path.exists(local_path)


# Load encoders and scaler
def load_encoders_and_scaler():
    print("Loading encoders and scaler...")
    encoders_path = './Label_encoder'
    os.makedirs(encoders_path, exist_ok=True)

    # Load scaler
    scaler_path = f'{encoders_path}/continuous_scaler.pkl'
    if not download_file('Label_encoder/continuous_scaler.pkl', scaler_path):
        print("Error: Continuous scaler download failed.")
        return None, None

    try:
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        print("Scaler loaded successfully.")
    except Exception as e:
        print(f"Error loading scaler: {e}")
        return None, None

    # Load encoders
    label_encoders = {}
    categorical_features = [
        'Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 'Sex',
        'Diabetic', 'PhysicalActivity', 'Asthma', 'KidneyDisease', 'SkinCancer',
        'AgeCategory', 'Race', 'GenHealth'
    ]

    for feature in categorical_features:
        encoder_path = f'{encoders_path}/{feature}_encoder.pkl'
        if not download_file(f'Label_encoder/{feature}_encoder.pkl', encoder_path):
            print(f"Error: Encoder for {feature} download failed.")
            return None, None

        try:
            with open(encoder_path, 'rb') as f:
                label_encoders[feature] = pickle.load(f)
            print(f"Encoder for {feature} loaded successfully.")
        except Exception as e:
            print(f"Error loading encoder for {feature}: {e}")
            return None, None

    return label_encoders, scaler

# Function to download the model
def download_model(firebase_path, local_path):
    print(f"Attempting to download model from {firebase_path} to {local_path}...")
    
    try:
        bucket = storage.bucket()  # Access the default bucket from your initialized Firebase app
        blob = bucket.blob(firebase_path)
        
        # Download the model file to the local path
        blob.download_to_filename(local_path)
        print(f"Model downloaded to {local_path}.")
    except Exception as e:
        print(f"Error downloading model: {e}")
        return False
    
    # Check if the file was downloaded successfully
    return os.path.exists(local_path)

# Preprocess data for prediction
def predict_heart_disease(model, label_encoders, scaler, input_data):
    print("Starting preprocessing...")
    print(f"Input Data: {input_data}")

    categorical_features = [
        'Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 'Sex',
        'Diabetic', 'PhysicalActivity', 'Asthma', 'KidneyDisease', 'SkinCancer',
        'AgeCategory', 'Race', 'GenHealth',
    ]
    continuous_features = ['BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime']

    # Encode categorical features
    for feature in categorical_features:
        input_data[feature] = label_encoders.get(feature, {}).transform([input_data[feature]])[0] \
            if input_data.get(feature) in label_encoders.get(feature, {}).classes_ else -1

    # Scale continuous features
    for feature in continuous_features:
        input_data[feature] = (input_data[feature] - scaler.mean_[continuous_features.index(feature)]) / scaler.scale_[continuous_features.index(feature)] \
            if feature in continuous_features else 0.0

    input_tensor = tf.convert_to_tensor([list(input_data.values())], dtype=tf.float32)

    prediction = model.predict(input_tensor).flatten()[0]
    return Prediction

from tensorflow.keras.models import load_model

@app.post("/predict-heart-disease/")
def predict_heart_disease_route(patient_data: PatientData):
    label_encoders, scaler = load_encoders_and_scaler()
    if not label_encoders or not scaler:
        raise HTTPException(status_code=500, detail="Failed to load encoders or scaler.")

    model_path = "./Models/heart_disease_model.h5"
    if not download_model("Models/heart_disease_model.h5", model_path):
        raise HTTPException(status_code=500, detail="Failed to download model.")

    model = load_model(model_path)
    input_data = patient_data.dict()
    prediction = predict_heart_disease(model, label_encoders, scaler, input_data)
    prediction_label = "Positive" if prediction > 0.5 else "Negative"
    resultMessage = (
        "This indicates that this patient is likely to have heart disease."
        if prediction > 0.5 else
        "This indicates that this patient is unlikely to have heart disease."
    )

    return {
        "prediction": f"Heart Disease Prediction: {prediction_label} (Score: {prediction:.2f})",
        "resultMessage": resultMessage,
    }





# -------------------- Section 3: Final Analysis --------------------


# Models
class HeartDiseaseData(BaseModel):
    HeartDisease: str  # Positive or Negative

class ECGRequest(BaseModel):
    ecgClass: str  # e.g., Myocardial Infarction, Abnormal Heartbeat, etc.
    heartDiseaseData: HeartDiseaseData

# Functions
def get_ecg_result_details(ecg_class: str):
    """
    Function to retrieve ECG notes based on the classification.
    """
    ecg_notes_map = {
        "Myocardial Infarction": "Indicates potential heart muscle damage due to reduced blood flow.",
        "History of Myocardial Infarction": "Suggests a prior episode of heart muscle damage.",
        "Abnormal Heartbeat": "Irregular heartbeat detected; may require further evaluation.",
        "Normal Heartbeat": "Heart rhythm appears normal with no abnormalities detected."
    }
    return ecg_notes_map.get(ecg_class, "Unknown ECG classification.")

def assign_diagnosis_recommendation_and_notes(ecg_class: str, heart_disease: str):
    """
    Assigns a diagnosis, notes, recommendations, and follow-up actions based on ECG and heart disease data.
    """
    diagnosis, notes, recommendation, follow_up, critical_alert, referral = "", "", "", "", "", ""

    if ecg_class == 'Myocardial Infarction':
        if heart_disease == 'Positive':
            diagnosis = 'Acute Coronary Syndrome with High Risk of Recurrence'
            notes = 'Critical scenario requiring immediate intervention.'
            recommendation = 'Immediate referral to a cardiologist; prescribe anticoagulants and lifestyle changes.'
            follow_up = 'Weekly follow-up until condition stabilizes.'
            critical_alert = 'High'
            referral = 'Yes'
        else:
            diagnosis = 'Previous Myocardial Infarction; Stable Condition'
            notes = 'Stable post-MI condition, monitoring recommended.'
            recommendation = 'Regular cardiovascular assessment every 3 months; monitor symptoms.'
            follow_up = '3-month follow-up with primary care.'
            critical_alert = 'Medium'
            referral = 'Consider cardiology if symptoms worsen'
    elif ecg_class == 'History of Myocardial Infarction':
        if heart_disease == 'Positive':
            diagnosis = 'History of Myocardial Infarction; Risk of Complications'
            notes = 'Further evaluation necessary to prevent complications.'
            recommendation = 'Lifestyle counseling and medication adherence; low-dose aspirin advised.'
            follow_up = 'Monthly check-ins to assess risk.'
            critical_alert = 'Medium'
            referral = 'Yes'
        else:
            diagnosis = 'Stable Post-MI; No Current Risk'
            notes = 'Recovered well from previous MI, no current issues.'
            recommendation = 'Annual cardiovascular exam; maintain healthy lifestyle.'
            follow_up = 'Annual check-up.'
            critical_alert = 'Low'
            referral = 'No'
    elif ecg_class == 'Abnormal Heartbeat':
        if heart_disease == 'Positive':
            diagnosis = 'Chronic Arrhythmia'
            notes = 'Chronic arrhythmia requires ongoing management and medication.'
            recommendation = 'Anti-arrhythmic drugs and possible ablation therapy; avoid strenuous activities.'
            follow_up = 'Bi-weekly follow-up with ECG monitoring.'
            critical_alert = 'High'
            referral = 'Yes'
        else:
            diagnosis = 'Minor Arrhythmia; No Immediate Concern'
            notes = 'Typically benign but should be monitored if symptoms develop.'
            recommendation = 'Lifestyle modifications; reduce caffeine and stress.'
            follow_up = '3-month follow-up if symptoms develop.'
            critical_alert = 'Low'
            referral = 'No'
    else:  # Normal Heartbeat
        if heart_disease == 'Negative':
            diagnosis = 'Healthy Cardiac Status'
            notes = 'Normal heart rhythm indicating healthy cardiac function.'
            recommendation = 'Maintain balanced diet, exercise, and sleep habits.'
            follow_up = 'Annual wellness check-up.'
            critical_alert = 'None'
            referral = 'No'
        else:
            diagnosis = 'Early Signs of Cardiac Risk'
            notes = 'Potential heart disease signs, requiring preventive measures.'
            recommendation = 'Preventive medication and cardiovascular fitness plan.'
            follow_up = '6-month follow-up for early intervention.'
            critical_alert = 'Medium'
            referral = 'Consider preventive cardiology'

    return {
        'Diagnosis': diagnosis,
        'Notes': notes,
        'Recommendation': recommendation,
        'FollowUp': follow_up,
        'CriticalAlert': critical_alert,
        'Referral': referral
    }

@app.post("/get-diagnosis")
async def get_diagnosis(ecg_request: ECGRequest):
    try:
        # Extract ECG and heart disease data from the request
        ecg_class = ecg_request.ecgClass
        heart_disease_status = ecg_request.heartDiseaseData.HeartDisease

        # Validate heart disease prediction value
        if heart_disease_status not in ['Positive', 'Negative']:
            raise ValueError("HeartDisease must be 'Positive' or 'Negative'")

        # Step 1: Get ECG result details
        ecg_notes = get_ecg_result_details(ecg_class)

        # Step 2: Assign diagnosis, recommendations, and follow-up
        diagnosis_info = assign_diagnosis_recommendation_and_notes(ecg_class, heart_disease_status)

        # Combine results
        result = {
            'Heart Disease Prediction': heart_disease_status,
            'ECG Class': ecg_class,
            'ECG Notes': ecg_notes,
            'Diagnosis': diagnosis_info['Diagnosis'],
            'Notes': diagnosis_info['Notes'],
            'Recommendation': diagnosis_info['Recommendation'],
            'FollowUp': diagnosis_info['FollowUp'],
            'CriticalAlert': diagnosis_info['CriticalAlert'],
            'Referral': diagnosis_info['Referral']
        }

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing diagnosis: {str(e)}")

# -------------------- Run the Server --------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
