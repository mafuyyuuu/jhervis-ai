import React from 'react';
import './ScanEffect.css';

const ScanEffect = ({ active }) => {
    return (
        <div className={`scan-effect ${active ? 'active' : ''}`}>
            <div className="scan-line"></div>
        </div>
    );
};

export default ScanEffect;
