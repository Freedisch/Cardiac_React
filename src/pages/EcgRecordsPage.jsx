// // src/pages/EcgRecordsPage.jsx
// /* eslint-disable no-unused-vars */

// import React, { useEffect, useState } from "react";
// import Header from "../components/common/Header.jsx";
// import { db } from "./firebase.js"; // Ensure the firestore instance is correctly configured

// const EcgRecordsPage = () => {
// 	const [ecgData, setEcgData] = useState([]);

// 	useEffect(() => {
// 		// Fetch ECG data from Firestore
// 		const fetchEcgData = async () => {
// 			try {
// 				const snapshot = await db.collection("ECG_images").get();
// 				const data = snapshot.docs.map((doc) => ({
// 					id: doc.id,
// 					...doc.data(),
// 				}));
// 				setEcgData(data);
// 			} catch (error) {
// 				console.error("Error fetching data: ", error);
// 			}
// 		};

// 		fetchEcgData();
// 	}, []);

// 	return (
// 		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
// 			<Header title="ECG Records" />
// 			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
// 				<div className="overflow-auto bg-white rounded-lg shadow-md">
// 					<table className="min-w-full bg-gray-800 text-white">
// 						<thead>
// 							<tr>
// 								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
// 									Image
// 								</th>
// 								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
// 									Format
// 								</th>
// 								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
// 									Voltage
// 								</th>
// 								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
// 									Speed
// 								</th>
// 								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
// 									Date
// 								</th>
// 							</tr>
// 						</thead>
// 						<tbody className="bg-gray-700 divide-y divide-gray-600">
// 							{ecgData.map((data, index) => (
// 								<tr key={index} className="border-b border-gray-600">
// 									<td className="px-4 py-2">
// 										<img
// 											src={data.imageUrl}
// 											alt="ECG"
// 											className="w-24 h-auto rounded-md"
// 										/>
// 									</td>
// 									<td className="px-4 py-2">{data.format || "N/A"}</td>
// 									<td className="px-4 py-2">{data.voltage || "N/A"}</td>
// 									<td className="px-4 py-2">{data.speed || "N/A"}</td>
// 									<td className="px-4 py-2">
// 										{data.date
// 											? new Date(data.date.seconds * 1000).toLocaleDateString()
// 											: "N/A"}
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</table>
// 				</div>
// 			</main>
// 		</div>
// 	);
// };

// export default EcgRecordsPage;
