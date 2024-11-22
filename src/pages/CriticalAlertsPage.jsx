/* eslint-disable no-unused-vars */
// src/pages/CriticalAlertsPage.jsx

import React, { useEffect, useState } from "react";
import Header from "../components/common/Header.jsx";
import { db } from "./firebase.js"; // Ensure Firestore instance is imported

const CriticalAlertPage = () => {
	const [criticalAlerts, setCriticalAlerts] = useState([]);

	useEffect(() => {
		// Fetch critical alerts data from Firestore
		const fetchCriticalAlerts = async () => {
			try {
				const snapshot = await db.collection("criticalAlerts").get(); // Ensure Firestore collection name is correct
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setCriticalAlerts(data);
			} catch (error) {
				console.error("Error fetching critical alerts data: ", error);
			}
		};

		fetchCriticalAlerts();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Welcome Dr. Gilbert" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<h2 className="text-white text-2xl mb-4">Critical Alert Patients</h2>
				<div className="overflow-auto bg-white rounded-lg shadow-md">
					<table className="min-w-full bg-gray-800 text-white">
						<thead>
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Age Category
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Gender
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									ECG Classification
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Diagnosis
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{criticalAlerts.map((alert, index) => (
								<tr key={index} className="border-b border-gray-600">
									<td className="px-4 py-2">{alert.Name || "N/A"}</td>
									<td className="px-4 py-2">{alert.AgeCategory || "N/A"}</td>
									<td className="px-4 py-2">{alert.Sex || "N/A"}</td>
									<td className="px-4 py-2">
										{alert.ECG_Classification || "N/A"}
									</td>
									<td className="px-4 py-2">{alert.Diagnosis || "N/A"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
};

export default CriticalAlertPage;
