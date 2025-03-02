import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import supabase from "../helper/supabaseClient";
import '../css/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from '@mui/material/Badge'; // Add this import



const Navbar = () => {
    const [state, setState] = useState({ left: false });
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userID, setUserID] = useState(null);
    const navigate = useNavigate(); // Initialize navigate
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error);
                return;
            }

            if (user) {
                const { data: userDetails, error: userError } = await supabase
                    .from('users') // Replace with your table name
                    .select('fname, role, id') // Use 'id' from the 'users' table instead of 'student_key'
                    .eq('id', user.id) // Match the user ID from Supabase
                    .single();

                if (userError) {
                    console.error('Error fetching user details:', userError);
                } else {
                    setUserName(userDetails?.fname || 'User');
                    setUserRole(userDetails?.role || 'Role');
                    setUserID(userDetails?.id || 'UserID'); // Use 'id' as the userId
                }
            }
        };
        fetchUserInfo();
    }, []);


    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error('Error signing out. Please try again.', {
                    position: 'top-center',
                    autoClose: 3000,
                });
                throw error;
            }

            toast.success('Signed out successfully.', {
                position: 'top-center',
                autoClose: 3000,
            });

            // Redirect after a delay to allow the toast to display
            setTimeout(() => {
                navigate('/register');
            }, 2000);
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    const handleItemClick = (path) => {
        if (path === '/logout') {
            signOut();
        } else {
            navigate(path); // Navigate to the desired path
        }
    };

    const list = (anchor) => (
        <Box
            className="navbar-box"
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box className="navbar-header">
                <Typography variant="h6">{`Welcome, ${userName}`}</Typography>
                <IconButton onClick={toggleDrawer(anchor, false)} className="navbar-close-btn">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider className="navbar-divider" />
            <List className="navbar-list">
                {[
                    { text: 'Map', path: '/dashboard', icon: <MapIcon /> },
                    // Conditionally include Notification for non-admins
                    ...(userRole !== 'admin' ? [{
                        text: 'Notification',
                        path: '/notification',
                        icon: (
                            <Badge badgeContent={notificationCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        )
                    }] : []),
                    { text: 'Report History', path: '/history', icon: <HistoryIcon /> },
                    { text: 'Profile', path: '/profile', icon: <EditIcon /> },
                ].map(({ text, path, icon }) => (
                    <ListItem key={text} disablePadding className="navbar-item">
                        <ListItemButton onClick={() => handleItemClick(path)}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider className="navbar-divider" />
            <List className="navbar-list-logout">
                {/* Always show the user role */}
                <ListItem disablePadding className="navbar-item">
                    <ListItemButton>
                        <ListItemIcon className="navbar-item-icon">
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={userRole} className="navbar-logout-text" />
                    </ListItemButton>
                </ListItem>
                {/* Logout button */}
                <ListItem disablePadding className="navbar-item">
                    <ListItemButton onClick={() => handleItemClick('/logout')}>
                        <ListItemIcon className="navbar-item-icon">
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" className="navbar-logout-text" />
                    </ListItemButton>
                </ListItem>
            </List>

        </Box>
    );

    return (
        <div className="Navbar">
            <MenuIcon
                onClick={toggleDrawer('left', true)}
                style={{ cursor: 'pointer' }}
            />
            <Drawer
                anchor="left"
                open={state['left']}
                onClose={toggleDrawer('left', false)}
                ModalProps={{
                    keepMounted: true, // Keeps the Drawer mounted to improve performance
                }}
            >
                {list('left')}
            </Drawer>
        </div>
    );
};

export default Navbar;
