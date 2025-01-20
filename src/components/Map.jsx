import React, { useState } from 'react';
import PinSidebar from './PinSidebar';
import { areas } from '../helper/areas';  // Adjust path if necessary

const FloorMap = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pins, setPins] = useState([]);  // Store pin positions

    const handleAreaClick = (area) => {
        setIsSidebarOpen(true); // Open sidebar when an area is clicked
    };

    // Handle pin placement by user click on the map
    const handleMapClick = (e) => {
        // Get the position where the user clicked on the map (relative to the SVG container)
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Place the pin (only if there are no pins placed already)
        if (pins.length === 0) {
            setPins([{ id: Date.now(), x, y }]);  // Set the pin at the clicked position
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1080 1080"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleMapClick} // Allow pin placement on map click
            >
                {areas.map((area) => (
                    <g
                        key={area.id}
                        onClick={() => handleAreaClick(area.label)}
                        style={{ cursor: 'pointer' }}
                    >
                        <rect
                            x={area.x}
                            y={area.y}
                            width={area.width}
                            height={area.height}
                            fill={area.color}
                            stroke="black"
                        />
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
            </svg>

            {/* Pass state and setState function to PinSidebar */}
            <PinSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>
    );
};

export default FloorMap;
