import React, { useEffect, useState } from "react";
import "./Compass.css";

const Compass = () => {
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      setDirection(alpha);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    } else {
      alert("Ваше устройство не поддерживает события ориентации.");
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // const updateHeading = () => {
  //   setHeading((prevHeading) => (prevHeading + 10) % 360);
  // };
  return (
    <div className="compass">
      <div
        className="compass-needle"
        style={{ transform: `rotate(${direction}deg)` }}
      />
    </div>
  );
};

export default Compass;
