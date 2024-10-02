import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { Mic, Stop } from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";

const AudioRecorder = ({ onAudioRecorded, setIsRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const analyserRef = useRef(null); // New ref for analyser node
  const dataArrayRef = useRef(null); // New ref for data array used for visualization

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        barWidth: 2,
        height: 50,
        responsive: true,
        cursorWidth: 0,
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Set up the audio context and analyser node for live visualization
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      analyserRef.current = analyser; // Store the analyser for later use
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      // Start the visualization loop
      visualize();

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(blob);
        setAudioURL(audioURL);
        chunksRef.current = [];

        if (wavesurferRef.current) {
          wavesurferRef.current.load(audioURL);
        }

        if (onAudioRecorded) {
          onAudioRecorded(blob);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  }, [onAudioRecorded]);

  const stopRecording = useCallback(async () => {
    await setIsRecorded(true);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording, setIsRecorded]);

  const visualize = () => {
    if (!isRecording || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const draw = () => {
      if (!isRecording) return; // Stop drawing when not recording

      analyser.getByteTimeDomainData(dataArray);

      if (wavesurferRef.current) {
        wavesurferRef.current.drawBuffer(); // Refresh the WaveSurfer display
        const canvas = document.querySelector("canvas");
        const canvasCtx = canvas.getContext("2d");

        // Clear the canvas
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the waveform
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "violet";
        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }

      requestAnimationFrame(draw);
    };

    draw(); // Start drawing
  };

  return (
    <div className="flex items-center space-x-2">
      <IconButton
        onClick={isRecording ? stopRecording : startRecording}
        color={isRecording ? "secondary" : "primary"}
      >
        {isRecording ? <Stop /> : <Mic />}
      </IconButton>
      <div ref={waveformRef} className="flex-grow h-12" />
      {audioURL && <audio src={audioURL} controls className="w-full mt-2" />}
    </div>
  );
};

export default AudioRecorder;
