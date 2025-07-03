import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import { PlayArrow, Pause, FastForward } from "@mui/icons-material";
import { Typography } from "@mui/material";

import { formatTime } from "../utils/Time";
import { useTimer } from "../contexts/TimerContext";

export default function Timer() {
  const {
    blockNumber,
    isPlaying,
    setIsPlaying,
    setSpeedMultiplier,
    simulationSeconds,
    speedMultiplier,
  } = useTimer();

  return (
    <Paper
      style={{
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 1,
        marginBottom: 16,
      }}
    >
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
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          style={{
            paddingTop: 8,
            paddingBottom: 9,
            paddingRight: 5,
            minWidth: 0,
          }}
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
        />
        <Button
          variant="contained"
          onClick={() => {
            setSpeedMultiplier((prev) => (prev * 10 > 1000 ? 1 : prev * 10));
          }}
          startIcon={<FastForward />}
        >
          {speedMultiplier}x
        </Button>
        <Typography
          style={{
            fontWeight: "bold",
            color: isPlaying ? "green" : "red",
          }}
        >
          Simulation time: {formatTime(simulationSeconds)} - Block:{" "}
          {blockNumber}
        </Typography>
      </div>
    </Paper>
  );
}
