import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Camera3 = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState("");

  const handleStartCaptureClick = () => {
    setCapturing(true);
    setVideoUrl(null); // Clear previous video URL if any
    (mediaRecorderRef as any).current = new MediaRecorder(
      (webcamRef as any).current.stream,
      {
        mimeType: "video/webm",
      }
    );
    (mediaRecorderRef as any).current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    (mediaRecorderRef as any).current.start();
  };

  const handleDataAvailable = ({ data }: { data: any }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStopCaptureClick = () => {
    try {
      (mediaRecorderRef as any).current.stop();
      setCapturing(false);
    } catch (err) {
      setError("Error: " + err);
    }
  };

  const handleSaveVideo = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url as any);
      setRecordedChunks([]);
    }
  };

  return (
    <div>
      <Webcam audio={true} ref={webcamRef} />
      <pre>{error}</pre>
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleSaveVideo}>Save Video</button>
      )}
      {videoUrl && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoUrl} controls autoPlay loop />
        </div>
      )}
    </div>
  );
};

export default Camera3;
