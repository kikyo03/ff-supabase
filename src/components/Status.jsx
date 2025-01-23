// import React, { useState, useEffect } from "react";
// import { styled } from "@mui/system";
// import { Card, CardContent, CardMedia, Typography, Button, Box, Modal, IconButton } from "@mui/material";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import CloseIcon from "@mui/icons-material/Close";

// // Main card container style
// const StyledCard = styled(Card)({
//     maxWidth: 500, // Maximum width of the card
//     margin: "10px auto", // Center the card with margin
//     borderRadius: "10px", // Rounded corners
//     backgroundColor: "#A8DADC", // Card background color
//     boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
// });

// // Header style for the card
// const StyledHeader = styled(Box)({
//     backgroundColor: "#1D3557", // Header background color
//     padding: "8px 12px", // Padding inside the header
//     borderRadius: "10px 10px 0 0", // Rounded corners at the top
//     textAlign: "center", // Center-align text
//     color: "#fae6cfff", // Font color of the header text
//     fontFamily: "Poppins", // Font family for consistent design
//     fontWeight: 600, // Font weight for emphasis
//     fontSize: "1.4rem", // Font size of the title
//     position: "relative", // For positioning the close button
// });

// // Close button style in the header
// const CloseButton = styled(IconButton)({
//     position: "absolute", // Position the button at the top-right corner
//     top: "8px",
//     right: "8px",
//     color: "#fae6cfff", // White color for the button
// });

// // Card content styling
// const StyledContent = styled(CardContent)({
//     padding: "10px", // Padding for card content
//     fontFamily: "Poppins", // Consistent font family
// });

// // Each detail section inside the card
// const DetailItem = styled(Box)({
//     marginBottom: "6px", // Spacing between detail items
//     textAlign: "center", // Center-align each detail
// });

// // Label style for detail items
// const DetailLabel = styled(Typography)({
//     fontWeight: 600, // Bold font weight for emphasis
//     fontSize: "1rem", // Font size of the label
//     color: "#E63946", // Font color of the label
// });

// // Value style for detail items
// const DetailValue = styled(Typography)({
//     fontSize: "1em", // Font size for the value text
//     color: "#1D3557", // Font color of the value text
//     marginTop: "4px", // Space between label and value
// });

// // Button style at the bottom of the card
// const ActionButton = styled(Button)({
//     marginTop: "8px", // Space above the button
//     backgroundColor: "#457B9D", // Background color of the button
//     color: "#fff", // Font color for button text
//     padding: "6px 16px", // Padding inside the button
//     fontSize: "0.9rem", // Font size of the button text
//     borderRadius: "16px", // Rounded button
//     "&:hover": {
//         backgroundColor: "#dc2f3c", // Hover background color
//     },
// });

// // Modal container for the image
// const ModalImage = styled(Box)({
//     display: "flex", // Center-align the content
//     alignItems: "center",
//     justifyContent: "center",
//     height: "90%", // Modal height
//     backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background for the modal
// });

// const ReportStatus = () => {
//     const [isCardOpen, setIsCardOpen] = useState(true); // State to control card visibility
//     const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State to control modal visibility

//     const handleCloseCard = () => setIsCardOpen(false); // Close the card
//     const handleOpenImageModal = () => setIsImageModalOpen(true); // Open the image modal
//     const handleCloseImageModal = () => setIsImageModalOpen(false); // Close the image modal

//     // Load custom font (Poppins)
//     useEffect(() => {
//         const link = document.createElement("link");
//         link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
//         link.rel = "stylesheet";
//         document.head.appendChild(link);
//         return () => document.head.removeChild(link);
//     }, []);

//     // Example report data
//     const reportData = {
//         title: "Electrical Hazard Report",
//         details: "Spotted illegal dumping of waste materials near the river bank",
//         type: "Electrical",
//         status: "Pending",
//         reporterName: "John Smith",
//         image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     };

//     return (
//         <>
//             {isCardOpen && (
//                 <StyledCard>
//                     {/* Header with title and close button */}
//                     <StyledHeader>
//                         Report Status
//                         <CloseButton onClick={handleCloseCard}>
//                             <CloseIcon />
//                         </CloseButton>
//                     </StyledHeader>

//                     {/* Image section */}
//                     <CardMedia
//                         component="img"
//                         height="190" // Image height
//                         image={reportData.image}
//                         alt="Report Image"
//                         sx={{ cursor: "pointer" }}
//                         onClick={handleOpenImageModal} // Open modal on click
//                     />

//                     {/* Details section */}
//                     <StyledContent>
//                         {["Title", "Details", "Report Type", "Status", "Reporter Name"].map((label, i) => (
//                             <DetailItem key={i}>
//                                 <DetailLabel>{label}:</DetailLabel>
//                                 <DetailValue>{reportData[label.toLowerCase().replace(" ", "")]}</DetailValue>
//                             </DetailItem>
//                         ))}
//                         <Box textAlign="center">
//                             <ActionButton startIcon={<FaMapMarkerAlt />}>Go to map</ActionButton>
//                         </Box>
//                     </StyledContent>
//                 </StyledCard>
//             )}

