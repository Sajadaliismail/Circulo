import { Pause, PlayArrow } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";

const VoiceMessagePlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      drawWaveform();
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      updateWaveform();
    });
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        drawWaveform();
      });
      audio.removeEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
        updateWaveform();
      });
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const bars = 70;
      const barWidth = width / bars;
      const barGap = 2;

      ctx.fillStyle = "rgba(80, 144, 255, 0.8)";
      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * height;
        ctx.fillRect(
          i * (barWidth + barGap),
          (height - barHeight) / 2,
          barWidth,
          barHeight
        );
      }
    }
  };

  const updateWaveform = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const progress = currentTime / duration;
      const progressWidth = width * progress;
      ctx.fillStyle = "rgba(30, 144, 255, 0.8)";
      ctx.fillRect(0, 0, progressWidth, height);
    }
  };

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={audioSrc} />
      <button
        onClick={togglePlayPause}
        style={styles.playButton}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </button>
      <div style={styles.waveformContainer}>
        <canvas
          ref={canvasRef}
          width={150}
          height={30}
          style={styles.waveform}
        />
      </div>
      <div style={styles.timeDisplay}>{formatTime(currentTime)}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    borderRadius: "20px",
    padding: "10px",
    maxWidth: "300px",
  },
  playButton: {
    backgroundColor: "#3f73e3",
    border: "none",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    lineHeight: "16px",
  },
  waveformContainer: {
    flex: 1,
    margin: "0 10px",
    overflow: "hidden",
  },
  waveform: {
    width: "100%",
    height: "30px",
  },
  timeDisplay: {
    fontSize: "12px",
    color: "#666",
    minWidth: "40px",
    textAlign: "right",
  },
};

export default VoiceMessagePlayer;
