import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage"; // Import Firebase storage functions
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs
import Header from "../components/common/Header.jsx";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 


const PatientPage = () => {
	const [isSyncing, setIsSyncing] = useState(false);
	const [predictionResult, setPredictionResult] = useState(null); // State to store prediction result
	const [heartDisease, setHeartDisease] = useState(""); // Store heart disease status
	const [ecgResult, setEcgResult] = useState(""); // Store ECG result
	const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
	const [diagnosis, setDiagnosis] = useState(""); // Store generated diagnosis
	// const [criticalAlerts, setCriticalAlerts] = useState([]);
	// const [referrals, setReferrals] = useState([]);
	// const [followUps, setFollowUps] = useState([]);
	const [message, setMessage] = useState("");
	const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
	

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
	const db = getFirestore();
	const auth = getAuth();

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

	// Generate Diagnosis Logic
	const generateDiagnosis = (ecgResult, heartDisease) => {
		let diagnosis = "";
		let notes = "";
		let recommendation = "";
		let followUp = "";
		let criticalAlert = "";
		let referral = "";
		let heartDiseasePrediction = ""; // Heart disease prediction as "Yes" or "No"

		// Set heart disease prediction based on user input
		heartDiseasePrediction = heartDisease === "Yes" ? "Yes" : "No";

		// Diagnosis logic based on ECG result and heart disease status
		if (ecgResult === "Myocardial Infarction") {
			if (heartDisease === "Yes") {
				diagnosis = "Acute Coronary Syndrome with High Risk of Recurrence";
				notes = "Critical scenario requiring immediate intervention.";
				recommendation =
					"Immediate referral to a cardiologist; prescribe anticoagulants and lifestyle changes.";
				followUp = "Weekly follow-up until condition stabilizes.";
				criticalAlert = "High";
				referral = "Yes";
			} else {
				diagnosis = "Previous Myocardial Infarction; Stable Condition";
				notes = "Stable post-MI condition, monitoring recommended.";
				recommendation =
					"Regular cardiovascular assessment every 3 months; monitor symptoms.";
				followUp = "3-month follow-up with primary care.";
				criticalAlert = "Medium";
				referral = "Consider cardiology if symptoms worsen.";
			}
		} else if (ecgResult === "History of Myocardial Infarction") {
			if (heartDisease === "Yes") {
				diagnosis = "History of Myocardial Infarction; Risk of Complications";
				notes = "Further evaluation necessary to prevent complications.";
				recommendation =
					"Lifestyle counseling and medication adherence; low-dose aspirin advised.";
				followUp = "Monthly check-ins to assess risk.";
				criticalAlert = "Medium";
				referral = "Yes";
			} else {
				diagnosis = "Stable Post-MI; No Current Risk";
				notes = "Recovered well from previous MI, no current issues.";
				recommendation =
					"Annual cardiovascular exam; maintain healthy lifestyle.";
				followUp = "Annual check-up.";
				criticalAlert = "Low";
				referral = "No";
			}
		} else if (ecgResult === "Abnormal Heartbeat") {
			if (heartDisease === "Yes") {
				diagnosis = "Chronic Arrhythmia";
				notes =
					"Chronic arrhythmia requires ongoing management and medication.";
				recommendation =
					"Anti-arrhythmic drugs and possible ablation therapy; avoid strenuous activities.";
				followUp = "Bi-weekly follow-up with ECG monitoring.";
				criticalAlert = "High";
				referral = "Yes";
			} else {
				diagnosis = "Minor Arrhythmia; No Immediate Concern";
				notes = "Typically benign but should be monitored if symptoms develop.";
				recommendation = "Lifestyle modifications; reduce caffeine and stress.";
				followUp = "3-month follow-up if symptoms develop.";
				criticalAlert = "Low";
				referral = "No";
			}
		} else if (ecgResult === "Normal") {
			if (heartDisease === "No") {
				diagnosis = "Healthy Cardiac Status";
				notes = "Normal heart rhythm indicating healthy cardiac function.";
				recommendation = "Maintain balanced diet, exercise, and sleep habits.";
				followUp = "Annual wellness check-up.";
				criticalAlert = "None";
				referral = "No";
			} else {
				diagnosis = "Early Signs of Cardiac Risk";
				notes = "Potential heart disease signs, requiring preventive measures.";
				recommendation =
					"Preventive medication and cardiovascular fitness plan.";
				followUp = "6-month follow-up for early intervention.";
				criticalAlert = "Medium";
				referral = "Consider preventive cardiology.";
			}
		} else {
			diagnosis = "Unknown ECG Result";
			notes = "Unable to determine diagnosis based on provided data.";
			recommendation = "Consult with a specialist for further analysis.";
			followUp = "Immediate follow-up recommended.";
			criticalAlert = "Medium";
			referral = "Yes";
		}

		return {
			ecgResult,
			heartDiseasePrediction,
			diagnosis,
			notes,
			recommendation,
			followUp,
			criticalAlert,
			referral,
		};
	};

	const handleGenerateDiagnosis = async () => {
		try {
			const diagnosisData = { heartDisease, ecgResult }; // heartDisease and ecgResult inputs
			const result = generateDiagnosis(
				diagnosisData.ecgResult,
				diagnosisData.heartDisease
			); // Generate diagnosis based on inputs
			setDiagnosis(result); // Set the result in the state
			setIsDiagnosisModalOpen(true); // Open the diagnosis modal
			setIsModalOpen(false); // Close the current modal (if any)
		} catch (error) {
			console.error("Error generating diagnosis:", error.message);
			alert(`Error: ${error.message}. Please try again later.`);
		}
	};

	// // Handle Actions (Critical Alert, Follow-Up, Referral)
	// const handleAction = (actionType) => {
	// 	let currentList;
	// 	if (actionType === "criticalAlert") currentList = criticalAlerts;
	// 	else if (actionType === "followUp") currentList = followUps;
	// 	else if (actionType === "referral") currentList = referrals;

	// 	if (currentList.includes(diagnosis)) {
	// 		setMessage("This item is already added.");
	// 	} else {
	// 		const updateList = (prev) => [...prev, diagnosis];
	// 		if (actionType === "criticalAlert") setCriticalAlerts(updateList);
	// 		else if (actionType === "followUp") setFollowUps(updateList);
	// 		else if (actionType === "referral") setReferrals(updateList);
	// 		setMessage(
	// 			`Added to ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`
	// 		);
	// 	}

	// 	// Reset the message after 2 seconds
	// 	setTimeout(() => setMessage(""), 2000);
	// };

	// Handle saving the diagnosis to Firestore
	const handleSave = async () => {
		try {
			// Prepare the diagnosis data
			const diagnosisData = {
				ecgResult: diagnosis.ecgResult,
				heartDiseasePrediction: diagnosis.heartDiseasePrediction,
				diagnosis: diagnosis.diagnosis,
				recommendation: diagnosis.recommendation,
				notes: diagnosis.notes,
				followUp: diagnosis.followUp,
				referral: diagnosis.referral,
				criticalAlert: diagnosis.criticalAlert,
				createdAt: new Date(),
				userId: auth.currentUser?.uid || "anonymous", // Store user info if logged in
			};

			// Save diagnosis data to Firestore
			const docRef = await addDoc(collection(db, "diagnosis"), diagnosisData);

			// Confirm successful save
			console.log("Diagnosis saved with ID: ", docRef.id);

			// Optionally, show a message or close the modal after saving
			setMessage("Diagnosis saved successfully!");
			setTimeout(() => setMessage(""), 2000);
		} catch (error) {
			console.error("Error saving diagnosis:", error.message);
			alert(`Error: ${error.message}. Please try again later.`);
		}
	};

	

	const storage = getStorage(); // Initialize Firebase Storage
	const navigate = useNavigate(); // Initialize navigation

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
							{/* Get Diagnosis Button */}
							<motion.div
								className="flex justify-center gap-2 mt-6 w-full max-w-4xl ml-auto"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1 }}>
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
												{predictionResult.prediction ||
													"No prediction available"}
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

								<motion.button
									onClick={() => setIsModalOpen(true)}
									className="mt-5 bg-green-600 text-white py-1.5 px-10 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 1 }}>
									Get Diagnosis
								</motion.button>

								{isModalOpen && (
									<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
										<div className="bg-white text-black p-6 rounded-lg shadow-md w-[40%] min-h-[400px]">
											<h2 className="text-3xl font-semibold mb-4 underline">
												Select Heart Disease and ECG Result
											</h2>
											<label className="text-xl">Heart Disease: </label>
											<select
												value={heartDisease}
												onChange={(e) => setHeartDisease(e.target.value)}
												className="mb-4 p-2 border rounded-md w-full text-lg">
												<option value="">Select</option>
												<option value="Yes">Yes</option>
												<option value="No">No</option>
											</select>

											<label className="text-xl">ECG Result: </label>
											<select
												value={ecgResult}
												onChange={(e) => setEcgResult(e.target.value)}
												className="mb-4 p-2 border rounded-md w-full text-lg">
												<option value="">Select</option>
												<option value="Myocardial Infarction">
													Myocardial Infarction
												</option>
												<option value="History of Myocardial Infarction">
													History of MI
												</option>
												<option value="Abnormal Heartbeat">
													Abnormal Heartbeat
												</option>
												<option value="Normal">Normal</option>
											</select>

											<div className="flex gap-2">
												<button
													onClick={handleGenerateDiagnosis}
													className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 text-lg">
													Generate Diagnosis
												</button>
												<button
													onClick={() => setIsModalOpen(false)}
													className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 text-lg">
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}

								{isDiagnosisModalOpen && (
									<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
										<div className="bg-white text-black p-6 rounded-lg shadow-md w-[40%] min-h-[400px]">
											<h2 className="text-3xl font-semibold mb-4 underline">
												Diagnosis
											</h2>
											<p className="text-xl">
												<strong>ECG Result:</strong> {diagnosis.ecgResult}
											</p>
											<p className="text-xl">
												<strong>Heart Disease Prediction:</strong>{" "}
												{diagnosis.heartDiseasePrediction}
											</p>
											<p className="text-xl">
												<strong>Diagnosis:</strong> {diagnosis.diagnosis}
											</p>
											<p className="text-xl">
												<strong>Notes:</strong> {diagnosis.notes}
											</p>
											<p className="text-xl">
												<strong>Recommendation:</strong>{" "}
												{diagnosis.recommendation}
											</p>
											<p className="text-xl">
												<strong>Critical Alert:</strong>{" "}
												{diagnosis.criticalAlert}
											</p>

											<p className="text-xl">
												<strong>Follow-Up:</strong> {diagnosis.followUp}
											</p>
											<p className="text-xl">
												<strong>Referral:</strong> {diagnosis.referral}
											</p>

											<div className="flex justify-end mt-4">
												<button
													onClick={handleSave}
													className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
													Save Report
												</button>

												<button
													onClick={() => setIsDiagnosisModalOpen(false)} // This closes the modal
													className="bg-red-600 text-white py-1.5 px-6 rounded-md hover:bg-red-700 ml-2 text-lg">
													Close
												</button>
											</div>
										</div>
									</div>
								)}
							</motion.div>

							{message && (
								<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-md">
									{message}
								</div>
							)}
						</motion.div>
					</section>
				</main>
			</div>
		</div>
	);
};

export default PatientPage;
