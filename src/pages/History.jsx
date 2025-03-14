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
import { FaTrash,  FaRadiation  } from "react-icons/fa";
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
    const [isDeletingAll, setIsDeletingAll] = useState(false);

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


    const fetchReports = async () => {
        try {
            // Create a base query
            let query = supabase
                .from('reports')
                .select('id, title, details, status, type, image, created_at, name, specific_place, pinid')
                .order('created_at', { ascending: false });
    
            // Add filter only for non-admin users
            if (formData.role !== 'admin') {
                query = query.eq('user_uid', formData.customUid);
            }
    
            // Execute the query
            const { data: reportsData, error: reportsError } = await query;
    
            if (reportsError) {
                console.error("Error fetching reports:", reportsError);
                return;
            }
    
            setReports(reportsData);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteReport = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
    
        try {
            // First get the associated pin ID from the report
            const { data: reportData, error: reportError } = await supabase
                .from('reports')
                .select('pinid')
                .eq('id', id)
                .single();
    
            if (reportError) throw reportError;
    
            // Delete the pin first if it exists
            if (reportData.pinid) {
                const { error: pinsError } = await supabase
                    .from('pins')
                    .delete()
                    .eq('pinid', reportData.pinid);
    
                if (pinsError) throw pinsError;
            }
    
            // Then delete the report
            const { error: reportsError } = await supabase
                .from('reports')
                .delete()
                .eq('id', id);
    
            if (reportsError) throw reportsError;
    
            // Update UI state
            setReports(prev => prev.filter(report => report.id !== id));
            
        } catch (error) {
            console.error("Deletion failed:", error);
            alert(`Deletion failed: ${error.message}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resolved": return "success";
            case "pending": return "warning";
            case "in progress": return "info";
            case "denied": return "error"; // Added "denied" status
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

    // Add this function before the return statement
// const handleDeleteAllReports = async () => {
//     if (formData.role !== 'admin') return;
    
//     if (!window.confirm("WARNING: This will permanently delete ALL reports and associated pins!\n\nAre you absolutely sure?")) return;

//     try {
//         setIsDeletingAll(true);
        
//         // First delete all associated pins
//         const { data: allReports } = await supabase
//             .from('reports')
//             .select('pinid');
        
//         const pinIds = allReports?.map(r => r.pinid).filter(Boolean);
//         if (pinIds?.length > 0) {
//             await supabase
//                 .from('pins')
//                 .delete()
//                 .in('pinid', pinIds);
//         }

//         // Then delete all reports
//         const { error } = await supabase
//             .from('reports')
//             .delete()
//             .neq('id', 0); // Requires proper RLS policies for admin access

//         if (error) throw error;
        
//         setReports([]);
//         alert('All reports and associated pins deleted successfully');
//     } catch (error) {
//         console.error('Mass deletion error:', error);
//         alert(`Deletion failed: ${error.message}`);
//     } finally {
//         setIsDeletingAll(false);
//     }
// };

// const handleDeleteAllReports = async () => {
//     if (!window.confirm("Are you sure you want to delete ALL reports? This action cannot be undone.")) return;

//     try {
//         // Fetch all reports to get their pin IDs and report IDs
//         const { data: allReports, error: fetchError } = await supabase
//             .from('reports')
//             .select('id, pinid');

//         if (fetchError) throw fetchError;

//         // Collect unique pin IDs (excluding nulls)
//         const pinIds = [...new Set(allReports.map(report => report.pinid).filter(Boolean))];

//         // Delete associated pins in one batch
//         if (pinIds.length > 0) {
//             const { error: deletePinsError } = await supabase
//                 .from('pins')
//                 .delete()
//                 .in('pinid', pinIds);

//             if (deletePinsError) throw deletePinsError;
//         }

//         // Collect all report IDs
//         const reportIds = allReports.map(report => report.id);

//         // Delete all reports in one batch
//         if (reportIds.length > 0) {
//             const { error: deleteReportsError } = await supabase
//                 .from('reports')
//                 .delete()
//                 .in('id', reportIds);

//             if (deleteReportsError) throw deleteReportsError;
//         }

//         // Clear reports from state
//         setReports([]);
//         alert('All reports and associated pins have been deleted successfully!');

//     } catch (error) {
//         console.error("Failed to delete all reports:", error);
//         alert(`Deletion failed: ${error.message}`);
//     }
// };

const handleDeleteAllReports = async () => {
    try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Authentication required");

        // Determine user role
        const isAdmin = formData.role === 'admin';

        // Confirmation message based on role
        const confirmMessage = isAdmin 
            ? "WARNING: This will delete ALL reports for ALL users! Are you sure?"
            : "Are you sure you want to delete all YOUR reports? This cannot be undone.";

        if (!window.confirm(confirmMessage)) return;

        // Base query for reports
        let reportsQuery = supabase
            .from('reports')
            .select('id, pinid, user_uid');

        // Add user filter for non-admins
        if (!isAdmin) {
            reportsQuery = reportsQuery.eq('user_uid', user.id);
        }

        // Fetch relevant reports
        const { data: allReports, error: fetchError } = await reportsQuery;
        if (fetchError) throw fetchError;

        // Exit if no reports found
        if (!allReports || allReports.length === 0) {
            alert(isAdmin ? "No reports to delete" : "You have no reports to delete");
            return;
        }

        // Process deletions
        const pinIds = [...new Set(allReports.map(report => report.pinid).filter(Boolean))]; // Fixed here
        
        // Delete associated pins
        if (pinIds.length > 0) {
            const { error: deletePinsError } = await supabase
                .from('pins')
                .delete()
                .in('pinid', pinIds);
            if (deletePinsError) throw deletePinsError;
        }

        // Delete reports
        const reportIds = allReports.map(report => report.id);
        const { error: deleteReportsError } = await supabase
            .from('reports')
            .delete()
            .in('id', reportIds);
        if (deleteReportsError) throw deleteReportsError;

        // Update state and UI
        setReports([]);
        alert(isAdmin 
            ? `Deleted ${reportIds.length} reports and ${pinIds.length} pins successfully!`
            : "Your reports have been deleted successfully");

    } catch (error) {
        console.error("Deletion failed:", error);
        alert(`Error: ${error.message}`);
    }
};


    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Navbar userDetails={formData} />
            {/* <Box sx={theme.components.MuiBox?.styleOverrides?.root || {}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Report History
                </Typography>
                <Typography variant="subtitle1">
                    User: {formData.name} | UID: {formData.customUid}
                </Typography>
            </Box> */}

<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h4" component="h1" gutterBottom>
        Report History
    </Typography>
    
    {/* {formData.role === 'admin' && (
        <Button
    variant="contained"
    color="error"
    startIcon={isDeletingAll ? <CircularProgress size={20} color="inherit" /> : <FaRadiation />}
    onClick={handleDeleteAllReports}
    disabled={isDeletingAll || reports.length === 0}
    sx={{
        minWidth: 200,
        backgroundColor: '#ff4444',
        '&:hover': {
            backgroundColor: '#cc0000'
        }
    }} */}
    <Button
    variant="contained"
    color="error"
    startIcon={isDeletingAll ? <CircularProgress size={20} color="inherit" /> : <FaRadiation />}
    onClick={handleDeleteAllReports}
    disabled={isDeletingAll || reports.length === 0}
    sx={{
        minWidth: 200,
        backgroundColor: '#ff4444',
        '&:hover': {
            backgroundColor: '#cc0000'
        }
    }}
>
    {isDeletingAll ? 'Deleting...' : (
        formData.role === 'admin' ? 'Delete All Reports' : 'Delete My Reports'
    )}
</Button>
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
                                                <Chip label={`Reporter Name: ${report.name}`} variant="outlined" />
                                                <Chip label={`Place: ${report.specific_place}`} variant="outlined" />
                                                <Chip label={`Pin ID: ${report.pinid}`} variant="outlined" />
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
