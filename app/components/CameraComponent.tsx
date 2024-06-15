"use client";
import { useEffect, useState } from "react";
import Camera3 from "./Camera3";

const CameraComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } else return <Camera3 />;
};

export default CameraComponent;
