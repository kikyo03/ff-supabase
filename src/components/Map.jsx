// import React, { useState, useEffect } from 'react';
// import PinSidebar from './PinSidebar';
// import { areas1, areas2 } from '../helper/areas';  // Assuming you have separate area data for both floors
// import supabase from '../helper/supabaseClient'; // Import your Supabase client
// import CircularProgress from '@mui/material/CircularProgress';
// import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";



// const FloorMap = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [pins, setPins] = useState([]); // Store pin positions
//     const [clickedArea, setClickedArea] = useState(null); // Store the name of the clicked area
//     const [userUID, setUserUID] = useState(null); // Store the user's UID
//     const [isLoading, setIsLoading] = useState(true); // Track loading state
//     const [selectedPin, setSelectedPin] = useState(null); // Store the currently selected pin for the modal
//     const [openModal, setOpenModal] = useState(false); // Control modal visibility
//     const navigate = useNavigate();
//     const [showImages, setShowImages] = useState(true);  // State to control image visibility



//     const handleAreaClick = (areaLabel) => {
//         setClickedArea(areaLabel); // Set the clicked area's name
//         setIsSidebarOpen(true); // Open the sidebar
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
//             const { error } = await supabase
//                 .from('pins')
//                 .delete()
//                 .eq('id', pinId); // Delete the pin from the database

//             if (error) throw error;

//             // Update the state after pin deletion
//             setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
//             setOpenModal(false); // Close the modal after deletion
//         } catch (error) {
//             console.error('Error deleting pin:', error.message);
//         }
//     };

//     useEffect(() => {
//         const fetchPins = async () => {
//             try {
//                 setIsLoading(true); // Start loading

//                 // Get the current user's UID
//                 const {
//                     data: { user },
//                     error: userError,
//                 } = await supabase.auth.getUser();
//                 if (userError) throw userError;

//                 setUserUID(user.id); // Save the user's UID to state

//                 // Fetch pins where user_uid matches the current user's UID
//                 const { data, error } = await supabase
//                     .from('pins')
//                     .select('*')
//                     .eq('user_uid', user.id); // Filter by user_uid
//                 if (error) throw error;

//                 // Parse the coordinates field from JSON and convert top/left to x/y
//                 const parsedPins = data.map((pin) => {
//                     let coordinates = { x: 0, y: 0 };

//                     if (pin.coordinates) {
//                         // Parse the JSON string in the `coordinates` field
//                         try {
//                             const parsedCoordinates = JSON.parse(pin.coordinates);
//                             coordinates = {
//                                 x: parseInt(parsedCoordinates.left.replace('px', ''), 10) || 0,
//                                 y: parseInt(parsedCoordinates.top.replace('px', ''), 10) || 0,
//                             };
//                         } catch (parseError) {
//                             console.error('Error parsing coordinates JSON:', parseError);
//                         }
//                     }

//                     return {
//                         ...pin,
//                         coordinates, // Add parsed x/y coordinates
//                     };
//                 });

//                 // Update pins state
//                 setPins(parsedPins);

//                 // Log the fetched pins
//                 console.log('Fetched Pins:', parsedPins);
//             } catch (error) {
//                 console.error('Error fetching pins:', error.message);
//             } finally {
//                 setIsLoading(false); // End loading
//             }
//         };

//         fetchPins();
//     }, []);

//     const toggleFloor = () => {
//         // Toggle between floor 1 and floor 2
//         setCurrentFloor(currentFloor === 1 ? 2 : 1);
//     };

//     const toggleImages = () => {
//         setShowImages(!showImages);  // Toggle the showImages state
//     };

//     const areasToDisplay = currentFloor === 1 ? areas1 : areas2;  // Dynamically select the areas based on currentFloor


//     return (
//         <div
//             style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 width: '100vw',
//                 height: '100vh',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 overflow: 'hidden',
//             }}
//         >
//             {isLoading ? (
//                 // Show loading indicator while fetching pins
//                 <div
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'column', // Arrange items in a column
//                         alignItems: 'center', // Center items horizontally
//                         justifyContent: 'center', // Center items vertically
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         fontSize: '20px',
//                         fontWeight: 'bold',
//                         color: 'rgba(0, 0, 0, 0.7)',
//                     }}
//                 >
//                     <CircularProgress size="4rem" style={{ marginBottom: '1rem' }} />
//                     {/* Add some spacing below the spinner */}
//                     Loading map and pins...
//                 </div>
//             ) : (
//                 <>
//                     <div style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         width: '100vw',
//                         height: '100vh',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         overflow: 'hidden',
//                     }}>
//                         <button
//                             style={{
//                                 position: 'absolute',
//                                 top: '20px',
//                                 left: '20px',
//                                 zIndex: 10,
//                                 padding: '10px 20px',
//                                 backgroundColor: '#333',
//                                 color: '#fff',
//                                 border: 'none',
//                                 cursor: 'pointer',
//                             }}
//                             onClick={toggleFloor}
//                         >
//                             Show Floor {currentFloor === 1 ? 2 : 1}
//                         </button>

