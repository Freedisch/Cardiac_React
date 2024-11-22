// eslint-disable-next-line no-unused-vars
import React from "react";
// import { motion } from "framer-motion";
// import { ClipboardCheck, UserCheck, AlertTriangle } from "lucide-react";
import ECGUploadPage from "../components/EcgInterpreterPage/NewAnalysis";
import Header from "../components/common/Header";
// import RecentReports from "../components/EcgInterpreterPage/RecentReports";

const EcgInterpreterPage = () => {
	return (
		<div className="flex-1 overflow-auto relative z-10">
			{/* Page Header */}
			<Header title="Analyze ECG" />

			{/* Main Content */}
			<div className="flex max-w-7xl mx-auto relative py-8 lg:px-4 lg:pl-10 space-x-0">
				<div className="flex-1 space-y-6">
					{/* ECG Upload Section */}
					<section>
						<ECGUploadPage />
					</section>

					{/* Patient Information Section */}
					{/* <section>
						<PatientPage />
					</section> */}

					{/* Action Buttons */}
					{/* <motion.div
						className="flex flex-row justify-between mt-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}>
						<button className="bg-purple-600 text-white py-1.5 px-4 rounded-md hover:bg-purple-700 flex items-center gap-2">
							<ClipboardCheck size={20} />
							<span>Refer</span>
						</button>

						<button className="bg-pink-600 text-white py-1.5 px-4 rounded-md hover:bg-pink-700 flex items-center gap-2">
							<UserCheck size={20} />
							<span>Follow-up</span>
						</button>

						<button className="bg-orange-600 text-white py-1.5 px-4 rounded-md hover:bg-orange-700 flex items-center gap-2">
							<AlertTriangle size={20} />
							<span>Critical Alert</span>
						</button>
					</motion.div> */}
				</div>

				{/* Right Side - Recent Reports */}
				{/* <div className="w-1/2">
					<RecentReports />
				</div> */}
			</div>
		</div>
	);
};

export default EcgInterpreterPage;
