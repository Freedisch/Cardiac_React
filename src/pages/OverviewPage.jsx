import { motion } from "framer-motion";
import { AlertTriangle, Calendar, File, Plus, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation

import Header from "../components/common/Header.jsx";
import StatCard from "../components/common/StatCard.jsx";
import EcgOverviewChart from "../components/overview/ECGAnalysisChart.jsx";
import EcgDistributionChart from "../components/overview/ECGRecordsList.jsx";

const OverviewPage = () => {
	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Dashboard" />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* BUTTONS */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-4">
					<Link to="/ecg-details">
						<button className="bg-[#6366F1] text-white px-3 py-2 rounded-md hover:bg-[#4F46E1] flex items-center space-x-2">
							<Plus className="w-4 h-4" />
							<span>Create New Report</span>
						</button>
					</Link>
					<Link to="/pending-reports">
						<button className="bg-[#8B5CF6] text-white px-3 py-2 rounded-md hover:bg-[#7C3AED] flex items-center space-x-2">
							<File className="w-4 h-4" />
							<span>Pending Reports</span>
						</button>
					</Link>
					<Link to="/critical-alerts">
						<button className="bg-[#EC4899] text-white px-3 py-2 rounded-md hover:bg-[#DB2777] flex items-center space-x-2">
							<AlertTriangle className="w-4 h-4" />
							<span>Critical Alerts</span>
						</button>
					</Link>
					<Link to="/follow-ups">
						{" "}
						{/* Link to FollowUpsPage */}
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
						name="Total Pending Reports"
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