//             {/* Modal for full-size image */}
//             <Modal open={isImageModalOpen} onClose={handleCloseImageModal}>
//                 <ModalImage onClick={handleCloseImageModal}>
//                     <Box
//                         component="img"
//                         src={reportData.image}
//                         alt="Full Size Report Image"
//                         sx={{ maxWidth: "80%", maxHeight: "60%", borderRadius: "10px" }}
//                     />
//                 </ModalImage>
//             </Modal>
//         </>
//     );
// };

// export default ReportStatus;


import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { Card, CardContent, CardMedia, Typography, Button, Box, Modal, IconButton } from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

// Main card container style
const StyledCard = styled(Card)(() => ({
    maxWidth: 500,
    margin: "10px auto",
    borderRadius: "10px",
    backgroundColor: "#A8DADC",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
}));

// Header style for the card
const StyledHeader = styled(Box)(() => ({
    backgroundColor: "#1D3557",
    padding: "8px 12px",
    borderRadius: "10px 10px 0 0",
    textAlign: "center",
    color: "#fae6cfff",
    fontFamily: "Poppins",
    fontWeight: 600,
    fontSize: "1.4rem",
    position: "relative",
}));

// Close button style in the header
const CloseButton = styled(IconButton)(() => ({
    position: "absolute",
    top: "8px",
    right: "8px",
    color: "#fae6cfff",
}));

// Card content styling
const StyledContent = styled(CardContent)(() => ({
    padding: "10px",
    fontFamily: "Poppins",
}));

// Each detail section inside the card
const DetailItem = styled(Box)(() => ({
    marginBottom: "6px",
    textAlign: "center",
}));

// Label style for detail items
const DetailLabel = styled(Typography)(() => ({
    fontWeight: 600,
    fontSize: "1rem",
    color: "#E63946",
}));

// Value style for detail items
const DetailValue = styled(Typography)(() => ({
    fontSize: "1em",
    color: "#1D3557",
    marginTop: "4px",
}));

// Button style at the bottom of the card
const ActionButton = styled(Button)(() => ({
    marginTop: "8px",
    backgroundColor: "#457B9D",
    color: "#fff",
    padding: "6px 16px",
    fontSize: "0.9rem",
    borderRadius: "16px",
    "&:hover": {
        backgroundColor: "#dc2f3c",
    },
}));

// Modal container for the image
const ModalImage = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 9999, // Ensure it's visible above other elements
}));

// The main component
const ReportStatus = () => {
    const [isCardOpen, setIsCardOpen] = useState(true); // State to control card visibility
    const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State to control modal visibility
    const navigate = useNavigate(); // Corrected hook location

    const handleNavigate = () => {
        navigate("/dashboard"); // Navigate to dashboard
    };

    const handleCloseCard = () => setIsCardOpen(false); // Close the card
    const handleOpenImageModal = () => {
        console.log("Opening Modal");
        setIsImageModalOpen(true); // Open the image modal
    };
    const handleCloseImageModal = () => setIsImageModalOpen(false); // Close the image modal

    // Load custom font (Poppins)
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    // Example report data
    const reportData = {
        title: "Electrical Hazard Report",
        details: "Spotted illegal dumping of waste materials near the river bank",
        type: "Electrical",
        status: "Pending",
        reporterName: "John Smith",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    };

    return (
        <>
            {isCardOpen && (
                <StyledCard>
                    {/* Header with title and close button */}
                    <StyledHeader>
                        Report Status
                        <CloseButton onClick={handleCloseCard}>
                            <CloseIcon />
                        </CloseButton>
                    </StyledHeader>

                    {/* Image section */}
                    <CardMedia
                        component="img"
                        height="190"
                        image={reportData.image}
                        alt="Report Image"
                        sx={{ cursor: "pointer" }}
                        onClick={handleOpenImageModal} // Open modal on click
                    />

                    {/* Details section */}
                    <StyledContent>
                        <DetailItem>
                            <DetailLabel>Title:</DetailLabel>
                            <DetailValue>{reportData.title}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>Details:</DetailLabel>
                            <DetailValue>{reportData.details}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>Report Type:</DetailLabel>
                            <DetailValue>{reportData.type}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>Status:</DetailLabel>
                            <DetailValue>{reportData.status}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>Reporter Name:</DetailLabel>
                            <DetailValue>{reportData.reporterName}</DetailValue>
                        </DetailItem>

                        <Box textAlign="center">
                            <ActionButton
                                startIcon={<FaMapMarkerAlt />}
                                onClick={handleNavigate} // Handle navigation
                            >
                                Go to map
                            </ActionButton>
                        </Box>
                    </StyledContent>
                </StyledCard>
            )}

            {/* Modal for full-size image */}
            <Modal open={isImageModalOpen} onClose={handleCloseImageModal}>
                <ModalImage onClick={handleCloseImageModal}>
                    <Box
                        component="img"
                        src={reportData.image}
                        alt="Full Size Report Image"
                        sx={{ maxWidth: "80%", maxHeight: "60%", borderRadius: "10px" }}
                    />
                    {/* Close button inside the modal */}
                    <IconButton
                        onClick={handleCloseImageModal}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            color: "#fff",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </ModalImage>
            </Modal>
        </>
    );
};

export default ReportStatus;
