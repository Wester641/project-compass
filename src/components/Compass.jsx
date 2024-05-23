import React, { useEffect, useState } from "react";
import "../App.css";

const Compass = () => {
  const [heading, setHeading] = useState(0);

  // useEffect(() => {
  //   const handleOrientation = (event) => {
  //     const alpha = event.alpha;
  //     setHeading(alpha);
  //   };

  //   window.addEventListener("deviceorientation", handleOrientation);

  //   return () => {
  //     window.removeEventListener("deviceorientation", handleOrientation);
  //   };
  // }, []);

  const updateHeading = () => {
    setHeading((prevHeading) => (prevHeading + 10) % 360);
  };
  return (
    <div className="compass" onClick={updateHeading}>
      <div className="arrow" style={{ transform: `rotate(${heading}deg)` }} />
      <div className="heading">{Math.round(heading)}°</div>
    </div>
  );
};

export default Compass;
