// // import React, { useState, useEffect } from "react";
// // import PinSidebar from "../components/PinSidebar";
// // import { areas } from "../helper/areas"; // Adjust path if necessary
// // import supabase from "../helper/supabaseClient"; // Import your Supabase client
// // import CircularProgress from "@mui/material/CircularProgress";
// // import Modal from "@mui/material/Modal";
// // import Button from "@mui/material/Button";
// // import { useNavigate } from "react-router-dom";

// // const FloorMap = () => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const [pins, setPins] = useState([]); // Store pin positions
// //     const [clickedArea, setClickedArea] = useState(null); // Store the name of the clicked area
// //     const [userUID, setUserUID] = useState(null); // Store the user's UID
// //     const [isLoading, setIsLoading] = useState(true); // Track loading state
// //     const [selectedPin, setSelectedPin] = useState(null); // Store the currently selected pin for the modal
// //     const [openModal, setOpenModal] = useState(false); // Control modal visibility
// //     const [clickedCoordinates, setClickedCoordinates] = useState(null); // Store clicked coordinates
// //     const navigate = useNavigate();

// //     const handleAreaClick = (areaLabel, event) => {
// //         setClickedArea(areaLabel); // Set the clicked area's name
// //         setIsSidebarOpen(true); // Open the sidebar

// //         // // Calculate coordinates relative to the SVG
// //         // const rect = event.target.getBoundingClientRect();
// //         // const x = event.clientX - rect.left; // X-coordinate
// //         // const y = event.clientY - rect.top; // Y-coordinate

// //         const svg = event.target.ownerSVGElement;
// //         const svgRect = svg.getBoundingClientRect();
// //         const x = event.clientX - svgRect.left;
// //         const y = event.clientY - svgRect.top;


// //         // Set the clicked coordinates
// //         setClickedCoordinates({ x: Math.round(x), y: Math.round(y) });

// //         // Display the label and coordinates in the console (or any UI element)
// //         console.log(`Area: ${areaLabel}, Coordinates: x: (${Math.round(x)}, y:  ${Math.round(y)})`);
// //     };


// //     const handleSidebarClose = () => {
// //         setIsSidebarOpen(false); // Close the sidebar
// //         setClickedArea(null); // Reset the clicked area
// //     };

// //     const handlePinClick = (pin) => {
// //         setSelectedPin(pin); // Set the selected pin to show in the modal
// //         setOpenModal(true); // Open the modal
// //     };

// //     const handleCloseModal = () => {
// //         setOpenModal(false); // Close the modal
// //         setSelectedPin(null);
// //     };

// //     const handleNavigate = () => {
// //         navigate("/status");
// //     };

// //     const handleDeletePin = async (pinId) => {
// //         try {
// //             const { error } = await supabase.from("pins").delete().eq("id", pinId); // Delete the pin from the database

// //             if (error) throw error;

// //             // Update the state after pin deletion
// //             setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
// //             setOpenModal(false); // Close the modal after deletion
// //         } catch (error) {
// //             console.error("Error deleting pin:", error.message);
// //         }
// //     };

// //     // useEffect(() => {
// //     //     const fetchPins = async () => {
// //     //         try {
// //     //             setIsLoading(true); // Start loading

// //     //             // Get the current user's UID
// //     //             const {
// //     //                 data: { user },
// //     //                 error: userError,
// //     //             } = await supabase.auth.getUser();
// //     //             if (userError) throw userError;

// //     //             setUserUID(user.id); // Save the user's UID to state

// //     //             // Fetch pins where user_uid matches the current user's UID
// //     //             const { data, error } = await supabase
// //     //                 .from("pins")
// //     //                 .select("*")
// //     //                 .eq("user_uid", user.id); // Filter by user_uid
// //     //             if (error) throw error;

// //     //             // Parse the coordinates field from JSON and extract x/y
// //     //             const parsedPins = data.map((pin) => {
// //     //                 let coordinates = { x: 0, y: 0 };

// //     //                 if (pin.coordinates) {
// //     //                     // Parse the JSON string in the `coordinates` field
// //     //                     try {
// //     //                         coordinates = JSON.parse(pin.coordinates); // JSON string -> { x, y }
// //     //                     } catch (parseError) {
// //     //                         console.error("Error parsing coordinates JSON:", parseError);
// //     //                     }
// //     //                 }

// //     //                 return {
// //     //                     ...pin,
// //     //                     coordinates, // Add parsed x/y coordinates
// //     //                 };
// //     //             });

// //     //             // Update pins state
// //     //             setPins(parsedPins);

// //     //             // Log the fetched pins
// //     //             console.log("Fetched Pins:", parsedPins);
// //     //         } catch (error) {
// //     //             console.error("Error fetching pins:", error.message);
// //     //         } finally {
// //     //             setIsLoading(false); // End loading
// //     //         }
// //     //     };

