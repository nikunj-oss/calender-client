import { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import { useGetEventQuery } from '../hooks/api'; 
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './CalendarView.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState("month");

  const { data, isLoading } = useGetEventQuery({ token }, { skip: !token });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await getAccessTokenSilently();
        setToken(fetchedToken);
      } catch (e) {
        console.error("Error fetching token", e);
      }
    };
    fetchToken();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (data && !isLoading) {
      const formattedEvents = data.map(event => {
        const startDate = parseISO(event.date);
        return {
          title: event.title,
          start: startDate,
          end: moment(startDate).add(1, 'hours').toDate(), // Set end time as 1 hour later
          allDay: false, 
          description: event.description,
        };
      });
      setEvents(formattedEvents);
    }
  }, [data, isLoading]);

  const handleDateSelect = ({ start }) => {
    const selectedEvents = events.filter(event => 
      moment(event.start).isSame(start, 'day')
    );
    setSelectedDateEvents(selectedEvents);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Event Calendar</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "20px" }}
        onSelectSlot={handleDateSelect} 
        selectable
        views={['month', 'week']}
        view={view}
        onView={setView} // Simplified view change handler
      />
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{ width: '100%', maxWidth: '400px', padding: '20px' }}
      >
        <div className="drawer-content">
          <IconButton onClick={() => setIsDrawerOpen(false)} style={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <div key={index} className="event-item">
                <h4>{event.title}</h4>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CalendarView;
