import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaTrash, FaRadiation } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import supabase from "../helper/supabaseClient";
import CircularProgress from '@mui/material/CircularProgress';

const REPORT_PRIORITY = {
    'Caution': { level: 'High', order: 1, color: 'error' },
    'Electrical': { level: 'High', order: 1, color: 'error' },
    'Repair': { level: 'Medium', order: 2, color: 'warning' },
    'IT Maintenance': { level: 'Medium', order: 3, color: 'warning' },
    'Cleaning': { level: 'Low', order: 4, color: 'info' },
    'Request': { level: 'Low', order: 4, color: 'info' }
};

const reportTypes = Object.keys(REPORT_PRIORITY).sort((a, b) => 
    REPORT_PRIORITY[a].order - REPORT_PRIORITY[b].order
);

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: "1rem",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
}));

const History = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        role: "",
        customUid: "",
    });

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const theme = useTheme();
    const statusOptions = ['pending', 'in progress', 'denied', 'resolved'];

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

    useEffect(() => {
        if (formData.customUid) {
            fetchReports();
        }
    }, [formData.customUid]);

    const fetchReports = async () => {
        try {
            let query = supabase
                .from('reports')
                .select('id, title, details, status, type, image, created_at, name, specific_place, pinid')
                .order('created_at', { ascending: false });

            if (formData.role !== 'admin') {
                query = query.eq('user_uid', formData.customUid);
            }

            const { data: reportsData, error: reportsError } = await query;

            if (reportsError) {
                console.error("Error fetching reports:", reportsError);
                return;
            }

            let sortedReports = reportsData;
            if (formData.role === 'admin') {
                sortedReports = [...reportsData].sort((a, b) => {
                    const priorityA = REPORT_PRIORITY[a.type]?.order || 99;
                    const priorityB = REPORT_PRIORITY[b.type]?.order || 99;
                    return priorityA - priorityB;
                });
            }

            setReports(sortedReports);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
    
        try {
            const { data: reportData, error: reportError } = await supabase
                .from('reports')
                .select('pinid')
                .eq('id', id)
                .single();

            if (reportError) throw reportError;

            if (reportData.pinid) {
                await supabase
                    .from('pins')
                    .delete()
                    .eq('pinid', reportData.pinid);
            }

            const { error: reportsError } = await supabase
                .from('reports')
                .delete()
                .eq('id', id);

            if (reportsError) throw reportsError;

            setReports(prev => prev.filter(report => report.id !== id));
            
        } catch (error) {
            console.error("Deletion failed:", error);
            alert(`Deletion failed: ${error.message}`);
        }
    };

    const handleDeleteAllReports = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("Authentication required");

            const isAdmin = formData.role === 'admin';
            const confirmMessage = isAdmin 
                ? "WARNING: This will delete ALL reports for ALL users! Are you sure?"
                : "Are you sure you want to delete all YOUR reports? This cannot be undone.";

            if (!window.confirm(confirmMessage)) return;

            let reportsQuery = supabase
                .from('reports')
                .select('id, pinid, user_uid');

            if (!isAdmin) {
                reportsQuery = reportsQuery.eq('user_uid', user.id);
            }

            const { data: allReports, error: fetchError } = await reportsQuery;
            if (fetchError) throw fetchError;

            if (!allReports || allReports.length === 0) {
                alert(isAdmin ? "No reports to delete" : "You have no reports to delete");
                return;
            }

            const pinIds = [...new Set(allReports.map(report => report.pinid).filter(Boolean))];
            if (pinIds.length > 0) {
                await supabase
                    .from('pins')
                    .delete()
                    .in('pinid', pinIds);
            }

            const reportIds = allReports.map(report => report.id);
            await supabase
                .from('reports')
                .delete()
                .in('id', reportIds);

            setReports([]);
            alert(isAdmin 
                ? `Deleted ${reportIds.length} reports and ${pinIds.length} pins successfully!`
                : "Your reports have been deleted successfully");

        } catch (error) {
            console.error("Deletion failed:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resolved": return "success";
            case "pending": return "warning";
            case "in progress": return "info";
            case "denied": return "error";
            default: return "default";
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size="4rem" />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Navbar userDetails={formData} />
            
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3, 
                gap: 2 
            }}>
                <Typography variant="h4" component="h1">
                    Report History
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center',
                    width: { xs: '100%', md: 'auto' },
                    flexDirection: { xs: 'column', md: 'row' }
                }}>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
                        <InputLabel>Filter by Type</InputLabel>
                        <Select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            label="Filter by Type"
                        >
                            <MenuItem value="all">All Types</MenuItem>
                            {reportTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" sx={{ minWidth: 180, width: { xs: '100%', md: 'auto' } }}>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Filter by Status"
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={isDeletingAll ? <CircularProgress size={20} color="inherit" /> : <FaRadiation />}
                        onClick={handleDeleteAllReports}
                        disabled={isDeletingAll || reports.length === 0}
                        sx={{ 
                            minWidth: 200,
                            width: { xs: '100%', md: 'auto' }
                        }}
                    >
                        {isDeletingAll ? 'Deleting...' : (
                            formData.role === 'admin' ? 'Delete All' : 'Delete Mine'
                        )}
                    </Button>
                </Box>
            </Box>

            {reports.length === 0 ? (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
                    No reports available.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {reports
                        .filter(report => 
                            (typeFilter === 'all' || report.type === typeFilter) &&
                            (statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase())
                        )
                        .map((report) => {
                            const isClickable = ['pending', 'in progress'].includes(report.status.toLowerCase());
                            
                            return (
                                <Grid item xs={12} key={report.id}>
                                    <StyledCard
                                        onClick={() => {
                                            if (isClickable) {
                                                navigate(`/status/${report.pinid}`);
                                            }
                                        }}
                                        sx={{
                                            cursor: isClickable ? 'pointer' : 'default',
                                            '&:hover': {
                                                transform: isClickable ? 'translateY(-4px)' : 'none'
                                            }
                                        }}
                                    >
                                        <Grid container>
                                            <Grid item xs={12} md={4}>
                                                {report.image ? (
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={report.image}
                                                        alt={report.title}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(report.image, "_blank");
                                                        }}
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteReport(report.id);
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body1" paragraph>
                                                        {report.details}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                        {formData.role === 'admin' && (
                                                            <Chip 
                                                                label={`Priority: ${REPORT_PRIORITY[report.type]?.level || 'Normal'}`}
                                                                color={REPORT_PRIORITY[report.type]?.color || 'default'}
                                                                variant="filled"
                                                            />
                                                        )}
                                                        <Chip label={`Type: ${report.type}`} variant="outlined" />
                                                        <Chip 
                                                            label={`Status: ${report.status}`} 
                                                            color={getStatusColor(report.status)} 
                                                        />
                                                        <Chip label={`Created: ${new Date(report.created_at).toLocaleString()}`} />
                                                        <Chip label={`Reporter: ${report.name}`} />
                                                        <Chip label={`Location: ${report.specific_place}`} />
                                                    </Box>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    </StyledCard>
                                </Grid>
                            );
                        })}
                </Grid>
            )}
        </Container>
    );
};

export default History;