/* eslint-disable no-unused-vars */
// src/pages/FollowUpsPage.jsx

import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Header from "../components/common/Header.jsx";
import { db } from "./firebase.js"; // Ensure this points to your Firestore instance

const PatientsRecordsPage = () => {
	const [patientsData, setPatientsData] = useState([]);

	// Fetch data from Firestore
	useEffect(() => {
		const fetchPatientsData = async () => {
			try {
				const patientCollection = collection(db, "Patientdata");
				const patientSnapshot = await getDocs(patientCollection);
				const patientList = patientSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPatientsData(patientList);
			} catch (error) {
				console.error("Error fetching patient data:", error);
			}
		};

		fetchPatientsData();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Welcome, Dr. Gilbert" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<h2 className="text-white text-2xl mb-4">Patient Records</h2>
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
									Sex
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									BMI
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Smoking
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Alcohol Drinking
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Stroke
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Physical Health
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Mental Health
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Difficulty Walking
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Race
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Heart Disease
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Diabetic
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Physical Activity
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									General Health
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Sleep Time
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Asthma
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Kidney Disease
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Skin Cancer
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									ECG Classification
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{patientsData.map((patient) => (
								<tr key={patient.id}>
									<td className="px-4 py-3">{patient.Name || "N/A"}</td>
									<td className="px-4 py-3">{patient.AgeCategory || "N/A"}</td>
									<td className="px-4 py-3">{patient.Sex || "N/A"}</td>
									<td className="px-4 py-3">{patient.BMI || "N/A"}</td>
									<td className="px-4 py-3">
										{patient.Smoking ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">
										{patient.AlcoholDrinking ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">{patient.Stroke ? "Yes" : "No"}</td>
									<td className="px-4 py-3">
										{patient.PhysicalHealth || "N/A"}
									</td>
									<td className="px-4 py-3">{patient.MentalHealth || "N/A"}</td>
									<td className="px-4 py-3">
										{patient.DiffWalking ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">{patient.Race || "N/A"}</td>
									<td className="px-4 py-3">
										{patient.HeartDisease ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">
										{patient.Diabetic ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">
										{patient.PhysicalActivity ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">{patient.GenHealth || "N/A"}</td>
									<td className="px-4 py-3">{patient.SleepTime || "N/A"}</td>
									<td className="px-4 py-3">{patient.Asthma ? "Yes" : "No"}</td>
									<td className="px-4 py-3">
										{patient.KidneyDisease ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">
										{patient.SkinCancer ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3">
										{patient.ECG_Classification || "N/A"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
};

export default PatientsRecordsPage;
