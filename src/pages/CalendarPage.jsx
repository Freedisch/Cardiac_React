// eslint-disable-next-line no-unused-vars
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar = () => {
    // Inline styles
    const calendarContainerStyle = {
        margin: 'auto',
        width: '90%',
        padding: '0rem 5rem',
        maxWidth: '1100px',
    };

    const customStyles = `
        .fc {
            font-size: 20px; /* Increase font size for better visibility */
        }
        .fc-toolbar {
            background-color: #ffffff; /* White background for high contrast */
            padding: 15px; /* Add padding for the toolbar */
            border-radius: 8px; /* Rounded corners for the toolbar */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Add subtle shadow */
        }
        .fc-toolbar-title {
            font-size: 28px; /* Increase font size for the month and year title */
            color: #1f2937; /* Dark text color for better contrast */
            font-weight: bold; /* Make the text bold for emphasis */
        }
        .fc-event {
            background: var(--orange-gradient) !important; /* Keep the background color */
            color: #6366f1; /* Change text color for better contrast */
        }
        .fc .fc-daygrid-day {
            padding: 10px; /* Increase padding for day cells */
        }
        .fc .fc-daygrid-day-number {
            font-weight: bold; /* Make day numbers bold */
        }
    `;

    // Append custom styles to head
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    return (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
            <div style={calendarContainerStyle}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView="dayGridMonth" // Default view for better month overview
                    height={600} // Adjusted height for better clarity
                    editable={false} // Disable editing
                    selectable={false} // Disable selecting dates
                    events={[]} // No events to display
                />
            </div>
        </div>
    );
};

export default Calendar;
