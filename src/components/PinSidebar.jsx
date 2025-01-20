import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import '@fontsource/poppins';
import { createTheme } from '@mui/material/styles';
import Report from './ReportForm';
import CautionIcon from '../assets/images/Caution_noshadow.png';
import CautionHoverIcon from '../assets/images/Caution_symbol.png';
import CleaningIcon from '../assets/images/Cleaning_shadow.png';
import CleaningHoverIcon from '../assets/images/Cleaning_symbol.png';
import ElectricalIcon from '../assets/images/Electrical Hazard_shadow.png';
import ElectricalHoverIcon from '../assets/images/Electrical Hazard_symbol.png';
import ITIcon from '../assets/images/IT Maintenance_shadow.png';
import ITHoverIcon from '../assets/images/IT Maintenance_symbol.png';
import RepairIcon from '../assets/images/Repair_shadow.png';
import RepairHoverIcon from '../assets/images/Repair_symbol.png';
import RequestIcon from '../assets/images/Request_shadow.png';
import RequestHoverIcon from '../assets/images/Request_symbol.png';
import { areas } from '../helper/areas';  // Adjust path if necessary



const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
    },
});

const PinSidebar = ({ isOpen, setIsOpen }) => {
    const [hoveredPin, setHoveredPin] = useState(null);
    const [clonedPins, setClonedPins] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false);

    const isDragging = useRef(false);
    const draggingPinId = useRef(null);
    const startPosition = useRef({ x: 0, y: 0 });
    const currentPinRef = useRef(null); // For the currently dragged pin

    const toggleDrawer = (open) => {
        setIsOpen(open);
    };

    const pinData = [
        { id: 'Hazard', icon: CautionHoverIcon, hoverIcon: CautionIcon, label: 'Hazard', type: 'Hazard' },
        { id: 'Cleaning', icon: CleaningHoverIcon, hoverIcon: CleaningIcon, label: 'Cleaning Pin', type: 'Cleaning' },
        { id: 'Electrical Hazard', icon: ElectricalHoverIcon, hoverIcon: ElectricalIcon, label: 'Electrical Pin', type: 'Electrical Hazard' },
        { id: 'IT Maintenance', icon: ITHoverIcon, hoverIcon: ITIcon, label: 'IT Maintenance Pin', type: 'IT Maintenance' },
        { id: 'Repair', icon: RepairHoverIcon, hoverIcon: RepairIcon, label: 'Repair Pin', type: 'Repair' },
        { id: 'Request', icon: RequestHoverIcon, hoverIcon: RequestIcon, label: 'Request Pin', type: 'Request' },
    ];

    // Function to delete pin from clonedPins state
    // Function to delete pin from clonedPins state
    const deletePin = (pinId) => {
        setClonedPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
    };


    // const handlePinClick = (id, isFromSidebar, e) => {
    //     const clickedPin = pinData.find((pin) => pin.id === id);
    //     if (!clickedPin) return;

    //     // Determine the event type (Mouse or Touch)
    //     let mouseX, mouseY;
    //     if (e.clientX && e.clientY) { // Mouse event
    //         mouseX = e.clientX;
    //         mouseY = e.clientY;
    //     } else if (e.touches && e.touches[0]) { // Touch event
    //         mouseX = e.touches[0].clientX;
    //         mouseY = e.touches[0].clientY;
    //     }

    //     if (isFromSidebar) {
    //         const userConfirmed = window.confirm(`${clickedPin.label} selected`);
    //         if (userConfirmed) {
    //             const newPin = {
    //                 id: `${Date.now()}-${Math.random()}`, // Ensure unique ID by appending a random value
    //                 ...clickedPin,
    //                 x: mouseX || 0,
    //                 y: mouseY || 0,
    //             };

    //             setClonedPins((prevPins) => [...prevPins, newPin]);
    //             setIsOpen(false); // Close sidebar
    //             currentPinRef.current = newPin;
    //         }
    //     } else {
    //         const userConfirmed = window.confirm('Do you want to confirm the pin position?');
    //         if (userConfirmed) {
    //             setSelectedPin({
    //                 id: Date.now().toString(),
    //                 type: clickedPin.type,
    //             });
    //             setShowReportForm(true);
    //         }
    //     }
    // };


    const handlePinClick = (id, isFromSidebar, e) => {
        const clickedPin = pinData.find((pin) => pin.id === id);
        if (!clickedPin) return;

        // Determine the event type (Mouse or Touch)
        let mouseX, mouseY;
        if (e.clientX && e.clientY) { // Mouse event
            mouseX = e.clientX;
            mouseY = e.clientY;
        } else if (e.touches && e.touches[0]) { // Touch event
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }

        if (isFromSidebar) {
            const userConfirmed = window.confirm(`${clickedPin.label} selected`);
            if (userConfirmed) {
                const newPin = {
                    id: `${Date.now()}-${Math.random()}`, // Ensure unique ID
                    ...clickedPin,
                    x: mouseX || 0,
                    y: mouseY || 0,
                };

                const pinDetails = {
                    top: `${newPin.y}px`,
                    left: `${newPin.x}px`,
                    imgSrc: newPin.hoverIcon,
                    floor: 1, // Assuming floor 1
                };

                // Save pin to localStorage
                const savedPins = JSON.parse(localStorage.getItem('pins')) || {};
                savedPins[newPin.id] = pinDetails;
                localStorage.setItem('pins', JSON.stringify(savedPins));

                // Update the state
                setClonedPins((prevPins) => [...prevPins, newPin]);
                setIsOpen(false); // Close sidebar
            }
        } else {
            const activePin = clonedPins.find((pin) => pin.id === id);
            if (activePin) {
                const pinDetails = {
                    top: `${activePin.y}px`,
                    left: `${activePin.x}px`,
                    imgSrc: activePin.hoverIcon,
                    floor: 1, // Assuming floor 1
                };
                console.log("Active Pin Details:", pinDetails);

                const userConfirmed = window.confirm('Do you want to confirm the pin position?');
                if (userConfirmed) {
                    // setSelectedPin(pinDetails);
                    setSelectedPin({
                        id: Date.now().toString(),
                        type: clickedPin.type,
                        coordinates: JSON.stringify(pinDetails),
                    });
                    setShowReportForm(true);
                    currentPinRef.current = newPin;
                }
            }
        }
    };



    // Mouse move handler for the new pin (follows the cursor)
    const handleMouseMoveForNewPin = (e) => {
        if (currentPinRef.current) {
            const x = e.clientX;
            const y = e.clientY;
            updatePinPosition(currentPinRef.current.id, x, y);
        }
    };

    const handleNewPinPlacement = () => {
        if (currentPinRef.current) {
            updatePinPosition(currentPinRef.current.id, currentPinRef.current.x, currentPinRef.current.y);
            currentPinRef.current = null;
        }
    };

    const handleMouseDown = (e, id) => {
        isDragging.current = true;
        draggingPinId.current = id;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startPosition.current = {
            x: clientX - getPinPosition(id).x,
            y: clientY - getPinPosition(id).y,
        };

        document.body.style.userSelect = 'none';

        if (e.touches) {
            document.addEventListener('touchmove', handleMouseMove);
            document.addEventListener('touchend', handleMouseUp);
        } else {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const newX = clientX - startPosition.current.x;
            const newY = clientY - startPosition.current.y;

            updatePinPosition(draggingPinId.current, newX, newY);
        }
    };




    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.userSelect = 'auto';

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
    };

    const getPinPosition = (id) => {
        return clonedPins.find((pin) => pin.id === id) || { x: 0, y: 0 };
    };

    const updatePinPosition = (id, x, y) => {
        setClonedPins((prevPins) =>
            prevPins.map((pin) => (pin.id === id ? { ...pin, x, y } : pin))
        );
    };

    return (
        <Box>
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={() => toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 300,
                        backgroundColor: '#A8DADC',
                        color: '#fae6cfff',
                    },
                }}
                aria-hidden={isOpen ? 'false' : 'true'} // Use dynamic aria-hidden
            >

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#1D3557', color: '#fae6cfff' }}>
                    <Typography variant="h6" component="div" sx={{ fontSize: '30px', fontWeight: 'bold', color: '#fae6cfff' }}>
                        PINS
                    </Typography>
                    <IconButton onClick={() => toggleDrawer(false)} sx={{ color: '#fae6cfff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: '#444' }} />

                <List sx={{ padding: '10px' }}>
                    {pinData.map(({ id, icon, hoverIcon, label }) => (
                        <ListItem
                            key={id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '15px 10px',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                backgroundColor: '#1D3557',
                                opacity: 0.8,
                                '&:hover': {
                                    backgroundColor: '#457B9D',
                                },
                            }}
                            onMouseEnter={() => setHoveredPin(id)}
                            onMouseLeave={() => setHoveredPin(null)}
                            onClick={(e) => handlePinClick(id, true, e)}
                        >
                            <ListItemIcon sx={{ minWidth: 'unset', marginRight: '15px' }}>
                                <img
                                    src={hoveredPin === id ? hoverIcon : icon}
                                    alt={label}
                                    style={{ width: 50, height: 'auto', borderRadius: '5px' }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                primaryTypographyProps={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins, Arial, sans-serif',
                                    color: '#fae6cfff',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {/* Render Cloned Pins */}
            <Box sx={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {clonedPins.map((pin) => (
                    <Box
                        key={pin.id}
                        sx={{
                            position: 'absolute',
                            top: pin.y,
                            left: pin.x,
                            width: 50,
                            height: 50,
                            cursor: 'grab',
                        }}
                        onMouseDown={(e) => handleMouseDown(e, pin.id)}
                        onTouchStart={(e) => handleMouseDown(e, pin.id)}
                        onClick={(e) => handlePinClick(pin.id, false, e)}
                    >
                        <img
                            src={pin.hoverIcon}
                            alt={pin.label}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Box>
                ))}
            </Box>

            {showReportForm && (
                <Report pin={selectedPin}
                    deletePin={deletePin}
                    setShowReportForm={setShowReportForm}  // Pass the state setter to close the form
                />
            )}
        </Box >
    );
};

export default PinSidebar;


