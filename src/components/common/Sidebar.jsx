import {
	BarChart2,
	Users,
	Menu,
	Settings,
	File,
	Calendar,
	Monitor,
	Clipboard,
	LogOut,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Dashboard",
		icon: BarChart2,
		color: "#6366f1",
		href: "/overview",
	},
	{
		name: "Patient Records",
		icon: File,
		color: "#EC4899",
		href: "/patient-records",
	},
	{ name: "FollowUps", icon: Calendar, color: "#EC4899", href: "/follow-ups" },
	{ name: "Referrals", icon: Users, color: "#F59E0B", href: "/referrals" },
	{
		name: "Appointments",
		icon: Clipboard,
		color: "#10B981",
		href: "/appointment",
	},
	{
		name: "ECG Diagnostic Tools",
		icon: Monitor,
		color: "#F59E0B",
		href: "/diagnostics",
	},
	{
		name: "Referral Centers",
		icon: Settings,
		color: "#6EE7B7",
		href: "/center",
	},
	{ name: "Calendar", icon: Settings, color: "#6EE7B7", href: "/calendar" },
	{ name: "Settings", icon: Calendar, color: "#6EE7B7", href: "/settings" },
	{
		name: "Logout",
		icon: LogOut,
		color: "#F87171", // A more noticeable red color for logout
		href: "/LOGIN",
	},
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();

	const handleLogout = () => {
		// Here, you can also clear user authentication tokens or session storage if needed
		navigate("/login");
	};

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}>
			<div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit">
					<Menu size={24} />
				</motion.button>

				<nav className="mt-8 flex-grow">
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div
								className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
								onClick={item.name === "Logout" ? handleLogout : undefined}>
								<item.icon
									size={20}
									style={{ color: item.color, minWidth: "20px" }}
								/>
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className="ml-4 whitespace-nowrap"
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