// //     //     fetchPins();
// //     // }, []);

// //     const fetchPins = async () => {
// //         try {
// //             setIsLoading(true);

// //             const { data, error } = await supabase.from("pins").select("*");
// //             if (error) throw error;

// //             const parsedPins = data.map((pin) => ({
// //                 ...pin,
// //                 coordinates: JSON.parse(pin.coordinates),
// //             }));
// //             setPins(parsedPins);
// //         } catch (error) {
// //             console.error("Error fetching pins:", error.message);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchPins();
// //     }, []);



// //     return (
// //         <div
// //             style={{
// //                 position: "fixed",
// //                 top: 0,
// //                 left: 0,
// //                 width: "100vw",
// //                 height: "100vh",
// //                 display: "flex",
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //                 overflow: "hidden",
// //             }}
// //         >
// //             {isLoading ? (
// //                 <div
// //                     style={{
// //                         display: "flex",
// //                         flexDirection: "column",
// //                         alignItems: "center",
// //                         justifyContent: "center",
// //                         position: "absolute",
// //                         top: "50%",
// //                         left: "50%",
// //                         transform: "translate(-50%, -50%)",
// //                         fontSize: "20px",
// //                         fontWeight: "bold",
// //                         color: "rgba(0, 0, 0, 0.7)",
// //                     }}
// //                 >
// //                     <CircularProgress size="4rem" style={{ marginBottom: "1rem" }} />
// //                     Loading map and pins...
// //                 </div>
// //             ) : (
// //                 <>
// //                     <svg
// //                         width="100%"
// //                         height="100%"
// //                         viewBox="0 0 1080 1080"
// //                         preserveAspectRatio="xMidYMid meet"
// //                         xmlns="http://www.w3.org/2000/svg"
// //                     >
// //                         {areas.map((area) => (
// //                             <g
// //                                 key={area.id}
// //                                 onClick={(e) => {
// //                                     e.stopPropagation();
// //                                     handleAreaClick(area.label, e);
// //                                 }}
// //                                 style={{ cursor: "pointer" }}
// //                             >
// //                                 <rect
// //                                     x={area.x}
// //                                     y={area.y}
// //                                     width={area.width}
// //                                     height={area.height}
// //                                     fill={area.color}
// //                                     stroke="black"
// //                                 />
// //                                 <text
// //                                     x={area.x + area.width / 2}
// //                                     y={area.y + area.height / 2}
// //                                     textAnchor="middle"
// //                                     dominantBaseline="middle"
// //                                     fontSize="16"
// //                                     fontWeight="bold"
// //                                     fill="black"
// //                                 >
// //                                     {area.label}
// //                                 </text>
// //                             </g>
// //                         ))}
// //                         {pins.map((pin) => {
// //                             if (!pin.coordinates || pin.coordinates.x === 0 || pin.coordinates.y === 0) {
// //                                 return null;
// //                             }
// //                             return (
// //                                 <circle
// //                                     key={pin.id}
// //                                     cx={pin.coordinates.x}
// //                                     cy={pin.coordinates.y}
// //                                     r={30}
// //                                     fill="red"
// //                                     stroke="black"
// //                                     onClick={() => handlePinClick(pin)}
// //                                 />
// //                             );
// //                         })}

// //                     </svg>

// //                     {clickedCoordinates && clickedArea && (
// //                         <div
// //                             style={{
// //                                 position: "absolute",
// //                                 bottom: 20,
// //                                 left: "50%",
// //                                 transform: "translateX(-50%)",
// //                                 backgroundColor: "rgba(0, 0, 0, 0.8)",
// //                                 color: "#fff",
// //                                 padding: "10px 20px",
// //                                 borderRadius: "5px",
// //                                 fontSize: "16px",
// //                             }}
// //                         >
// //                             {`Area Label: ${clickedArea}, Clicked Coordinates: X=${clickedCoordinates.x}, Y=${clickedCoordinates.y}`}
// //                         </div>
// //                     )}
// //                 </>

// //             )}

// //             <Modal
// //                 open={openModal}
// //                 onClose={handleCloseModal}
// //                 aria-labelledby="pin-details-modal"
// //                 aria-describedby="pin-status-remove-close"
// //             >
// //                 <div
// //                     style={{
// //                         position: "absolute",
// //                         top: "50%",
// //                         left: "50%",
// //                         transform: "translate(-50%, -50%)",
// //                         backgroundColor: "#A8DADC",
// //                         padding: "20px",
// //                         borderRadius: "8px",
// //                         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
// //                         width: "300px",
// //                         color: "#1D3557",
// //                     }}
// //                 >
// //                     <h2>Pin Details</h2>
// //                     {selectedPin && <p><strong>Pin ID:</strong> {selectedPin.id}</p>}
// //                     <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
// //                         <Button variant="contained" color="primary" onClick={handleNavigate}>Status</Button>
// //                         <Button variant="contained" color="secondary" onClick={() => handleDeletePin(selectedPin.id)}>Remove Pin</Button>
// //                         <Button variant="outlined" onClick={handleCloseModal} style={{ borderColor: "#E63946" }}>Close</Button>
// //                     </div>
// //                 </div>
// //             </Modal>

