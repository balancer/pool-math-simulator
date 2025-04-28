import React, { useState, useMemo, useEffect } from "react";
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { ReClammChart } from "./ReClammChart";
import {
  calculateLowerMargin,
  calculateOutGivenIn,
  calculatePoolCenteredness,
  calculateUpperMargin,
  calculateBalancesAfterSwapIn,
  recalculateVirtualBalances,
  calculateInvariant,
} from "./ReClammMath";
import { formatTime } from "../../utils/Time";

const defaultInitialBalanceA = 1000;
const defaultInitialBalanceB = 2000;
const defaultMargin = 10;
const defaultPriceShiftDailyRate = 100;
const defaultSwapAmountIn = 100;
const defaultMinPrice = 0.5;
const defaultMaxPrice = 8;
const defaultTargetPrice = 2;
const defaultMaxBalanceA = 3000;

const tickMilliseconds = 10;

const MIN_SWAP = 0.000001;

export default function ReClamm() {
  // Simulation variables
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simulationSeconds, setSimulationSeconds] = useState<number>(0);
  const [simulationSecondsLastTick, setSimulationSecondsLastTick] =
    useState<number>(1);
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPoolInRange, setIsPoolInRange] = useState<boolean>(true);
  const [outOfRangeTime, setOutOfRangeTime] = useState<number>(0);
  const [lastRangeCheckTime, setLastRangeCheckTime] = useState<number>(0);

  // Initial Variables
  const [initialBalanceA, setInitialBalanceA] = useState<number>(
    defaultInitialBalanceA
  );
  const [initialBalanceB, setInitialBalanceB] = useState<number>(
    defaultInitialBalanceB
  );
  const [initialInvariant, setInitialInvariant] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(defaultMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(defaultMaxPrice);
  const [targetPrice, setTargetPrice] = useState<number>(defaultTargetPrice);

  // Pool Variables
  const [priceRatio, setPriceRatio] = useState<number>(
    defaultMaxPrice / defaultMinPrice
  );
  const [margin, setMargin] = useState<number>(defaultMargin);
  const [priceShiftDailyRate, setPriceShiftDailyRate] = useState<number>(
    defaultPriceShiftDailyRate
  );

  // Input Variables
  const [inputBalanceA, setInputBalanceA] = useState<number>(
    defaultInitialBalanceA
  );
  const [inputMargin, setInputMargin] = useState<number>(defaultMargin);
  const [inputMinPrice, setInputMinPrice] = useState<number>(defaultMinPrice);
  const [inputMaxPrice, setInputMaxPrice] = useState<number>(defaultMaxPrice);
  const [inputTargetPrice, setInputTargetPrice] =
    useState<number>(defaultTargetPrice);

  const [realTimeBalanceA, setRealTimeBalanceA] = useState<number>(
    defaultInitialBalanceA
  );
  const [realTimeBalanceB, setRealTimeBalanceB] = useState<number>(
    defaultInitialBalanceB
  );
  const [realTimeVirtualBalances, setRealTimeVirtualBalances] = useState({
    virtualBalanceA: 0,
    virtualBalanceB: 0,
  });

  // Swap variables
  const [swapTokenIn, setSwapTokenIn] = useState("Token A");
  const [swapAmountIn, setSwapAmountIn] = useState<number>(defaultSwapAmountIn);

  // Price Ratio Variables
  const [startPriceRatio, setStartPriceRatio] = useState<number>(
    defaultMaxPrice / defaultMinPrice
  );
  const [targetPriceRatio, setTargetPriceRatio] = useState<number>(
    defaultMaxPrice / defaultMinPrice
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const [inputEndTime, setInputEndTime] = useState<number>(0);

  // Add new state variables for inputs
  const [inputSecondsPerBlock, setInputSecondsPerBlock] = useState<number>(12);

  // Replace the constants with state variables
  const [simulationSecondsPerBlock, setSimulationSecondsPerBlock] =
    useState<number>(12);

  // Add new state for error message
  const [endTimeError, setEndTimeError] = useState<string>("");

  const [currentBalanceA, setCurrentBalanceA] = useState<number>(
    defaultInitialBalanceA
  );
  const [currentBalanceB, setCurrentBalanceB] = useState<number>(
    defaultInitialBalanceB
  );
  const [currentVirtualBalances, setCurrentVirtualBalances] = useState({
    virtualBalanceA: 0,
    virtualBalanceB: 0,
  });
  const [currentInvariant, setCurrentInvariant] = useState<number>(0);
  const [lastSwapTime, setLastSwapTime] = useState<number>(0);

  const [targetPriceRatioError, setTargetPriceRatioError] =
    useState<string>("");

  const realTimeInvariant = useMemo(() => {
    return (
      (realTimeBalanceA + realTimeVirtualBalances.virtualBalanceA) *
      (realTimeBalanceB + realTimeVirtualBalances.virtualBalanceB)
    );
  }, [realTimeBalanceA, realTimeBalanceB, realTimeVirtualBalances]);

  const poolCenteredness = useMemo(() => {
    return calculatePoolCenteredness({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
  }, [realTimeBalanceA, realTimeBalanceB, realTimeVirtualBalances]);

  const lowerMargin = useMemo(() => {
    return calculateLowerMargin({
      margin: margin,
      invariant: realTimeInvariant,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
  }, [margin, realTimeVirtualBalances, realTimeInvariant]);

  const higherMargin = useMemo(() => {
    return calculateUpperMargin({
      margin: margin,
      invariant: realTimeInvariant,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
  }, [margin, realTimeVirtualBalances, realTimeInvariant]);

  const calculatedSwapAmountOut = useMemo(() => {
    const amountOut = calculateOutGivenIn({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
      swapAmountIn: swapAmountIn,
      swapTokenIn: swapTokenIn,
    });

    // Check if amount out exceeds available balance
    const relevantBalance =
      swapTokenIn === "Token A"
        ? realTimeBalanceB - MIN_SWAP
        : realTimeBalanceA - MIN_SWAP;
    return {
      amount: amountOut,
      exceedsBalance: amountOut > relevantBalance,
    };
  }, [
    swapAmountIn,
    swapTokenIn,
    realTimeBalanceA,
    realTimeBalanceB,
    realTimeVirtualBalances,
  ]);

  const inputPriceRatio = useMemo(() => {
    return inputMaxPrice / inputMinPrice;
  }, [inputMaxPrice, inputMinPrice]);

  const idealVirtualBalanceA = useMemo(() => {
    return defaultMaxBalanceA / (Math.sqrt(inputPriceRatio) - 1);
  }, [inputPriceRatio]);

  const idealVirtualBalanceB = useMemo(() => {
    return inputMinPrice * (defaultMaxBalanceA + idealVirtualBalanceA);
  }, [idealVirtualBalanceA, inputMinPrice]);

  const idealBalanceB = useMemo(() => {
    return (
      Math.sqrt(
        inputTargetPrice *
          (defaultMaxBalanceA + idealVirtualBalanceA) *
          idealVirtualBalanceB
      ) - idealVirtualBalanceB
    );
  }, [inputTargetPrice, idealVirtualBalanceA, idealVirtualBalanceB]);

  const idealBalanceA = useMemo(() => {
    return (
      (idealBalanceB +
        idealVirtualBalanceB -
        idealVirtualBalanceA * inputTargetPrice) /
      inputTargetPrice
    );
  }, [
    idealBalanceB,
    idealVirtualBalanceB,
    idealVirtualBalanceA,
    inputTargetPrice,
  ]);

  const inputMaxBalanceA = useMemo(() => {
    return (inputBalanceA / idealBalanceA) * defaultMaxBalanceA;
  }, [idealBalanceA, inputBalanceA]);

  const inputVirtualBalanceA = useMemo(() => {
    return inputMaxBalanceA / (Math.sqrt(inputPriceRatio) - 1);
  }, [inputMaxBalanceA, inputPriceRatio]);

  const inputVirtualBalanceB = useMemo(() => {
    return inputMinPrice * (inputMaxBalanceA + inputVirtualBalanceA);
  }, [inputVirtualBalanceA, inputMinPrice, inputMaxBalanceA]);

  const inputBalanceB = useMemo(() => {
    return (inputBalanceA * idealBalanceB) / idealBalanceA;
  }, [inputBalanceA, idealBalanceB, idealBalanceA]);

  // Start default scenario and show chart.
  useEffect(() => {
    setTimeout(() => {
      setCurrentVirtualBalances({
        virtualBalanceA: inputVirtualBalanceA,
        virtualBalanceB: inputVirtualBalanceB,
      });
      setRealTimeVirtualBalances({
        virtualBalanceA: inputVirtualBalanceA,
        virtualBalanceB: inputVirtualBalanceB,
      });
      initializeInvariants();
    }, 1);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setSimulationSeconds(
          (prev) => prev + speedMultiplier / (1000 / tickMilliseconds)
        );
      }, tickMilliseconds);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, speedMultiplier, tickMilliseconds]);

  useEffect(() => {
    // Update values once every block.
    if (
      simulationSecondsLastTick % simulationSecondsPerBlock <
        simulationSeconds % simulationSecondsPerBlock ||
      !isPlaying
    ) {
      setSimulationSecondsLastTick(simulationSeconds);
      return;
    }
    setSimulationSecondsLastTick(simulationSeconds);
    setBlockNumber((prev) => prev + 1);

    const { newVirtualBalances, newPriceRatio } = recalculateVirtualBalances({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      oldVirtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      oldVirtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
      currentPriceRatio: priceRatio,
      poolParams: {
        margin: margin,
        priceShiftDailyRate: priceShiftDailyRate,
      },
      updateQ0Params: {
        startTime: startTime,
        endTime: endTime,
        startPriceRatio: startPriceRatio,
        targetPriceRatio: targetPriceRatio,
      },
      simulationParams: {
        simulationSeconds: simulationSeconds,
        simulationSecondsPerBlock: simulationSecondsPerBlock,
        secondsSinceLastInteraction: simulationSecondsPerBlock,
      },
    });

    setRealTimeVirtualBalances(newVirtualBalances);
    setPriceRatio(newPriceRatio);
  }, [simulationSeconds]);

  useEffect(() => {
    if (poolCenteredness <= margin / 100) {
      if (isPoolInRange) {
        setIsPoolInRange(false);
        setOutOfRangeTime(0);
      } else {
        setOutOfRangeTime(
          (prev) => prev + (simulationSeconds - lastRangeCheckTime)
        );
      }
    } else {
      setIsPoolInRange(true);
    }
    setLastRangeCheckTime(simulationSeconds);
  }, [simulationSeconds, poolCenteredness, margin]);

  const handleInitialization = () => {
    setInitialBalanceA(Number(inputBalanceA));
    setInitialBalanceB(Number(inputBalanceB));
    setCurrentBalanceA(Number(inputBalanceA));
    setCurrentBalanceB(Number(inputBalanceB));
    setRealTimeBalanceA(Number(inputBalanceA));
    setRealTimeBalanceB(Number(inputBalanceB));
    setCurrentVirtualBalances({
      virtualBalanceA: Number(inputVirtualBalanceA),
      virtualBalanceB: Number(inputVirtualBalanceB),
    });
    setRealTimeVirtualBalances({
      virtualBalanceA: Number(inputVirtualBalanceA),
      virtualBalanceB: Number(inputVirtualBalanceB),
    });
    setPriceRatio(Number(inputPriceRatio));
    setMargin(Number(inputMargin));
    setMinPrice(Number(inputMinPrice));
    setMaxPrice(Number(inputMaxPrice));
    setTargetPrice(Number(inputTargetPrice));
    initializeInvariants();
    setSimulationSeconds(0);
  };

  const initializeInvariants = () => {
    setInitialInvariant(
      (inputBalanceA + inputVirtualBalanceA) *
        (inputBalanceB + inputVirtualBalanceB)
    );
    setCurrentInvariant(
      (inputBalanceA + inputVirtualBalanceA) *
        (inputBalanceB + inputVirtualBalanceB)
    );
  };

  const handleUpdatePriceRatio = async () => {
    if (inputEndTime < simulationSeconds) {
      setEndTimeError("End time >= Simulation Time");
      return;
    }

    if (inputTargetPrice < 1.1 || inputTargetPrice > 1000) {
      setTargetPriceRatioError(
        "Target price ratio must be between 1.1 and 1000"
      );
      return;
    }

    setEndTimeError("");
    setTargetPriceRatioError("");
    setStartPriceRatio(priceRatio);
    setTargetPriceRatio(inputTargetPrice);
    setStartTime(simulationSeconds);
    setEndTime(inputEndTime);
  };

  const handleSwap = () => {
    handleRealTimeSwap();
    handleCurrentSwap();
  };

  const handleRealTimeSwap = () => {
    const { newBalanceA, newBalanceB } = calculateBalancesAfterSwapIn({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
      swapAmountIn: swapAmountIn,
      swapTokenIn: swapTokenIn,
    });

    setRealTimeBalanceA(newBalanceA);
    setRealTimeBalanceB(newBalanceB);
  };

  const handleCurrentSwap = () => {
    const { newVirtualBalances } = recalculateVirtualBalances({
      balanceA: currentBalanceA,
      balanceB: currentBalanceB,
      oldVirtualBalanceA: currentVirtualBalances.virtualBalanceA,
      oldVirtualBalanceB: currentVirtualBalances.virtualBalanceB,
      currentPriceRatio: priceRatio,
      poolParams: {
        margin: margin,
        priceShiftDailyRate: priceShiftDailyRate,
      },
      updateQ0Params: {
        startTime: startTime,
        endTime: endTime,
        startPriceRatio: startPriceRatio,
        targetPriceRatio: targetPriceRatio,
      },
      simulationParams: {
        simulationSeconds: simulationSeconds,
        simulationSecondsPerBlock: simulationSecondsPerBlock,
        secondsSinceLastInteraction: simulationSeconds - lastSwapTime,
      },
    });
    setLastSwapTime(simulationSeconds);
    setCurrentVirtualBalances(newVirtualBalances);

    const { newBalanceA, newBalanceB } = calculateBalancesAfterSwapIn({
      balanceA: currentBalanceA,
      balanceB: currentBalanceB,
      virtualBalanceA: newVirtualBalances.virtualBalanceA,
      virtualBalanceB: newVirtualBalances.virtualBalanceB,
      swapAmountIn: swapAmountIn,
      swapTokenIn: swapTokenIn,
    });

    setCurrentBalanceA(newBalanceA);
    setCurrentBalanceB(newBalanceB);
    setCurrentInvariant(
      calculateInvariant({
        balanceA: newBalanceA,
        balanceB: newBalanceB,
        virtualBalanceA: newVirtualBalances.virtualBalanceA,
        virtualBalanceB: newVirtualBalances.virtualBalanceB,
      })
    );
  };

  // Add handler for saving simulation config
  const handleSaveSimulationConfig = () => {
    setSimulationSecondsPerBlock(inputSecondsPerBlock);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Create and Initialize</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="subtitle1"
                style={{
                  fontWeight: "bold",
                }}
              >
                Create Parameters
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Minimum Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={inputMinPrice}
                    onChange={(e) => setInputMinPrice(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Maximum Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={inputMaxPrice}
                    onChange={(e) => setInputMaxPrice(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Target Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={inputTargetPrice}
                    onChange={(e) =>
                      setInputTargetPrice(Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Margin (%)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={inputMargin}
                    onChange={(e) => setInputMargin(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Price Shift Daily Rate (%)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={priceShiftDailyRate}
                    onChange={(e) =>
                      setPriceShiftDailyRate(Number(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Typography
                variant="subtitle1"
                style={{
                  marginTop: 8,
                  fontWeight: "bold",
                }}
              >
                Initial Balances
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Initial Balance A"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={inputBalanceA}
                    onChange={(e) => setInputBalanceA(Number(e.target.value))}
                  />
                </Grid>
              </Grid>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Ideal Proportion:</Typography>
                <Typography>
                  {(idealBalanceB / idealBalanceA).toFixed(2)}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Balance B:</Typography>
                <Typography>{inputBalanceB.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Virtual Balance A:</Typography>
                <Typography>{inputVirtualBalanceA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Virtual Balance B:</Typography>
                <Typography>{inputVirtualBalanceB.toFixed(2)}</Typography>
              </div>
              <Button
                variant="contained"
                fullWidth
                onClick={handleInitialization}
                disabled={
                  Math.abs(
                    inputBalanceB /
                      inputBalanceA /
                      (idealBalanceB / idealBalanceA) -
                      1
                  ) >= 0.01
                }
                style={{ marginTop: 16 }}
              >
                Create and Initialize
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Swap Exact In</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                select
                label="Token In"
                fullWidth
                margin="normal"
                value={swapTokenIn}
                onChange={(e) => setSwapTokenIn(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="Token A">Token A</option>
                <option value="Token B">Token B</option>
              </TextField>
              <TextField
                label="Amount In"
                type="number"
                fullWidth
                margin="normal"
                value={swapAmountIn}
                onChange={(e) => setSwapAmountIn(Number(e.target.value))}
              />
              <Typography
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  color: calculatedSwapAmountOut.exceedsBalance
                    ? "red"
                    : "inherit",
                }}
              >
                Amount Out {swapTokenIn === "Token A" ? "B" : "A"}:{" "}
                {calculatedSwapAmountOut.amount > 0
                  ? calculatedSwapAmountOut.amount.toFixed(2)
                  : "0"}
                {calculatedSwapAmountOut.exceedsBalance && (
                  <div style={{ fontSize: "0.8em" }}>
                    Token {swapTokenIn === "Token A" ? "B" : "A"} Amount in the
                    pool must be at least {MIN_SWAP}.
                  </div>
                )}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSwap}
                disabled={calculatedSwapAmountOut.exceedsBalance}
                style={{ marginTop: 16 }}
              >
                Swap
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Update Price Ratio</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Target Price Ratio"
                type="number"
                fullWidth
                margin="normal"
                value={inputTargetPrice}
                onChange={(e) => setInputTargetPrice(Number(e.target.value))}
                error={!!targetPriceRatioError}
                helperText={targetPriceRatioError}
              />
              <Typography>
                Current Time: {simulationSeconds.toFixed(0)}
              </Typography>
              <TextField
                label="End Time (in seconds)"
                type="number"
                fullWidth
                margin="normal"
                value={inputEndTime}
                onChange={(e) => setInputEndTime(Number(e.target.value))}
                error={!!endTimeError}
                helperText={endTimeError}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdatePriceRatio}
                style={{ marginTop: 16 }}
              >
                Update Price Ratio
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Simulation Parameters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Seconds Per Block"
                type="number"
                fullWidth
                margin="normal"
                value={inputSecondsPerBlock}
                onChange={(e) =>
                  setInputSecondsPerBlock(Number(e.target.value))
                }
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSaveSimulationConfig}
                style={{ marginTop: 16 }}
              >
                Save Config
              </Button>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={6}>
          <Paper style={{ padding: 16, textAlign: "center" }}>
            <div style={{ width: "100%", height: 600 }}>
              <ReClammChart
                realTimeBalanceA={realTimeBalanceA}
                realTimeBalanceB={realTimeBalanceB}
                realTimeVirtualBalances={realTimeVirtualBalances}
                realTimeInvariant={realTimeInvariant}
                initialInvariant={initialInvariant}
                margin={margin}
                currentBalanceA={currentBalanceA}
                currentBalanceB={currentBalanceB}
                currentVirtualBalances={currentVirtualBalances}
                currentInvariant={currentInvariant}
              />
            </div>
          </Paper>
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
        </Grid>

        {/* Current Values Column */}
        <Grid item xs={3}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Current Pool State</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Invariant:</Typography>
                <Typography>{currentInvariant.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance A:</Typography>
                <Typography>{currentBalanceA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance B:</Typography>
                <Typography>{currentBalanceB.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Virtual Balance A:</Typography>
                <Typography>
                  {currentVirtualBalances.virtualBalanceA.toFixed(2)}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Virtual Balance B:</Typography>
                <Typography>
                  {currentVirtualBalances.virtualBalanceB.toFixed(2)}
                </Typography>
              </div>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Rate Max/Min:</Typography>
                  <Typography>
                    {(
                      Math.pow(currentInvariant, 2) /
                      (Math.pow(currentVirtualBalances.virtualBalanceA, 2) *
                        Math.pow(currentVirtualBalances.virtualBalanceB, 2))
                    ).toFixed(2)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "red" }}>Min Price A:</Typography>
                  <Typography style={{ color: "red" }}>
                    {(
                      Math.pow(currentVirtualBalances.virtualBalanceB, 2) /
                      currentInvariant
                    ).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "blue" }}>
                    Lower Margin Price A:
                  </Typography>
                  <Typography style={{ color: "blue" }}>
                    {(currentInvariant / Math.pow(higherMargin, 2)).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "green" }}>
                    Current Price A:
                  </Typography>
                  <Typography style={{ color: "green" }}>
                    {(
                      (currentBalanceB +
                        currentVirtualBalances.virtualBalanceB) /
                      (currentBalanceA + currentVirtualBalances.virtualBalanceA)
                    ).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "blue" }}>
                    Upper Margin Price A:
                  </Typography>
                  <Typography style={{ color: "blue" }}>
                    {(currentInvariant / Math.pow(lowerMargin, 2)).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "red" }}>Max Price A:</Typography>
                  <Typography style={{ color: "red" }}>
                    {(
                      currentInvariant /
                      Math.pow(currentVirtualBalances.virtualBalanceA, 2)
                    ).toFixed(4)}
                  </Typography>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Real-Time Pool State</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Invariant:</Typography>
                <Typography>{realTimeInvariant.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance A:</Typography>
                <Typography>{realTimeBalanceA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance B:</Typography>
                <Typography>{realTimeBalanceB.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Virtual Balance A:</Typography>
                <Typography>
                  {realTimeVirtualBalances.virtualBalanceA.toFixed(2)}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Virtual Balance B:</Typography>
                <Typography>
                  {realTimeVirtualBalances.virtualBalanceB.toFixed(2)}
                </Typography>
              </div>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Rate Max/Min:</Typography>
                  <Typography>
                    {(
                      Math.pow(realTimeInvariant, 2) /
                      (Math.pow(realTimeVirtualBalances.virtualBalanceA, 2) *
                        Math.pow(realTimeVirtualBalances.virtualBalanceB, 2))
                    ).toFixed(2)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "red" }}>Min Price A:</Typography>
                  <Typography style={{ color: "red" }}>
                    {(
                      Math.pow(realTimeVirtualBalances.virtualBalanceB, 2) /
                      realTimeInvariant
                    ).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "blue" }}>
                    Lower Margin Price A:
                  </Typography>
                  <Typography style={{ color: "blue" }}>
                    {(realTimeInvariant / Math.pow(higherMargin, 2)).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "green" }}>
                    Current Price A:
                  </Typography>
                  <Typography style={{ color: "green" }}>
                    {(
                      (realTimeBalanceB +
                        realTimeVirtualBalances.virtualBalanceB) /
                      (realTimeBalanceA +
                        realTimeVirtualBalances.virtualBalanceA)
                    ).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "blue" }}>
                    Upper Margin Price A:
                  </Typography>
                  <Typography style={{ color: "blue" }}>
                    {(realTimeInvariant / Math.pow(lowerMargin, 2)).toFixed(4)}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography style={{ color: "red" }}>Max Price A:</Typography>
                  <Typography style={{ color: "red" }}>
                    {(
                      realTimeInvariant /
                      Math.pow(realTimeVirtualBalances.virtualBalanceA, 2)
                    ).toFixed(4)}
                  </Typography>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Price Ratio</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {simulationSeconds < endTime ? (
                <>
                  <Typography style={{ color: "green", fontWeight: "bold" }}>
                    UPDATING RANGE
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: 10,
                    }}
                  >
                    <Typography>Start Price Ratio:</Typography>
                    <Typography>{startPriceRatio.toFixed(2)}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: 10,
                    }}
                  >
                    <Typography>Current Price Ratio:</Typography>
                    <Typography>{priceRatio.toFixed(2)}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: 10,
                    }}
                  >
                    <Typography>Target Price Ratio:</Typography>
                    <Typography>{targetPriceRatio.toFixed(2)}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: 10,
                    }}
                  >
                    <Typography>End Time (s):</Typography>
                    <Typography>{endTime}</Typography>
                  </div>
                </>
              ) : (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Current Price Ratio:</Typography>
                  <Typography>{priceRatio.toFixed(2)}</Typography>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Pool Centeredness:</Typography>
                <Typography>{poolCenteredness.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Status:</Typography>
                <Typography
                  style={{
                    color: poolCenteredness > margin / 100 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {poolCenteredness > margin / 100
                    ? "IN RANGE"
                    : "OUT OF RANGE"}
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Out of Range time:</Typography>
                <Typography>{formatTime(outOfRangeTime)}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Initial Values</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Balance A:</Typography>
                <Typography>{initialBalanceA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Balance B:</Typography>
                <Typography>{initialBalanceB.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Min Price A:</Typography>
                <Typography>{minPrice.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Target Price A:</Typography>
                <Typography>{targetPrice.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Max Price A:</Typography>
                <Typography>{maxPrice.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Price Ratio:</Typography>
                <Typography>{priceRatio.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Margin:</Typography>
                <Typography>{margin.toFixed(2)}%</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
}
