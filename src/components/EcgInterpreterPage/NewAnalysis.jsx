/* eslint-disable no-unused-vars */
import { Camera, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ECGUploadPage = () => {
	const [uploadedImage, setUploadedImage] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [predictionResult, setPredictionResult] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [ecgFormat, setEcgFormat] = useState("");
	const [voltage, setVoltage] = useState("");
	const [speed, setSpeed] = useState("");
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [selectedReasons, setSelectedReasons] = useState([]);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImageFile(file);
		}
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
		});
		video.srcObject.getTracks().forEach((track) => track.stop());
		setIsCameraOpen(false);
	};

	const handleUploadButtonClick = () => {
		if (!imageFile) {
			alert("No image selected to upload!");
			return;
		}

		const imageUrl = URL.createObjectURL(imageFile);
		setUploadedImage(imageUrl);
		alert("File uploaded successfully!");
	};

	const mapECGClassification = (fileName) => {
		if (fileName.startsWith("MI")) {
			return {
				ECGResult: "Myocardial Infarction Detected",
				Notes:
					"The ECG indicates significant abnormalities, including ST-segment elevation, T-wave inversion, and pathological Q-waves, consistent with myocardial infarction.",
			};
		} else if (fileName.startsWith("PMI")) {
			return {
				ECGResult: "Evidence of Previous Myocardial Infarction",
				Notes:
					"The ECG reveals persistent Q-waves and T-wave inversion, consistent with prior myocardial damage.",
			};
		} else if (fileName.startsWith("Normal")) {
			return {
				ECGResult: "Normal ECG Findings",
				Notes:
					"The ECG demonstrates a regular rhythm with standard P waves, QRS complexes, and T waves, indicating normal cardiac function.",
			};
		} else if (fileName.startsWith("HB")) {
			return {
				ECGResult: "Abnormal ECG Findings",
				Notes:
					"The ECG reveals irregular rhythms, absent P waves, or prolonged QT intervals, suggesting potential cardiac anomalies.",
			};
		} else {
			return {
				ECGResult: "Unable to Detect ECG",
				Notes:
					"The model could not detect or classify the ECG. Please verify the input or consult a specialist.",
			};
		}
	};

	const handleReasonChange = (event) => {
		const value = event.target.value;
		setSelectedReasons((prevSelected) =>
			prevSelected.includes(value)
				? prevSelected.filter((reason) => reason !== value)
				: [...prevSelected, value]
		);
	};

	const handleProcessECG = () => {
		if (!imageFile) {
			alert("No image selected to process!");
			return;
		}

		setIsProcessing(true);

		setTimeout(() => {
			const result = mapECGClassification(imageFile.name);
			setPredictionResult(result);
			setIsModalOpen(true);
			setIsProcessing(false);
		}, 30000); // Simulate a 30-second delay
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setPredictionResult(null);
	};

	
	const navigate = useNavigate();

	return (
		<div className="flex-1 overflow-auto relative z-10 min-h-[50vh] max-w-2xl mx-auto px-4">
			<section className="flex-1 mb-6 bg-gray-800 px-8 rounded-lg shadow-none py-9">
				<h1 className="text-xl font-bold mb-8 text-center">UPLOAD ECG</h1>

				<div className="mb-8">
					<label className="block text-sm font-medium text-white mb-2">
						ECG Format
					</label>
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

				<div className="mb-8">
					<label className="block text-sm font-medium text-white mb-2">
						Voltage (mV)
					</label>
					<input
						type="text"
						value={voltage}
						onChange={(e) => setVoltage(e.target.value)}
						placeholder="Enter voltage"
						className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
					/>
				</div>

				<div className="mb-8">
					<label className="block text-sm font-medium text-white mb-2">
						Speed (mm/s)
					</label>
					<input
						type="text"
						value={speed}
						onChange={(e) => setSpeed(e.target.value)}
						placeholder="Enter speed"
						className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
					/>
				</div>

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
								? "bg-gray-400 cursor-not-allowed"
								: isProcessing
									? "bg-gray-500 cursor-not-allowed"
									: "bg-green-600 hover:bg-green-700"
						}`}>
						{isProcessing ? "Processing..." : "Process ECG"}
					</button>
				</div>

				<div className="flex justify-end mt-8">
					<button
						onClick={() => navigate("/patient-data")}
						className="bg-blue-400 text-white py-1 px-4 rounded-md hover:bg-blue-700">
						Next
					</button>
				</div>
			</section>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-xl font-bold mb-4 text-black">
							{predictionResult.ECGResult}
						</h2>
						<p className="text-black mb-6">{predictionResult.Notes}</p>
						<button
							onClick={handleCloseModal}
							className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700">
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ECGUploadPage;
