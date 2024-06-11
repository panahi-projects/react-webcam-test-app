"use client";
import { useState, useEffect } from "react";
import Camera from "./Camera";

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