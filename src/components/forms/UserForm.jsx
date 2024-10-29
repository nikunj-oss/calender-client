import { useEffect, useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, Skeleton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useEditUserProfileMutation, useGetUserProfileQuery } from '../../hooks/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [editUserProfile] = useEditUserProfileMutation();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

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

  const { data, isLoading, refetch } = useGetUserProfileQuery({ token }, { skip: !token });

  const [formData, setFormData] = useState({
    auth0Id: '', // Can optionally be displayed or used internally
    name: '',
    email: 'user@example.com',
    company: '',
    role: '',
  });

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'unemployeed', label: 'Unemployed' },
    { value: 'professional', label: 'Professional' },
    { value: 'manager', label: 'Manager' },
  ];

  useEffect(() => {
    if (data && !isLoading) {
      setFormData({
        auth0Id: data.auth0Id || '',
        name: data.name || '',
        email: data.email || 'user@example.com',
        company: data.company || '',
        role: data.role || '',
      });
    }
    // Set email from Auth0 user
    setFormData((prevFormData) => ({ ...prevFormData, email: user?.email }));
  }, [data, isLoading, user?.email]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await editUserProfile({
        data: formData,
        token,
      }).unwrap();
      console.log("Profile Updated Successfully", res);
      toast.success("Profile updated successfully");
      // Refetch user profile to get the updated data
      refetch();
      navigate("/");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        User Form
      </Typography>
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        fullWidth
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Email"
        name="email"
        variant="outlined"
        fullWidth
        value={formData.email}
        InputProps={{
          readOnly: true,
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Company"
        name="company"
        variant="outlined"
        fullWidth
        value={formData.company}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        select
        label="Role"
        name="role"
        variant="outlined"
        fullWidth
        value={formData.role}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
      >
        {roles.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default UserForm;
