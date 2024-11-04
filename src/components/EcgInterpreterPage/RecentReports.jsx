// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const RecentReports = () => {
	// Sample data for recent reports
	const reports = [
		{
			reportID: "ECG-10234",
			diagnosis: "Normal",
			date: "2024-10-20",
			name: "John Doe",
		},
		{
			reportID: "ECG-10235",
			diagnosis: "Myocardial Infarction",
			date: "2024-10-19",
			name: "Jane Smith",
		},
		{
			reportID: "ECG-10236",
			diagnosis: "Arrhythmia",
			date: "2024-10-18",
			name: "Michael Lee",
		},
		{
			reportID: "ECG-10237",
			diagnosis: "Normal",
			date: "2024-10-17",
			name: "Sarah Brown",
		},
		{
			reportID: "ECG-10238",
			diagnosis: "Normal",
			date: "2024-10-16",
			name: "Sarah Brown",
		},
		{
			reportID: "ECG-10239",
			diagnosis: "Normal",
			date: "2024-10-15",
			name: "Sarah Brown",
		},
		{
			reportID: "ECG-10240",
			diagnosis: "Normal",
			date: "2024-10-14",
			name: "Sarah Brown",
		},
		{
			reportID: "ECG-10241",
			diagnosis: "Normal",
			date: "2024-10-13",
			name: "Sarah Brown",
		},
		{
			reportID: "ECG-10242",
			diagnosis: "Normal",
			date: "2024-10-12",
			name: "Sarah Brown",
		},
		{
			reportID: "ECG-10243",
			diagnosis: "Normal",
			date: "2024-10-11",
			name: "Sarah Brown",
		},
	];

	// State for toggling view more/less
	const [viewMore, setViewMore] = useState(false);

	// Number of reports to show initially
	const initialReportsToShow = 4;

	// Toggle view more/less
	const toggleViewMore = () => {
		setViewMore((prevState) => !prevState);
	};

	return (
		<div className="flex-1 overflow-auto relative z-10 min-h-screen mx-8">
			<h1 className="w-full text-xl font-semibold mb-4 text-center">
				Recent Reports
			</h1>
			<section className="mb-2 bg-gray-800 p-2 rounded shadow-none">
				<table className="w-full text-left table-nowrap">
					<thead>
						<tr>
							<th className="py-2 px-2 border-b border-gray-700 w-1/4">
								Report ID
							</th>
							<th className="py-2 px-2 border-b border-gray-700 w-1/4">
								Diagnosis
							</th>
							<th className="py-2 px-2 border-b border-gray-700 w-1/4">Date</th>
							<th className="py-2 px-2 border-b border-gray-700 w-1/4">Name</th>
						</tr>
					</thead>
					<tbody>
						{/* Conditionally render reports based on viewMore state */}
						{(viewMore ? reports : reports.slice(0, initialReportsToShow)).map(
							(report, index) => (
								<tr key={index} className="hover:bg-gray-700">
									<td className="py-2 px-2 border-b border-gray-700">
										{report.reportID}
									</td>
									<td className="py-2 px-2 border-b border-gray-700">
										{report.diagnosis}
									</td>
									<td className="py-2 px-2 border-b border-gray-700">
										{report.date}
									</td>
									<td className="py-2 px-2 border-b border-gray-700">
										{report.name}
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
				{/* View More/Less Button */}
				<div className="text-center mt-4">
					<button
						onClick={toggleViewMore}
						className="bg-blue-600 text-white py-1 px-4 rounded">
						{viewMore ? "View Less" : "View More"}
					</button>
				</div>
			</section>
		</div>
	);
};

export default RecentReports;
