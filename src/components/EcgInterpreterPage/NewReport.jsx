import { Camera, Upload, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import axios from "axios";
import { storage } from "../../firebase.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ECGUploadPage = () => {
	const [uploadedImage, setUploadedImage] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [ecgFormat, setEcgFormat] = useState("");
	const [voltage, setVoltage] = useState("");
	const [speed, setSpeed] = useState("");
	const [selectedReasons, setSelectedReasons] = useState([]);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [imageFile, setImageFile] = useState(null);
	const [predictionResult, setPredictionResult] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setUploadedImage(imageUrl);
			setImageFile(file);
		}
	};

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

	const handleClearImage = () => {
		setUploadedImage(null);
		setImageFile(null);
		setPredictionResult(null);
	};

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

	const handleReasonChange = (event) => {
		const value = event.target.value;
		setSelectedReasons((prevSelected) =>
			prevSelected.includes(value)
				? prevSelected.filter((reason) => reason !== value)
				: [...prevSelected, value]
		);
	};

	const handleProcessECG = async () => {
		setIsProcessing(true);
		console.log("Starting ECG processing...");

		try {
			const response = await axios.post("http://localhost:3008/predict", {
				image_url: uploadedImage,
			});

			console.log("Received response:", response);
			if (response.status === 200) {
				setPredictionResult(response.data);
				setIsModalOpen(true);
			} else {
				alert("Failed to get prediction.");
			}
		} catch (error) {
			console.error("Error processing ECG:", error);
			alert(
				"Error processing ECG: " +
					(error.response ? error.response.data.message : error.message)
			);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setPredictionResult(null);
	};

	return (
		<div className="flex-1 overflow-auto relative z-10 min-h-screen mx-6">
			<h1 className="text-xl font-semibold mb-4 text-center">
				Create Your New Report
			</h1>
			<section className="flex-1 mb-6 bg-gray-800 px-8 rounded-lg shadow-none py-9">
				<h1 className="text-xl font-semibold mb-8">Upload ECG</h1>
				<div className="flex items-center gap-8 mb-10">
					<label
						htmlFor="upload"
						className="bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700 flex items-center gap-4 cursor-pointer">
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
					<div className="flex items-center gap-2 mb-2">
						<div className="border border-gray-400 p-1 rounded-md">
							<img
								src={uploadedImage}
								alt="Uploaded ECG"
								className="max-w-xs"
							/>
						</div>
						<button
							onClick={handleClearImage}
							className="bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700 flex items-center gap-2">
							<X size={18} /> Clear Image
						</button>
					</div>
				)}
				<div className="mb-4">
					<button
						onClick={handleUploadButtonClick}
						className="bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700">
						Upload
					</button>
				</div>
				<div className="space-y-5 mb-12">
					<div>
						<label className="block mb-1">Select ECG Format</label>
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
						<label className="block mb-1">Select Voltage</label>
						<input
							type="number"
							className="w-full bg-gray-700 text-white py-1 px-2 rounded-md"
							placeholder="Voltage (mV)"
							value={voltage}
							onChange={(e) => setVoltage(e.target.value)}
						/>
					</div>
					<div>
						<label className="block mb-1">Select Speed</label>
						<input
							type="number"
							className="w-full bg-gray-700 text-white py-1 px-2 rounded-md"
							placeholder="Speed (mm/s)"
							value={speed}
							onChange={(e) => setSpeed(e.target.value)}
						/>
					</div>
				</div>
				<div>
					<label className="block mb-1">Reason for ECG</label>
					<div className="flex justify-between">
						<div className="flex flex-col space-y-1">
							<label className="flex items-center">
								<input
									type="checkbox"
									value="Routine Checkup"
									checked={selectedReasons.includes("Routine Checkup")}
									onChange={handleReasonChange}
									className="mr-2"
								/>
								Routine Checkup
							</label>
							<label className="flex items-center">
								<input
									type="checkbox"
									value="Suspected Heart Condition"
									checked={selectedReasons.includes(
										"Suspected Heart Condition"
									)}
									onChange={handleReasonChange}
									className="mr-2"
								/>
								Suspected Heart Condition
							</label>
							<label className="flex items-center">
								<input
									type="checkbox"
									value="Heart Attack Symptoms"
									checked={selectedReasons.includes("Heart Attack Symptoms")}
									onChange={handleReasonChange}
									className="mr-2"
								/>
								Heart Attack Symptoms
							</label>
							<label className="flex items-center">
								<input
									type="checkbox"
									value="Pre-Surgery Assessment"
									checked={selectedReasons.includes("Pre-Surgery Assessment")}
									onChange={handleReasonChange}
									className="mr-2"
								/>
								Pre-Surgery Assessment
							</label>
						</div>
					</div>
				</div>
				<div className="flex justify-center mt-8">
					<button
						onClick={handleProcessECG}
						disabled={!uploadedImage || isProcessing}
						className={`${
							isProcessing ? "bg-gray-400" : "bg-green-600"
						} text-white py-1 px-4 rounded-md hover:bg-green-700`}>
						{isProcessing ? "Processing..." : "Process ECG"}
					</button>
				</div>
			</section>

			{/* Modal for displaying prediction result */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
						<h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
						<p>
							<strong>Diagnosis:</strong> {predictionResult?.diagnosis}
						</p>
						<p>
							<strong>Similarity:</strong> {predictionResult?.similarity}
						</p>
						<div className="flex justify-end mt-4">
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
