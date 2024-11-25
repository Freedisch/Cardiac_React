/* eslint-disable no-unused-vars */
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // For date formatting
import Header from "../components/common/Header.jsx"; // Assuming Header component is in the same location

const AppointmentPage = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(false);
	const db = getFirestore(); // Firestore instance

	// Function to format Firebase Timestamp or standard Date
	const formatDate = (date) => {
		if (!date) return "N/A";
		// Check if date is a Firestore Timestamp, and convert to JS Date if so
		const jsDate = date.toDate ? date.toDate() : new Date(date);
		return format(jsDate, "PPpp"); // Example: "Nov 7, 2024, 2:00 AM"
	};

	// Fetch appointments data from Firebase Firestore
	const fetchAppointments = async () => {
		setLoading(true); // Set loading state to true
		try {
			const querySnapshot = await getDocs(collection(db, "Appointments"));
			const appointmentList = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id, // Add Firestore document ID
			}));
			console.log("Fetched appointments:", appointmentList);
			setAppointments(appointmentList); // Set the loaded data to state
		} catch (error) {
			console.error("Error fetching appointments data:", error);
		} finally {
			setLoading(false); // Reset loading state
		}
	};

	useEffect(() => {
		fetchAppointments(); // Fetch data on page load
	}, []); // Empty dependency array ensures this runs only once on mount

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Appointment Records" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<div className="overflow-auto bg-white rounded-lg shadow-md">
					<table className="min-w-full bg-gray-800 text-white">
						<thead>
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									#
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									ID
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Event Title
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Date
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Patient Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Diagnosis
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Critical Alert
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-700 divide-y divide-gray-600">
							{loading ? (
								<tr>
									<td
										colSpan="7"
										className="px-4 py-3 text-center text-gray-400">
										Loading...
									</td>
								</tr>
							) : appointments.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="px-4 py-3 text-center text-gray-400">
										No appointments available.
									</td>
								</tr>
							) : (
								appointments.map((appointment, index) => (
									<tr key={appointment.id}>
										<td className="px-4 py-3">{index + 1}</td>
										<td className="px-4 py-3">{appointment.id}</td>
										<td className="px-4 py-3">{appointment.title || "N/A"}</td>
										<td className="px-4 py-3">
											{formatDate(appointment.date)}
										</td>
										<td className="px-4 py-3">
											{appointment.patientName || "N/A"}
										</td>
										<td className="px-4 py-3">
											{appointment.diagnosis || "N/A"}
										</td>
										<td className="px-4 py-3">
											{appointment.criticalAlert || "N/A"}
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

export default AppointmentPage;
