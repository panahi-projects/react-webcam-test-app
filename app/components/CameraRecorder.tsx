import { useState, useRef, useEffect } from "react";

const CameraRecorder = () => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Reset video URL on component unmount
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .catch((error) => console.error("Error playing video:", error));
      }
      setCameraStarted(true);
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
    }
  };

  const handleStartRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      recordedChunksRef.current = [];
      const options = { mimeType: "video/webm; codecs=vp9" };

      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (error) {
        console.error("Error starting media recorder:", error);
      }
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      {!cameraStarted ? (
        <button onClick={handleStartCamera}>Start Camera</button>
      ) : (
        <>
          <video
            ref={videoRef}
            style={{ width: "100%", height: "auto" }}
            playsInline
            muted
          ></video>
          {!recording ? (
            <button onClick={handleStartRecording}>Start Recording</button>
          ) : (
            <button onClick={handleStopRecording}>Stop Recording</button>
          )}
          {videoURL && (
            <div>
              <h3>Recorded Video:</h3>
              <video
                src={videoURL}
                controls
                style={{ width: "100%", height: "auto" }}
                playsInline
              ></video>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CameraRecorder;
