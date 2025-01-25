import React, { useState, useEffect } from "react";
import PinSidebar from "./PinSidebar";
import { areas1, areas2 } from "../helper/areas";
import supabase from "../helper/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

// Reusable ToggleButton Component
const ToggleButton = ({ label, onClick, isActive }) => (
    <button
        style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: isActive ? "#4CAF50" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: isActive ? "bold" : "normal",
        }}
        onClick={onClick}
    >
        {label}
    </button>
);

// FloorContent Component to Encapsulate SVG Logic
const FloorContent = ({ areas, showImages, pins, onAreaClick, onPinClick }) => (
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
                onClick={(e) => {
                    e.stopPropagation();
                    onAreaClick(area.label);
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
                {showImages && area.image && (
                    <image
                        x={area.x}
                        y={area.y}
                        width={area.width}
                        height={area.height}
                        href={area.image}
                    />
                )}
                {!showImages && (
                    <text
                        x={area.x + area.width / 2}
                        y={area.y + area.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="black"
                    >
                        🎨
                    </text>
                )}
                <text
                    x={area.x + area.width / 2}
                    y={area.y + area.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fontFamily="Poppins"
                    fill="black"
                    fontWeight="bold" // Makes the black text thicker/bold
                    stroke="#D3D3D3"
                    strokeWidth="5"
                    paintOrder="stroke fill"
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
                    onClick={() => onPinClick(pin)}
                />
            ) : null
        )}
    </svg>
);

// Main Component
const FloorMap = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pins, setPins] = useState([]);
    const [clickedArea, setClickedArea] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentFloor, setCurrentFloor] = useState(1);
    const [showImages, setShowImages] = useState(true);
    const [isFloorHovered, setIsFloorHovered] = useState(false); // Hover state for the floor button
    const [isImagesHovered, setIsImagesHovered] = useState(false)

    const navigate = useNavigate();

    const toggleFloor = () => {
        setLoadingAction(true);
        setTimeout(() => {
            setCurrentFloor((prev) => (prev === 1 ? 2 : 1));
            setLoadingAction(false);
        }, 500); // Simulate loading for 500ms
    };

    const toggleImages = () => {
        setLoadingAction(true);
        setTimeout(() => {
            setShowImages((prev) => !prev);
            setLoadingAction(false);
        }, 500); // Simulate loading for 500ms
    };

    const handleAreaClick = (areaLabel) => {
        setClickedArea(areaLabel);
        setIsSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
        setClickedArea(null);
    };

    const handlePinClick = (pin) => {
        setSelectedPin(pin);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPin(null);
    };

    useEffect(() => {
        const fetchPins = async () => {
            try {
                setIsLoading(true);

                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError || !user) throw new Error("Failed to fetch user.");

                const { data, error } = await supabase
                    .from("pins")
                    .select("*")
                    .eq("user_uid", user.id);
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
                        } catch (err) {
                            console.error("Error parsing coordinates JSON:", err);
                        }
                    }
                    return { ...pin, coordinates };
                });

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
            {(isLoading || loadingAction) ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "rgba(0, 0, 0, 0.7)",
                    }}
                >
                    <CircularProgress size="4rem" style={{ marginRight: "1rem" }} />
                    Loading content...
                </div>
            ) : (
                <>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "5%", // Positioned relative to the viewport height
                            right: "5%", // Positioned relative to the viewport width
                            display: "flex",
                            flexDirection: "column", // Stack buttons vertically
                            gap: "10px", // Space between buttons
                            zIndex: 10,
                        }}
                    >
                        <button
                            style={{
                                padding: "10px 20px", // Responsive padding
                                fontSize: "clamp(14px, 2vw, 18px)", // Responsive font size
                                backgroundColor: isFloorHovered ? "#1D3557" : "#457B9D", // Change color on hover
                                color: "#fae6cfff",
                                border: "none",
                                borderRadius: "8px", // Rounded corners
                                cursor: "pointer",
                                width: "clamp(120px, 20vw, 200px)", // Responsive width
                                display: "flex", // Use flexbox
                                alignItems: "center", // Align items vertically
                                justifyContent: "center", // Center content horizontally
                                gap: "10px", // Add space between icon and text
                                transition: "background-color 0.3s ease", // Smooth hover transition
                            }}
                            onMouseEnter={() => setIsFloorHovered(true)} // Set hover state for floor button
                            onMouseLeave={() => setIsFloorHovered(false)} // Reset hover state for floor button
                            onClick={toggleFloor}
                        >
                            <MapIcon style={{ fontSize: "clamp(16px, 2vw, 24px)" }} /> {/* Adjust icon size */}
                            Change to Floor {currentFloor === 1 ? 2 : 1}
                        </button>

                        <button
                            style={{
                                padding: "10px 20px", // Responsive padding
                                fontSize: "clamp(14px, 2vw, 18px)", // Responsive font size
                                backgroundColor: isImagesHovered ? "#1D3557" : "#457B9D", // Change color on hover
                                color: "#fae6cfff",
                                border: "none",
                                borderRadius: "8px", // Rounded corners
                                cursor: "pointer",
                                width: "clamp(120px, 20vw, 200px)", // Responsive width
                                display: "flex", // Use flexbox
                                alignItems: "center", // Align items vertically
                                justifyContent: "center", // Center content horizontally
                                gap: "10px", // Add space between icon and text
                                transition: "background-color 0.3s ease", // Smooth hover transition
                            }}
                            onMouseEnter={() => setIsImagesHovered(true)} // Set hover state for images button
                            onMouseLeave={() => setIsImagesHovered(false)} // Reset hover state for images button
                            onClick={toggleImages}
                        >
                            <ChangeCircleIcon style={{ fontSize: "clamp(16px, 2vw, 24px)" }} /> {/* Adjust icon size */}
                            {showImages ? "Switch Style" : "Switch Style"}
                        </button>
                    </div>
                    <div
                        style={{
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <FloorContent
                            areas={areasToDisplay}
                            showImages={showImages}
                            pins={pins}
                            onAreaClick={handleAreaClick}
                            onPinClick={handlePinClick}
                        />
                    </div>
                    {clickedArea && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "20px",
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
                        width: "300px",
                        color: "#1D3557",
                    }}
                >
                    <h2>Pin Details</h2>
                    {selectedPin && <p><strong>Pin ID:</strong> {selectedPin.id}</p>}
                    <Button variant="outlined" onClick={handleCloseModal}>
                        Close
                    </Button>
                </div>
            </Modal>
            <PinSidebar isOpen={isSidebarOpen} setIsOpen={handleSidebarClose} />
        </div>
    );
};

export default FloorMap;
