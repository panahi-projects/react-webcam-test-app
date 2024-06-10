"use client";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const capturePhoto = useCallback(() => {
    const imageSrc = (webcamRef as any).current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
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
  }, [webcamRef, setCapturing, mediaRecorderRef as any]);

  const handleDataAvailable = useCallback(
    ({ data }: { data: any }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    (mediaRecorderRef as any).current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      (a as any).style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  return (
    <>
      {/* <button onClick={capturePhoto}>Capture photo</button>
      <Webcam
        suppressHydrationWarning
        ref={webcamPhotoRef}
        mirrored={true}
        videoConstraints={videoConstraints}
      />
      {imgSrc && <img src={imgSrc} />} */}
      <button
        onClick={capturePhoto}
        style={{
          margin: "6px 12px",
          padding: "8px 16px",
          background: "#fff",
          color: "#000",
          display: "block",
        }}
      >
        Capture photo
      </button>
      {capturing ? (
        <button
          onClick={handleStopCaptureClick}
          style={{
            margin: "6px 12px",
            padding: "8px 16px",
            background: "#fff",
            color: "#000",
            display: "block",
          }}
        >
          Stop Capture
        </button>
      ) : (
        <button
          onClick={handleStartCaptureClick}
          style={{
            margin: "6px 12px",
            padding: "8px 16px",
            background: "#fff",
            color: "#000",
            display: "block",
          }}
        >
          Start Capture
        </button>
      )}
      {recordedChunks.length > 0 && (
        <button
          onClick={handleDownload}
          style={{
            margin: "6px 12px",
            padding: "8px 16px",
            background: "#fff",
            color: "#000",
            display: "block",
          }}
        >
          Download
        </button>
      )}
      <Webcam audio={false} ref={webcamRef} />
      {imgSrc && <img src={imgSrc} />}
    </>
  );
};

export default WebcamComponent;
