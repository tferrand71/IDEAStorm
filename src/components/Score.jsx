import React from 'react';
import { formatNumber } from '../utils/format'; // Import du formateur

export default function Score({ score }) {
    return (
        <div style={{ margin: "20px 0" }}>
            <h2 style={{ fontSize: "3rem", margin: 0, color: "#ff6f61" }}>
                {formatNumber(score)}
            </h2>
            <p style={{ margin: 0, color: "#888" }}>points</p>
        </div>
    );
}