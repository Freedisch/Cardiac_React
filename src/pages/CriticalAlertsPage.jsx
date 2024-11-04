// src/pages/CriticalAlertsPage.jsx

// eslint-disable-next-line no-unused-vars
import Header from '../components/common/Header.jsx';

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const CriticalAlertPage = () => {
	const location = useLocation();
	const initialPatientData = location.state || {}; // First critical alert data if present
	const [criticalAlerts, setCriticalAlerts] = useState(
		initialPatientData ? [initialPatientData] : []
	);

	// Function to add new patient data
	const addCriticalAlert = (newAlertData) => {
		setCriticalAlerts((prevAlerts) => [...prevAlerts, newAlertData]);
	};

	return (
		<div className="p-8">
			<h2 className="text-xl font-semibold mb-4">Critical Alert Patients</h2>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="px-4 py-2 border">Name</th>
						<th className="px-4 py-2 border">Age Category</th>
						<th className="px-4 py-2 border">Gender</th>
						<th className="px-4 py-2 border">ECG Classification</th>
						<th className="px-4 py-2 border">Diagnosis</th>
					</tr>
				</thead>
				<tbody>
					{criticalAlerts.map((alert, index) => (
						<tr key={index}>
							<td className="px-4 py-2 border">{alert.Name}</td>
							<td className="px-4 py-2 border">{alert.AgeCategory}</td>
							<td className="px-4 py-2 border">{alert.Sex}</td>
							<td className="px-4 py-2 border">{alert.ECG_Classification}</td>
							<td className="px-4 py-2 border">{alert.Diagnosis}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CriticalAlertPage;

