import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Typography } from "@mui/material";

import { formatTime } from "../utils/Time";

interface TimerProps {
  blockNumber: number;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setSpeedMultiplier: (speed: number) => void;
  simulationSeconds: number;
  speedMultiplier: number;
}

export default function Timer({
  blockNumber,
  isPlaying,
  setIsPlaying,
  setSpeedMultiplier,
  simulationSeconds,
  speedMultiplier,
}: TimerProps) {
  return (
    <Paper style={{ padding: 16, marginTop: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsPlaying(!isPlaying)}
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Typography
          style={{
            fontWeight: "bold",
            color: isPlaying ? "green" : "red",
          }}
        >
          {isPlaying ? "Running" : "Paused"} - Simulation time:{" "}
          {formatTime(simulationSeconds)} - Block: {blockNumber}
        </Typography>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[1, 10, 100, 1000].map((speed) => (
          <Button
            key={speed}
            variant="contained"
            onClick={() => setSpeedMultiplier(speed)}
            style={{
              backgroundColor:
                speedMultiplier === speed ? "#90caf9" : undefined,
              flex: "1 1 auto",
            }}
          >
            {speed}x
          </Button>
        ))}
      </div>
    </Paper>
  );
}
