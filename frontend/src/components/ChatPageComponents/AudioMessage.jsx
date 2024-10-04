import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { Button, Card, CardContent } from "@mui/material";
import { Mic, Pause, PlayArrow, Square } from "@mui/icons-material";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const recordPluginRef = useRef(null);
  const recordedChunks = [];

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        cursorColor: "navy",
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 1,
        height: 20,
        barGap: 3,
      });

      wavesurferRef.current.on("click", () => {
        wavesurferRef.current.play();
      });

      // Register the recording plugin
      recordPluginRef.current = wavesurferRef.current.registerPlugin(
        RecordPlugin.create()
      );

      // Reset playback state when audio finishes playing
      wavesurferRef.current.on("finish", () => setIsPlaying(false));
    }

    // Clean up when component is unmounted
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (recordPluginRef.current) {
        await recordPluginRef.current.startRecording();
        console.log(
          "MediaRecorder state after starting:",
          recordPluginRef.current.mediaRecorder?.state
        );
        setIsRecording(true);
        recordPluginRef.current.mediaRecorder?.addEventListener(
          "dataavailable",
          (event) => {
            console.log(event);

            if (event.data.size > 0) {
              recordedChunks.push(event.data);
              console.log(recordedChunks);
            }
          }
        );
      }
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = async () => {
    if (recordPluginRef.current) {
      try {
        await recordPluginRef.current.stopRecording();

        recordPluginRef.current.mediaRecorder?.addEventListener(
          "dataavailable",
          (event) => {
            if (event.data.size > 0) {
              const newBlob = new Blob([event.data], { type: event.data.type });

              const audio = URL.createObjectURL(newBlob);
              setAudioUrl(audio);
            }
          }
        );

        setIsRecording(false);
      } catch (error) {
        setIsRecording(false);

        console.error("Error stopping recording:", error);
      }
    }
  };

  return (
    <Card className=" max-w-sm mx-auto">
      <CardContent className="p-2">
        {/* Waveform container */}
        <div ref={waveformRef} className="mb-4" />

        {/* Recording and playback buttons */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button onClick={startRecording} disabled={isRecording}>
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="mr-2 h-4 w-4" /> Stop Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
