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


    const fetchReports = async () => {
        try {
            // Create a base query
            let query = supabase
                .from('reports')
                .select('id, title, details, status, type, image, created_at, name')
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
                                                <Chip label={`Reporter Name: ${report.name}`} variant="outlined" />
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
