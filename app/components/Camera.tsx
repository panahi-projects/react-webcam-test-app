"use client";
import { useRef, useState, useEffect } from "react";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [videoURL, setVideoURL] = useState<string | null>(null);

  useEffect(() => {
    const constraints = {
      video: true,
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
        }
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
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
        const blob = new Blob([event.data], { type: "video/webm" });
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
      <video ref={videoRef} style={{ width: "640px", height: "480px" }} />
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
      <div>
        <button
          onClick={startRecording}
          disabled={isRecording}
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
      </div>
      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoURL} controls style={{ width: "100%" }} />
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
