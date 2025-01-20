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
// import { styled } from "@mui/system";
// import { FaTrash } from "react-icons/fa";
// import { useTheme } from '@mui/material/styles';
// import Navbar from '../components/Navbar';
// import supabase from "../helper/supabaseClient";

// const StyledCard = styled(Card)(({ theme }) => ({
//     marginBottom: "1rem",
//     transition: "transform 0.2s",
//     "&:hover": {
//         transform: "translateY(-4px)",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     },
// }));

// const History = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         lastName: "",
//         email: "",
//         role: "",
//         customUid: "",
//     });

//     const [reports, setReports] = useState([]); // Initialize as an empty array
//     const [media, setMedia] = useState([]); // Media files
//     const theme = useTheme();

//     // Fetch user details from Supabase
//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             const { data: { user }, error } = await supabase.auth.getUser();

//             if (error) {
//                 console.error('Error fetching user:', error);
//                 return;
//             }

//             if (user) {
//                 const { data: userDetails, error: userError } = await supabase
//                     .from('users')
//                     .select('fname, lname, role, id')
//                     .eq('id', user.id)
//                     .single();

//                 if (userError) {
//                     console.error('Error fetching user details:', userError);
//                 } else {
//                     setFormData({
//                         name: `${userDetails.fname} ${userDetails.lname}`,
//                         lastName: userDetails.lname,
//                         email: user.email,
//                         role: userDetails.role,
//                         customUid: userDetails.id,
//                     });
//                 }
//             }
//         };
//         fetchUserInfo();
//     }, []);

//     // Fetch reports from Supabase when customUid is set
//     useEffect(() => {
//         if (formData.customUid) {
//             fetchReports();
//         }
//     }, [formData.customUid]);

//     // const fetchReports = async () => {
//     //     try {
//     //         const { data, error } = await supabase
//     //             .from('reports')
//     //             .select('id, title, details, status, type, image, created_at')
//     //             .eq('user_uid', formData.customUid); // Using the customUid from the formData state

//     //         if (error) throw error;

//     //         console.log("Fetched Reports:", data);
//     //         setReports(data);
//     //     } catch (error) {
//     //         console.error("Error fetching reports:", error);
//     //     }
//     // };

//     // const fetchReports = async () => {
//     //     try {
//     //         // Fetch reports
//     //         const { data: reportsData, error: reportsError } = await supabase
//     //             .from('reports')
//     //             .select('id, title, details, status, type, image, created_at')
//     //             .eq('user_uid', formData.customUid);

//     //         if (reportsError) throw reportsError;

//     //         // Fetch images from storage
//     //         const { data: mediaData, error: mediaError } = await supabase.storage
//     //             .from('uploads')
//     //             .list(`${formData.customUid}/`, {
//     //                 limit: 50, // Adjust limit as needed
//     //                 sortBy: { column: 'name', order: 'asc' },
//     //             });

//     //         if (mediaError) throw mediaError;

//     //         // Map images to their full URLs
//     //         const imageUrls = mediaData.reduce((acc, file) => {
//     //             acc[file.name] = `https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${formData.customUid}/${file.name}`;
//     //             return acc;
//     //         }, {});

//     //         // Attach image URLs to reports
//     //         const enrichedReports = reportsData.map((report) => ({
//     //             ...report,
//     //             image: imageUrls[report.image] || null, // Use full URL or null if not found
//     //         }));

//     //         setReports(enrichedReports);
//     //     } catch (error) {
//     //         console.error("Error fetching reports or images:", error);
//     //     }
//     // };

//     // const fetchReports = async () => {
//     //     try {
//     //         // Fetch reports
//     //         const { data: reportsData, error: reportsError } = await supabase
//     //             .from('reports')
//     //             .select('id, title, details, status, type, image, created_at')
//     //             .eq('user_uid', formData.customUid);

//     //         if (reportsError) throw reportsError;

//     //         // Fetch images from storage
//     //         const { data: mediaData, error: mediaError } = await supabase.storage
//     //             .from('uploads')
//     //             .list(`${formData.customUid}/`, {
//     //                 limit: 50,
//     //                 sortBy: { column: 'name', order: 'asc' },
//     //             });

//     //         if (mediaError) throw mediaError;