//                         <button
//                             style={{
//                                 position: 'absolute',
//                                 top: '20px',
//                                 right: '20px',
//                                 zIndex: 10,
//                                 padding: '10px 20px',
//                                 backgroundColor: '#333',
//                                 color: '#fff',
//                                 border: 'none',
//                                 cursor: 'pointer',
//                             }}
//                             onClick={toggleImages}
//                         >
//                             {showImages ? 'Hide Images' : 'Show Images'}
//                         </button>
//                         <svg
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 1080 1080"
//                             preserveAspectRatio="xMidYMid meet"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             {/* Render areas */}
//                             {areas.map((area) => (
//                                 <g
//                                     key={area.id}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleAreaClick(area.label);
//                                     }}
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     <rect
//                                         x={area.x}
//                                         y={area.y}
//                                         width={area.width}
//                                         height={area.height}
//                                         fill={area.color}
//                                         stroke="black"
//                                     />
//                                     <text
//                                         x={area.x + area.width / 2}
//                                         y={area.y + area.height / 2}
//                                         textAnchor="middle"
//                                         dominantBaseline="middle"
//                                         fontSize="16"
//                                         fontWeight="bold"
//                                         fill="black"
//                                     >
//                                         {area.label}
//                                     </text>
//                                 </g>
//                             ))}

//                             {/* Render the pins on the map */}
//                             {pins.map((pin) => {
//                                 // Safeguard against invalid data
//                                 if (!pin.coordinates || pin.coordinates.x === 0 || pin.coordinates.y === 0) {
//                                     console.warn('Invalid pin coordinates:', pin);
//                                     return null;
//                                 }

//                                 return (
//                                     <circle
//                                         key={pin.id} // Use a unique key for each pin
//                                         cx={pin.coordinates.x} // Use pin's x coordinate
//                                         cy={pin.coordinates.y} // Use pin's y coordinate
//                                         r={30} // Adjust the radius of the circle to your preference
//                                         fill="red" // Set the color of the pin
//                                         stroke="black" // Add border to the pin
//                                         onClick={() => handlePinClick(pin)} // Open modal on pin click
//                                     />
//                                 );
//                             })}
//                         </svg>

//                         {/* Display the clicked area's name */}
//                         {clickedArea && (
//                             <div
//                                 style={{
//                                     position: 'absolute',
//                                     bottom: 20,
//                                     left: '50%',
//                                     transform: 'translateX(-50%)',
//                                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                                     color: '#fff',
//                                     padding: '10px 20px',
//                                     borderRadius: '5px',
//                                     fontSize: '16px',
//                                 }}
//                             >
//                                 {`You clicked on: ${clickedArea}`}
//                             </div>
//                         )}
//                     </>
//             )}


//                     {/* Pin Details Modal */}
//                     <Modal
//                         open={openModal}
//                         onClose={handleCloseModal}
//                         aria-labelledby="pin-details-modal"
//                         aria-describedby="pin-status-remove-close"
//                     >
//                         <div
//                             style={{
//                                 position: 'absolute',
//                                 top: '50%',
//                                 left: '50%',
//                                 transform: 'translate(-50%, -50%)',
//                                 backgroundColor: '#A8DADC',
//                                 padding: '20px',
//                                 borderRadius: '8px',
//                                 boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                                 width: '300px',
//                                 color: '#1D3557',
//                             }}
//                         >
//                             <h2>Pin Details</h2>
//                             {/* Display pin ID */}
//                             {selectedPin && (
//                                 <div>
//                                     <p><strong>Pin ID:</strong> {selectedPin.id}</p>
//                                 </div>
//                             )}
//                             <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                                 {/* Status Button */}
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={handleNavigate}
//                                 >
//                                     Status
//                                 </Button>
//                                 {/* Remove Pin Button */}
//                                 <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     onClick={() => handleDeletePin(selectedPin.id)}
//                                 >
//                                     Remove Pin
//                                 </Button>
//                                 {/* Close Button */}
//                                 <Button
//                                     variant="outlined"
//                                     onClick={handleCloseModal}
//                                     style={{ borderColor: '#E63946' }}
//                                 >
//                                     Close
//                                 </Button>
//                             </div>
//                         </div>
//                     </Modal>

//                     {/* Pass state and setState function to PinSidebar */}
//                     <PinSidebar
//                         isOpen={isSidebarOpen}
//                         setIsOpen={handleSidebarClose} // Call handleSidebarClose when closing
//                     />
//                 </div>
//             );
// };

//             export default FloorMap;


