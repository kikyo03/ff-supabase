// import React, { useState, useEffect } from "react";
// import PinSidebar from "../components/PinSidebar";
// import { areas } from "../helper/areas"; // Adjust path if necessary
// import supabase from "../helper/supabaseClient"; // Import your Supabase client
// import CircularProgress from "@mui/material/CircularProgress";
// import Modal from "@mui/material/Modal";
// import Button from "@mui/material/Button";
// import { useNavigate } from "react-router-dom";

// const FloorMap = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [pins, setPins] = useState([]); // Store pin positions
//     const [clickedArea, setClickedArea] = useState(null); // Store the name of the clicked area
//     const [userUID, setUserUID] = useState(null); // Store the user's UID
//     const [isLoading, setIsLoading] = useState(true); // Track loading state
//     const [selectedPin, setSelectedPin] = useState(null); // Store the currently selected pin for the modal
//     const [openModal, setOpenModal] = useState(false); // Control modal visibility
//     const [clickedCoordinates, setClickedCoordinates] = useState(null); // Store clicked coordinates
//     const navigate = useNavigate();

//     const handleAreaClick = (areaLabel, event) => {
//         setClickedArea(areaLabel); // Set the clicked area's name
//         setIsSidebarOpen(true); // Open the sidebar

//         // // Calculate coordinates relative to the SVG
//         // const rect = event.target.getBoundingClientRect();
//         // const x = event.clientX - rect.left; // X-coordinate
//         // const y = event.clientY - rect.top; // Y-coordinate

//         const svg = event.target.ownerSVGElement;
//         const svgRect = svg.getBoundingClientRect();
//         const x = event.clientX - svgRect.left;
//         const y = event.clientY - svgRect.top;


//         // Set the clicked coordinates
//         setClickedCoordinates({ x: Math.round(x), y: Math.round(y) });

//         // Display the label and coordinates in the console (or any UI element)
//         console.log(`Area: ${areaLabel}, Coordinates: x: (${Math.round(x)}, y:  ${Math.round(y)})`);
//     };


//     const handleSidebarClose = () => {
//         setIsSidebarOpen(false); // Close the sidebar
//         setClickedArea(null); // Reset the clicked area
//     };

//     const handlePinClick = (pin) => {
//         setSelectedPin(pin); // Set the selected pin to show in the modal
//         setOpenModal(true); // Open the modal
//     };

//     const handleCloseModal = () => {
//         setOpenModal(false); // Close the modal
//         setSelectedPin(null);
//     };

//     const handleNavigate = () => {
//         navigate("/status");
//     };

//     const handleDeletePin = async (pinId) => {
//         try {
//             const { error } = await supabase.from("pins").delete().eq("id", pinId); // Delete the pin from the database

//             if (error) throw error;

//             // Update the state after pin deletion
//             setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
//             setOpenModal(false); // Close the modal after deletion
//         } catch (error) {
//             console.error("Error deleting pin:", error.message);
//         }
//     };

//     // useEffect(() => {
//     //     const fetchPins = async () => {
//     //         try {
//     //             setIsLoading(true); // Start loading

//     //             // Get the current user's UID
//     //             const {
//     //                 data: { user },
//     //                 error: userError,
//     //             } = await supabase.auth.getUser();
//     //             if (userError) throw userError;

//     //             setUserUID(user.id); // Save the user's UID to state

//     //             // Fetch pins where user_uid matches the current user's UID
//     //             const { data, error } = await supabase
//     //                 .from("pins")
//     //                 .select("*")
//     //                 .eq("user_uid", user.id); // Filter by user_uid
//     //             if (error) throw error;

//     //             // Parse the coordinates field from JSON and extract x/y
//     //             const parsedPins = data.map((pin) => {
//     //                 let coordinates = { x: 0, y: 0 };

//     //                 if (pin.coordinates) {
//     //                     // Parse the JSON string in the `coordinates` field
//     //                     try {
//     //                         coordinates = JSON.parse(pin.coordinates); // JSON string -> { x, y }
//     //                     } catch (parseError) {
//     //                         console.error("Error parsing coordinates JSON:", parseError);
//     //                     }
//     //                 }

//     //                 return {
//     //                     ...pin,
//     //                     coordinates, // Add parsed x/y coordinates
//     //                 };
//     //             });

//     //             // Update pins state
//     //             setPins(parsedPins);

