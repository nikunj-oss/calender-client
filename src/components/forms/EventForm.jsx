/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreateEventMutation, useEditEventMutation } from '../../hooks/api';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';

const EventForm = ({ onClose,heading,currentEvent }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [ createEvent ] = useCreateEventMutation();
  const [editEvent]=useEditEventMutation()
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

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


  useEffect(()=>{
    if(currentEvent){
        console.log(currentEvent)
        setTitle(currentEvent.title);
        setDescription(currentEvent.description);
        setDate(new Date(currentEvent.date))
        setTime(new Date(currentEvent.time))
    }
  },[currentEvent])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description && date && time) {
      // Create event data
      const eventData = {
        title,
        description,
        date,
        time,
      };

      try {
        
        if(currentEvent?._id){
            await editEvent({id:currentEvent._id,data:eventData,token})
            toast.success("Event updated Successfully")
        }
        else{
            await createEvent({ data: eventData, token });
            toast.success("Event Created Successfully")
        }
        setTitle('');
        setDescription('');
        setDate(null);
        setTime(null);
        onClose();
      } catch (error) {
        console.error("Error creating event", error);
        toast.error("some error occured")
      }
    } else {
        toast.error("Fill all details")
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 4,
      }}
    >
      <Paper elevation={3} sx={{ width: '100%', padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
            {heading}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens, horizontally on larger screens
              gap: 2, // Add gap between date and time pickers
              marginTop: 2,
            }}>
              <DatePicker
                label="Event Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(props) => <TextField {...props} fullWidth required />}
              />
              <TimePicker
                label="Event Time"
                value={time}
                onChange={(newTime) => setTime(newTime)}
                renderInput={(props) => <TextField {...props} fullWidth required />}
              />
            </Box>
          </LocalizationProvider>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} >
            {`${heading}`}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventForm;
