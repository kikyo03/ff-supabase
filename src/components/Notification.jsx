import React, { useState, useEffect } from "react";
import { 
  Alert,
  IconButton, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Collapse,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { styled } from "@mui/system";
import { FaCheckCircle, FaTimes, FaBell, FaEnvelope, FaEye } from "react-icons/fa";
import Navbar from '../components/Navbar';
import supabase from "../helper/supabaseClient";

const StyledAlert = styled(Alert)({
  fontSize: "1.1rem",
  alignItems: "center",
  "& .MuiAlert-icon": {
    fontSize: "2rem"
  }
});

const NotificationContainer = styled(Container)({
  paddingTop: "32px",
  paddingBottom: "32px"
});

const NotificationItem = styled(Paper)({
  padding: "16px",
  marginBottom: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  }
});

const NotificationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    role: "",
    customUid: "",
  });
  
  const [showBanner, setShowBanner] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [latestNotification, setLatestNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return;

        const { data: userDetails, error: userError } = await supabase
          .from('users')
          .select('fname, lname, role, id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        setFormData({
          name: `${userDetails.fname} ${userDetails.lname}`,
          lastName: userDetails.lname,
          email: user.email,
          role: userDetails.role,
          customUid: userDetails.id,
        });

        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsError) throw notificationsError;
        
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndNotifications();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          if (payload.new.user_id === user.id) {
            setNotifications(prev => [payload.new, ...prev]);
            setLatestNotification(payload.new);
            setShowBanner(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const markAllAsRead = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (!error) {
        setNotifications([]);
      }
      setShowClearConfirmation(false);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    setLatestNotification(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const ClearConfirmationDialog = () => (
    <Dialog
      open={showClearConfirmation}
      onClose={() => setShowClearConfirmation(false)}
    >
      <DialogTitle>Confirm Clear All Notifications</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to permanently delete all notifications? 
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowClearConfirmation(false)}>Cancel</Button>
        <Button 
          onClick={clearAllNotifications} 
          color="error"
          variant="contained"
        >
          Confirm Delete All
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Navbar userDetails={formData} notificationCount={unreadCount}/>

      <Collapse in={showBanner && !!latestNotification}>
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseBanner}
            >
              <FaTimes fontSize="inherit" />
            </IconButton>
          }
          sx={{ mt: 2, mb: 2 }}
        >
          {latestNotification?.message}
        </Alert>
      </Collapse>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4 
        }}>
          <CircularProgress size="4rem" />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4 
        }}>
          <Typography variant="h6">No notifications found</Typography>
        </Box>
      ) : (
        <NotificationContainer maxWidth="md">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            gap: 2 
          }}>
            <Typography variant="h4" component="h1" sx={{ display: "flex", alignItems: "center" }}>
              <FaBell style={{ marginRight: "12px" }} />
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => setShowClearConfirmation(true)}
                disabled={notifications.length === 0}
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <List>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <NotificationItem elevation={1}>
                  <ListItem>
                    <ListItemIcon>
                      {notification.type === 'status_update' ? (
                        notification.message.toLowerCase().includes('denied') ? (
                          <FaTimes color="#ff4444" style={{ fontSize: '1.5rem' }} />
                        ) : (
                          <FaCheckCircle color="#4caf50" style={{ fontSize: '1.5rem' }} />
                        )
                      ) : (
                        <FaEnvelope color="#2196f3" style={{ fontSize: '1.5rem' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.type === 'status_update' ? 'Status Update' : 'New Message'}
                      secondary={notification.message}
                      sx={{ 
                        opacity: notification.read ? 0.6 : 1,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    <IconButton 
                      edge="end" 
                      aria-label="mark as read"
                      onClick={() => markAsRead(notification.id)}
                    >
                      {notification.read ? (
                        <FaCheckCircle color="#4caf50" />
                      ) : (
                        <FaEye color="#666" />
                      )}
                    </IconButton>
                  </ListItem>
                </NotificationItem>
                <Divider sx={{ my: 1 }} />
              </React.Fragment>
            ))}
          </List>
        </NotificationContainer>
      )}
      <ClearConfirmationDialog />
    </Box>
  );
};

export default NotificationPage;