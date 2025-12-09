import React from "react";
import "./DropDownLoadBoard.css";
import { FaClipboardList, FaTruck } from "react-icons/fa"; // icons for buttons
import { useNavigate } from 'react-router-dom';

const DropDownLoadBoard = () => {
    const navigate = useNavigate();

    return (
        <div className="loadboard-buttons">
            <button className="loadboard-btn" onClick={() => navigate('/loads')}>
                <FaClipboardList className="loadboard-icon loadboard-green" />
                <span>Loads</span>
            </button>

            <button className="loadboard-btn" onClick={() => navigate('/trucks')}>
                <FaTruck className="loadboard-icon loadboard-green" />
                <span>Trucks</span>
            </button>
        </div>
    );
};

export default DropDownLoadBoard;