//     //         // Map media files to URLs
//     //         const imageUrls = (mediaData || []).reduce((acc, file) => {
//     //             acc[file.name] = `https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${formData.customUid}/${file.name}`;

//     //             return acc;
//     //         }, {});

//     //         // Attach image URLs to reports
//     //         const enrichedReports = reportsData.map((report) => ({
//     //             ...report,
//     //             image: imageUrls[report.image] || null,
//     //         }));

//     //         setReports(enrichedReports);
//     //     } catch (error) {
//     //         console.error("Error fetching reports or media:", error);
//     //     }
//     // };

//     // const fetchReports = async () => {
//     //     try {
//     //         // Fetch reports
//     //         const { data: reportsData, error: reportsError } = await supabase
//     //             .from('reports')
//     //             .select('id, title, details, status, type, image, created_at')
//     //             .eq('user_uid', formData.customUid);

//     //         if (reportsError) {
//     //             console.error("Error fetching reports:", reportsError);
//     //             return;
//     //         }

//     //         console.log("Fetched Reports:", reportsData);  // Log the reports to check if they're fetched correctly

//     //         // Fetch images from storage
//     //         const { data: mediaData, error: mediaError } = await supabase.storage
//     //             .from('uploads')
//     //             .list(`${formData.customUid}/`, {
//     //                 limit: 50,
//     //                 sortBy: { column: 'name', order: 'asc' },
//     //             });

//     //         if (mediaError) {
//     //             console.error("Error fetching media:", mediaError);
//     //             return;
//     //         }

//     //         console.log("Fetched Media:", mediaData);  // Log the media data to check image files

//     //         // Map media files to URLs
//     //         const imageUrls = (mediaData || []).reduce((acc, file) => {
//     //             const url = `https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${formData.customUid}/${file.name}`;
//     //             acc[file.name] = url;
//     //             return acc;
//     //         }, {});

//     //         console.log("Image URLs:", imageUrls);  // Log the image URLs to verify

//     //         // Attach image URLs to reports
//     //         const enrichedReports = reportsData.map((report) => ({
//     //             ...report,
//     //             image: imageUrls[report.image] || '/path/to/placeholder-image.jpg', // Use placeholder if image is missing
//     //         }));

//     //         console.log("Enriched Reports:", enrichedReports);  // Log enriched reports with images

//     //         setReports(enrichedReports);  // Set the enriched reports to state

//     //     } catch (error) {
//     //         console.error("Error fetching reports or media:", error);
//     //     }
//     // };

//     const fetchReports = async () => {
//         try {
//             // Fetch reports
//             const { data: reportsData, error: reportsError } = await supabase
//                 .from('reports')
//                 .select('id, title, details, status, type, image, created_at')
//                 .eq('user_uid', formData.customUid);

//             if (reportsError) {
//                 console.error("Error fetching reports:", reportsError);
//                 return;
//             }

//             console.log("Fetched Reports:", reportsData);  // Log the reports to check if they're fetched correctly

//             // Fetch images from storage
//             const { data: mediaData, error: mediaError } = await supabase.storage
//                 .from('uploads')
//                 .list(`${formData.customUid}/`, {
//                     limit: 50,
//                     sortBy: { column: 'name', order: 'asc' },
//                 });

//             if (mediaError) {
//                 console.error("Error fetching media:", mediaError);
//                 return;
//             }

//             console.log("Fetched Media:", mediaData);  // Log the media data to check image files

//             // Map media files to URLs
//             const imageUrls = (mediaData || []).reduce((acc, file) => {
//                 const url = `https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${formData.customUid}/${file.name}`;
//                 acc[file.name] = url;
//                 return acc;
//             }, {});

//             console.log("Image URLs:", imageUrls);  // Log the image URLs to verify

//             // Attach image URLs to reports
//             const enrichedReports = reportsData.map((report) => {
//                 console.log("Report Image:", report.image);  // Log the image property of each report
//                 return {
//                     ...report,
//                     image: imageUrls[report.image] || '/path/to/placeholder-image.jpg', // Use placeholder if image is missing
//                 };
//             });

//             console.log("Enriched Reports:", enrichedReports);  // Log enriched reports with images

//             setReports(enrichedReports);  // Set the enriched reports to state

//         } catch (error) {
//             console.error("Error fetching reports or media:", error);
//         }
//     };




