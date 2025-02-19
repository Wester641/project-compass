// import React, { useEffect, useState } from "react";
// import "./Compass.css";

// const Compass = () => {
//   const [direction, setDirection] = useState(0);

//   useEffect(() => {
//     const handleOrientation = (event) => {
//       const alpha = event.alpha;
//       setDirection(alpha);
//     };

//     if (window.DeviceOrientationEvent) {
//       window.addEventListener("deviceorientation", handleOrientation, true);
//     } else {
//       alert("Ваше устройство не поддерживает события ориентации.");
//     }

//     return () => {
//       window.removeEventListener("deviceorientation", handleOrientation);
//     };
//   }, []);

//   // const updateHeading = () => {
//   //   setHeading((prevHeading) => (prevHeading + 10) % 360);
//   // };
//   return (
//     <div className="compass">
//       <div
//         className="compass-needle"
//         style={{ transform: `rotate(${direction}deg)` }}
//       />
//     </div>
//   );
// };

// export default Compass;

import { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";

import "./Compass.css";

export default function CipherCompass() {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const [pointDegree, setPointDegree] = useState(0);
  const [compassCircleTransformStyle, setCompassCircleTransform] = useState(
    "translate(-50%, -50%)"
  );
  const [myPointStyle, setMypointStyle] = useState(0);

  const locationHandler = (coords) => {
    const { latitude, longitude } = coords;
    const resP = calcDegreeToPoint(latitude, longitude);
    console.log("resP", resP);
    if (resP < 0) {
      setPointDegree(resP + 360);
    } else {
      setPointDegree(resP);
    }
  };

  useEffect(() => {
    if (!isGeolocationAvailable) {
      alert("Your browser does not support Geolocation");
    } else if (!isGeolocationEnabled) {
      alert(
        "Geolocation is not enabled, Please allow the location check your setting"
      );
    } else if (coords) {
      locationHandler(coords);
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);
  const isIOS = () => {
    return (
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
      navigator.userAgent.match(/AppleWebKit/)
    );
  };

  const calcDegreeToPoint = (latitude, longitude) => {
    // Qibla geolocation
    const point = {
      lat: 21.422487,
      lng: 39.826206,
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return Math.round(psi);
  };
  const startCompass = async () => {
    const checkIos = isIOS();
    if (checkIos) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("has to be allowed!");
          }
        })
        .catch(() => alert("not supported"));
    } else {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  };
  const handler = (e) => {
    const compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    const compassCircleTransform = `translate(-50%, -50%) rotate(${-compass}deg)`;
    setCompassCircleTransform(compassCircleTransform);

    // ±15 degree
    if (
      (pointDegree < Math.abs(compass) &&
        pointDegree + 15 > Math.abs(compass)) ||
      pointDegree > Math.abs(compass + 15) ||
      pointDegree < Math.abs(compass)
    ) {
      setMypointStyle(0);
    } else if (pointDegree) {
      setMypointStyle(1);
    }
  };
  console.log("coords:", coords);
  return (
    <div className="App">
      <div>myPointStyle:{myPointStyle}</div>
      <div>pointDegree:{pointDegree}</div>
      <div>coords?.latitude:{coords?.latitude}</div>
      <div>coords?.longitude:{coords?.longitude}</div>

      <div className="compass">
        <div className="arrow" />
        <div
          className="compass-circle"
          style={{ transform: compassCircleTransformStyle }}
        />
        <div className="my-point" style={{ opacity: myPointStyle }} />
      </div>
      <button className="start-btn" onClick={startCompass}>
        Start compass
      </button>
    </div>
  );
}
