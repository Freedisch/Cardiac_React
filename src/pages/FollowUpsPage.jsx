/* eslint-disable no-unused-vars */
// src/pages/DiagnosisListPage.jsx

import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Header from "../components/common/Header.jsx";

const DiagnosisListPage = () => {
	const [diagnosisData, setDiagnosisData] = useState([]);
	const [loading, setLoading] = useState(false);
	const db = getFirestore(); // Firebase Firestore instance

	// Fetch diagnosis data from Firebase Firestore
	const fetchDiagnosisData = async () => {
		setLoading(true); // Set loading state to true
		try {
			const querySnapshot = await getDocs(collection(db, "diagnosis"));
			const diagnoses = querySnapshot.docs.map((doc, index) => ({
				...doc.data(),
				id: doc.id, // Add Firestore document ID
			}));
			console.log("Fetched diagnoses:", diagnoses); // Log the diagnosis data
			setDiagnosisData(diagnoses); // Set the loaded diagnosis data to the state
		} catch (error) {
			console.error("Error fetching diagnosis data:", error);
		} finally {
			setLoading(false); // Reset loading state
		}
	};

	useEffect(() => {
		fetchDiagnosisData(); // Fetch data on page load
	}, []); // Empty dependency array ensures this runs only once on mount

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Follow Ups" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<div className="overflow-auto bg-white rounded-lg shadow-md">
					<table className="min-w-full bg-gray-800 text-white">
						<thead>
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									# {/* Row number column */}
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									ID
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Diagnosis
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									ECG Classification
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Recommendation
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Follow Up
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Critical Alert
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{diagnosisData.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="px-4 py-3 text-center text-gray-400">
										No diagnosis data available.
									</td>
								</tr>
							) : (
								diagnosisData.map((diagnosis, index) => (
									<tr key={diagnosis.id}>
										<td className="px-4 py-3">{index + 1}</td>{" "}
										{/* Row number column */}
										<td className="px-4 py-3">{diagnosis.id}</td>{" "}
										{/* Firestore Document ID */}
										<td className="px-4 py-3">
											{diagnosis.diagnosis || "N/A"}
										</td>
										<td className="px-4 py-3">
											{diagnosis.ECG_Classification || "N/A"}
										</td>
										<td className="px-4 py-3">
											{diagnosis.recommendation || "N/A"}
										</td>
										<td className="px-4 py-3">{diagnosis.followUp || "N/A"}</td>
										<td className="px-4 py-3">
											{diagnosis.criticalAlert || "N/A"}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
};

export default DiagnosisListPage;
