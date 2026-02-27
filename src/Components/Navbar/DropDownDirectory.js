import React from "react";
import "./DropDownDirectory.css";
import { FaWrench, FaHandsHelping } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const DropDownDirectory = () => {
    const navigate = useNavigate();

    return (
        <div className="directory-buttons">
            <button className="directory-btn" onClick={() => navigate('/directory')}>
                <FaWrench className="directory-icon directory-green" />
                <span>Directory</span>
            </button>

            <button className="directory-btn" onClick={() => navigate('/request')}>
                <FaHandsHelping className="directory-icon directory-green" />
                <span>Requests</span>
            </button>
        </div>
    );
};

export default DropDownDirectory;
