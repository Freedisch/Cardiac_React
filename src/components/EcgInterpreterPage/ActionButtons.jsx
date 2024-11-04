// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, UserCheck, AlertTriangle } from "lucide-react";

const ActionsPage = () => {
	// State variables for diagnosis and recommendation
	const [diagnosis, setDiagnosis] = useState("");
	const [recommendation] = useState("");
	const [name] = useState("John Doe"); // Placeholder for patient name
	const [age] = useState(30); // Placeholder for patient age
	const [gender] = useState("Male"); // Placeholder for patient gender

	// Diagnosis handler
	const handleGetDiagnosis = () => {
		// Logic to determine diagnosis based on patient data
		const determinedDiagnosis = `Diagnosis based on data: ${name}, ${age}, ${gender}`;
		setDiagnosis(determinedDiagnosis);
		alert(determinedDiagnosis); // Show diagnosis in alert (you may change this to a modal or another UI element)
	};

	// Print handler
	const handlePrint = () => {
		window.print(); // Trigger the browser's print dialog
	};

	// Share handler
	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: "ECG Diagnosis",
					text: `Diagnosis: ${diagnosis}\nRecommendation: ${recommendation}`,
					url: window.location.href,
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
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
			<h1 className="text-2xl font-bold mb-6">Patient Action Page</h1>

			{/* Action Buttons Section */}
			<section className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-md">
				<h3 className="text-lg font-semibold mb-4">Actions</h3>
				<div className="flex flex-col gap-4">
					{/* Get Diagnosis Button */}
					<motion.button
						className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						onClick={handleGetDiagnosis}>
						<span>Get Diagnosis</span>
					</motion.button>

					{/* Print Button */}
					<motion.button
						className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						onClick={handlePrint}>
						<span>Print</span>
					</motion.button>

					{/* Share Button */}
					<motion.button
						className="bg-yellow-600 text-white py-2 px-6 rounded-md hover:bg-yellow-700 transition-colors duration-200 flex items-center gap-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						onClick={handleShare}>
						<span>Share</span>
					</motion.button>

					{/* Referral Button */}
					<motion.button
						className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						onClick={() => console.log("Referral Process Initiated")}>
						<ClipboardCheck size={20} />
						<span>Referral</span>
					</motion.button>

					{/* Follow-up Button */}
					<motion.button
						className="bg-pink-600 text-white py-2 px-6 rounded-md hover:bg-pink-700 transition-colors duration-200 flex items-center gap-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						onClick={() => console.log("Follow-up Process Initiated")}>
						<UserCheck size={20} />
						<span>Follow-up</span>
					</motion.button>

					{/* Critical Alert Button */}
					<motion.button
						className="bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						onClick={() => console.log("Critical Alert Process Initiated")}>
						<AlertTriangle size={20} />
						<span>Critical Alert</span>
					</motion.button>
				</div>
			</section>
		</div>
	);
};

export default ActionsPage;
