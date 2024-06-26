"use client";
import useBrowserAndOS from "@/hooks/useBrowserAndOS";
import { useRef, useState, useEffect } from "react";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoType, setVideoType] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { browserName, browserVersion, osName, osVersion } = useBrowserAndOS();
  // useEffect(() => {
  //   if (browserName.toLowerCase() === "safari") {
  //     setVideoType("video/mp4");
  //   } else {
  //     setVideoType("video/webm");
  //   }
  // }, []);

  const startCamera = () => {
    if (browserName.toLowerCase() === "safari") {
      setVideoType("video/mp4");
    } else {
      setVideoType("video/webm");
    }
    const constraints = {
      video: { facingMode: "user" },
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);
          const options = { mimeType: videoType };

          const recorder = new MediaRecorder(stream, options);
          setMediaRecorder(recorder);
          setErrorMessage(null);
        }
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        setErrorMessage("Error accessing camera: " + err.message);
      });
  };
  const startRecording = () => {
    try {
      if (mediaRecorder && !isRecording) {
        mediaRecorder.start();
        setIsRecording(true);
        mediaRecorder.ondataavailable = (event) => {
          const blob = new Blob([event.data], { type: videoType });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        };
      }
    } catch (err) {
      setErrorMessage("Error accessing camera: " + err);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  return (
    <div>
      <div>
        {!isStreaming && !errorMessage && (
          <button
            onClick={startCamera}
            style={{
              margin: "6px 12px",
              padding: "8px 16px",
              background: "#22eb36",
              color: "#fff",
              display: "block",
            }}
          >
            Start Camera
          </button>
        )}
        {!isRecording ? (
          <button
            onClick={startRecording}
            style={{
              margin: "6px 12px",
              padding: "8px 16px",
              background: "#7c2af7",
              color: "#fff",
              display: "block",
            }}
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            style={{
              margin: "6px 12px",
              padding: "8px 16px",
              background: "#f72a5a",
              color: "#fff",
              display: "block",
            }}
          >
            Stop Recording
          </button>
        )}
      </div>
      <pre>{errorMessage}</pre>
      <div>
        <span>Browser:</span>
        <span>
          {browserName} {browserVersion}
        </span>
      </div>
      <div>
        <span>OS:</span>
        <span>
          {osName} {osVersion}
        </span>
      </div>
      <div>
        <span>video type:</span>
        <span>{videoType}</span>
      </div>
      <video ref={videoRef} style={{ width: "640px", height: "480px" }} />
      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video
            src={videoURL}
            controls
            style={{ width: "640px", height: "480px" }}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: "block" }}
        width="640"
        height="480"
      />
      {!isStreaming && <p>Loading camera...</p>}
    </div>
  );
};

export default Camera;
