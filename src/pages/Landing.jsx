import React from "react";
import { Link } from "react-router-dom";

function Landing() {
    return (
        <div>
            <Link to="/signup">Register</Link>
            <br></br>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default Landing;