import { useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";

interface Device {
  deviceId: string;
  label: string;
}

const Camera2 = () => {
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState<Device[]>([]);

  const handleDevices = useCallback(
    (mediaDevices: any) =>
      setDevices(
        mediaDevices.filter(({ kind }: { kind: any }) => kind === "videoinput")
      ),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      <Webcam audio={false} videoConstraints={{ deviceId }} />
      <div>
        {devices.map((device, key) => (
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

export default Camera2;
