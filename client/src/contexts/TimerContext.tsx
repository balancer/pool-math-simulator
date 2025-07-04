import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TimerContextType {
  // Timer state
  isPlaying: boolean;
  setIsPlaying: (playing: boolean | ((p: boolean) => boolean)) => void;
  simulationSeconds: number;
  setSimulationSeconds: (seconds: number | ((s: number) => number)) => void;
  simulationSecondsLastTick: number;
  setSimulationSecondsLastTick: (
    seconds: number | ((s: number) => number)
  ) => void;
  blockNumber: number;
  setBlockNumber: (block: number | ((b: number) => number)) => void;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number | ((s: number) => number)) => void;

  // Simulation configuration
  simulationSecondsPerBlock: number;
  setSimulationSecondsPerBlock: (seconds: number) => void;

  // Timer control functions
  resetTimer: () => void;
  pauseTimer: () => void;
  playTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  // Timer state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simulationSeconds, setSimulationSeconds] = useState<number>(0);
  const [simulationSecondsLastTick, setSimulationSecondsLastTick] =
    useState<number>(1);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Simulation configuration
  const [simulationSecondsPerBlock, setSimulationSecondsPerBlock] =
    useState<number>(12);

  // Timer control functions
  const resetTimer = () => {
    setSimulationSeconds(0);
    setBlockNumber(0);
    setSimulationSecondsLastTick(1);
    setIsPlaying(false);
  };

  const pauseTimer = () => {
    setIsPlaying(false);
  };

  const playTimer = () => {
    setIsPlaying(true);
  };

  const value: TimerContextType = {
    // Timer state
    isPlaying,
    setIsPlaying,
    simulationSeconds,
    setSimulationSeconds,
    simulationSecondsLastTick,
    setSimulationSecondsLastTick,
    blockNumber,
    setBlockNumber,
    speedMultiplier,
    setSpeedMultiplier,

    // Simulation configuration
    simulationSecondsPerBlock,
    setSimulationSecondsPerBlock,

    // Timer control functions
    resetTimer,
    pauseTimer,
    playTimer,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

// Custom hook to use the timer context
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
