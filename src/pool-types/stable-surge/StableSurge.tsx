import React, { useState, useMemo } from "react";
import {
  Grid,
  Paper,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { stableInvariant } from "../stable-pool/StableMath";
import { StableSurgeChart } from "./StableSurgeChart";
import { getTokenBalanceGivenInvariantAndAllOtherBalances } from "../stable-pool/StableMath";
import { calculateImbalance, getSurgeFeePercentage } from "./StableSurgeHook";
export default function StableSurge() {
  const [inputBalances, setInputBalances] = useState<number[]>([1000, 1000]);
  const [initialBalances, setInitialBalances] = useState<number[]>([
    1000, 1000,
  ]);
  const [currentBalances, setCurrentBalances] = useState<number[]>([
    1000, 1000,
  ]);
  const [totalFees, setTotalFees] = useState<number[]>([0, 0]);
  const [tokenNames, setTokenNames] = useState<string[]>(["A", "B", "C", "D"]);

  const [inputTokenCount, setInputTokenCount] = useState<number>(2);
  const [tokenCount, setTokenCount] = useState<number>(2);
  const [inputAmplification, setInputAmplification] = useState<number>(100);
  const [inputSwapFee, setInputSwapFee] = useState<number>(1);
  const [inputMaxSurgeFee, setInputMaxSurgeFee] = useState<number>(10);
  const [inputSurgeThreshold, setInputSurgeThreshold] = useState<number>(20);

  const [amplification, setAmplification] = useState<number>(100);
  const [swapFee, setSwapFee] = useState<number>(1);
  const [maxSurgeFee, setMaxSurgeFee] = useState<number>(10);
  const [surgeThreshold, setSurgeThreshold] = useState<number>(20);

  const [swapTokenInIndex, setSwapTokenInIndex] = useState(0);
  const [swapTokenOutIndex, setSwapTokenOutIndex] = useState(1);
  const [swapAmountIn, setSwapAmountIn] = useState<number>(0);

  const currentInvariant = useMemo(() => {
    return stableInvariant(amplification, currentBalances);
  }, [amplification, currentBalances]);

  const curvePoints = useMemo(() => {
    const lastBalanceOut = currentBalances[swapTokenOutIndex] / 100;
    let lastBalanceIn = currentBalances[swapTokenInIndex];

    for (let i = 0; i < 1000; i++) {
      const currentIn = (i * currentBalances[swapTokenOutIndex]) / 10;
      const balances = [currentIn, currentBalances[swapTokenOutIndex]];
      const currentOut = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );
      if (currentOut < lastBalanceOut) {
        lastBalanceIn = currentIn;
        break;
      }
    }

    const step = lastBalanceIn / 1000;

    return Array.from({ length: 1000 }, (_, i) => {
      const x = (i + 1) * step;
      const balances = [x, currentBalances[swapTokenOutIndex]];
      const y = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );

      return { x, y };
    });
  }, [currentBalances, amplification, currentInvariant]);

  const curvePointsWithFees = useMemo(() => {
    const lastBalanceOut = currentBalances[swapTokenOutIndex] / 100;
    let lastBalanceIn = currentBalances[swapTokenInIndex];

    for (let i = 0; i < 1000; i++) {
      const currentIn = (i * currentBalances[swapTokenOutIndex]) / 10;
      const balances = [currentIn, currentBalances[swapTokenOutIndex]];
      const currentOut = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );
      if (currentOut < lastBalanceOut) {
        lastBalanceIn = currentIn;
        break;
      }
    }

    const step = lastBalanceIn / 10000;

    return Array.from({ length: 10000 }, (_, i) => {
      let x = (i + 1) * step;
      const balances = [x, currentBalances[swapTokenOutIndex]];
      let y = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );
      const surgeFeePercentage = getSurgeFeePercentage(
        maxSurgeFee,
        surgeThreshold,
        swapFee,
        [x, y],
        currentBalances
      );
      if (x < currentBalances[swapTokenInIndex]) {
        // fee on B
        const swapAmountIn = y - currentBalances[swapTokenOutIndex];
        const fee = (swapAmountIn * surgeFeePercentage) / 100;
        y = y + fee; // Give fees back to the pool.
      } else {
        // fee on A
        const swapAmountIn = x - currentBalances[swapTokenInIndex];
        const fee = (swapAmountIn * surgeFeePercentage) / 100;
        x = x + fee; // Give fees back to the pool.
      }

      return { x, y };
    });
  }, [
    currentBalances,
    amplification,
    currentInvariant,
    maxSurgeFee,
    surgeThreshold,
  ]);

  const initialCurvePoints = useMemo(() => {
    const initialInvariant = stableInvariant(amplification, initialBalances);

    const lastBalanceOut = initialBalances[swapTokenOutIndex] / 100;
    let lastBalanceIn = initialBalances[swapTokenInIndex];

    for (let i = 0; i < 1000; i++) {
      const currentIn = (i * initialBalances[swapTokenOutIndex]) / 10;
      const balances = [...initialBalances];
      balances[swapTokenInIndex] = currentIn;
      const currentOut = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        initialInvariant,
        1
      );
      if (currentOut < lastBalanceOut) {
        lastBalanceIn = currentIn;
        break;
      }
    }

    const step = lastBalanceIn / 1000;

    return Array.from({ length: 1000 }, (_, i) => {
      const x = (i + 1) * step;
      const balances = [...initialBalances];
      balances[swapTokenInIndex] = x;
      const y = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        initialInvariant,
        1
      );

      return { x, y };
    });
  }, [initialBalances, amplification]);

  const swapPreview = useMemo(() => {
    if (!swapAmountIn) return { amountOut: 0, fee: 0, feePercentage: 0 };

    // Calculate surge fee
    const newBalances = [...currentBalances];
    newBalances[swapTokenInIndex] += swapAmountIn;
    newBalances[swapTokenOutIndex] =
      getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        newBalances,
        currentInvariant,
        swapTokenOutIndex
      );

    const surgeFee = getSurgeFeePercentage(
      maxSurgeFee,
      surgeThreshold,
      swapFee,
      newBalances,
      currentBalances
    );

    const fees = (swapAmountIn * surgeFee) / 100;

    const balances = [...currentBalances];
    balances[swapTokenInIndex] += swapAmountIn - fees;
    const newBalanceOut = getTokenBalanceGivenInvariantAndAllOtherBalances(
      amplification,
      balances,
      currentInvariant,
      swapTokenOutIndex
    );
    return {
      amountOut: currentBalances[swapTokenOutIndex] - newBalanceOut,
      fee: fees,
      feePercentage: surgeFee,
    };
  }, [
    swapAmountIn,
    swapTokenInIndex,
    swapTokenOutIndex,
    currentBalances[swapTokenInIndex],
    currentBalances[swapTokenOutIndex],
    currentInvariant,
    maxSurgeFee,
    surgeThreshold,
    swapFee,
    amplification,
  ]);

  const [lowerImbalanceThreshold, upperImbalanceThreshold] = useMemo(() => {
    let lowerBalanceInImbalance = 0;
    let upperBalanceInImbalance = 0;
    let lowerImbalanceThreshold = { x: 0, y: 0 };
    let upperImbalanceThreshold = { x: 0, y: 0 };
    for (let i = 1; i <= 10000; i++) {
      const balances = [...initialBalances];
      balances[swapTokenInIndex] =
        (i *
          (initialBalances[swapTokenInIndex] +
            initialBalances[swapTokenOutIndex])) /
        2 /
        100;
      balances[swapTokenOutIndex] =
        getTokenBalanceGivenInvariantAndAllOtherBalances(
          amplification,
          balances,
          currentInvariant,
          swapTokenOutIndex
        );

      const imbalance = calculateImbalance(balances);
      if (imbalance < surgeThreshold && lowerBalanceInImbalance === 0) {
        lowerBalanceInImbalance = balances[swapTokenInIndex];
        lowerImbalanceThreshold = {
          x: balances[swapTokenInIndex],
          y: balances[swapTokenOutIndex],
        };
      }
      if (
        imbalance > surgeThreshold &&
        upperBalanceInImbalance === 0 &&
        lowerBalanceInImbalance !== 0
      ) {
        upperBalanceInImbalance = balances[swapTokenInIndex];
        upperImbalanceThreshold = {
          x: balances[swapTokenInIndex],
          y: balances[swapTokenOutIndex],
        };
        break;
      }
    }
    return [lowerImbalanceThreshold, upperImbalanceThreshold];
  }, [currentInvariant, surgeThreshold]);

  const previewPoint = useMemo(() => {
    if (!swapPreview.amountOut) return undefined;

    return {
      x: currentBalances[swapTokenInIndex] + swapAmountIn,
      y: currentBalances[swapTokenOutIndex] - swapPreview.amountOut,
    };
  }, [swapPreview, swapAmountIn, swapTokenInIndex, currentBalances]);

  const handleUpdate = () => {
    setTokenCount(inputTokenCount);
    setInitialBalances(inputBalances.slice(0, inputTokenCount));
    setCurrentBalances(inputBalances.slice(0, inputTokenCount));
    setTotalFees(Array(inputTokenCount).fill(0));
    setAmplification(inputAmplification);
    setSwapFee(inputSwapFee);
    setMaxSurgeFee(inputMaxSurgeFee);
    setSurgeThreshold(inputSurgeThreshold);
  };

  const handleSwap = () => {
    const amountIn = Number(swapAmountIn);

    // Calculate surge fee
    const newBalances = [...currentBalances];
    newBalances[swapTokenInIndex] += swapAmountIn;
    newBalances[swapTokenOutIndex] =
      getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        newBalances,
        currentInvariant,
        swapTokenOutIndex
      );

    const surgeFee = getSurgeFeePercentage(
      maxSurgeFee,
      surgeThreshold,
      swapFee,
      newBalances,
      currentBalances
    );

    const fees = (amountIn * surgeFee) / 100;

    currentBalances[swapTokenInIndex] += amountIn - fees;
    currentBalances[swapTokenOutIndex] =
      getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        currentBalances,
        currentInvariant,
        swapTokenOutIndex
      );
    setCurrentBalances(currentBalances);
    setTotalFees((prevFees) => {
      const newFees = [...prevFees];
      newFees[swapTokenInIndex] += fees;
      return newFees;
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {/* Left Column - Controls */}
        <Grid item xs={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Initialize Pool</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                select
                label="Number of Tokens"
                fullWidth
                margin="normal"
                value={inputTokenCount}
                onChange={(e) => setInputTokenCount(Number(e.target.value))}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={2}>2 Tokens</option>
                <option value={3}>3 Tokens</option>
                <option value={4}>4 Tokens</option>
              </TextField>
              <TextField
                label={`Initial Balance ${tokenNames[0]}`}
                type="number"
                fullWidth
                margin="normal"
                value={inputBalances[0]}
                onChange={(e) =>
                  setInputBalances((prev) => {
                    const result = [...prev];
                    result[0] = Number(e.target.value);
                    return result;
                  })
                }
              />
              <TextField
                label={`Initial Balance ${tokenNames[1]}`}
                type="number"
                fullWidth
                margin="normal"
                value={inputBalances[1]}
                onChange={(e) =>
                  setInputBalances((prev) => {
                    const result = [...prev];
                    result[1] = Number(e.target.value);
                    return result;
                  })
                }
              />
              {inputTokenCount >= 3 && (
                <TextField
                  label={`Initial Balance ${tokenNames[2]}`}
                  type="number"
                  fullWidth
                  margin="normal"
                  value={inputBalances[2]}
                  onChange={(e) =>
                    setInputBalances((prev) => {
                      const result = [...prev];
                      result[2] = Number(e.target.value);
                      return result;
                    })
                  }
                />
              )}
              {inputTokenCount >= 4 && (
                <TextField
                  label={`Initial Balance ${tokenNames[3]}`}
                  type="number"
                  fullWidth
                  margin="normal"
                  value={inputBalances[3]}
                  onChange={(e) =>
                    setInputBalances((prev) => {
                      const result = [...prev];
                      result[3] = Number(e.target.value);
                      return result;
                    })
                  }
                />
              )}
              <TextField
                label="Amplification Parameter"
                type="number"
                fullWidth
                margin="normal"
                value={inputAmplification}
                onChange={(e) => setInputAmplification(Number(e.target.value))}
              />
              <TextField
                label="Static Swap Fee (%)"
                type="number"
                fullWidth
                margin="normal"
                value={inputSwapFee}
                onChange={(e) => setInputSwapFee(Number(e.target.value))}
                inputProps={{ step: "0.1", min: "0", max: "100" }}
              />
              <TextField
                label="Max Surge Fee (%)"
                type="number"
                fullWidth
                margin="normal"
                value={inputMaxSurgeFee}
                onChange={(e) => setInputMaxSurgeFee(Number(e.target.value))}
                inputProps={{ step: "0.1", min: "0", max: "100" }}
              />
              <TextField
                label="Surge Threshold (%)"
                type="number"
                fullWidth
                margin="normal"
                value={inputSurgeThreshold}
                onChange={(e) => setInputSurgeThreshold(Number(e.target.value))}
                inputProps={{ step: "0.1", min: "0", max: "100" }}
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
                value={swapTokenInIndex}
                onChange={(e) => setSwapTokenInIndex(Number(e.target.value))}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={0}>{tokenNames[0]}</option>
                <option value={1}>{tokenNames[1]}</option>
                {tokenCount >= 3 && <option value={2}>{tokenNames[2]}</option>}
                {tokenCount >= 4 && <option value={3}>{tokenNames[3]}</option>}
              </TextField>
              <TextField
                select
                label="Token Out"
                fullWidth
                margin="normal"
                value={swapTokenOutIndex}
                onChange={(e) => setSwapTokenOutIndex(Number(e.target.value))}
                SelectProps={{
                  native: true,
                }}
              >
                <option value={0} disabled={swapTokenInIndex === 0}>
                  {tokenNames[0]}
                </option>
                <option value={1} disabled={swapTokenInIndex === 1}>
                  {tokenNames[1]}
                </option>
                {tokenCount >= 3 && (
                  <option value={2} disabled={swapTokenInIndex === 2}>
                    {tokenNames[2]}
                  </option>
                )}
                {tokenCount >= 4 && (
                  <option value={3} disabled={swapTokenInIndex === 3}>
                    {tokenNames[3]}
                  </option>
                )}
              </TextField>
              <TextField
                label="Amount In"
                type="number"
                fullWidth
                margin="normal"
                value={swapAmountIn}
                onChange={(e) => setSwapAmountIn(Number(e.target.value))}
              />
              <Typography style={{ marginTop: 8, marginBottom: 8 }}>
                Amount Out {tokenNames[swapTokenOutIndex]}:{" "}
                {swapPreview.amountOut > 0
                  ? swapPreview.amountOut.toFixed(2)
                  : "0"}
              </Typography>
              <Typography style={{ marginBottom: 8 }}>
                Surge Fee (%): {swapPreview.feePercentage.toFixed(2)}
              </Typography>
              <Typography style={{ marginBottom: 8 }}>
                Fee: {swapPreview.fee > 0 ? swapPreview.fee.toFixed(2) : "0"}{" "}
                {tokenNames[swapTokenInIndex]}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSwap}
                style={{ marginTop: 16 }}
              >
                Swap
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Config</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Token A Name"
                fullWidth
                margin="normal"
                value={tokenNames[0]}
                onChange={(e) =>
                  setTokenNames((prev) => {
                    const result = [...prev];
                    result[0] = e.target.value;
                    return result;
                  })
                }
              />
              <TextField
                label="Token B Name"
                fullWidth
                margin="normal"
                value={tokenNames[1]}
                onChange={(e) =>
                  setTokenNames((prev) => {
                    const result = [...prev];
                    result[1] = e.target.value;
                    return result;
                  })
                }
              />
              {tokenCount >= 3 && (
                <TextField
                  label="Token C Name"
                  fullWidth
                  margin="normal"
                  value={tokenNames[2]}
                  onChange={(e) =>
                    setTokenNames((prev) => {
                      const result = [...prev];
                      result[2] = e.target.value;
                      return result;
                    })
                  }
                />
              )}
              {tokenCount >= 4 && (
                <TextField
                  label="Token D Name"
                  fullWidth
                  margin="normal"
                  value={tokenNames[3]}
                  onChange={(e) =>
                    setTokenNames((prev) => {
                      const result = [...prev];
                      result[3] = e.target.value;
                      return result;
                    })
                  }
                />
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Middle Column - Chart */}
        <Grid item xs={6}>
          <Paper style={{ padding: 16, textAlign: "center" }}>
            <div style={{ width: "100%", height: 600 }}>
              <StableSurgeChart
                curvePoints={curvePoints}
                curvePointsWithFees={curvePointsWithFees}
                currentPoint={{
                  x: currentBalances[swapTokenInIndex],
                  y: currentBalances[swapTokenOutIndex],
                }}
                initialCurvePoints={initialCurvePoints}
                previewPoint={previewPoint}
                lowerImbalanceThreshold={lowerImbalanceThreshold}
                upperImbalanceThreshold={upperImbalanceThreshold}
                tokenInName={tokenNames[swapTokenInIndex]}
                tokenOutName={tokenNames[swapTokenOutIndex]}
              />
            </div>
          </Paper>
        </Grid>

        {/* Right Column - Current Values */}
        <Grid item xs={3}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Current Values</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance {tokenNames[0]}:</Typography>
                <Typography>{currentBalances[0].toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance {tokenNames[1]}:</Typography>
                <Typography>{currentBalances[1].toFixed(2)}</Typography>
              </div>
              {tokenCount >= 3 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Current Balance {tokenNames[2]}:</Typography>
                  <Typography>{currentBalances[2].toFixed(2)}</Typography>
                </div>
              )}
              {tokenCount >= 4 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Current Balance {tokenNames[3]}:</Typography>
                  <Typography>{currentBalances[3].toFixed(2)}</Typography>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Invariant:</Typography>
                <Typography>{currentInvariant.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Imbalance (%):</Typography>
                <Typography>
                  {calculateImbalance(currentBalances).toFixed(2)}
                </Typography>
              </div>
              {previewPoint && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Post-Swap Imbalance (%):</Typography>
                  <Typography>
                    {calculateImbalance([
                      previewPoint.x,
                      previewPoint.y,
                    ]).toFixed(2)}
                  </Typography>
                </div>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Pool Parameters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Amplification Factor:</Typography>
                <Typography>{amplification.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Static Swap Fee (%):</Typography>
                <Typography>{swapFee.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Surge Threshold (%):</Typography>
                <Typography>{surgeThreshold.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Max Surge Fee (%):</Typography>
                <Typography>{maxSurgeFee.toFixed(2)}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Initial Values</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Balance {tokenNames[0]}:</Typography>
                <Typography>{initialBalances[0].toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Balance {tokenNames[1]}:</Typography>
                <Typography>{initialBalances[1].toFixed(2)}</Typography>
              </div>
              {tokenCount >= 3 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Initial Balance {tokenNames[2]}:</Typography>
                  <Typography>{initialBalances[2].toFixed(2)}</Typography>
                </div>
              )}
              {tokenCount >= 4 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Initial Balance {tokenNames[3]}:</Typography>
                  <Typography>{initialBalances[3].toFixed(2)}</Typography>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Invariant:</Typography>
                <Typography>
                  {stableInvariant(amplification, initialBalances).toFixed(2)}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Collected Fees</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>{tokenNames[0]}:</Typography>
                <Typography>{totalFees[0].toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>{tokenNames[1]}:</Typography>
                <Typography>{totalFees[1].toFixed(2)}</Typography>
              </div>
              {tokenCount >= 3 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>{tokenNames[2]}:</Typography>
                  <Typography>{totalFees[2].toFixed(2)}</Typography>
                </div>
              )}
              {tokenCount >= 4 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>{tokenNames[3]}:</Typography>
                  <Typography>{totalFees[3].toFixed(2)}</Typography>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
}
