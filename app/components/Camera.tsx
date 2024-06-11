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

  const { browserName } = useBrowserAndOS();
  useEffect(() => {
    if (browserName.toLowerCase() === "safari") {
      setVideoType("video/mp4");
    } else {
      setVideoType("video/webm");
    }
  }, []);

  const startCamera = () => {
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
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.translate(canvasRef.current.width, 0);
        context.scale(0, 0);
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const dataUrl = canvasRef.current.toDataURL("image/png");
        console.log("Photo taken: ", dataUrl);
      }
    }
  };
  const startRecording = () => {
    if (mediaRecorder && !isRecording) {
      mediaRecorder.start();
      setIsRecording(true);
      mediaRecorder.ondataavailable = (event) => {
        const blob = new Blob([event.data], { type: videoType });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      };
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
        <button
          style={{
            margin: "6px 12px",
            padding: "8px 16px",
            background: "#2ae3f7",
            color: "#fff",
            display: "block",
          }}
          onClick={takePhoto}
        >
          Take Photo
        </button>
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
