import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";


const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState([
    { title: "Meeting", start: new Date(), end: new Date() },
  ]);

  return (
    <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "10px" }}>
      <h3>Calendar</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarComponent;
