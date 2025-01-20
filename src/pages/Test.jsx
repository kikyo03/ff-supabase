// // import { useEffect, useState } from "react";
// // import supabase from "../helper/supabaseClient"; // Ensure the correct path to your Supabase client
// // import { v4 as uuidv4 } from "uuid";

// // function App() {
// //     const [userId, setUserId] = useState(null); // Store authenticated user ID
// //     const [media, setMedia] = useState([]); // Store uploaded media list

// //     // Fetch the authenticated user and set the userId
// //     useEffect(() => {
// //         const getUser = async () => {
// //             const {
// //                 data: { user },
// //             } = await supabase.auth.getUser();

// //             if (user) {
// //                 setUserId(user.id);
// //             } else {
// //                 console.error("No authenticated user found. Please log in.");
// //             }
// //         };

// //         getUser();
// //     }, []);

// //     // Upload an image to the Supabase storage bucket
// //     async function uploadImage(e) {
// //         const file = e.target.files[0]; // Get the selected file

// //         if (!file) {
// //             console.error("No file selected for upload.");
// //             return;
// //         }

// //         if (!userId) {
// //             console.error("User ID is not set. Ensure the user is authenticated.");
// //             return;
// //         }

// //         try {
// //             const filePath = `${userId}/${uuidv4()}`; // Generate a unique file path
// //             const { data, error } = await supabase
// //                 .storage
// //                 .from("uploads")
// //                 .upload(filePath, file);

// //             if (error) {
// //                 console.error("Upload error:", error);
// //             } else {
// //                 console.log("File uploaded successfully:", data);
// //                 getMedia(); // Refresh the media list
// //             }
// //         } catch (error) {
// //             console.error("Unexpected upload error:", error);
// //         }
// //     }

// //     // Fetch the list of uploaded media for the current user
// //     async function getMedia() {
// //         if (!userId) {
// //             console.error("User ID is not set. Cannot fetch media.");
// //             return;
// //         }

// //         try {
// //             const { data, error } = await supabase.storage.from("uploads").list(`${userId}/`, {
// //                 limit: 10,
// //                 offset: 0,
// //                 sortBy: {
// //                     column: "name",
// //                     order: "asc",
// //                 },
// //             });

// //             if (error) {
// //                 console.error("Fetch error:", error);
// //             } else {
// //                 setMedia(data || []);
// //             }
// //         } catch (error) {
// //             console.error("Unexpected fetch error:", error);
// //         }
// //     }

// //     // Fetch media list when userId changes
// //     useEffect(() => {
// //         if (userId) {
// //             getMedia();
// //         }
// //     }, [userId]);

// //     return (
// //         <div className="mt-5">
// //             <input type="file" onChange={uploadImage} />
// //             <div className="mt-5">My Uploads</div>
// //             <div>
// //                 {media.length === 0 && <p>No uploads found.</p>}
// //                 {media.map((mediaItem) => (
// //                     <div key={mediaItem.name}>
// //                         <img
// //                             src={`https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${userId}/${mediaItem.name}`}
// //                             alt={mediaItem.name}
// //                             style={{ width: "200px", height: "auto", margin: "10px" }}
// //                         />
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // }

// // export default App;


// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     CardMedia,
//     Button,
//     Grid,
//     Container,
//     Chip,
// } from "@mui/material";
// import { FaTrash } from "react-icons/fa";
// import Navbar from "../components/Navbar";
// import supabase from "../helper/supabaseClient";

// const History = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         lastName: "",
//         email: "",
//         role: "",
//         customUid: "",
//     });

//     const [media, setMedia] = useState([]); // Media files
//     const [userId, setUserId] = useState(""); // User ID for fetching media

//     // Fetch user details from Supabase
//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             const { data: { user }, error } = await supabase.auth.getUser();

//             if (error) {
//                 console.error("Error fetching user:", error);
//                 return;
//             }

//             if (user) {
//                 const { data: userDetails, error: userError } = await supabase
//                     .from("users")
//                     .select("fname, lname, id")
//                     .eq("id", user.id)
//                     .single();

//                 if (userError) {
//                     console.error("Error fetching user details:", userError);
//                 } else {
//                     setFormData({
//                         name: `${userDetails.fname} ${userDetails.lname}`,
//                         lastName: userDetails.lname,
//                         email: user.email,
//                         customUid: userDetails.id,
//                     });
//                     setUserId(userDetails.id); // Set userId for media fetching
//                 }
//             }
//         };
//         fetchUserInfo();
//     }, []);

//     // Fetch the list of uploaded media for the current user
//     const getMedia = async () => {
//         if (!userId) {
//             console.error("User ID is not set. Cannot fetch media.");
//             return;
//         }

//         try {
//             const { data, error } = await supabase.storage
//                 .from("uploads")
//                 .list(`${userId}/`, {
//                     limit: 10,
//                     offset: 0,
//                     sortBy: {
//                         column: "name",
//                         order: "asc",
//                     },
//                 });

//             if (error) {
//                 console.error("Fetch error:", error);
//             } else {
//                 setMedia(data || []);
//             }
//         } catch (error) {
//             console.error("Unexpected fetch error:", error);
//         }
//     };

