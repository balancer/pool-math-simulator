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
import { AclAmmChart } from "./AclAmmChart";
import {
  calculateLowerMargin,
  calculateOutGivenIn,
  calculatePoolCenteredness,
  calculateUpperMargin,
  calculateInitialVirtualBalances,
  calculateBalancesAfterSwapIn,
  isAboveCenter,
} from "./AclAmmMath";
import { formatTime } from "../../utils/Time";

const defaultInitialBalanceA = 1000;
const defaultInitialBalanceB = 2000;
const defaultPriceRange = 16;
const defaultMargin = 10;
const defaultPriceShiftDailyRate = 100;
const defaultSwapAmountIn = 100;
const timeFix = 12464900; // Using the same constant as the Contract. The full value is 12464935.015039.

const tickMilliseconds = 10;

export default function AclAmm() {
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

  // Pool Variables
  const [priceRange, setPriceRange] = useState<number>(defaultPriceRange);
  const [margin, setMargin] = useState<number>(defaultMargin);
  const [priceShiftDailyRate, setPriceShiftDailyRate] = useState<number>(
    defaultPriceShiftDailyRate
  );

  // Input Variables
  const [inputBalanceA, setInputBalanceA] = useState<number>(
    defaultInitialBalanceA
  );
  const [inputBalanceB, setInputBalanceB] = useState<number>(
    defaultInitialBalanceB
  );
  const [inputPriceRange, setInputPriceRange] =
    useState<number>(defaultPriceRange);
  const [inputMargin, setInputMargin] = useState<number>(defaultMargin);

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

  // Price Range Variables
  const [startPriceRange, setStartPriceRange] =
    useState<number>(defaultPriceRange);
  const [targetPriceRange, setTargetPriceRange] =
    useState<number>(defaultPriceRange);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const [inputTargetPriceRange, setInputTargetPriceRange] =
    useState<number>(defaultPriceRange);
  const [inputEndTime, setInputEndTime] = useState<number>(0);

  // Add new state variables for inputs
  const [inputSecondsPerBlock, setInputSecondsPerBlock] = useState<number>(12);

  // Replace the constants with state variables
  const [simulationSecondsPerBlock, setSimulationSecondsPerBlock] =
    useState<number>(12);

  // Add new state for error message
  const [endTimeError, setEndTimeError] = useState<string>("");

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
      swapTokenIn === "Token A" ? realTimeBalanceB : realTimeBalanceA;
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

  useEffect(() => {
    setTimeout(() => {
      initializeVirtualBalances();
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

    let newPriceRange = priceRange;
    let newVirtualBalances = {
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    };

    const isPoolAboveCenter = isAboveCenter({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });

    const isPriceRangeUpdating =
      simulationSeconds >= startTime &&
      (simulationSeconds <= endTime ||
        simulationSeconds - simulationSecondsPerBlock <= endTime);

    // Price range update logic
    if (isPriceRangeUpdating) {
      // Q0 is updating.
      newPriceRange =
        startPriceRange *
        Math.pow(
          targetPriceRange / startPriceRange,
          Math.min(endTime - startTime, simulationSeconds - startTime) /
            (endTime - startTime)
        );

      const centerednessFix = isPoolAboveCenter
        ? 1 / poolCenteredness
        : poolCenteredness;

      const newVirtualBalanceA = Math.sqrt(
        (realTimeBalanceA * realTimeInvariant) /
          (Math.sqrt(newPriceRange) * realTimeBalanceB * centerednessFix)
      );
      const newVirtualBalanceB =
        (realTimeBalanceB * newVirtualBalanceA * centerednessFix) /
        realTimeBalanceA;

      newVirtualBalances = {
        virtualBalanceA: newVirtualBalanceA,
        virtualBalanceB: newVirtualBalanceB,
      };

      setPriceRange(newPriceRange);
    }

    if (poolCenteredness <= margin / 100) {
      const tau = priceShiftDailyRate / timeFix;

      if (isPoolAboveCenter) {
        const newVirtualBalanceB =
          newVirtualBalances.virtualBalanceB *
          Math.pow(1 - tau, simulationSecondsPerBlock);
        const newVirtualBalanceA =
          (realTimeBalanceA * (newVirtualBalanceB + realTimeBalanceB)) /
          (newVirtualBalanceB * (Math.sqrt(newPriceRange) - 1) -
            realTimeBalanceB);

        newVirtualBalances = {
          virtualBalanceA: newVirtualBalanceA,
          virtualBalanceB: newVirtualBalanceB,
        };
      } else {
        const newVirtualBalanceA =
          newVirtualBalances.virtualBalanceA *
          Math.pow(1 - tau, simulationSecondsPerBlock);
        const newVirtualBalanceB =
          (realTimeBalanceB * (newVirtualBalanceA + realTimeBalanceA)) /
          (newVirtualBalanceA * (Math.sqrt(newPriceRange) - 1) -
            realTimeBalanceA);

        newVirtualBalances = {
          virtualBalanceA: newVirtualBalanceA,
          virtualBalanceB: newVirtualBalanceB,
        };
      }
    }
    setRealTimeVirtualBalances(newVirtualBalances);
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

  const handleUpdate = () => {
    setInitialBalanceA(Number(inputBalanceA));
    setInitialBalanceB(Number(inputBalanceB));
    setRealTimeBalanceA(Number(inputBalanceA));
    setRealTimeBalanceB(Number(inputBalanceB));
    setPriceRange(Number(inputPriceRange));
    setMargin(Number(inputMargin));
    initializeVirtualBalances();
  };

  const initializeVirtualBalances = () => {
    const initialVirtualBalances = calculateInitialVirtualBalances({
      priceRange: inputPriceRange,
      balanceA: inputBalanceA,
      balanceB: inputBalanceB,
    });
    setRealTimeVirtualBalances(initialVirtualBalances);
    setInitialInvariant(
      (inputBalanceA + initialVirtualBalances.virtualBalanceA) *
        (inputBalanceB + initialVirtualBalances.virtualBalanceB)
    );
  };

  const handleUpdatePriceRange = async () => {
    if (inputEndTime < simulationSeconds) {
      setEndTimeError("End time >= Simulation Time");
      return;
    }

    setEndTimeError("");
    setStartPriceRange(priceRange);
    setTargetPriceRange(inputTargetPriceRange);
    setStartTime(simulationSeconds);
    setEndTime(inputEndTime);
  };

  const handleSwap = () => {
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
              <Typography variant="h6">Initialize Pool</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Real Initial Balance A"
                type="number"
                fullWidth
                margin="normal"
                value={inputBalanceA}
                onChange={(e) => setInputBalanceA(Number(e.target.value))}
              />
              <TextField
                label="Real Initial Balance B"
                type="number"
                fullWidth
                margin="normal"
                value={inputBalanceB}
                onChange={(e) => setInputBalanceB(Number(e.target.value))}
              />
              <TextField
                label="Price Range"
                type="number"
                fullWidth
                margin="normal"
                value={inputPriceRange}
                onChange={(e) => setInputPriceRange(Number(e.target.value))}
              />
              <TextField
                label="Margin (%)"
                type="number"
                fullWidth
                margin="normal"
                value={inputMargin}
                onChange={(e) => setInputMargin(Number(e.target.value))}
              />
              <TextField
                label="Price Shift Daily Rate (%)"
                type="number"
                fullWidth
                margin="normal"
                value={priceShiftDailyRate}
                onChange={(e) => setPriceShiftDailyRate(Number(e.target.value))}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdate}
                style={{ marginTop: 16 }}
              >
                Initialize Pool
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
                    Token {swapTokenIn === "Token A" ? "B" : "A"} Out Amount
                    must be smaller than balance
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
              <Typography variant="h6">Update Price Range</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Target Price Range"
                type="number"
                fullWidth
                margin="normal"
                value={inputTargetPriceRange}
                onChange={(e) =>
                  setInputTargetPriceRange(Number(e.target.value))
                }
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
                onClick={handleUpdatePriceRange}
                style={{ marginTop: 16 }}
              >
                Update Price Range
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
              <AclAmmChart
                realTimeBalanceA={realTimeBalanceA}
                realTimeBalanceB={realTimeBalanceB}
                realTimeVirtualBalances={realTimeVirtualBalances}
                realTimeInvariant={realTimeInvariant}
                initialInvariant={initialInvariant}
                margin={margin}
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
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Initial Values</Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Initial Balance A:</Typography>
              <Typography>{initialBalanceA.toFixed(2)}</Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Initial Balance B:</Typography>
              <Typography>{initialBalanceB.toFixed(2)}</Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Price Range:</Typography>
              <Typography>{priceRange.toFixed(2)}</Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Margin:</Typography>
              <Typography>{margin.toFixed(2)}%</Typography>
            </div>

            <Typography variant="h6" style={{ marginTop: 16 }}>
              Token Price
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Rate Max/Min:</Typography>
              <Typography>
                {(
                  Math.pow(realTimeInvariant, 2) /
                  (Math.pow(realTimeVirtualBalances.virtualBalanceA, 2) *
                    Math.pow(realTimeVirtualBalances.virtualBalanceB, 2))
                ).toFixed(2)}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "red" }}>Min Price A:</Typography>
              <Typography style={{ color: "red" }}>
                {(
                  Math.pow(realTimeVirtualBalances.virtualBalanceB, 2) /
                  realTimeInvariant
                ).toFixed(4)}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "blue" }}>
                Lower Margin Price A:
              </Typography>
              <Typography style={{ color: "blue" }}>
                {(realTimeInvariant / Math.pow(higherMargin, 2)).toFixed(4)}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "green" }}>
                Current Price A:
              </Typography>
              <Typography style={{ color: "green" }}>
                {(
                  (realTimeBalanceB + realTimeVirtualBalances.virtualBalanceB) /
                  (realTimeBalanceA + realTimeVirtualBalances.virtualBalanceA)
                ).toFixed(4)}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "blue" }}>
                Upper Margin Price A:
              </Typography>
              <Typography style={{ color: "blue" }}>
                {(realTimeInvariant / Math.pow(lowerMargin, 2)).toFixed(4)}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ color: "red" }}>Max Price A:</Typography>
              <Typography style={{ color: "red" }}>
                {(
                  realTimeInvariant /
                  Math.pow(realTimeVirtualBalances.virtualBalanceA, 2)
                ).toFixed(4)}
              </Typography>
            </div>

            <Typography variant="h6" style={{ marginTop: 16 }}>
              Price Range
            </Typography>
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
                  <Typography>Start Price Range:</Typography>
                  <Typography>{startPriceRange.toFixed(2)}</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginLeft: 10,
                  }}
                >
                  <Typography>Current Price Range:</Typography>
                  <Typography>{priceRange.toFixed(2)}</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginLeft: 10,
                  }}
                >
                  <Typography>Target Price Range:</Typography>
                  <Typography>{targetPriceRange.toFixed(2)}</Typography>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Price Range:</Typography>
                <Typography>{priceRange.toFixed(2)}</Typography>
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
                {poolCenteredness > margin / 100 ? "IN RANGE" : "OUT OF RANGE"}
              </Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Out of Range time:</Typography>
              <Typography>{formatTime(outOfRangeTime)}</Typography>
            </div>

            <Typography variant="h6" style={{ marginTop: 16 }}>
              Balances
            </Typography>
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
