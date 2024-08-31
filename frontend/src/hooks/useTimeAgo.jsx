import { useState, useEffect } from "react";
import { convertUTCToIST } from "../pages/Utilitis";

export function useTimeAgo(utcDateString) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTimeAgo = () => {
      setTimeAgo(convertUTCToIST(utcDateString));
    };

    updateTimeAgo();

    const intervalId = setInterval(updateTimeAgo, 60000);

    return () => clearInterval(intervalId);
  }, [utcDateString]);

  return timeAgo;
}
