// import WebcamComponent from "./components/WebcamComponent";
import dynamic from "next/dynamic";
import Webcam from "react-webcam";
import CameraComponent from "./components/CameraComponent";
const WebcamComponent = dynamic(() => import("./components/WebcamComponent"), {
  ssr: false,
});
export default function Home() {
  return (
    <div>
      <CameraComponent />
    </div>
  );
}
