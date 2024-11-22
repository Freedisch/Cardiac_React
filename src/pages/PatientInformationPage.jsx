import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage"; // Import Firebase storage functions
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs
import Header from "../components/common/Header.jsx";
import { db } from "../firebaseConfig"; // Assuming db is exported from firebaseConfig.js

const PatientPage = () => {
	const [isSyncing, setIsSyncing] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
	const [predictionResult, setPredictionResult] = useState(null); // State to store prediction result

	// Patient data states
	const [Name, setName] = useState("");
	const [Sex, setSex] = useState("");
	const [BMI, setBmi] = useState("");
	const [Smoking, setSmoking] = useState("");
	const [AlcoholDrinking, setAlcoholDrinking] = useState("");
	const [Stroke, setStroke] = useState("");
	const [PhysicalHealth, setPhysicalHealth] = useState("");
	const [MentalHealth, setMentalHealth] = useState("");
	const [DiffWalking, setDiffWalking] = useState("");
	const [AgeCategory, setAgeCategory] = useState("");
	const [Race, setRace] = useState("");
	const [Diabetic, setDiabetic] = useState("");
	const [PhysicalActivity, setPhysicalActivity] = useState("");
	const [GenHealth, setGenHealth] = useState("");
	const [SleepTime, setSleepTime] = useState("");
	const [Asthma, setAsthma] = useState("");
	const [KidneyDisease, setKidneyDisease] = useState("");
	const [SkinCancer, setSkinCancer] = useState("");

	const handleSyncPatients = async () => {
		try {
			setIsSyncing(true);

			// Generate unique ID and prepare patient data
			const uniqueId = uuidv4();
			const patientDataWithoutName = {
				AgeCategory,
				Sex,
				BMI: parseFloat(BMI),
				Smoking,
				AlcoholDrinking,
				Stroke,
				PhysicalHealth: parseFloat(PhysicalHealth),
				MentalHealth: parseFloat(MentalHealth),
				DiffWalking,
				Race,
				Diabetic,
				PhysicalActivity,
				GenHealth,
				SleepTime: parseFloat(SleepTime),
				Asthma,
				KidneyDisease,
				SkinCancer,
			};

			// Upload patient data to Firebase
			const storageRef = ref(storage, `Patients/${uniqueId}.json`);
			const blob = new Blob([JSON.stringify(patientDataWithoutName)], {
				type: "application/json",
			});
			await uploadBytes(storageRef, blob);

			// Add patient record to Firestore
			const patientDocRef = doc(db, "patients", uniqueId);
			await setDoc(
				patientDocRef,
				{
					patientId: uniqueId,
					timestamp: new Date(),
				},
				{ merge: true }
			);

			// Get heart disease prediction from backend
			const prediction = await getHeartDiseasePrediction(
				patientDataWithoutName
			);
			console.log("Prediction from backend:", prediction);

			setPredictionResult(prediction); // Set the full prediction result here
			setIsModalOpen(true); // Open the modal after setting prediction
		} catch (error) {
			console.error("Error syncing prediction results:", error);
			alert("An error occurred while syncing prediction results.");
		} finally {
			setIsSyncing(false);
		}
	};

	// Close modal
	// const handleCloseModal = () => {
	// 	setIsModalOpen(false);
	// 	setPredictionResult(null);
	// };

	// Function to call the prediction API
	const getHeartDiseasePrediction = async (data) => {
		try {
			const response = await fetch(
				"http://localhost:8000/predict-heart-disease",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);

			if (response.ok) {
				const result = await response.json();

				// Assuming the backend returns 'prediction' and 'resultMessage'
				return {
					prediction: result.prediction, // Example: "Heart Disease Prediction: Negative (Score: 0.00)"
					resultMessage: result.resultMessage, // Example: "This indicates that this patient is unlikely to have heart disease."
				};
			} else {
				const errorResponse = await response.json();
				alert(`Failed to get prediction: ${errorResponse.message}`);
				throw new Error("Failed to get prediction");
			}
		} catch (error) {
			console.error("Error calling the prediction API:", error);
			throw error;
		}
	};

	// Function to handle getting diagnosis
	const handleGetDiagnosis = async () => {
		try {
			// Prepare patient data for diagnosis
			const patientData = {
				Name,
				AgeCategory,
				Sex,
				BMI,
				Smoking,
				AlcoholDrinking,
				Stroke,
				PhysicalHealth,
				MentalHealth,
				DiffWalking,
				Race,
				Diabetic,
				PhysicalActivity,
				GenHealth,
				SleepTime,
				Asthma,
				KidneyDisease,
				SkinCancer,
			};

			// Fetch diagnosis from the backend
			const diagnosis = await getDiagnosis(patientData);

			// Generate the report with diagnosis and patient data
			const reportData = generateReport(diagnosis, patientData);

			// Navigate to the report page with the report data
			navigate("/report", { state: { reportData } });
		} catch (error) {
			console.error("Error fetching diagnosis:", error);
			alert("There was an error retrieving the diagnosis. Please try again.");
		}
	};

	// This function calls your backend API to fetch the diagnosis
	const getDiagnosis = async (data) => {
		try {
			const response = await fetch("http://localhost:8000/get-diagnosis", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const result = await response.json();
				return result; // Assuming the response includes all necessary details
			} else {
				const errorResponse = await response.json();
				alert(`Failed to get diagnosis: ${errorResponse.message}`);
				throw new Error("Failed to get diagnosis");
			}
		} catch (error) {
			console.error("Error calling the diagnosis API:", error);
			throw error;
		}
	};

	const generateReport = (diagnosis, patientData) => {
		try {
			// Get the current date and time for the report
			const currentDate = new Date().toLocaleString();

			// Extract only the necessary patient info for the report
			const reportPatientData = {
				name: patientData.name, // Patient name
				age: patientData.age, // Patient age
			};

			// Generate the report data, combining the relevant patient info and diagnosis details
			const reportData = {
				...reportPatientData, // Include only the name and age of the patient
				ecgClass: diagnosis.ecgClass, // ECG class prediction from diagnosis
				heartDiseasePrediction: diagnosis.heartDiseasePrediction, // Heart disease prediction from diagnosis
				diagnosis: diagnosis.diagnosis, // Diagnosis result
				notes: diagnosis.notes, // Additional notes from diagnosis
				recommendation: diagnosis.recommendation, // Treatment recommendations
				followUp: diagnosis.followUp, // Follow-up instructions
				criticalAlert: diagnosis.criticalAlert, // Critical alert flag
				referral: diagnosis.referral, // Referral details
				diagnosisDate: currentDate, // Timestamp when the diagnosis is made
			};

			// Return the generated report
			return reportData;
		} catch (error) {
			console.error("Error generating report:", error);
			return null;
		}
	};

	const storage = getStorage(); // Initialize Firebase Storage

	const navigate = useNavigate();

	return (
		<div className="flex-1 overflow-auto relative z-10">
			{/* Page Header */}
			<Header title="Patient Information" />

			<div className="flex-1 overflow-auto relative z-10 min-h-[40vh] max-w-4xl mx-auto px-4 py-2 mt-6">
				<main>
					<h1 className="text-xl font-bold mb-8 text-center -ml-20">
						Enter Patient Data
					</h1>

					<div className="grid grid-cols-2 gap-y-1 gap-x-1">
						{/* Left Column */}
						<div className="flex-1">
							<input
								type="text"
								value={Name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Patient Name"
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4"
							/>
							{/* Age Category */}
							<select
								value={AgeCategory}
								onChange={(e) => setAgeCategory(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Select Age Category</option>
								<option value="25-29">25-29</option>
								<option value="30-34">30-34</option>
								<option value="55-59">55-59</option>
								<option value="80 or older">80 or older</option>
							</select>

							{/* Sex */}
							<select
								value={Sex}
								onChange={(e) => setSex(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Select Sex</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>

							{/* Race */}
							<select
								value={Race}
								onChange={(e) => setRace(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Select Race</option>
								<option value="White">White</option>
								<option value="Hispanic">Hispanic</option>
								<option value="Black">Black</option>
								<option value="Asian">Asian</option>
							</select>

							{/* Other Inputs */}
							{/* BMI */}
							<input
								type="number"
								value={BMI}
								onChange={(e) => setBmi(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="BMI"
							/>

							<select
								value={DiffWalking}
								onChange={(e) => setDiffWalking(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Difficult Walking</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={KidneyDisease}
								onChange={(e) => setKidneyDisease(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Kidney Disease</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={SkinCancer}
								onChange={(e) => setSkinCancer(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Skin Cancer</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={Diabetic}
								onChange={(e) => setDiabetic(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Diabetic</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</div>

						{/* Right Column */}
						<div className="flex-1">
							{/* Sleep Time */}
							{/* Physical Health */}
							<input
								type="number"
								value={PhysicalHealth}
								onChange={(e) => setPhysicalHealth(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="Physical Health"
							/>
							{/* General Health */}
							<select
								value={GenHealth}
								onChange={(e) => setGenHealth(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">General Health</option>
								<option value="Excellent">Excellent</option>
								<option value="Very good">Very good</option>
								<option value="Fair">Fair</option>
								<option value="Poor">Poor</option>
							</select>
							{/* Mental Health Issues */}
							<input
								type="number"
								value={MentalHealth}
								onChange={(e) => setMentalHealth(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="Physical Health"
							/>

							<input
								type="number"
								value={SleepTime}
								onChange={(e) => setSleepTime(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="Sleep Time"
							/>
							{/* Asthma */}
							<select
								value={Asthma}
								onChange={(e) => setAsthma(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Asthma</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Smoking */}
							<select
								value={Smoking}
								onChange={(e) => setSmoking(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Smoking</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Alcohol Drinking */}
							<select
								value={AlcoholDrinking}
								onChange={(e) => setAlcoholDrinking(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">AlcoholDrinking</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Physical Activity */}
							<select
								value={PhysicalActivity}
								onChange={(e) => setPhysicalActivity(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Physical Activity</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Stroke */}
							<select
								value={Stroke}
								onChange={(e) => setStroke(e.target.value)}
								className="w-3/4 bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Stroke</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</div>
					</div>

					{/* Action Buttons */}

					<section>
						<motion.div
							className="flex justify-center gap-2 mt-6 w-full max-w-4xl ml-auto"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1 }}>
							{/* Back Button */}
							<button
								onClick={() => navigate("/ecg-details")}
								className="mt-5 bg-blue-600 text-white py-1.5 px-10 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
								Back
							</button>
							{/* Sync Patients Button */}
							<button
								onClick={handleSyncPatients}
								disabled={isSyncing}
								className={`${
									isSyncing ? "bg-gray-400" : "bg-blue-600"
								} mt-5 text-white py-1.5 px-10 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2`}>
								{isSyncing ? "Syncing..." : "Submit"}
							</button>
							{isModalOpen && predictionResult && (
								<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
									<div className="bg-white text-black p-6 rounded-lg shadow-md w-96 max-w-full">
										<h2 className="text-lg font-semibold mb-4">
											Heart Disease Prediction
										</h2>

										<p className="text-sm">
											<strong>Prediction:</strong>{" "}
											{predictionResult.prediction || "No prediction available"}
										</p>

										<p className="text-sm">
											<strong>Notes:</strong>{" "}
											{predictionResult.resultMessage || "No notes available"}
										</p>

										<div className="flex justify-end mt-6">
											<button
												onClick={() => {
													setIsModalOpen(false);
													setPredictionResult(null);
												}}
												className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700">
												Close
											</button>
										</div>
									</div>
								</div>
							)}

							{/* Get Diagnosis Button */}
							<button
								className="mt-5 bg-blue-600 text-white py-1.5 px-10 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
								onClick={handleGetDiagnosis}>
								<span>Get Diagnosis</span>
							</button>
						</motion.div>
					</section>
				</main>
			</div>
		</div>
	);
};

export default PatientPage;
