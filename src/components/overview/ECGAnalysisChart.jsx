import { motion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ecgData = [
	{ name: "Normal", value: 5 }, // Number of patients with Normal diagnosis
	{ name: "HB", value: 3 }, // Number of patients with Abnormal diagnosis
	{ name: "PMI", value: 4 }, // Number of patients with history of MI
	{ name: "MI", value: 1 }, // Number of patients currently experiencing MI
];

const ECGAnalysisChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>ECG Analysis Overview</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={ecgData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis 
							dataKey={"name"} 
							stroke='#9ca3af' 
							label={{ 
								value: "Diagnosis", 
								position: "insideBottom", // Adjust position to be directly below the axis
								offset: -5, // Adjust the vertical offset as needed
								dx: 0, // Center the label
								style: { textAnchor: "middle", fontSize: 14 } 
							}} 
						/>
						<YAxis 
							stroke='#9ca3af' 
							label={{ 
								value: "Number of Patients", 
								angle: -90, 
								position: "insideLeft", 
								offset: 0, 
								style: { textAnchor: "middle", fontSize: 14 } 
							}} 
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='value'
							stroke='#6366F1'
							strokeWidth={3}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ECGAnalysisChart;
