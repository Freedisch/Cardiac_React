/* eslint-disable no-unused-vars */
// src/pages/FollowUpPage.jsx

import React, { useEffect, useState } from "react";
import Header from "../components/common/Header.jsx";
import { db } from "./firebase.js"; // Ensure this points to the Firestore instance

const FollowUpPage = () => {
	const [followUpData, setFollowUpData] = useState([]);

	useEffect(() => {
		// Fetch follow-up data from Firestore without limiting rows
		const fetchFollowUpData = async () => {
			try {
				const snapshot = await db.collection("followUpData").get(); // Firestore query without limit
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setFollowUpData(data);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchFollowUpData();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Welcome, Dr. Gilbert" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<h2 className="text-white text-2xl mb-4">Follow-Ups</h2>
				<div className="overflow-auto bg-white rounded-lg shadow-md">
					<table className="min-w-full bg-gray-800 text-white">
						<thead>
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Diagnosis
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Recommendation
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Critical Alert
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Date
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{followUpData.map((data, index) => (
								<tr key={index} className="border-b border-gray-600">
									<td className="px-4 py-2">{data.name || "N/A"}</td>
									<td className="px-4 py-2">{data.diagnosis || "N/A"}</td>
									<td className="px-4 py-2">{data.recommendation || "N/A"}</td>
									<td className="px-4 py-2">
										{data.criticalAlert ? "Yes" : "No"}
									</td>
									<td className="px-4 py-2">
										{data.date
											? new Date(data.date.seconds * 1000).toLocaleDateString()
											: "N/A"}
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

export default FollowUpPage;
