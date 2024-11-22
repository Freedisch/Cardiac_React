/* eslint-disable no-unused-vars */
// src/pages/Calendar.jsx

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Header from "../components/common/Header.jsx";

const Calendar = () => {
	const [events, setEvents] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event
	const [newEvent, setNewEvent] = useState({
		title: "",
		date: "",
		patientName: "",
		diagnosis: "",
	});

	const calendarContainerStyle = {
		margin: "20px auto",
		width: "90%",
		padding: "0rem 5rem",
		maxWidth: "1100px",
		color: "white",
		textAlign: "center",
	};

	const handleAddEventButtonClick = () => {
		setNewEvent({ title: "", date: "", patientName: "", diagnosis: "" });
		setModalOpen(true);
	};

	const handleAddEvent = () => {
		if (
			newEvent.title &&
			newEvent.date &&
			newEvent.patientName &&
			newEvent.diagnosis
		) {
			setEvents([...events, newEvent]);
			setNewEvent({ title: "", date: "", patientName: "", diagnosis: "" });
			setModalOpen(false);
		}
	};

	const handleEventClick = (clickInfo) => {
		setSelectedEvent(clickInfo.event); // Set the selected event
	};

	const closeEventDetails = () => {
		setSelectedEvent(null);
	};

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-gray-900">
			<Header title="Calendar" />
			<div style={calendarContainerStyle}>
				<button
					onClick={handleAddEventButtonClick}
					className="my-4 bg-gray-700 text-white px-4 py-2 rounded">
					Schedule Appointment
				</button>

				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin]}
					headerToolbar={{
						left: "prev,next today",
						center: "title",
						right: "dayGridMonth,timeGridWeek,timeGridDay",
					}}
					initialView="dayGridMonth"
					height={600}
					editable={false}
					selectable={false}
					events={events}
					eventClick={handleEventClick} // Set the event click handler
				/>
			</div>

			{/* Modal for adding event */}
			{modalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
					<div className="bg-gray-500 p-6 rounded-lg shadow-lg w-80">
						<h2 className="text-xl font-semibold mb-4 text-white">
							Add Appointment/Note
						</h2>
						<input
							type="text"
							className="border p-2 w-full mb-4 bg-gray-600 text-white"
							placeholder="Event Title"
							value={newEvent.title}
							onChange={(e) =>
								setNewEvent({ ...newEvent, title: e.target.value })
							}
						/>
						<input
							type="date"
							className="border p-2 w-full mb-4 bg-gray-600 text-white"
							value={newEvent.date}
							onChange={(e) =>
								setNewEvent({ ...newEvent, date: e.target.value })
							}
						/>
						<input
							type="text"
							className="border p-2 w-full mb-4 bg-gray-600 text-white"
							placeholder="Patient Name"
							value={newEvent.patientName}
							onChange={(e) =>
								setNewEvent({ ...newEvent, patientName: e.target.value })
							}
						/>
						<input
							type="text"
							className="border p-2 w-full mb-4 bg-gray-600 text-white"
							placeholder="Diagnosis"
							value={newEvent.diagnosis}
							onChange={(e) =>
								setNewEvent({ ...newEvent, diagnosis: e.target.value })
							}
						/>
						<div className="flex justify-end">
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
								onClick={handleAddEvent}>
								Add Event
							</button>
							<button
								className="bg-red-500 text-white px-4 py-2 rounded"
								onClick={() => setModalOpen(false)}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal for event details */}
			{selectedEvent && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
					<div className="bg-gray-700 p-6 rounded-lg shadow-lg w-80">
						<h2 className="text-xl font-semibold mb-4 text-white">
							Event Details
						</h2>
						<p className="text-white mb-2">
							<strong>Title:</strong> {selectedEvent.title}
						</p>
						<p className="text-white mb-2">
							<strong>Date:</strong> {selectedEvent.startStr}
						</p>
						<p className="text-white mb-2">
							<strong>Patient Name:</strong>{" "}
							{selectedEvent.extendedProps.patientName}
						</p>
						<p className="text-white mb-2">
							<strong>Diagnosis:</strong>{" "}
							{selectedEvent.extendedProps.diagnosis}
						</p>
						<button
							className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
							onClick={closeEventDetails}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Calendar;
