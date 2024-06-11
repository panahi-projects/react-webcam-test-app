import { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState([]);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const videoConstraints = {
    facingMode: "user",
  };

  const onUserMedia = () => {
    if (devices.length === 0) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((mediaDevices: any) =>
          setDevices(
            mediaDevices.filter(
              ({ kind }: { kind: String }) => kind === "videoinput"
            )
          )
        );
    }
  };

  return (
    <>
      <Webcam
        mirrored
        audio={false}
        onUserMedia={onUserMedia}
        videoConstraints={{ deviceId, ...videoConstraints }}
      />
      <div>
        {devices.map((device: any, key) => (
          <button
            key={device.deviceId}
            onClick={() => setDeviceId(device.deviceId)}
          >
            {device.label || `Device ${key + 1}`}
          </button>
        ))}
      </div>
    </>
  );
};

export default WebcamCapture;
