/* eslint-disable no-unused-vars */
// src/pages/ReferralPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Header.jsx";
import { db } from "./firebase.js"; // Import the Firestore instance

const ReferralPage = () => {
	const [referralPatients, setReferralPatients] = useState([]);

	useEffect(() => {
		// Fetch referral patient data from Firestore
		const fetchReferralPatients = async () => {
			try {
				const snapshot = await db.collection("referralPatients").get(); // Ensure Firestore collection is correctly named
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setReferralPatients(data);
			} catch (error) {
				console.error("Error fetching referral patients data: ", error);
			}
		};

		fetchReferralPatients();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Referral Patients" />
			<main className="max-w-full mx-auto py-6 px-4 lg:px-8">
				<div className="overflow-auto bg-white rounded-lg shadow-md w-full">
					<table className="min-w-full bg-gray-800 text-white border-separate border-spacing-0 table-auto">
						<thead>
							<tr>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									#
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									Date
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600 ">
									Name
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									Age Category
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									ECG Class
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									ECG Notes
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									Diagnosis
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									Diagnosis Notes
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									Recommendation
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									FollowUp
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600">
									Critical Alert
								</th>
								<th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">
									Referral
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{referralPatients.map((patient, index) => (
								<tr key={index} className="border-b border-gray-600">
									<td className="px-4 py-2 border-r border-gray-600 text-center">
										{index + 2}
									</td>{" "}
									{/* Row numbering starts from 2 */}
									<td className="px-4 py-2 border-r border-gray-600 text-center">
										{patient.Name || "N/A"}
									</td>
									<td className="px-4 py-2 border-r border-gray-600 text-center">
										{patient.Diagnosis || "N/A"}
									</td>
									<td className="px-4 py-2 border-r border-gray-600 text-center">
										{patient.Recommendation || "N/A"}
									</td>
									<td className="px-4 py-2 border-r border-gray-600 text-center">
										{patient.CriticalAlert ? "Yes" : "No"}
									</td>
									<td className="px-4 py-2 text-center">
										{patient.Referral || "N/A"}
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

export default ReferralPage;