//     //             // Log the fetched pins
//     //             console.log("Fetched Pins:", parsedPins);
//     //         } catch (error) {
//     //             console.error("Error fetching pins:", error.message);
//     //         } finally {
//     //             setIsLoading(false); // End loading
//     //         }
//     //     };

//     //     fetchPins();
//     // }, []);

//     const fetchPins = async () => {
//         try {
//             setIsLoading(true);

//             const { data, error } = await supabase.from("pins").select("*");
//             if (error) throw error;

//             const parsedPins = data.map((pin) => ({
//                 ...pin,
//                 coordinates: JSON.parse(pin.coordinates),
//             }));
//             setPins(parsedPins);
//         } catch (error) {
//             console.error("Error fetching pins:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPins();
//     }, []);



//     return (
//         <div
//             style={{
//                 position: "fixed",
//                 top: 0,
//                 left: 0,
//                 width: "100vw",
//                 height: "100vh",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 overflow: "hidden",
//             }}
//         >
//             {isLoading ? (
//                 <div
//                     style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         fontSize: "20px",
//                         fontWeight: "bold",
//                         color: "rgba(0, 0, 0, 0.7)",
//                     }}
//                 >
//                     <CircularProgress size="4rem" style={{ marginBottom: "1rem" }} />
//                     Loading map and pins...
//                 </div>
//             ) : (
//                 <>
//                     <svg
//                         width="100%"
//                         height="100%"
//                         viewBox="0 0 1080 1080"
//                         preserveAspectRatio="xMidYMid meet"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         {areas.map((area) => (
//                             <g
//                                 key={area.id}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleAreaClick(area.label, e);
//                                 }}
//                                 style={{ cursor: "pointer" }}
//                             >
//                                 <rect
//                                     x={area.x}
//                                     y={area.y}
//                                     width={area.width}
//                                     height={area.height}
//                                     fill={area.color}
//                                     stroke="black"
//                                 />
//                                 <text
//                                     x={area.x + area.width / 2}
//                                     y={area.y + area.height / 2}
//                                     textAnchor="middle"
//                                     dominantBaseline="middle"
//                                     fontSize="16"
//                                     fontWeight="bold"
//                                     fill="black"
//                                 >
//                                     {area.label}
//                                 </text>
//                             </g>
//                         ))}
//                         {pins.map((pin) => {
//                             if (!pin.coordinates || pin.coordinates.x === 0 || pin.coordinates.y === 0) {
//                                 return null;
//                             }
//                             return (
//                                 <circle
//                                     key={pin.id}
//                                     cx={pin.coordinates.x}
//                                     cy={pin.coordinates.y}
//                                     r={30}
//                                     fill="red"
//                                     stroke="black"
//                                     onClick={() => handlePinClick(pin)}
//                                 />
//                             );
//                         })}

//                     </svg>

//                     {clickedCoordinates && clickedArea && (
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 bottom: 20,
//                                 left: "50%",
//                                 transform: "translateX(-50%)",
//                                 backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                 color: "#fff",
//                                 padding: "10px 20px",
//                                 borderRadius: "5px",
//                                 fontSize: "16px",
//                             }}
//                         >
//                             {`Area Label: ${clickedArea}, Clicked Coordinates: X=${clickedCoordinates.x}, Y=${clickedCoordinates.y}`}
//                         </div>
//                     )}
//                 </>

//             )}

//             <Modal
//                 open={openModal}
//                 onClose={handleCloseModal}
//                 aria-labelledby="pin-details-modal"
//                 aria-describedby="pin-status-remove-close"
//             >
//                 <div
//                     style={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         backgroundColor: "#A8DADC",
//                         padding: "20px",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                         width: "300px",
//                         color: "#1D3557",
//                     }}
//                 >
//                     <h2>Pin Details</h2>
//                     {selectedPin && <p><strong>Pin ID:</strong> {selectedPin.id}</p>}
//                     <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
//                         <Button variant="contained" color="primary" onClick={handleNavigate}>Status</Button>
//                         <Button variant="contained" color="secondary" onClick={() => handleDeletePin(selectedPin.id)}>Remove Pin</Button>
//                         <Button variant="outlined" onClick={handleCloseModal} style={{ borderColor: "#E63946" }}>Close</Button>
//                     </div>
//                 </div>
//             </Modal>

