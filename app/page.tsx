// import WebcamComponent from "./components/WebcamComponent";
import dynamic from "next/dynamic";
const WebcamComponent = dynamic(() => import("./components/WebcamComponent"), {
  ssr: false,
});
export default function Home() {
  return (
    <div>
      <WebcamComponent />
    </div>
  );
}
