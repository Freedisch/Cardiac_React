/* eslint-disable no-unused-vars */
// src/pages/ReferralPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/common/Header.jsx";
import { db } from "./firebase.js"; // Import the Firestore instance

const ReferralPage = () => {
	// Sample data for referral hospitals with Cardiologist's name included
	const referralHospitals = [
		{
			hospitalName: "Muhimbili National Hospital",
			location: "Dar es Salaam",
			contact: "+255 22 212 1515",
			cardiologist: "Dr. John Doe",
		},
		{
			hospitalName: "Kilimanjaro Christian Medical Centre",
			location: "Moshi",
			contact: "+255 27 275 4555",
			cardiologist: "Dr. Mary Ann",
		},
		{
			hospitalName: "Bugando Medical Centre",
			location: "Mwanza",
			contact: "+255 28 250 5194",
			cardiologist: "Dr. Peter Lema",
		},
		{
			hospitalName: "Selian Lutheran Hospital",
			location: "Arusha",
			contact: "+255 27 254 1055",
			cardiologist: "Dr. Francis Kamara",
		},
		{
			hospitalName: "St. Francis Referral Hospital",
			location: "Ifakara",
			contact: "+255 23 260 4216",
			cardiologist: "Dr. Agnes Shabani",
		},
		{
			hospitalName: "Mbeya Referral Hospital",
			location: "Mbeya",
			contact: "+255 25 250 4000",
			cardiologist: "Dr. George Kamani",
		},
		{
			hospitalName: "Dodoma Regional Referral Hospital",
			location: "Dodoma",
			contact: "+255 26 232 2670",
			cardiologist: "Dr. James Nkongoro",
		},
		{
			hospitalName: "Iringa Regional Referral Hospital",
			location: "Iringa",
			contact: "+255 26 270 4321",
			cardiologist: "Dr. Janet Mbise",
		},
		{
			hospitalName: "Tumbi Referral Hospital",
			location: "Tabora",
			contact: "+255 26 262 0009",
			cardiologist: "Dr. Moses Lunyungu",
		},
		{
			hospitalName: "Lindi Regional Referral Hospital",
			location: "Lindi",
			contact: "+255 23 230 1513",
			cardiologist: "Dr. David Mwita",
		},
	];

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Referral Hospitals in Tanzania" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<div className="overflow-auto bg-white rounded-lg shadow-md">
					<table className="min-w-full bg-gray-800 text-white">
						<thead>
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Hospital Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Location
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Contact Number
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Cardiologist
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{referralHospitals.map((hospital, index) => (
								<tr key={index} className="border-b border-gray-600">
									<td className="px-4 py-2">
										{hospital.hospitalName || "N/A"}
									</td>
									<td className="px-4 py-2">{hospital.location || "N/A"}</td>
									<td className="px-4 py-2">{hospital.contact || "N/A"}</td>
									<td className="px-4 py-2">
										{hospital.cardiologist || "N/A"}
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
