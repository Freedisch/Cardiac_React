/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
	AlertTriangle,
	Calendar,
	File,
	Plus,
	Users,
	Zap,
	Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import StatCard from "../components/common/StatCard.jsx";
import EcgOverviewChart from "../components/overview/ECGAnalysisChart.jsx";
import EcgDistributionChart from "../components/overview/RecentPatientList.jsx";

const OverviewPage = () => {
	return (
		<div className="flex-1 overflow-auto relative z-10">
			{/* HEADER */}
			<div className="flex items-center justify-between px-4 lg:px-8 py-4 bg-gray-900">
				<Header title="Welcome, Dr. Gilbert" />
				{/* Search bar */}
				<div className="flex items-center space-x-4">
					<input
						type="text"
						placeholder="Search..."
						className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{/* Notification Icon */}
					<button className="relative">
						<Bell className="w-6 h-6 text-white hover:text-gray-300" />
						{/* Notification Badge */}
						<span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
							3
						</span>
					</button>
				</div>
			</div>

			{/* MAIN CONTENT */}
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* BUTTONS */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-4">
					<Link to="/ecg-details">
						<button className="bg-[#6366F1] text-white px-3 py-2 rounded-md hover:bg-[#4F46E1] flex items-center space-x-2">
							<Plus className="w-4 h-4" />
							<span>Analyze ECG</span>
						</button>
					</Link>
					<Link to="/patient-records">
						<button className="bg-[#8B5CF6] text-white px-3 py-2 rounded-md hover:bg-[#7C3AED] flex items-center space-x-2">
							<File className="w-4 h-4" />
							<span>Patient Records</span>
						</button>
					</Link>
					<Link to="/critical-alerts">
						<button className="bg-[#EC4899] text-white px-3 py-2 rounded-md hover:bg-[#DB2777] flex items-center space-x-2">
							<AlertTriangle className="w-4 h-4" />
							<span>Critical Alerts</span>
						</button>
					</Link>
					<Link to="/follow-ups">
						<button className="bg-[#10B981] text-white px-3 py-2 rounded-md hover:bg-[#059669] flex items-center space-x-2">
							<Calendar className="w-4 h-4" />
							<span>Follow-ups</span>
						</button>
					</Link>
				</div>

				{/* STATS */}
				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}>
					<StatCard
						name="Total ECG Reports"
						icon={Zap}
						value="5"
						color="#6366F1"
					/>
					<StatCard
						name="Total Patients"
						icon={Users}
						value="5"
						color="#8B5CF6"
					/>
					<StatCard
						name="Total FollowUps"
						icon={Calendar}
						value="3"
						color="#EC4899"
					/>
					<StatCard
						name="Total Pending Appointments"
						icon={File}
						value="0"
						color="#10B981"
					/>
				</motion.div>

				{/* CHARTS */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<EcgOverviewChart />
					<EcgDistributionChart />
				</div>
			</main>
		</div>
	);
};

export default OverviewPage;
