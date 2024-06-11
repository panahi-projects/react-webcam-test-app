"use client";
import { useState, useEffect } from "react";
import Camera from "./Camera";
import Camera2 from "./Camera2";
import WebcamCapture from "./WebcamCapture";
import CameraRecorder from "./CameraRecorder";

const CameraComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } else return <Camera />;
};

export default CameraComponent;
