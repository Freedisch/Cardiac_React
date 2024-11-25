/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReportPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { reportData } = location.state || {};

	const [editableReportData, setEditableReportData] = useState(reportData);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditableReportData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSaveReport = () => {
		console.log("Report Saved:", editableReportData);
		alert("Report Saved Successfully!");
	};

	return (
		<div className="report-page-container">
			<h2>Patient Report</h2>
			<div className="form-group">
				<strong>Heart Disease Prediction:</strong>
				<input
					type="text"
					name="heart_disease_status"
					value={editableReportData.heart_disease_status}
					onChange={handleInputChange}
				/>
			</div>
			<div className="form-group">
				<strong>ECG Result:</strong>
				<input
					type="text"
					name="ecg_class"
					value={editableReportData.ecg_class}
					onChange={handleInputChange}
				/>
			</div>
			<div className="form-group">
				<strong>Diagnosis:</strong>
				<textarea
					name="diagnosis_info.Diagnosis"
					value={editableReportData.diagnosis_info.Diagnosis}
					onChange={handleInputChange}
				/>
			</div>
			<button onClick={handleSaveReport}>Save Report</button>
			<button onClick={() => navigate("/")}>Go Back</button>
		</div>
	);
};

export default ReportPage;