//             <PinSidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarClose} />
//         </div>
//     );
// };

// export default FloorMap;

import React, { useState, useEffect } from "react";
import { areas1, areas2 } from "../helper/areas";
import supabase from "../helper/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Report from '../components/ReportForm'; // Import the ReportForm componen

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
        const svg = event.currentTarget.ownerSVGElement;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

        setSelectedPosition({ x, y });
        // setSelectedPosition({ x: x, y: y }); // Round to 2 decimal places if needed

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
                coordinates: JSON.stringify(selectedPosition),
                floor: String(currentFloor), // Store the current floor
                status: "Pending", // Default status
            };

            console.log(newPin); // For debugging

            setPins((prevPins) => [...prevPins, newPin]);
            setShowConfirmation(false);
            setShowPinModal(false);
            setSelectedPin(newPin); // Store the selected pin details
            setShowReportModal(true); // Open the ReportForm modal
        }
    };



    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setSelectedPin(null);
    };

    useEffect(() => {
        const fetchPins = async () => {
            try {
                setIsLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from("pins")
                    .select("*")
                    .eq("user_uid", user.id);

                if (error) throw error;

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
    }, []);

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
                    Loading content...
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
                            Go to Floor {currentFloor === 1 ? 2 : 1}
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
                            pins={pins}
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
                                Select Pin Type
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
                            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
                                Are you sure you want to place a {selectedPinType?.label} pin here?
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 'clamp(0.5rem, 2vw, 1rem)',
                                marginTop: 'clamp(1rem, 3vw, 1.5rem)',
                            }}>
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
                                <Button
                                    variant="contained"
                                    onClick={confirmPinPlacement}
                                    style={{
                                        backgroundColor: '#1D3557',
                                        color: 'white',
                                        fontSize: 'clamp(12px, 2vw, 14px)'
                                    }}
                                >
                                    Confirm
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
                            padding: 'clamp(15px, 3vw, 20px)',
                            borderRadius: '8px',
                            width: 'clamp(250px, 90vw, 300px)',
                            color: '#1D3557',
                        }}>
                            <h2 style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>Pin Details</h2>
                            {selectedPin && (
                                <>
                                    <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
                                        <strong>Type:</strong> {selectedPin.pinid}
                                    </p>
                                    <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#457B9D' }}>
                                        <strong>Status:</strong> {selectedPin.status}
                                    </p>
                                </>
                            )}
                            <Button

                                // onClick={handleDeletePin}
                                style={{ fontSize: 'clamp(12px, 2vw, 14px)', marginTop: '1rem', marginRight: '20px', backgroundColor: '#E63946', color: '#fae6cfff' }}
                            >
                                Delete Pin
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleCloseModal}
                                style={{ fontSize: 'clamp(12px, 2vw, 14px)', marginTop: '1rem' }}
                            >
                                Close
                            </Button>
                        </div>
                    </Modal>

                    {/* Report Modal */}
                    {/* <Modal open={showReportModal} onClose={handleCloseReportModal}>
                        <div>
                            <Report
                                pinId={selectedPin?.id}
                                coordinates={selectedPin?.coordinates}
                                type={selectedPin?.type}
                                floor={selectedPin?.floor}
                                onClose={handleCloseReportModal} // Ensure you handle closing the modal
                            />
                        </div>
                    </Modal> */}
                    {/* Report Modal
                    <Modal
                        open={showReportModal}
                        onClose={handleCloseReportModal}
                        BackdropProps={{ invisible: true }} // Removes gray overlay
                    >
                        <div>
                            <Report
                                pinId={selectedPin?.id}
                                coordinates={selectedPin?.coordinates}
                                type={selectedPin?.type}
                                floor={selectedPin?.floor}
                                onClose={handleCloseReportModal} // Ensure closing works
                            />
                        </div>
                    </Modal> */}
                    {/* Report Modal */}
                    <Modal
                        open={showReportModal}
                        onClose={handleCloseReportModal}
                        BackdropProps={{ invisible: true }}
                    >
                        <div>
                            <Report
                                pin={selectedPin}  // Pass the entire pin object
                                onClose={() => {
                                    handleCloseReportModal();
                                    // Add any additional cleanup here if needed
                                }}
                            />
                        </div>
                    </Modal>



                </>
            )}
        </div>
    );
};

export default FloorMap;