//     const handleDeleteReport = async (id) => {
//         try {
//             const { error } = await supabase
//                 .from('reports')
//                 .delete()
//                 .eq('id', id);

//             if (error) throw error;

//             setReports((prevReports) => prevReports.filter(report => report.id !== id));
//         } catch (error) {
//             console.error("Error deleting report:", error);
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//             case "resolved": return "success";
//             case "pending": return "warning";
//             case "in progress": return "info";
//             default: return "default";
//         }
//     };

//     return (
//         <Container maxWidth="lg" sx={{ py: 4 }}>
//             <Navbar userDetails={formData} />
//             <Box sx={theme.components.MuiBox?.styleOverrides?.root || {}}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Report History
//                 </Typography>
//                 <Typography variant="subtitle1">
//                     User: {formData.name} | UID: {formData.customUid}
//                 </Typography>
//             </Box>

//             {reports.length === 0 ? (
//                 <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
//                     No reports available.
//                 </Typography>
//             ) : (
//                 <Grid container spacing={3}>
//                     {Array.isArray(reports) && reports.map((report) => (
//                         <Grid item xs={12} key={report.id}>
//                             <StyledCard>
//                                 <Grid container>
//                                     <Grid item xs={12} md={4}>
//                                         {/* Render image only if available */}
//                                         {report.image ? (
//                                             // <CardMedia
//                                             //     component="img"
//                                             //     height="200"
//                                             //     image={`https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${report.image}`} // Replace with your correct storage URL
//                                             //     alt={report.title}
//                                             //     style={{ cursor: "pointer" }}
//                                             //     onClick={() => window.open(`https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${report.image}`, "_blank")}
//                                             // />
//                                             <CardMedia
//                                                 component="img"
//                                                 height="200"
//                                                 // image={report.image} // Use the full URL from enrichedReports
//                                                 image={`https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${userId}/${file.name}`} // Replace with your correct storage URL
//                                                 alt={report.title}
//                                                 style={{ cursor: "pointer" }}
//                                                 onClick={() => window.open(report.image, "_blank")}
//                                             />



//                                         ) : (
//                                             <Box
//                                                 sx={{
//                                                     height: 200,
//                                                     backgroundColor: "#f0f0f0",
//                                                     display: "flex",
//                                                     justifyContent: "center",
//                                                     alignItems: "center",
//                                                     color: "#888",
//                                                 }}
//                                             >
//                                                 No Image Available
//                                             </Box>
//                                         )}
//                                     </Grid>
//                                     <Grid item xs={12} md={8}>
//                                         <CardContent>
//                                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
//                                                 <Typography variant="h6" component="h2">
//                                                     {report.title}
//                                                 </Typography>
//                                                 <Button
//                                                     // variant="outlined"
//                                                     color="error"
//                                                     startIcon={<FaTrash />}
//                                                     onClick={() => handleDeleteReport(report.id)}
//                                                 // aria-label={`Delete report ${report.title}`}
//                                                 >
//                                                     {/* Delete Report */}
//                                                 </Button>
//                                             </Box>
//                                             <Typography variant="body1" paragraph>
//                                                 {report.details}
//                                             </Typography>
//                                             <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                                                 <Chip label={`Type: ${report.type}`} variant="outlined" />
//                                                 <Chip label={`Status: ${report.status}`} color={getStatusColor(report.status)} />
//                                                 <Chip label={`Created At: ${new Date(report.created_at).toLocaleString()}`} variant="outlined" />
//                                             </Box>
//                                         </CardContent>
//                                     </Grid>
//                                 </Grid>
//                             </StyledCard>
//                         </Grid>
//                     ))
//                     }
//                 </Grid >
//             )}
//         </Container >
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
import { styled } from "@mui/system";
import { FaTrash } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import supabase from "../helper/supabaseClient";
import CircularProgress from '@mui/material/CircularProgress';


const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: "1rem",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
}));

