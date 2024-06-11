import { useState, useEffect } from "react";
import Bowser from "bowser";

const useBrowserAndOS = () => {
  const [browserInfo, setBrowserInfo] = useState({
    browserName: "",
    browserVersion: "",
    osName: "",
    osVersion: "",
  });

  useEffect(() => {
    const detectBrowserAndOS = () => {
      const browser = Bowser.getParser(window.navigator.userAgent);
      const browserDetails = browser.getBrowser();
      const osDetails = browser.getOS();

      setBrowserInfo({
        browserName: browserDetails.name || "Unknown",
        browserVersion: browserDetails.version || "Unknown",
        osName: osDetails.name || "Unknown",
        osVersion: osDetails.version || "Unknown",
      });
    };

    detectBrowserAndOS();
  }, []);

  return browserInfo;
};

export default useBrowserAndOS;
