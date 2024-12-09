"use client";

import React from "react";

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-gears">
        <div className="maintenance-gear maintenance-gear-large"></div>
        <div className="maintenance-gear maintenance-gear-small"></div>
      </div>
      <h1 className="maintenance-title">Under Maintenance</h1>
      <p className="maintenance-message">
        Check back later!
      </p>
    </div>
  );
};

export default Maintenance;
