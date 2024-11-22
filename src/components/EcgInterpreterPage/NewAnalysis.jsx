// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, Camera, X } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

import { storage } from "../../pages/firebase.js";

const ECGUploadPage = () => {
	const [uploadedImage, setUploadedImage] = useState(null); // Store the uploaded image URL
	const [imageFile, setImageFile] = useState(null); // Store the image file
	const [isProcessing, setIsProcessing] = useState(false); // Handle processing state
	const [predictionResult, setPredictionResult] = useState(null); // Store prediction result
	const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
	const [ecgFormat, setEcgFormat] = useState(""); // Store ECG format selection
	const [voltage, setVoltage] = useState(""); // Store voltage input
	const [speed, setSpeed] = useState(""); // Store speed input
	const [selectedReasons, setSelectedReasons] = useState([]); // Store selected reasons for ECG
	const [isCameraOpen, setIsCameraOpen] = useState(false); // Control camera visibility
	const videoRef = useRef(null); // Reference for video element
	const canvasRef = useRef(null); // Reference for canvas element

	// Handle file upload
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setUploadedImage(imageUrl);
			setImageFile(file);
		}
	};

	// Handle camera open
	const handleOpenCamera = async () => {
		setIsCameraOpen(true);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			videoRef.current.srcObject = stream;
			videoRef.current.play();
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	
	// Capture photo from camera
	const handleCapturePhoto = () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imageUrl = canvas.toDataURL("image/png");

		canvas.toBlob((blob) => {
			setImageFile(new File([blob], "captured_ecg.png", { type: "image/png" }));
			setUploadedImage(imageUrl);
		});
		video.srcObject.getTracks().forEach((track) => track.stop());
		setIsCameraOpen(false);
	};

	// Handle file upload to Firebase
	const handleUploadButtonClick = async () => {
		if (!imageFile) {
			alert("No image selected to upload!");
			return;
		}

		const storageRef = ref(storage, `images/${imageFile.name}`);
		const uploadTask = uploadBytes(storageRef, imageFile);

		try {
			const snapshot = await uploadTask;
			const downloadURL = await getDownloadURL(snapshot.ref);
			alert("File uploaded successfully!");
			console.log("Uploaded file URL:", downloadURL);
			setUploadedImage(downloadURL);
		} catch (error) {
			console.error("Error uploading file:", error);
			alert("Error uploading file.");
		}
	};

	// Handle reason selection for ECG
	const handleReasonChange = (event) => {
		const value = event.target.value;
		setSelectedReasons((prevSelected) =>
			prevSelected.includes(value)
				? prevSelected.filter((reason) => reason !== value)
				: [...prevSelected, value]
		);
	};

	// Process the ECG and send it to the backend
	const handleProcessECG = async () => {
		setIsProcessing(true);
		try {
			const response = await axios.post("http://localhost:8000/predict-ecg");
			if (response.status === 200) {
				setPredictionResult(response.data); // Populate the modal with the backend response
				setIsModalOpen(true); // Open the modal
			} else {
				alert("Failed to get prediction.");
			}
		} catch (error) {
			console.error("Error processing ECG:", error);
			alert(
				"Error processing ECG: " +
					(error.response ? error.response.data.detail : error.message)
			);
		} finally {
			setIsProcessing(false);
		}
	};


	// Close the result modal
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setPredictionResult(null);
	};
	const navigate = useNavigate();
	
	return (
		<div className="flex-1 overflow-auto relative z-10 min-h-[50vh] max-w-2xl mx-auto px-4">
			<section className="flex-1 mb-6 bg-gray-800 px-8 rounded-lg shadow-none py-9">
				<h1 className="text-xl font-bold mb-8 text-center">UPLOAD ECG</h1>
				<div className="flex items-center gap-8 mb-10 justify-center">
					<label
						htmlFor="upload"
						className="bg-blue-400 text-black py-1 px-2 rounded-md hover:bg-green-700 flex items-center gap-4 cursor-pointer">
						<Upload size={18} /> Browse Files
					</label>
					<input
						type="file"
						id="upload"
						accept="image/*"
						className="hidden"
						onChange={handleFileUpload}
					/>
					<button
						onClick={handleOpenCamera}
						className="bg-yellow-600 text-white py-1 px-2 rounded-md hover:bg-yellow-700 flex items-center gap-1">
						<Camera size={18} /> Take ECG Photo
					</button>
				</div>

				{isCameraOpen && (
					<div className="mb-4">
						<video ref={videoRef} className="w-full max-w-xs border" autoPlay />
						<button
							onClick={handleCapturePhoto}
							className="mt-2 bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700">
							Capture Photo
						</button>
					</div>
				)}

				<canvas ref={canvasRef} className="hidden" />

				{uploadedImage && (
					<div className="flex justify-center items-center gap-8 mb-2">
						<div className="border border-gray-400 p-1 rounded-md">
							<img
								src={uploadedImage}
								alt="Uploaded ECG"
								className="max-w-md mx-auto"
							/>
						</div>
						<button
							onClick={() => setUploadedImage(null)}
							className="bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700 flex items-center gap-2">
							<X size={18} /> Clear Image
						</button>
					</div>
				)}

				<div className="flex justify-center mb-8">
					<button
						onClick={handleUploadButtonClick}
						className="bg-green-600 text-white py-1 px-2 rounded-md hover:bg-blue-700">
						Upload
					</button>
				</div>

				<div className="space-y-5 mb-12">
					<div>
						<select
							className="w-full bg-gray-700 text-white py-1 px-2 rounded-md"
							value={ecgFormat}
							onChange={(e) => setEcgFormat(e.target.value)}>
							<option value="" disabled>
								Select Format
							</option>
							<option value="12-lead">12-Lead</option>
							<option value="3-lead">3-Lead</option>
							<option value="5-lead">5-Lead</option>
						</select>
					</div>

					<div>
						<input
							type="number"
							className="w-full bg-gray-700 text-white py-1 px-2 rounded-md"
							placeholder="Select Voltage (mV)"
							value={voltage}
							onChange={(e) => setVoltage(e.target.value)}
						/>
					</div>

					<div>
						<input
							type="number"
							className="w-full bg-gray-700 text-white py-1 px-2 rounded-md"
							placeholder="Select Speed (mm/s)"
							value={speed}
							onChange={(e) => setSpeed(e.target.value)}
						/>
					</div>
				</div>

				<div>
					<label className="text-xl font-bold mb-8 text-center w-1/2 mx-auto block border-b-2 border-gray-400">
						REASON FOR ECG
					</label>

					<div className="flex justify-center items-center mb-4 ml-10">
						<div className="flex space-x-16">
							{/* Left Column */}
							<div className="flex flex-col space-y-1">
								<label className="flex items-center">
									<input
										type="checkbox"
										value="Shortness of Breath"
										checked={selectedReasons.includes("Shortness of Breath")}
										onChange={handleReasonChange}
										className="mr-4"
									/>
									Shortness of Breath
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										value="Palpitations"
										checked={selectedReasons.includes("Palpitations")}
										onChange={handleReasonChange}
										className="mr-4"
									/>
									Palpitations
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										value="Syncope (Fainting)"
										checked={selectedReasons.includes("Syncope (Fainting)")}
										onChange={handleReasonChange}
										className="mr-4"
									/>
									Syncope (Fainting)
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										value="History of Heart Disease"
										checked={selectedReasons.includes(
											"History of Heart Disease"
										)}
										onChange={handleReasonChange}
										className="mr-4"
									/>
									History of Heart Disease
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										value="Risk Factors (Diabetes, High Cholesterol, Family History)"
										checked={selectedReasons.includes(
											"Risk Factors (Diabetes, High Cholesterol, Family History)"
										)}
										onChange={handleReasonChange}
										className="mr-4"
									/>
									Risk Factors (Diabetes, High Cholesterol, Family History)
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										value="Chest Pain"
										checked={selectedReasons.includes("Chest Pain")}
										onChange={handleReasonChange}
										className="mr-4"
									/>
									Chest Pain
								</label>
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-center mt-8">
					<button
						onClick={handleProcessECG}
						disabled={!uploadedImage || isProcessing}
						className={`py-2 px-6 rounded-md text-white transition duration-200 ease-in-out ${
							!uploadedImage
								? "bg-gray-400 cursor-not-allowed" // Disabled state (no image)
								: isProcessing
									? "bg-gray-500 cursor-not-allowed" // Processing state
									: "bg-green-600 hover:bg-green-700" // Enabled state
						}`}>
						{isProcessing ? (
							<span className="flex items-center gap-2">
								<svg
									className="animate-spin h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8H4zm2 5.292A7.972 7.972 0 014 12h8v5.292z"></path>
								</svg>
								Processing...
							</span>
						) : (
							"Process ECG"
						)}
					</button>
				</div>

				<div className="flex justify-end mt-8">
					<button
						onClick={() => navigate("/patient-data")} // Route to /patient-data
						className="bg-blue-400 text-white py-1 px-4 rounded-md hover:bg-blue-00">
						Next
					</button>
				</div>
			</section>

			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
					<div className="bg-white text-black p-6 rounded-lg shadow-md w-96 max-w-full">
						<h2 className="text-lg font-semibold mb-4">
							ECG Prediction Result
						</h2>

						{/* Display prediction results */}
						{predictionResult ? (
							<div>
								<p className="text-sm text-gray-700">
									<strong>ECG Results:</strong> {predictionResult.ECGResults}
								</p>
								<p className="text-sm text-gray-700 mt-2">
									<strong>Notes:</strong> {predictionResult.Notes}
								</p>
							</div>
						) : (
							<p className="text-sm text-gray-500">No result available.</p>
						)}

						<div className="flex justify-end mt-6">
							<button
								onClick={handleCloseModal}
								className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700">
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ECGUploadPage;
