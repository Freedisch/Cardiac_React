import { useState } from "react";
// import { ClipboardCheck, UserCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const PatientPage = () => {
	const [isSyncing, setIsSyncing] = useState(false);

	// State variables for patient data
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
	const [HeartDisease, setHeartDisease] = useState("");
	const [Diabetic, setDiabetic] = useState("");
	const [PhysicalActivity, setPhysicalActivity] = useState("");
	const [GenHealth, setGenHealth] = useState("");
	const [SleepTime, setSleepTime] = useState("");
	const [Asthma, setAsthma] = useState("");
	const [KidneyDisease, setKidneyDisease] = useState("");
	const [SkinCancer, setSkinCancer] = useState("");
	const [ECG_Classification, setEcgClassification] = useState("");
	const [Diagnosis, setDiagnosis] = useState("");
	const [Recommendation, setRecommendation] = useState("");
	const [CriticalAlert, setCriticalAlert] = useState("");
	const [FollowUp, setFollowUp] = useState("");
	const [Referral, setReferral] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility

	// Sync patients handler
	const handleSyncPatients = async () => {
		setIsSyncing(true);

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
			HeartDisease,
			Diabetic,
			PhysicalActivity,
			GenHealth,
			SleepTime,
			Asthma,
			KidneyDisease,
			SkinCancer,
			ECG_Classification,
		};

		try {
			const response = await fetch("http://localhost:3005/store-patient-data", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(patientData),
			});

			if (response.ok) {
				const result = await response.json();
				alert(`Patients data synced successfully! ${result.message}`);
			} else {
				const errorResponse = await response.json();
				alert(`Failed to sync patient data: ${errorResponse.message}`);
			}
		} catch (error) {
			alert("An error occurred while syncing data.");
			console.error("Error syncing patient data:", error);
		} finally {
			setIsSyncing(false);
		}
	};

	// Diagnosis handler with API call
	const handleGetDiagnosis = async () => {
		try {
			const response = await fetch("http://localhost:3007/predict", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify([{ Name, AgeCategory, Sex }]), // Flask expects a JSON array
			});

			if (!response.ok) {
				throw new Error("Failed to fetch diagnosis");
			}

			const data = await response.json();
			setDiagnosis(data.Diagnosis[0]);
			setRecommendation(data.Recommendation[0]);
			setCriticalAlert(data["Critical Alert"][0]);
			setFollowUp(data["Follow-Up"][0]);
			setReferral(data.Referral[0]);

			// Open the modal after fetching the data
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error fetching diagnosis:", error);
			alert("There was an error retrieving the diagnosis. Please try again.");
		}
	};

	// Close modal function
	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Print handler
	const handlePrint = () => {
		const printContent = `
		<h2>Patient Information</h2>
		<p><strong>Name:</strong> ${Name}</p>
		<p><strong>Age Category:</strong> ${AgeCategory}</p>
		<p><strong>Gender:</strong> ${Sex}</p>
		<p><strong>Diagnosis Result:</strong> ${Diagnosis}</p>
	`;

		// Create a new window and print the content
		const printWindow = window.open("", "_blank");
		printWindow.document.open();
		printWindow.document.write(`
		<html>
			<head>
				<title>Print Diagnosis</title>
				<style>
					body { font-family: Arial, sans-serif; padding: 20px; }
					h2 { color: #333; }
					p { font-size: 16px; margin-bottom: 8px; }
					strong { font-weight: bold; }
				</style>
			</head>
			<body onload="window.print(); window.close();">
				${printContent}
			</body>
		</html>
	`);
		printWindow.document.close();
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Patient Diagnosis Summary",
					text: `Patient Name: ${Name}\nAge Category: ${AgeCategory}\nGender: ${Sex}\nDiagnosis: ${Diagnosis}`,
				});
				alert("Shared successfully!");
			} catch (error) {
				alert("An error occurred while sharing.");
			}
		} else {
			alert("Sharing is not supported in your browser.");
		}
	};


	return (
		<div className="relative z-10 min-h-screen mx-6">
			<main>
				<h2 className="w-full text-xl font-semibold mb-4 text-center">
					Patient Information
				</h2>
				<section className="bg-gray-800 p-6 rounded-md shadow-none mb-8">
					<div className="grid grid-cols-2 gap-4">
						{/* Left Column */}
						<div className="flex-1">
							<input
								type="text"
								value={Name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Patient Name"
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
							/>
							{/* Age Category */}
							<select
								value={AgeCategory}
								onChange={(e) => setAgeCategory(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
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
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Select Sex</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>

							{/* Race */}
							<select
								value={Race}
								onChange={(e) => setRace(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
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
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="BMI"
							/>

							<select
								value={DiffWalking}
								onChange={(e) => setDiffWalking(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Difficult Walking</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={HeartDisease}
								onChange={(e) => setHeartDisease(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Heart Disease</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={KidneyDisease}
								onChange={(e) => setKidneyDisease(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Kidney Disease</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={SkinCancer}
								onChange={(e) => setSkinCancer(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Skin Cancer</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							<select
								value={Diabetic}
								onChange={(e) => setDiabetic(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
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
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="Physical Health"
							/>
							{/* General Health */}
							<select
								value={GenHealth}
								onChange={(e) => setGenHealth(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">General Health</option>
								<option value="Excellent">Excellent</option>
								<option value="Very good">Very good</option>
								<option value="Fair">Fair</option>
								<option value="Poor">Poor</option>
							</select>
							{/* Mental Health Issues */}
							<select
								value={MentalHealth}
								onChange={(e) => setMentalHealth(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Mental Health</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* ECG Classification */}
							<select
								value={ECG_Classification}
								onChange={(e) => setEcgClassification(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Select ECG Result</option>
								<option value="Normal Heartbeat">Normal Heartbeat</option>
								<option value="Abnormal Heartbeat">Abnormal Heartbeat</option>
								<option value="Myocardial Infarction">
									Myocardial Infarction
								</option>
								<option value="History of Myocardial Infarction">
									History of Myocardial Infarction
								</option>
							</select>
							<input
								type="number"
								value={SleepTime}
								onChange={(e) => setSleepTime(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4"
								placeholder="Sleep Time"
							/>
							{/* Asthma */}
							<select
								value={Asthma}
								onChange={(e) => setAsthma(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Asthma</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Smoking */}
							<select
								value={Smoking}
								onChange={(e) => setSmoking(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Smoking</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Alcohol Drinking */}
							<select
								value={AlcoholDrinking}
								onChange={(e) => setAlcoholDrinking(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Alchohol Drinking</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Physical Activity */}
							<select
								value={PhysicalActivity}
								onChange={(e) => setPhysicalActivity(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Physical Activity</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Stroke */}
							<select
								value={Stroke}
								onChange={(e) => setStroke(e.target.value)}
								className="w-full bg-gray-700 text-white p-2 rounded-md mb-4">
								<option value="">Stroke</option>
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>

							{/* Sync Patients Button */}
							<button
								onClick={handleSyncPatients}
								disabled={isSyncing}
								className={`w-full ${isSyncing ? "bg-gray-400" : "bg-blue-600"} text-white p-2 rounded-md mb-4`}>
								{isSyncing ? "Syncing..." : "Submit"}
							</button>
						</div>
					</div>
				</section>

				{/* Action Buttons */}
				<section>
					<motion.div
						className="flex justify-between mt-6 w-full max-w-4xl ml-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}>
						{/* Get Diagnosis Button */}
						<button
							className="mt-5 mx-4 bg-blue-600 text-white py-1.5 px-10 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-4"
							onClick={handleGetDiagnosis}>
							<span>Get Diagnosis</span>
						</button>

						{/* Print Button */}
						<button
							className="mt-5 bg-green-600 text-white py-1.5 px-10 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-4"
							onClick={handlePrint}>
							<span>Print</span>
						</button>

						{/* Share Button */}
						<button
							className="mt-5 bg-yellow-600 text-white py-1.5 px-10 rounded-md hover:bg-yellow-700 transition-colors duration-200 flex items-center gap-2"
							onClick={handleShare}>
							<span>Share</span>
						</button>
					</motion.div>

					{/* Modal for displaying diagnosis and recommendation */}
					{isModalOpen && (
						<motion.div
							className="fixed inset-0 flex items-center justify-center z-50"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}>
							<div className="bg-white p-6 rounded-lg shadow-lg">
								<h3 className="text-lg font-semibold text-black mb-4">
									Diagnosis
								</h3>
								<p className="text-black">Diagnosis: {Diagnosis}</p>
								<p className="text-black">Recommendation: {Recommendation}</p>
								<p className="text-black">Critical Alert: {CriticalAlert}</p>
								<p className="text-black">Follow-Up: {FollowUp}</p>
								<p className="text-black">Referral: {Referral}</p>
								<button
									className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
									onClick={closeModal}>
									Close
								</button>
							</div>
						</motion.div>
					)}
				</section>
			</main>
		</div>
	);
};


export default PatientPage;