const History = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        role: "",
        customUid: "",
    });

    const [reports, setReports] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);

    const theme = useTheme();

    // Fetch user details from Supabase
    useEffect(() => {
        const fetchUserInfo = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error);
                return;
            }

            if (user) {
                const { data: userDetails, error: userError } = await supabase
                    .from('users')
                    .select('fname, lname, role, id')
                    .eq('id', user.id)
                    .single();

                if (userError) {
                    console.error('Error fetching user details:', userError);
                } else {
                    setFormData({
                        name: `${userDetails.fname} ${userDetails.lname}`,
                        lastName: userDetails.lname,
                        email: user.email,
                        role: userDetails.role,
                        customUid: userDetails.id,
                    });
                }
            }
        };
        fetchUserInfo();
    }, []);

    // Fetch reports from Supabase when customUid is set
    useEffect(() => {
        if (formData.customUid) {
            fetchReports();
        }
    }, [formData.customUid]);

    // Fetch reports and images from Supabase
    // const fetchReports = async () => {
    //     try {
    //         // Fetch reports
    //         const { data: reportsData, error: reportsError } = await supabase
    //             .from('reports')
    //             .select('id, title, details, status, type, image, created_at')
    //             .eq('user_uid', formData.customUid);

    //         if (reportsError) {
    //             console.error("Error fetching reports:", reportsError);
    //             return;
    //         }

    //         console.log("Fetched Reports:", reportsData);  // Log the reports to check if they're fetched correctly

    //         // Fetch images from storage
    //         const { data: mediaData, error: mediaError } = await supabase.storage
    //             .from('uploads')
    //             .list(`${formData.customUid}/`, {
    //                 limit: 50,
    //                 sortBy: { column: 'name', order: 'asc' },
    //             });

    //         if (mediaError) {
    //             console.error("Error fetching media:", mediaError);
    //             return;
    //         }

    //         console.log("Fetched Media:", mediaData);  // Log the media data to check image files

    //         // Map media files to URLs
    //         const imageUrls = (mediaData || []).reduce((acc, file) => {
    //             const url = `https://xgznhhqrqmdmakhadoyc.supabase.co/storage/v1/object/public/uploads/${formData.customUid}/${file.name}`;
    //             acc[file.name] = url;
    //             return acc;
    //         }, {});

    //         console.log("Image URLs:", imageUrls);  // Log the image URLs to verify

    //         // Attach image URLs to reports
    //         const enrichedReports = reportsData.map((report) => ({
    //             ...report,
    //             image: imageUrls[report.image] || '/path/to/placeholder-image.jpg', // Use placeholder if image is missing
    //         }));

    //         console.log("Enriched Reports:", enrichedReports);  // Log enriched reports with images

    //         setReports(enrichedReports);  // Set the enriched reports to state

    //     } catch (error) {
    //         console.error("Error fetching reports or media:", error);
    //     }
    // };

    const fetchReports = async () => {
        try {
            // Fetch reports
            const { data: reportsData, error: reportsError } = await supabase
                .from('reports')
                .select('id, title, details, status, type, image, created_at')
                .eq('user_uid', formData.customUid);

            if (reportsError) {
                console.error("Error fetching reports:", reportsError);
                return;
            }

            console.log("Fetched Reports:", reportsData);  // Log the reports to check if they're fetched correctly

            // You no longer need to fetch images separately, since you already have the full image URL in the `image` field
            setReports(reportsData);  // Just set the reports directly
        } catch (error) {
            console.error("Error fetching reports or media:", error);
        } finally {
            setLoading(false);
        }
    };



    const handleDeleteReport = async (id) => {
        try {
            const { error } = await supabase
                .from('reports')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setReports((prevReports) => prevReports.filter(report => report.id !== id));
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resolved": return "success";
            case "pending": return "warning";
            case "in progress": return "info";
            default: return "default";
        }
    };

    if (loading) {
        return <div>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress size="4rem" />
            </Box>
        </div>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Navbar userDetails={formData} />
            <Box sx={theme.components.MuiBox?.styleOverrides?.root || {}}>
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
                    {Array.isArray(reports) && reports.map((report) => (
                        <Grid item xs={12} key={report.id}>
                            <StyledCard>
                                <Grid container>
                                    <Grid item xs={12} md={4}>
                                        {/* Render image only if available */}
                                        {report.image ? (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={report.image} // Use the full URL from enrichedReports
                                                alt={report.title}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => window.open(report.image, "_blank")}
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
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                <Typography variant="h6" component="h2">
                                                    {report.title}
                                                </Typography>
                                                <Button
                                                    color="error"
                                                    startIcon={<FaTrash />}
                                                    onClick={() => handleDeleteReport(report.id)}
                                                >
                                                    {/* Delete Report */}
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
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default History;
