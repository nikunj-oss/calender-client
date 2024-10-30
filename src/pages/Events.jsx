import { useEffect, useState } from 'react';
import { Box, IconButton, List, ListItem, ListItemText, Typography, Fab, Dialog, DialogTitle, DialogContent, CircularProgress, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EventForm from '../components/forms/EventForm';
import { useDeleteEventMutation, useGetEventQuery, useRemindEventMutation } from '../hooks/api';
import { useAuth0 } from '@auth0/auth0-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { Alarm, AlarmOffTwoTone } from '@mui/icons-material';

const Events = () => {
  const [events, setEvents] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  
  const { data, isLoading, refetch } = useGetEventQuery({ token }, { skip: !token });
  const [remindEvent]=useRemindEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formHeading, setFormHeading] = useState('');
  
  // State for the confirmation dialog
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
      setEvents(data);
    }
  }, [data, isLoading]);

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormHeading('Edit Event');
    setOpen(true);
  };

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setFormHeading('Add New Event');
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    await refetch();
  };

  const handleDeleteOpen = (event) => {
    setCurrentEvent(event);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setCurrentEvent(null);
  };

  const handleDelete = async () => {
    try {
      await deleteEvent({ id: currentEvent._id, token });
      toast.success("Deleted Successfully");
      await refetch();
    } catch (error) {
      console.log("Error deleting", error);
      toast.error("Can't delete successfully");
    } finally {
      handleDeleteClose(); // Close confirmation dialog after delete attempt
    }
  };

  const setReminder=async(event)=>{
    try{
      await remindEvent({id:event._id,token})
      toast.success("Reminder updated successfully");
      await refetch()
    }
    catch(e){
      console.log(e);
      toast.error("can not create reminder")
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <List>
        {events.length > 0 ? (
          events.map((event) => (
            <ListItem
              key={event.id}
              sx={{
                '&:hover .actions': { display: 'flex' },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                borderRadius: 1,
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                mb: 1,
              }}
            >
              <ListItemText
                primary={event.title}
                secondary={
                  <>
                    <Typography variant="body2">Description: {event.description}</Typography>
                    <Typography variant="body2">Date: {format(parseISO(event.date), 'MMMM d, yyyy')}</Typography>
                    <Typography variant="body2">Time: {format(parseISO(event.time), 'hh:mm a')}</Typography>
                  </>
                }
              />
              <Box className="actions" sx={{ display: 'none', gap: 1 }}>
                <IconButton onClick={() => handleEdit(event)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteOpen(event)} color="error">
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={()=>
                  setReminder(event)
                }>
                  {event?.remind ?(<Alarm/>):(<AlarmOffTwoTone/>)}
                </IconButton>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No events found.</Typography>
        )}
      </List>
      
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddEvent}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formHeading}</DialogTitle>
        <DialogContent>
          <EventForm 
            heading={formHeading}
            onClose={handleClose} 
            currentEvent={currentEvent}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={confirmDeleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events;
