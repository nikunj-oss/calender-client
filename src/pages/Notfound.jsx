import { Container, Stack, Typography, Button } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <Container 
      maxWidth="lg" 
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",  // Light background
      }}
    >
      <Stack 
        alignItems="center" 
        spacing={4} 
        justifyContent="center" 
        sx={{
          textAlign: "center",
          animation: "fadeIn 1s ease-in-out", // Smooth fade-in animation
        }}
      >
        <ErrorIcon sx={{ 
          fontSize: "10rem", 
          color: "#d32f2f", // A bright error color
        }} />
        <Typography variant="h1" sx={{ 
          fontWeight: 700, 
          color: "#333", 
          fontSize: { xs: "3rem", md: "6rem" },  // Responsive font size
        }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ 
          color: "#555", 
          fontWeight: 500, 
          fontSize: { xs: "1.5rem", md: "2rem" }, 
        }}>
          Oops! Page Not Found
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            padding: "10px 20px",
            fontSize: "1.2rem",
            borderRadius: "30px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          Go Back To Home
        </Button>
      </Stack>
    </Container>
  );
};

export default Notfound;
