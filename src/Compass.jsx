import React, { useEffect, useState } from "react";

export default function Compass() {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      setHeading(alpha);
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className="compass">
      <div
        className="arrow"
        style={{ transform: `rotate(${heading}deg)` }}
      ></div>
      <div className="heading">{Math.round(heading)}°</div>
    </div>
  );
}
