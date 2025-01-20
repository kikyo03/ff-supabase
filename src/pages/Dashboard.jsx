import React from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReportForm from "../components/ReportForm";
import Map from "../components/Map";
import PinSidebar from "../components/PinSidebar";


function Dashboard() {
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error('Error signing out. Please try again.');
                throw error;
            }

            toast.success('Signed out successfully.', {
                position: 'top-center',
                autoClose: 3000,
            });

            // Redirect after a delay to allow the toast to display
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page
            }, 2000);
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <PinSidebar />
            <Map />
        </div>
    );
}

export default Dashboard;
