import { motion } from "framer-motion";

const recentECGRecords = [
	{ name: "Ama Kofi", date: "2024-10-10", diagnosis: "Normal" },
	{
		name: "John Brako",
		date: "2024-10-11",
		diagnosis: "Myocardial Infarction",
	},
	{ name: "Rit Serwa", date: "2024-10-12", diagnosis: "Abnormal Heartbeat" },
	{ name: "Aku Joy", date: "2024-10-13", diagnosis: "Normal" },
	{ name: "Felicia OB", date: "2024-10-14", diagnosis: "Myocardial Infarction" },
];

const ECGRecordsList = () => {
	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}>
			<h2 className="text-lg font-medium mb-4 text-gray-100">
				Recent ECG Records
			</h2>
			<table className="min-w-full bg-gray-800 text-gray-100">
				<thead>
					<tr className="w-full bg-gray-700">
						<th className="py-3 px-4 text-left">Name</th>
						<th className="py-3 px-4 text-left">Date</th>
						<th className="py-3 px-4 text-left">Diagnosis</th>
					</tr>
				</thead>
				<tbody>
					{recentECGRecords.map((record, index) => (
						<tr key={index} className="border-b border-gray-600">
							<td className="py-3 px-4">{record.name}</td>
							<td className="py-3 px-4">{record.date}</td>
							<td className="py-3 px-4">{record.diagnosis}</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};

export default ECGRecordsList;
