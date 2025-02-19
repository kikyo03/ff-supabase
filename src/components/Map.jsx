import React, { useState, useEffect } from "react";
import { areas1, areas2 } from "../helper/areas";
import supabase from "../helper/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Report from './ReportForm'; // Import the ReportForm component

// Import icons
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

const pinTypes = [
    { id: 1, label: "Caution", icon: CautionIcon, hoverIcon: CautionHoverIcon },
    { id: 2, label: "Cleaning", icon: CleaningIcon, hoverIcon: CleaningHoverIcon },
    { id: 3, label: "Electrical", icon: ElectricalIcon, hoverIcon: ElectricalHoverIcon },
    { id: 4, label: "IT Maintenance", icon: ITIcon, hoverIcon: ITHoverIcon },
    { id: 5, label: "Repair", icon: RepairIcon, hoverIcon: RepairHoverIcon },
    { id: 6, label: "Request", icon: RequestIcon, hoverIcon: RequestHoverIcon },
];

const FloorContent = ({ areas, showImages, pins, onAreaClick, onPinClick, textStyle }) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1080"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
    >
        {areas.map((area) => (
            <g
                key={area.id}
                onClick={(e) => onAreaClick(e, area)}
                style={{ cursor: "pointer" }}
            >
                <rect
                    x={area.x}
                    y={area.y}
                    width={area.width}
                    height={area.height}
                    fill={area.color}
                    stroke="black"
                />
                {showImages && area.image && (
                    <image
                        x={area.x}
                        y={area.y}
                        width={area.width}
                        height={area.height}
                        href={area.image}
                    />
                )}
                <text
                    x={area.x + area.width / 2}
                    y={area.y + area.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    {...textStyle}
                >
                    {area.label}
                </text>
            </g>
        ))}

{pins.map((pin) => {
            const pinType = pinTypes.find(pt => pt.label === pin.type);
            if (!pinType) return null;

            return (
                <g
                    key={pin.id}
                    transform={`translate(${pin.coordinates.x}, ${pin.coordinates.y})`}
                    onClick={() => onPinClick(pin)}
                    style={{ cursor: "pointer" }}
                >
                    <image
                        href={pinType.icon}
                        width="90"
                        height="90"
                        x="-20"
                        y="-70"
                    />
                </g>
            );
        })}
    </svg>
);

const FloorMap = () => {
    const [pins, setPins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentFloor, setCurrentFloor] = useState(1);
    const [showImages, setShowImages] = useState(true);
    const [isFloorHovered, setIsFloorHovered] = useState(false);
    const [isImagesHovered, setIsImagesHovered] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedPinType, setSelectedPinType] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [userRole, setUserRole] = useState('');



    

    const navigate = useNavigate();

    const toggleFloor = () => {
        setLoadingAction(true);
        setTimeout(() => {
            setCurrentFloor((prev) => (prev === 1 ? 2 : 1));
            setLoadingAction(false);
        }, 500);
    };

    const toggleImages = () => {
        setLoadingAction(true);
        setTimeout(() => {
            setShowImages((prev) => !prev);
            setLoadingAction(false);
        }, 500);
    };

    const handleAreaClick = (event, area) => {
        // Check pin limit before proceeding
        if (pins.length >= 5) {
            alert("Maximum limit of 5 pins reached. Please delete existing pins to create new ones.");
            return;
        }
    
        const svg = event.currentTarget.ownerSVGElement;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());
    
        setSelectedPosition({ x, y });
        setShowPinModal(true);
    };

    const handlePinClick = (pin) => {
        if (selectedPin && selectedPin.id === pin.id) {
            setShowConfirmation(true);
        } else {
            setSelectedPin(pin);
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPin(null);
    };

    const handlePinSelect = (pinType) => {
        setSelectedPinType(pinType);
        setShowConfirmation(true);
    };



    const confirmPinPlacement = () => {
        if (selectedPinType && selectedPosition) {
          const newPin = {
            id: Date.now(), // Unique ID for the pin
            type: selectedPinType.label,
            coordinates: selectedPosition,
            status: "Pending", // Default status
            floor: String(currentFloor), // Store the current floor
          };
      
          console.log(newPin); // For debugging
      
          setPins((prevPins) => [...prevPins, newPin]);
          setSelectedPin(newPin); // Set the newly created pin as selected
          setShowConfirmation(false);
          setShowPinModal(false);
          setShowReportModal(true); // Open ReportForm modal
        }
      };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setSelectedPin(null);
    };

    const handleCancelPin = () => {
        if (!selectedPin) return;
        
        // Remove the temporary pin from local state
        setPins(prev => prev.filter(pin => pin.id !== selectedPin.id));
        
        // Reset state
        setShowReportModal(false);
        setSelectedPin(null);
        setSelectedPosition(null);
        setSelectedPinType(null);
    };


    const handleDeletePin = async () => {
        if (!selectedPin) return;
    
        // Admin confirmation
        if (userRole === 'admin' && !window.confirm('Are you sure you want to delete this pin?')) {
            return;
        }
    
        try {
            const { error } = await supabase
                .from('pins')
                .delete()
                .eq('pinid', selectedPin.pinid);
    
            if (error) throw error;
    
            setPins(prev => prev.filter(pin => pin.pinid !== selectedPin.pinid));
            handleCloseModal();
            alert('Pin deleted successfully');
        } catch (err) {
            console.error('Error deleting pin:', err.message);
            alert(`Failed to delete pin: ${err.message}`);
        }
    };

   
    // Inside the useEffect for fetching user role
