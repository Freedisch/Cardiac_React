import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import CalendarPage from "./pages/CalendarPage";
import LoginForm from "./pages/LoginForm";
import CriticalAlertsPage from "./pages/CriticalAlertsPage";
import DiagnosticToolPage from "./pages/DiagnosticToolPage";
import EcgInterpreterPage from "./pages/EcgInterpreterPage";
import FollowUpsPage from "./pages/FollowUpsPage";
import NewReportPage from "./pages/NewReportPage";
import OverviewPage from "./pages/OverviewPage";
import PatientInformationPage from "./pages/PatientInformationPage";
import PatientsRecordPage from "./pages/PatientsRecordsPage";
import ReferralCentersPage from "./pages/ReferralCentersPage";
import ReferralPage from "./pages/ReferralPage";
import SettingsPage from "./pages/SettingsPage";
import UpcomingAppointmentPage from "./pages/UpcomingAppointmentPage";
import WelcomePage from "./pages/WelcomePage";
import CreateAccount from "./pages/CreateAccount";

function App() {
	const location = useLocation(); // Get the current location
	// Define the paths where the sidebar should not appear
	const noSidebarPaths = ["/", "/LOGIN"];
	const hideSidebar = noSidebarPaths.includes(location.pathname);

	console.log("Current Path:", location.pathname); // Debugging
	console.log("Hide Sidebar:", hideSidebar); // Debugging

	return (
		<div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
			{/* BG */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
				<div className="absolute inset-0 backdrop-blur-sm" />
			</div>

			{/* Conditionally render Sidebar */}
			{!hideSidebar && <Sidebar />}

			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/overview" element={<OverviewPage />} />
				<Route path="/diagnostic-records" element={<PatientsRecordPage />} />
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
				<Route path="/LOGIN" element={<LoginForm />} />
				<Route path="/CREATE" element={<CreateAccount />} />
			</Routes>
		</div>
	);
}

export default App;
