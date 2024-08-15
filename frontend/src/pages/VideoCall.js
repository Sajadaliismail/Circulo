import React, { useEffect } from "react";
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";

export default function VideoCall({ roomId }) {
  useEffect(() => {
    const config = {
      name: "Demo User",
      meetingId: roomId,
      apiKey: "70006009-346f-42ac-acca-f13e62ec739f",

      containerId: null,

      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,

      chatEnabled: true,
      screenShareEnabled: true,
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
  }, []);

  return <div></div>;
}
