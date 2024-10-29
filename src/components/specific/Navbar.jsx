import { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { styled } from '@mui/material/styles';
import logo from '../../assets/logo.jpg';


const StyledAppBar = styled(AppBar)(({ isScrolled }) => ({
  backgroundColor: isScrolled ? 'rgba(26, 35, 126, 0.8)' : '#1A237E',
  transition: 'background-color 0.3s ease',
  borderRadius: '50px',
  boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.3)',
  backdropFilter: isScrolled ? 'blur(10px)' : 'none',
  marginTop: '10px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const Navbar = () => {
  const navigate=useNavigate()
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'My Events', path: '/events' },
    { label: 'About', path: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  const handleNavClick = () => {
    setShowLogout(false);
    setDrawerOpen(false);
  };

  useEffect(() => {
    setShowLogout(false);
  }, [location]);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    setDrawerOpen(false); // Close the drawer after logout is initiated
  };

  const clickHandler=()=>{
    navigate("/calender")
  }

  // Close drawer if window size exceeds 600px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <StyledAppBar position="fixed" isScrolled={isScrolled}>
      <Toolbar sx={{ justifyContent: 'space-between', borderRadius: '50px', padding: '0 15px', minHeight: '48px' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1rem' }}>
          <img src={logo} alt='logo' style={{
            height:"40px",
            width:'auto'
          }} onClick={clickHandler}/>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {navItems.map((item) => (
            (isAuthenticated || item.label !== 'My Events') && (
              <StyledButton key={item.label} color="inherit" component={Link} to={item.path} onClick={handleNavClick}>
                {item.label}
              </StyledButton>
            )
          ))}
          {isAuthenticated ? (
            <Box sx={{ position: 'relative' }} ref={dropdownRef}>
              <StyledButton 
                color="inherit" 
                onClick={handleToggleLogout} 
                sx={{ marginLeft: 2 }}
              >
                {user?.name || "User"}
              </StyledButton>
              {showLogout && (
                <Box sx={{ position: 'absolute', right: 0, backgroundColor: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
                  <StyledButton component={Link} to="/user/form" onClick={handleNavClick}>
                    User Form
                  </StyledButton>
                  <StyledButton onClick={handleLogout}>
                    Logout
                  </StyledButton>
                </Box>
              )}
            </Box>
          ) : (
            <StyledButton color="inherit" onClick={() => loginWithRedirect()} sx={{ marginLeft: 2 }}>
              Login
            </StyledButton>
          )}
        </Box>
        <IconButton
          color="inherit"
          edge="end"
          sx={{ display: { xs: 'block', md: 'none' } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250, backgroundColor: 'white' }}
            role="presentation"
          >
            <List>
              {navItems.map((item) => (
                (isAuthenticated || item.label !== 'My Events') && (
                  <StyledListItem button key={item.label} component={Link} to={item.path} onClick={handleNavClick}>
                    <ListItemText primary={item.label} />
                  </StyledListItem>
                )
              ))}
              {isAuthenticated && (
                <>
                  <StyledListItem button onClick={handleToggleLogout}>
                    <ListItemText primary={user?.name || "User"} />
                  </StyledListItem>
                  {showLogout && (
                    <Box sx={{ pl: 2 }}>
                      <StyledListItem button component={Link} to="/user/form" onClick={handleNavClick}>
                        <ListItemText primary="User Form" />
                      </StyledListItem>
                      <StyledListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </StyledListItem>
                    </Box>
                  )}
                </>
              )}
              {!isAuthenticated && (
                <StyledListItem button onClick={() => { loginWithRedirect(); handleNavClick(); }}>
                  <ListItemText primary="Login" />
                </StyledListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