// //             <PinSidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarClose} />
// //         </div>
// //     );
// // };

// // export default FloorMap;

// import React, { useState, useEffect } from "react";
// import PinSidebar from "../components/Pin";
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
//     const [clickedCoordinates, setClickedCoordinates] = useState(null); // Store clicked coordinates
//     const [selectedPin, setSelectedPin] = useState(null); // Store the currently selected pin
//     const [openModal, setOpenModal] = useState(false); // Control modal visibility
//     const [isLoading, setIsLoading] = useState(true); // Track loading state
//     const [userUID, setUserUID] = useState(null); // Store the user's UID
//     const navigate = useNavigate();

//     // Scaling factor (adjust as needed)
//     const scalingFactor = 1.2;

//     const handleAreaClick = (areaLabel, event) => {
//         setClickedArea(areaLabel); // Set the clicked area's name
//         setIsSidebarOpen(true); // Open the sidebar

//         // Calculate coordinates relative to the SVG and apply scaling factor
//         const svg = event.target.ownerSVGElement;
//         const svgRect = svg.getBoundingClientRect();
//         const x = event.clientX - svgRect.left;
//         const y = event.clientY - svgRect.top;

//         // Apply the scaling factor
//         const scaledX = x * scalingFactor;
//         const scaledY = y * scalingFactor;

//         // Set the clicked coordinates
//         setClickedCoordinates({ x: Math.round(scaledX), y: Math.round(scaledY) });

//         // Display the label and coordinates in the console (or any UI element)
//         console.log(`Area: ${areaLabel}, Coordinates: x: (${Math.round(scaledX)}, y:  ${Math.round(scaledY)})`);
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

//     // Fetch and render the pins with adjusted coordinates
//     // const fetchPins = async () => {
//     //     try {
//     //         setIsLoading(true);

//     //         const { data, error } = await supabase.from("pins").select("*");
//     //         if (error) throw error;

//     //         const parsedPins = data.map((pin) => ({
//     //             ...pin,
//     //             coordinates: JSON.parse(pin.coordinates), // Parsing coordinates from JSON
//     //         }));

//     //         // Apply scaling factor to render pins correctly
//     //         const adjustedPins = parsedPins.map((pin) => ({
//     //             ...pin,
//     //             coordinates: {
//     //                 x: pin.coordinates.x / scalingFactor,
//     //                 y: pin.coordinates.y / scalingFactor,
//     //             },
//     //         }));

//     //         setPins(adjustedPins);
//     //     } catch (error) {
//     //         console.error("Error fetching pins:", error.message);
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // };


//     // Fetch and render the pins with adjusted coordinates
//     const fetchPins = async () => {
//         try {
//             setIsLoading(true);

//             const { data, error } = await supabase.from("pins").select("*");
//             if (error) throw error;

//             const parsedPins = data.map((pin) => ({
//                 ...pin,
//                 coordinates: JSON.parse(pin.coordinates), // Parsing coordinates from JSON
//             }));

//             // Now no need to apply scaling factor, use coordinates as is
//             setPins(parsedPins);
//         } catch (error) {
//             console.error("Error fetching pins:", error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Add handleSidebarClose function
//     const handleSidebarClose = () => {
//         setIsSidebarOpen(false); // Close the sidebar
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