useEffect(() => {
    const fetchUserRole = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('Error fetching user:', error);
            return;
        }

        if (user) {
            const { data: userDetails, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (userError) {
                console.error('Error fetching user role:', userError);
            } else {
                console.log('User Role:', userDetails?.role);
                setUserRole(userDetails?.role || ''); // Add this line to set the role in state
            }
        }
    };
    fetchUserRole();
}, []);


useEffect(() => {
    const fetchPins = async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            // Create base query with status filter
            let query = supabase
                .from('pins')
                .select('*')

            // Add user filter for non-admin users
            if (userRole !== 'admin') {
                query = query.eq('user_uid', user.id);
            }

            // Execute query
            const { data, error } = await query;

            if (error) throw error;
            
            // Parse coordinates
            const parsedPins = data.map((pin) => ({
                ...pin,
                coordinates: pin.coordinates ? JSON.parse(pin.coordinates) : { x: 0, y: 0 }
            }));

            setPins(parsedPins);
        } catch (err) {
            console.error("Error fetching pins:", err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchPins();
}, [userRole]);

    const areasToDisplay = currentFloor === 1 ? areas1 : areas2;

    const responsiveStyles = {
        container: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
        controlButtons: {
            position: "absolute",
            bottom: "5%",
            right: "5%",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(8px, 1vw, 10px)",
            zIndex: 10,
            '@media (maxWidth: 600px)': {
                bottom: "2%",
                right: "2%",
            },
        },
        button: {
            padding: "clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 20px)",
            fontSize: "clamp(12px, 2vw, 16px)",
            backgroundColor: "#457B9D",
            color: "#fae6cfff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "clamp(120px, 20vw, 200px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(5px, 1vw, 10px)",
            transition: "all 0.3s ease",
        },
        pinModal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 'clamp(1rem, 3vw, 2rem)',
            borderRadius: '8px',
            width: 'clamp(300px, 90vw, 600px)',
            textAlign: 'center',
        },
        pinGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
        },
        pinIcon: {
            width: 'clamp(50px, 15vw, 80px)',
            height: 'clamp(50px, 15vw, 80px)',
            marginBottom: '0.5rem',
        },
        confirmationModal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 'clamp(1rem, 3vw, 2rem)',
            borderRadius: '8px',
            textAlign: 'center',
            width: 'clamp(280px, 90vw, 400px)',
        },
        pinText: {
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontFamily: 'Poppins',
            fill: "black",
            fontWeight: "bold",
            stroke: "#D3D3D3",
            strokeWidth: "5",
            paintOrder: "stroke fill",
        }
    };

    return (
        <div style={responsiveStyles.container}>
            {(isLoading || loadingAction) ? (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontSize: "clamp(16px, 3vw, 20px)",
                    fontWeight: "bold",
                    color: "rgba(0, 0, 0, 0.7)",
                }}>
                    <CircularProgress size="clamp(3rem, 10vw, 4rem)" style={{ marginRight: "1rem" }} />
                    Loading Map...
                </div>
            ) : (
                <>
                    <div style={responsiveStyles.controlButtons}>
                        <button
                            style={{
                                ...responsiveStyles.button,
                                backgroundColor: isFloorHovered ? "#1D3557" : "#457B9D",
                            }}
                            onMouseEnter={() => setIsFloorHovered(true)}
                            onMouseLeave={() => setIsFloorHovered(false)}
                            onClick={toggleFloor}
                        >
                            <MapIcon style={{ fontSize: "clamp(16px, 2vw, 24px)" }} />
                            Floor {currentFloor === 1 ? 2 : 1}
                        </button>

                        <button
                            style={{
                                ...responsiveStyles.button,
                                backgroundColor: isImagesHovered ? "#1D3557" : "#457B9D",
                            }}
                            onMouseEnter={() => setIsImagesHovered(true)}
                            onMouseLeave={() => setIsImagesHovered(false)}
                            onClick={toggleImages}
                        >
                            <ChangeCircleIcon style={{ fontSize: "clamp(16px, 2vw, 24px)" }} />
                            {showImages ? "Labels" : "Images"}
                        </button>
                    </div>

                    <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "clamp(10px, 2vw, 20px)",
                    }}>
                        <FloorContent
                            areas={areasToDisplay}
                            showImages={showImages}
                            pins={pins.filter(pin => pin.floor === String(currentFloor))}
                            // pins={pins}
                            onAreaClick={handleAreaClick}
                            onPinClick={handlePinClick}
                            textStyle={responsiveStyles.pinText}
                        />
                    </div>

                    {/* Pin Selection Modal */}
                    <Modal open={showPinModal} onClose={() => setShowPinModal(false)}>
                        <div style={responsiveStyles.pinModal}>
                            <h2 style={{
                                color: '#1D3557',
                                marginBottom: 'clamp(10px, 2vw, 20px)',
                                fontSize: 'clamp(18px, 3vw, 24px)'
                            }}>
                                Select Pin Type ({5 - pins.length} remaining)
                            </h2>
                            <div style={responsiveStyles.pinGrid}>
                                {pinTypes.map((pin) => (
                                    <button
                                        key={pin.id}
                                        style={{
                                            background: 'none',
                                            border: '2px solid #A8DADC',
                                            borderRadius: '8px',
                                            padding: 'clamp(0.5rem, 2vw, 1rem)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => handlePinSelect(pin)}
                                        onMouseOver={(e) => (e.currentTarget.children[0].src = pin.icon)}
                                        onMouseOut={(e) => (e.currentTarget.children[0].src = pin.hoverIcon)}
                                    >
                                        <img
                                            src={pin.hoverIcon}
                                            alt={pin.label}
                                            style={responsiveStyles.pinIcon}
                                        />
                                        <span style={{
                                            display: 'block',
                                            color: '#1D3557',
                                            fontWeight: '500',
                                            fontSize: 'clamp(12px, 2vw, 14px)'
                                        }}>
                                            {pin.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Modal>

                    {/* Confirmation Modal */}
                    <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
                        <div style={responsiveStyles.confirmationModal}>
                            <h2 style={{
                                color: '#1D3557',
                                fontSize: 'clamp(18px, 3vw, 24px)'
                            }}>
                                Confirm Pin Placement
                            </h2>
                            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' , color: '#1D3557'}}>
                                Are you sure you want to place a {selectedPinType?.label} pin here?
                            </p>
                            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)' , color: '#1D3557'}}>
            You have {5 - pins.length - 1} pins remaining after this placement.
        </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 'clamp(0.5rem, 2vw, 1rem)',
                                marginTop: 'clamp(1rem, 3vw, 1.5rem)',
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={confirmPinPlacement}
                                    style={{
                                        backgroundColor: '#457B9D',
                                        color: 'white',
                                        fontSize: 'clamp(12px, 2vw, 14px)'
                                    }}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowConfirmation(false)}
                                    style={{
                                        borderColor: '#457B9D',
                                        color: '#1D3557',
                                        fontSize: 'clamp(12px, 2vw, 14px)'
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    {/* Existing Pin Details Modal */}

                    <Modal open={openModal} onClose={handleCloseModal}>
                <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#A8DADC',
                padding: 'clamp(20px, 4vw, 25px)', // Slightly increased padding
                borderRadius: '8px',
                width: 'clamp(300px, 95vw, 400px)', // Increased width
                color: '#1D3557',
                textAlign: 'center', // Center content
            }}>
                <h2 style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>
            {selectedPin?.type ? `${selectedPin.type} Pin` : 'Pin Details'}
        </h2>
        {selectedPin && (
            <>
               <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
  <strong>Pin ID:</strong> {selectedPin?.pinid}
</p>
                {/* <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
                    <strong>Status:</strong> {selectedPin.status}
                </p> */}
            </>
        )}


        {/* Button Container for Alignment */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between', // Ensures even spacing
            gap: '12px', // Slightly increased gap
            marginTop: '1.5rem',
        }}>
            <Button
                style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    backgroundColor: '#E63946',
                    color: '#fae6cfff',
                    flex: 1, // Equal button width
                    padding: '8px', // More padding for better fit
                }}
                onClick={handleDeletePin}
            >
                Delete Pin
            </Button>
            <Button
                style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    backgroundColor: '#1D3557',
                    color: '#fae6cfff',
                    flex: 1,
                    padding: '8px',
                }}
                // onClick={() => navigate('/status')}
                onClick={() => navigate(`/status/${selectedPin.pinid}`)}
                disabled={!selectedPin?.pinid} // Disable if pinid is missing
            >
                Status
            </Button>
            <Button
                variant="outlined"
                onClick={handleCloseModal}
                style={{
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    flex: 1,
                    padding: '8px',
                }}
            >
                Close
            </Button>
        </div>
    </div>
</Modal>

                    {/* Report Modal */}
<Modal
    open={showReportModal}
    onClose={() => {
        // if (selectedPin) handleDeletePin(selectedPin); // Delete on modal close
        // if (selectedPin) handleCancelPin(selectedPin);
        handleCloseReportModal();
    }}
    BackdropProps={{ invisible: true }}
>
    <div>
        <Report
            pin={selectedPin}  // Pass the pin object
            onCancel={() => {
                if (selectedPin) handleCancelPin(selectedPin); // Delete on "Cancel"
                handleCloseReportModal();
            }}
            // onClose={() => {
            //     if (selectedPin) handleCancelPin(selectedPin); // Delete on "Close"
            //     handleCloseReportModal();
            // }}
        />
    </div>
</Modal>
    </>
            )}
        </div>
    );
};

export default FloorMap;

