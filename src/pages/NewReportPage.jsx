/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig"; // Update path if needed
import { v4 as uuidv4 } from "uuid";

const ReportPage = ({ location }) => {
	const { reportData } = location.state || {}; // Retrieve report data from location state
	const navigate = useNavigate(); // Using useNavigate for React Router v6

	// State to manage editable fields
	const [editableReportData, setEditableReportData] = useState({
		...reportData,
		id: reportData ? reportData.id : uuidv4(), // If no ID, generate a new unique ID
		followUp: [], // Store follow-up data in an array (not saving to Firestore)
		referral: [], // Referral data (not saving to Firestore)
		criticalAlert: [], // Critical Alert data (not saving to Firestore)
	});

	// Fetch and set the report data if it's already stored (for editing purposes)
	useEffect(() => {
		if (reportData && reportData.id) {
			// This section is for retrieving a report if the reportData contains an 'id' field
			const fetchReportData = async () => {
				try {
					const reportRef = db.collection("reports").doc(reportData.id);
					const doc = await reportRef.get();
					if (doc.exists) {
						setEditableReportData(doc.data());
					} else {
						console.log("No such document!");
					}
				} catch (error) {
					console.error("Error fetching document: ", error);
				}
			};
			fetchReportData();
		}
	}, [reportData]);

	// Handle actions for buttons (display on respective pages instead of Firestore)
	const handleFollowUp = (newFollowUpData) => {
		setEditableReportData((prevData) => ({
			...prevData,
			followUp: [...prevData.followUp, newFollowUpData], // Add new follow-up to array
		}));
	};

	const handleRefer = (newReferralData) => {
		setEditableReportData((prevData) => ({
			...prevData,
			referral: [...prevData.referral, newReferralData], // Add new referral to array
		}));
	};

	const handleCriticalAlert = (newAlertData) => {
		setEditableReportData((prevData) => ({
			...prevData,
			criticalAlert: [...prevData.criticalAlert, newAlertData], // Add new alert to array
		}));
	};

	const handleClose = () => {
		navigate("/"); // Redirect back to the diagnosis page or any other page
	};

	// Function to handle changes in editable fields
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditableReportData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Print handler
	const handlePrint = () => {
		// Extract necessary data from state
		const {
			heart_disease_status, // Updated field
			ecg_class, // Updated field
			ecg_notes, // Updated field
			diagnosis_info, // Contains diagnosis data like Diagnosis, Notes, Recommendation, FollowUp, CriticalAlert, Referral
		} = editableReportData;

		// Construct the content to be printed
		const printContent = `
			<h2>Patient Information</h2>
			<p><strong>Heart Disease Prediction:</strong> ${heart_disease_status}</p>
			<p><strong>ECG Class:</strong> ${ecg_class}</p>
			<p><strong>ECG Notes:</strong> ${ecg_notes}</p>
			<p><strong>Diagnosis:</strong> ${diagnosis_info.Diagnosis}</p>
			<p><strong>Notes:</strong> ${diagnosis_info.Notes}</p>
			<p><strong>Recommendation:</strong> ${diagnosis_info.Recommendation}</p>
			<p><strong>FollowUp:</strong> ${diagnosis_info.FollowUp}</p>
			<p><strong>Critical Alert:</strong> ${diagnosis_info.CriticalAlert}</p>
			<p><strong>Referral:</strong> ${diagnosis_info.Referral}</p>
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

	// Share handler
	const handleShare = async () => {
		if (navigator.share) {
			const { heart_disease_status, ecg_class, ecg_notes, diagnosis_info } =
				editableReportData;
			try {
				await navigator.share({
					title: "Patient Diagnosis Summary",
					text: `
						Heart Disease Prediction: ${heart_disease_status}
						ECG Class: ${ecg_class}
						ECG Notes: ${ecg_notes}
						Diagnosis: ${diagnosis_info.Diagnosis}
					`,
				});
				alert("Shared successfully!");
			} catch (error) {
				alert("An error occurred while sharing.");
			}
		} else {
			alert("Sharing is not supported in your browser.");
		}
	};

	// Function to store the report data in Firestore (save or update)
	const handleSaveReport = async () => {
		try {
			if (editableReportData.id) {
				// If the report already has an ID (editing existing report)
				await db.collection("reports").doc(editableReportData.id).update({
					"Heart Disease Prediction": editableReportData.heart_disease_status, // Updated field
					"ECG Class": editableReportData.ecg_class, // Updated field
					"ECG Notes": editableReportData.ecg_notes, // Updated field
					Diagnosis: editableReportData.diagnosis_info.Diagnosis,
					Notes: editableReportData.diagnosis_info.Notes,
					Recommendation: editableReportData.diagnosis_info.Recommendation,
					FollowUp: editableReportData.diagnosis_info.FollowUp,
					CriticalAlert: editableReportData.diagnosis_info.CriticalAlert,
					Referral: editableReportData.diagnosis_info.Referral,
				});
				console.log("Report updated successfully.");
				alert("Report updated successfully.");
			} else {
				// If the report does not have an ID (new report)
				const newReportRef = await db.collection("reports").add({
					...editableReportData,
					id: uuidv4(), // Assign a new ID
				});
				console.log("New report added successfully with ID:", newReportRef.id);
				alert("New report added successfully.");
			}
		} catch (error) {
			console.error("Error saving report:", error);
			alert("Error saving report. Please try again.");
		}
	};

	return (
		<div className="report-page-container">
			<h2>Patient Information</h2>
			{/* Display input fields as required */}
			{/* Other fields here like Heart Disease Status, ECG Class, etc. */}
			<div className="form-group">
				<strong>Heart Disease Prediction:</strong>
				<input
					type="text"
					name="heart_disease_status"
					value={editableReportData.heart_disease_status}
					onChange={handleInputChange}
					className="input-field"
				/>
			</div>
			<div className="form-group">
				<strong>ECG Class:</strong>
				<input
					type="text"
					name="ecg_class"
					value={editableReportData.ecg_class}
					onChange={handleInputChange}
					className="input-field"
				/>
			</div>
			<div className="form-group">
				<strong>ECG Notes:</strong>
				<input
					type="text"
					name="ecg_notes"
					value={editableReportData.ecg_notes}
					onChange={handleInputChange}
					className="input-field"
				/>
			</div>
			<div className="form-group">
				<strong>Diagnosis:</strong>
				<textarea
					name="Diagnosis"
					value={editableReportData.diagnosis_info.Diagnosis}
					onChange={handleInputChange}
					className="input-field"
				/>
			</div>
			{/* Other fields for Notes, Recommendation, FollowUp, etc. */}
			<div className="form-group">
				<strong>FollowUp:</strong>
				<textarea
					name="FollowUp"
					value={editableReportData.diagnosis_info.FollowUp}
					onChange={handleInputChange}
					className="input-field"
				/>
			</div>

			{/* Action Buttons */}
			<button onClick={handleFollowUp}>Add Follow Up</button>
			<button onClick={handleRefer}>Add Referral</button>
			<button onClick={handleCriticalAlert}>Add Critical Alert</button>

			{/* Save and Print */}
			<button onClick={handleSaveReport}>Save Report</button>
			<button onClick={handlePrint}>Print Report</button>
			<button onClick={handleShare}>Share Report</button>
			<button onClick={handleClose}>Close</button>
		</div>
	);
};

export default ReportPage;