//     // Fetch media list when userId changes
//     useEffect(() => {
//         if (userId) {
//             getMedia();
//         }
//     }, [userId]);

//     return (
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             <Navbar userDetails={formData} />
//             <Box>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     My Uploads
//                 </Typography>
//                 <div className="mt-5">
//                     <div>
//                         {media.length === 0 && <p>No uploads found.</p>}
//                         {media.map((mediaItem) => (
//                             <div key={mediaItem.name}>
//                                 <Card>
//                                     <CardMedia
//                                         component="img"
//                                         height="200"
//                                         image={`https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${userId}/${mediaItem.name}`}
//                                         alt={mediaItem.name}
//                                         style={{
//                                             width: "200px",
//                                             height: "auto",
//                                             margin: "10px",
//                                         }}
//                                     />
//                                     <CardContent>
//                                         <Typography variant="body2">
//                                             {mediaItem.name}
//                                         </Typography>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </Box>
//         </Container>
//     );
// };

// export default History;

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Grid,
    Container,
    Chip,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import supabase from "../helper/supabaseClient";

const History = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        role: "",
        customUid: "",
    });

    const [reports, setReports] = useState([]); // Reports data
    const [media, setMedia] = useState([]); // Media files
    const [userId, setUserId] = useState(""); // User ID for fetching reports and media

    // Fetch user details from Supabase
    useEffect(() => {
        const fetchUserInfo = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error);
                return;
            }

            if (user) {
                const { data: userDetails, error: userError } = await supabase
                    .from("users")
                    .select("fname, lname, id")
                    .eq("id", user.id)
                    .single();

                if (userError) {
                    console.error("Error fetching user details:", userError);
                } else {
                    setFormData({
                        name: `${userDetails.fname} ${userDetails.lname}`,
                        lastName: userDetails.lname,
                        email: user.email,
                        customUid: userDetails.id,
                    });
                    setUserId(userDetails.id); // Set userId for fetching reports and media
                }
            }
        };
        fetchUserInfo();
    }, []);

    // Fetch reports and media
    const fetchReportsAndMedia = async () => {
        if (!userId) {
            console.error("User ID is not set. Cannot fetch data.");
            return;
        }

        try {
            // Fetch reports from the database
            const { data: reportsData, error: reportsError } = await supabase
                .from("reports")
                .select("id, title, details, status, type, image, created_at")
                .eq("user_uid", userId);

            if (reportsError) throw reportsError;

            // Fetch all files from the user's storage folder
            const { data: storageData, error: storageError } = await supabase.storage
                .from("uploads")
                .list(`${userId}/`, { limit: 50 });

            if (storageError) throw storageError;

            // Build a map of storage files for easy lookup
            const storageFileMap = storageData.reduce((map, file) => {
                map[file.name] = `https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${userId}/${file.name}`;
                return map;
            }, {});

            // Enrich reports with image URLs from storage
            const enrichedReports = reportsData.map((report) => ({
                ...report,
                image: storageFileMap[report.image] || null, // Get URL or set null if not found
            }));

            console.log("Enriched Reports:", enrichedReports);
            setReports(enrichedReports);
        } catch (error) {
            console.error("Error fetching reports or images:", error);
        }
    };


    const generateSignedURL = async (fileName) => {
        try {
            const { data, error } = await supabase.storage
                .from("uploads")
                .createSignedUrl(`${userId}/${fileName}`, 3600); // 1-hour expiry

            if (error) throw error;

            return data.signedUrl;
        } catch (error) {
            console.error("Error generating signed URL:", error);
            return null;
        }
    };



    useEffect(() => {
        if (userId) {
            fetchReportsAndMedia();
        }
    }, [userId]);

    const handleDeleteReport = async (id) => {
        try {
            const { error } = await supabase
                .from("reports")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resolved":
                return "success";
            case "pending":
                return "warning";
            case "in progress":
                return "info";
            default:
                return "default";
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Navbar userDetails={formData} />
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Report History
                </Typography>
                <Typography variant="subtitle1">
                    User: {formData.name} | UID: {formData.customUid}
                </Typography>
            </Box>

            {reports.length === 0 ? (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
                    No reports available.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {reports.map((report) => (
                        <Grid item xs={12} key={report.id}>
                            <Card sx={{ mb: 3 }}>
                                <Grid container>
                                    <Grid item xs={12} md={4}>
                                        {/* Render image only if available */}
                                        {report.image ? (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={report.image}
                                                alt={report.title}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => report.image && window.open(report.image, "_blank")}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    backgroundColor: "#f0f0f0",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    color: "#888",
                                                }}
                                            >
                                                No Image Available
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start",
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography variant="h6" component="h2">
                                                    {report.title}
                                                </Typography>
                                                <Button
                                                    color="error"
                                                    startIcon={<FaTrash />}
                                                    onClick={() => handleDeleteReport(report.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                            <Typography variant="body1" paragraph>
                                                {report.details}
                                            </Typography>
                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                <Chip label={`Type: ${report.type}`} variant="outlined" />
                                                <Chip label={`Status: ${report.status}`} color={getStatusColor(report.status)} />
                                                <Chip label={`Created At: ${new Date(report.created_at).toLocaleString()}`} variant="outlined" />
                                            </Box>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default History;