//                     {selectedPin && (
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 top: 20,
//                                 left: "50%",
//                                 transform: "translateX(-50%)",
//                                 backgroundColor: "rgba(0, 0, 0, 0.8)",
//                                 color: "#fff",
//                                 padding: "10px 20px",
//                                 borderRadius: "5px",
//                                 fontSize: "16px",
//                             }}
//                         >
//                             <p><strong>Pin ID:</strong> {selectedPin.id}</p>
//                             <p><strong>Coordinates:</strong> X={selectedPin.coordinates.x}, Y={selectedPin.coordinates.y}</p>
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
import PinSidebar from "../components/PinSidebar";
import { areas } from "../helper/areas"; // Adjust path if necessary
import supabase from "../helper/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const FloorMap = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pins, setPins] = useState([]);
    const [clickedArea, setClickedArea] = useState(null);
    const [clickedCoordinates, setClickedCoordinates] = useState(null);
    const [selectedPin, setSelectedPin] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userUID, setUserUID] = useState(null); // For user-specific functionality
    const navigate = useNavigate();

    const scalingFactor = 1.2;

    const handleAreaClick = (areaLabel, event) => {
        setClickedArea(areaLabel);
        setIsSidebarOpen(true);

        const svg = event.target.ownerSVGElement;
        const svgRect = svg.getBoundingClientRect();
        const x = (event.clientX - svgRect.left) * scalingFactor;
        const y = (event.clientY - svgRect.top) * scalingFactor;

        setClickedCoordinates({ x: Math.round(x), y: Math.round(y) });

        console.log(`Area: ${areaLabel}, Coordinates: x: (${Math.round(x)}, y: ${Math.round(y)})`);
    };

    const handlePinClick = (pin) => {
        setSelectedPin(pin);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPin(null);
    };

    const handleDeletePin = async (pinId) => {
        try {
            const { error } = await supabase.from("pins").delete().eq("id", pinId);
            if (error) throw error;

            setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
            setOpenModal(false);
        } catch (error) {
            console.error("Error deleting pin:", error.message);
        }
    };

    const fetchPins = async () => {
        try {
            setIsLoading(true);

            const { data, error } = await supabase.from("pins").select("*");
            if (error) throw error;

            const parsedPins = data.map((pin) => ({
                ...pin,
                coordinates: JSON.parse(pin.coordinates),
            }));

            setPins(parsedPins);
        } catch (error) {
            console.error("Error fetching pins:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSidebarClose = () => setIsSidebarOpen(false);

    useEffect(() => {
        fetchPins();
    }, []);

    return (
        <div style={containerStyle}>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <>
                    <svg {...svgProps}>
                        {areas.map((area) => (
                            <g
                                key={area.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAreaClick(area.label, e);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <rect {...area} fill={area.color} stroke="black" />
                                <text {...textProps(area)}>{area.label}</text>
                            </g>
                        ))}
                        {pins.map((pin) => (
                            pin.coordinates && pin.coordinates.x !== 0 && pin.coordinates.y !== 0 && (
                                <circle
                                    key={pin.id}
                                    cx={pin.coordinates.x}
                                    cy={pin.coordinates.y}
                                    r={30}
                                    fill="red"
                                    stroke="black"
                                    onClick={() => handlePinClick(pin)}
                                />
                            )
                        ))}
                    </svg>

                    <SidebarLabel clickedArea={clickedArea} clickedCoordinates={clickedCoordinates} />
                    <PinDetails selectedPin={selectedPin} />
                </>
            )}

            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="pin-details-modal">
                <ModalContent
                    selectedPin={selectedPin}
                    handleNavigate={() => navigate("/status")}
                    handleDeletePin={handleDeletePin}
                    handleCloseModal={handleCloseModal}
                />
            </Modal>

            <PinSidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarClose} />
        </div>
    );
};

export default FloorMap;

// Component styles and helper components
const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
};

const svgProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 1080 1080",
    preserveAspectRatio: "xMidYMid meet",
    xmlns: "http://www.w3.org/2000/svg",
};

const textProps = (area) => ({
    x: area.x + area.width / 2,
    y: area.y + area.height / 2,
    textAnchor: "middle",
    dominantBaseline: "middle",
    fontSize: "16",
    fontWeight: "bold",
    fill: "black",
});

const LoadingIndicator = () => (
    <div style={{ ...containerStyle, fontSize: "20px", fontWeight: "bold", color: "rgba(0, 0, 0, 0.7)" }}>
        <CircularProgress size="4rem" style={{ marginBottom: "1rem" }} />
        Loading map and pins...
    </div>
);

const SidebarLabel = ({ clickedArea, clickedCoordinates }) =>
    clickedCoordinates && clickedArea && (
        <div style={labelStyle}>
            {`Area Label: ${clickedArea}, Clicked Coordinates: X=${clickedCoordinates.x}, Y=${clickedCoordinates.y}`}
        </div>
    );

const labelStyle = {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
};

const PinDetails = ({ selectedPin }) =>
    selectedPin && (
        <div style={labelStyle}>
            <p><strong>Pin ID:</strong> {selectedPin.id}</p>
            <p><strong>Coordinates:</strong> X={selectedPin.coordinates.x}, Y={selectedPin.coordinates.y}</p>
        </div>
    );

const ModalContent = ({ selectedPin, handleNavigate, handleDeletePin, handleCloseModal }) => (
    <div style={modalStyle}>
        <h2>Pin Details</h2>
        {selectedPin && <p><strong>Pin ID:</strong> {selectedPin.id}</p>}
        <div style={modalButtonStyle}>
            <Button variant="contained" color="primary" onClick={handleNavigate}>Status</Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeletePin(selectedPin.id)}>Remove Pin</Button>
            <Button variant="outlined" onClick={handleCloseModal} style={{ borderColor: "#E63946" }}>Close</Button>
        </div>
    </div>
);

const modalStyle = {
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
};

const modalButtonStyle = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};
