import React from 'react';
import './Spinner.css'
const Spinner= () => {
  return (
    <div className="loading-component">
      <span className="spinner"></span>
      <p style={{color:'green',fontWeight:'bolder'}}>Verifing...</p>
    </div>
  );
};

export default Spinner;
