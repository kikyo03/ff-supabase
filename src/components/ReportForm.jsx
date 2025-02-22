import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Upload, Visibility, VisibilityOff, Cancel, CheckCircle } from "@mui/icons-material";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import supabase from "../helper/supabaseClient";
import { v4 as uuidv4 } from "uuid";  // Add uuid to generate unique file names


const Report = ({ pin, onCancel, onClose}) => {
    const [userData, setUserData] = useState(null);
    const [report, setReport] = useState({
        title: "",
        details: "",
        type: "", // Initialize with pin's type
        status: "Pending",
        name: "",
        coordinates: pin?.coordinates,
        floor: "",
        place: "",
        pinId: pin?.id || "", // Initialize with pin's id
        image: null,
    });



    useEffect(() => {
        if (pin) {
            setReport((prev) => ({
                ...prev,
                pinId: pin.id,
                type: pin.type,
                coordinates: pin.coordinates,
                floor: pin.floor, // Add this line
                place: pin.place, // Add this line
            }));
        }
    }, [pin]);

    // const handleCancel = () => {
    //     // Close the form by updating the state in the parent
    //     setShowReportForm(false); // Hide the report form

    // };



    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showAllFields, setShowAllFields] = useState(false);
    const [userId, setUserId] = useState(null); // Store the authenticated user ID




    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch the current authenticated user
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                if (user) {
                    setUserId(user.id); // Set userId from Supabase
                    // Fetch additional user data (fname, lname) from your users table
                    const { data, error: fetchError } = await supabase
                        .from("users")
                        .select('fname, lname, id')
                        .eq("id", user.id)
                        .single();

                    if (fetchError) throw fetchError;

                    setUserData({
                        fname: data.fname,
                        lname: data.lname,
                        customUid: data.id, // This is the Supabase `user.id`
                    });
                } else {
                    console.error("No authenticated user found. Please log in.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };
        fetchUser();
    }, []);




    const handleChange = (e) => {
        setReport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const filePath = `${userId}/${uuidv4()}_${file.name}`; // Generate unique file path
                const { data, error } = await supabase.storage
                    .from("uploads") // Replace with your bucket name
                    .upload(filePath, file);

                if (error) {
                    console.error("Upload error:", error);
                    return;
                }

                // Generate public URL for the uploaded file
                const { data: publicUrlData } = supabase.storage
                    .from("uploads")
                    .getPublicUrl(filePath);

                if (publicUrlData) {
                    setReport((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
                    console.log("File uploaded successfully:", publicUrlData.publicUrl);
                } else {
                    console.error("Failed to generate public URL");
                }
            } catch (error) {
                console.error("Unexpected upload error:", error);
            }
        }
    };

  
    const handleClick = async (e) => {
        e.preventDefault();
        let newErrors = {};

        // Validate each field separately
        if (!report.title) newErrors.title = "Title is required.";
        if (!report.details) newErrors.details = "Details are required.";
        if (!report.type) newErrors.type = "Type is required.";

        // If there are errors, update state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Insert report into "reports" table
            const { error: reportError } = await supabase.from("reports").insert({
                title: report.title,
                details: report.details,
                type: report.type,
                status: report.status,
                user_uid: userId,
                name: `${userData?.fname || ""} ${userData?.lname || ""}`,
                coordinates: report.coordinates,
                floor: report.floor,
                specific_place: report.place,
                pinid: report.pinId,
                image: report.image,
            });

            if (reportError) throw reportError;

            // Upsert data into "pins" table
            const { error: pinError } = await supabase.from("pins").upsert({
                pinid: report.pinId, // Pin ID to update or insert
                coordinates: report.coordinates,
                user_uid: userId, // User UID from the current user
                floor: report.floor, // Floor value
                status: report.status,
                type: report.type,
                name: `${userData?.fname || ""} ${userData?.lname || ""}`
            });

            if (pinError) throw pinError;

            // Success: Close modal, show success message, clear errors, reset form
            setOpen(false);
            setOpenSnackbar(true);
            setErrors({});
            resetForm();
        } catch (err) {
            console.error("Error submitting report:", err.message);
        }
    };




    const resetForm = () => {
        setReport({
            title: "",
            details: "",
            type: "",
            status: "Pending",
            name: `${userData?.fname || ""} ${userData?.lname || ""}`, // Dynamically set the name
            coordinates: "",
            floor: "",
            pinId: "",
            image: null,
        });
    };


    // const handleCancel = () => setOpen(false);

    const handleCancel = () => {
        // Close the form by updating the state in the parent
        setOpen(false); // Hide the report form

        // Delete the pin
    };




    const handleCloseSnackbar = () => setOpenSnackbar(false);

    return (
        <div>
            {/* <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    backgroundColor: "#457b9d",
                    color: "#f1faee",
                    padding: "10px 20px",
                    borderRadius: "5px",
                }}
            >
                Open Report Form
            </Button> */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle style={{ fontFamily: "'Poppins', sans-serif", color: "#fae6cfff", backgroundColor: "#1d3557", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FmdBadIcon style={{ marginRight: '10px', color: '#f1faee', fontSize: '35px' }} /> {/* Map pin icon */}
                        Submit a New Report
                    </div>
                    <Button
                        onClick={resetForm}
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            color: "#e63946",
                            backgroundColor: "#f1faee",
                        }}
                    >
                        <DeleteIcon />
                        Clear
                    </Button>
                </DialogTitle>

                <DialogContent style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#a8dadc", padding: "20px", color: "#1d3557" }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Report Title"
                        type="text"
                        fullWidth
                        name="title"
                        value={report.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <TextField
                        margin="dense"
                        label="Report Details"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        name="details"
                        value={report.details}
                        onChange={handleChange}
                        error={!!errors.details}
                        helperText={errors.details}
                    />

                    <TextField
                        margin="dense"
                        label="Report Type"
                        type="text"
                        fullWidth
                        name="type"
                        value={report.type}
                        // value={"test"}
                        onChange={handleChange}
                        // InputProps={{ readOnly: true }}
                        error={!!errors.type}
                        helperText={errors.type}
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        id="file-upload"
                        style={{ display: "none" }}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="contained"
                            component="span"
                            style={{
                                marginTop: "10px",
                                backgroundColor: "#457b9d",
                                color: "#f1faee",
                                fontFamily: "'Poppins', sans-serif",
                                padding: "8px 20px",
                                borderRadius: "5px",
                                textTransform: "none"
                            }}
                            startIcon={<Upload />}
                        >
                            Upload Report Image
                        </Button>
                    </label>
                    {report.image && (
                        <p style={{ fontFamily: "'Poppins', sans-serif", color: "#1d3557" }}>
                            {report.image}
                        </p>
                    )}
                    {showAllFields && (
                        <>
                            <TextField
                                margin="dense"
                                label="Floor"
                                type="text"
                                fullWidth
                                name="floor"
                                value={report.floor}
                                // value={"test"}
                                onChange={handleChange}
                            />
                             <TextField
                                margin="dense"
                                label="Specific Place"
                                type="text"
                                fullWidth
                                name="place"
                                value={report.place}
                                // value={"test"}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                label="Coordinates"
                                type="text"
                                fullWidth
                                name="coordinates"
                                value={report.coordinates}
                                // value={"test"}
                                onChange={handleChange}
                            // InputProps={{ readOnly: true }}
                            />
                            <TextField
                                margin="dense"
                                label="Pin ID"
                                type="text"
                                fullWidth
                                name="pinId"
                                value={report.pinId}
                                // value={"test"}
                                onChange={handleChange}
                            // InputProps={{ readOnly: true }}
                            />
                            <TextField
                                margin="dense"
                                label="User UID"
                                type="text"
                                fullWidth
                                value={userData?.customUid || ""}
                                InputProps={{ readOnly: true }}
                            />
                            <TextField
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                value={`${userData?.fname || ""} ${userData?.lname || ""}`}
                                InputProps={{ readOnly: true }}
                            />
                            {/* <TextField
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                value={report.name} // Use the report state for value
                                InputProps={{ readOnly: true }} // Keep it read-only if you don’t want editing
                            /> */}

                            <TextField
                                margin="dense"
                                label="Status"
                                type="text"
                                fullWidth
                                value={report.status}
                                InputProps={{ readOnly: true }}
                            />
                        </>
                    )}
                    {/* {error && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                            All fields must be filled out.
                        </p>
                    )} */}
                </DialogContent>

                <DialogActions style={{ backgroundColor: "#1d3557", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                        onClick={() => setShowAllFields(!showAllFields)}
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor: "#457b9d",
                            color: "#f1faee",
                            alignSelf: "flex-start",
                        }}
                        startIcon={showAllFields ? <VisibilityOff /> : <Visibility />}
                    >
                        {showAllFields ? "Hide All Fields" : "Show All Fields"}
                    </Button>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button
                            // onClick={handleCancel}
                            onClick={onCancel}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                color: "#e63946",
                                backgroundColor: "#f1faee",
                            }}
                            startIcon={<Cancel />}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleClick}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                color: "#f1faee",
                                backgroundColor: "#457b9d",
                            }}
                            startIcon={<CheckCircle />}
                        >
                            Submit Report
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity="success">
                    Report submitted successfully!
                </MuiAlert>
            </Snackbar>
        </div>
    );
};



export default Report;


