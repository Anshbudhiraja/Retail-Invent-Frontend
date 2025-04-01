import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        alert("Unauthorized user");
        navigate("/", { replace: true });
    }, [navigate]);

    return null; // No UI, just redirects
};

export default EmergencyLogout;