import React, { useState, useEffect } from "react";
import PinSidebar from "./PinSidebar";
import { areas1, areas2 } from "../helper/areas"; // Import area data
import supabase from "../helper/supabaseClient"; // Supabase client
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const FloorMap = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pins, setPins] = useState([]); // Store pin positions
    const [clickedArea, setClickedArea] = useState(null); // Store the name of the clicked area
    const [userUID, setUserUID] = useState(null); // Store the user's UID
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [selectedPin, setSelectedPin] = useState(null); // Store the currently selected pin for the modal
    const [openModal, setOpenModal] = useState(false); // Control modal visibility
    const [currentFloor, setCurrentFloor] = useState(1); // Track current floor
    const [showImages, setShowImages] = useState(true); // State to control image visibility

    const navigate = useNavigate();

    const toggleFloor = () => {
        console.log("Toggling floor");
        setCurrentFloor((prevFloor) => (prevFloor === 1 ? 2 : 1));
    };

    const toggleImages = () => {
        console.log("Toggling images");
        setShowImages((prev) => !prev); // Toggle the showImages state
    };

    const areasToDisplay = currentFloor === 1 ? areas1 : areas2; // Dynamically select areas


    const handleAreaClick = (areaLabel) => {
        setClickedArea(areaLabel); // Set the clicked area's name
        setIsSidebarOpen(true); // Open the sidebar
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false); // Close the sidebar
        setClickedArea(null); // Reset the clicked area
    };

    const handlePinClick = (pin) => {
        setSelectedPin(pin); // Set the selected pin to show in the modal
        setOpenModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setOpenModal(false); // Close the modal
        setSelectedPin(null);
    };

    const handleNavigate = () => {
        navigate("/status");
    };

    const handleDeletePin = async (pinId) => {
        try {
            const { error } = await supabase
                .from("pins")
                .delete()
                .eq("id", pinId); // Delete the pin from the database

            if (error) throw error;

            setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
            setOpenModal(false); // Close the modal after deletion
        } catch (error) {
            console.error("Error deleting pin:", error.message);
        }
    };

    useEffect(() => {
        const fetchPins = async () => {
            try {
                setIsLoading(true); // Start loading

                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError || !user) throw new Error("Failed to fetch user.");

                setUserUID(user.id); // Save the user's UID to state

                const { data, error } = await supabase
                    .from("pins")
                    .select("*")
                    .eq("user_uid", user.id); // Filter by user_uid
                if (error) throw error;

                const parsedPins = data.map((pin) => {
                    let coordinates = { x: 0, y: 0 };
                    if (pin.coordinates) {
                        try {
                            const parsedCoordinates = JSON.parse(pin.coordinates);
                            coordinates = {
                                x: parseInt(parsedCoordinates.left.replace("px", ""), 10) || 0,
                                y: parseInt(parsedCoordinates.top.replace("px", ""), 10) || 0,
                            };
                        } catch (parseError) {
                            console.error("Error parsing coordinates JSON:", parseError);
                        }
                    }
                    return { ...pin, coordinates };
                });

                setPins(parsedPins);
            } catch (error) {
                console.error("Error fetching pins:", error.message);
            } finally {
                setIsLoading(false); // End loading
            }
        };

        fetchPins();
    }, []);


    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {isLoading ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "rgba(0, 0, 0, 0.7)",
                    }}
                >
                    <CircularProgress size="4rem" style={{ marginBottom: "1rem" }} />
                    Loading map and pins...
                </div>
            ) : (
                <>
                    <button
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            zIndex: 10,
                            padding: "10px 20px",
                            backgroundColor: "#333",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            toggleFloor(); // Ensure it updates properly
                        }}
                    >
                        {`Show Floor ${currentFloor === 1 ? 2 : 1}`}
                    </button>
                    <button
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            zIndex: 10,
                            padding: "10px 20px",
                            backgroundColor: "#333",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            toggleImages(); // Ensure the toggle works correctly
                        }}
                    >
                        {showImages ? "Hide Images" : "Show Images"}
                    </button>

                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 1080 1080"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {areasToDisplay.map((area) => (
                            <g
                                key={area.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAreaClick(area.label);
                                }}
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
                                {/* Display image if available and showImages is true */}
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
                                    fontSize="16"
                                    fontWeight="bold"
                                    fill="black"
                                >
                                    {area.label}
                                </text>
                            </g>
                        ))}
                        {pins.map((pin) =>
                            pin.coordinates && pin.coordinates.x && pin.coordinates.y ? (
                                <circle
                                    key={pin.id}
                                    cx={pin.coordinates.x}
                                    cy={pin.coordinates.y}
                                    r={30}
                                    fill="red"
                                    stroke="black"
                                    onClick={() => handlePinClick(pin)}
                                />
                            ) : null
                        )}
                    </svg>
                    {clickedArea && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: 20,
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                fontSize: "16px",
                            }}
                        >
                            {`You clicked on: ${clickedArea}`}
                        </div>
                    )}
                </>
            )}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="pin-details-modal"
                aria-describedby="pin-status-remove-close"
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#A8DADC",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        width: "300px",
                        color: "#1D3557",
                    }}
                >
                    <h2>Pin Details</h2>
                    {selectedPin && (
                        <div>
                            <p>
                                <strong>Pin ID:</strong> {selectedPin.id}
                            </p>
                        </div>
                    )}
                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Button variant="contained" color="primary" onClick={handleNavigate}>
                            Status
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeletePin(selectedPin.id)}
                        >
                            Remove Pin
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCloseModal}
                            style={{ borderColor: "#E63946" }}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <PinSidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarClose} />
        </div>
    );
};

export default FloorMap;
