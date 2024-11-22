import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import CalendarPage from "./pages/CalendarPage";
import DiagnosticToolPage from "./pages/DiagnosticToolPage";
import FollowUpsPage from "./pages/FollowUpsPage";
import ReferralPage from "./pages/ReferralPage";
import PatientsRecordPage from "./pages/PatientsRecordsPage";
import SettingsPage from "./pages/SettingsPage";
import OverviewPage from "./pages/OverviewPage";
import CriticalAlertsPage from "./pages/CriticalAlertsPage";
import EcgInterpreterPage from "./pages/EcgInterpreterPage";
import PatientInformationPage from "./pages/PatientInformationPage";
import WelcomePage from "./pages/WelcomePage";
import NewReportPage from "./pages/NewReportPage";
import ReferralCentersPage from "./pages/ReferralCentersPage";
import UpcomingAppointmentPage from "./pages/UpcomingAppointmentPage";


function App() {
	const location = useLocation(); // Get the current location
	const isRoot = location.pathname === "/";
	// Check if current path is root

	console.log("Current Path:", location.pathname); // Debugging
	console.log("Is Root Path:", isRoot); // Debugging

	return (
		<div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
			{/* BG */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
				<div className="absolute inset-0 backdrop-blur-sm" />
			</div>

			{/* Conditionally render Sidebar */}
			{!isRoot && <Sidebar />}

			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/overview" element={<OverviewPage />} />
				<Route path="/patient-records" element={<PatientsRecordPage />} />
				<Route path="/follow-ups" element={<FollowUpsPage />} />
				<Route path="/diagnostics" element={<DiagnosticToolPage />} />
				<Route path="/referrals" element={<ReferralPage />} />
				<Route path="/calendar" element={<CalendarPage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/critical-alerts" element={<CriticalAlertsPage />} />
				<Route path="/ecg-details" element={<EcgInterpreterPage />} />
				<Route path="/patient-data" element={<PatientInformationPage />} />
				<Route path="/report" element={<NewReportPage />} />
				<Route path="/center" element={<ReferralCentersPage />} />
				<Route path="/appointment" element={<UpcomingAppointmentPage />} />
			</Routes>
		</div>
	);
}

export default App;
