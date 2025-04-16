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
import * as d3 from "d3";
import { getTokenBalanceGivenInvariantAndAllOtherBalances } from "../stable-pool/StableMath";
import { calculateImbalance, getSurgeFeePercentage } from "./StableSurgeHook";
export default function StableSurge() {
  const [inputBalanceA, setInputBalanceA] = useState<number>(1000);
  const [inputBalanceB, setInputBalanceB] = useState<number>(1000);
  const [inputAmplification, setInputAmplification] = useState<number>(100);
  const [inputSwapFee, setInputSwapFee] = useState<number>(1);
  const [inputMaxSurgeFee, setInputMaxSurgeFee] = useState<number>(10);
  const [inputSurgeThreshold, setInputSurgeThreshold] = useState<number>(20);

  const [initialBalanceA, setInitialBalanceA] = useState<number>(1000);
  const [initialBalanceB, setInitialBalanceB] = useState<number>(1000);
  const [amplification, setAmplification] = useState<number>(100);
  const [swapFee, setSwapFee] = useState<number>(1);
  const [maxSurgeFee, setMaxSurgeFee] = useState<number>(10);
  const [surgeThreshold, setSurgeThreshold] = useState<number>(20);
  const [currentBalanceA, setCurrentBalanceA] = useState<number>(1000);
  const [currentBalanceB, setCurrentBalanceB] = useState<number>(1000);

  const [swapTokenIn, setSwapTokenIn] = useState("Token A");
  const [swapAmountIn, setSwapAmountIn] = useState<number>(0);
  const [totalFeesTokenA, setTotalFeesTokenA] = useState<number>(0);
  const [totalFeesTokenB, setTotalFeesTokenB] = useState<number>(0);

  const currentInvariant = useMemo(() => {
    return stableInvariant(amplification, [currentBalanceA, currentBalanceB]);
  }, [amplification, currentBalanceA, currentBalanceB]);

  const curvePoints = useMemo(() => {
    const lastBalanceB = currentBalanceB / 100;
    let lastBalanceA = currentBalanceA;

    for (let i = 0; i < 1000; i++) {
      const currentA = (i * currentBalanceB) / 10;
      const balances = [currentA, currentBalanceB];
      const currentB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );
      if (currentB < lastBalanceB) {
        lastBalanceA = currentA;
        break;
      }
    }

    const step = lastBalanceA / 1000;

    return Array.from({ length: 1000 }, (_, i) => {
      const x = (i + 1) * step;
      const balances = [x, currentBalanceB];
      const y = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );

      return { x, y };
    });
  }, [currentBalanceA, currentBalanceB, amplification, currentInvariant]);

  const curvePointsWithFees = useMemo(() => {
    const lastBalanceB = currentBalanceB / 100;
    let lastBalanceA = currentBalanceA;

    for (let i = 0; i < 1000; i++) {
      const currentA = (i * currentBalanceB) / 10;
      const balances = [currentA, currentBalanceB];
      const currentB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        currentInvariant,
        1
      );
      if (currentB < lastBalanceB) {
        lastBalanceA = currentA;
        break;
      }
    }

    const step = lastBalanceA / 10000;

    return Array.from({ length: 10000 }, (_, i) => {
      let x = (i + 1) * step;
      const balances = [x, currentBalanceB];
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
        [currentBalanceA, currentBalanceB]
      );
      if (x < currentBalanceA) {
        // fee on B
        const swapAmountIn = y - currentBalanceB;
        const fee = (swapAmountIn * surgeFeePercentage) / 100;
        y = y + fee; // Give fees back to the pool.
      } else {
        // fee on A
        const swapAmountIn = x - currentBalanceA;
        const fee = (swapAmountIn * surgeFeePercentage) / 100;
        x = x + fee; // Give fees back to the pool.
      }

      return { x, y };
    });
  }, [
    currentBalanceA,
    currentBalanceB,
    amplification,
    currentInvariant,
    maxSurgeFee,
    surgeThreshold,
  ]);

  const initialCurvePoints = useMemo(() => {
    const initialInvariant = stableInvariant(amplification, [
      initialBalanceA,
      initialBalanceB,
    ]);

    const lastBalanceB = initialBalanceB / 100;
    let lastBalanceA = initialBalanceA;

    for (let i = 0; i < 1000; i++) {
      const currentA = (i * initialBalanceB) / 10;
      const balances = [currentA, initialBalanceB];
      const currentB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        initialInvariant,
        1
      );
      if (currentB < lastBalanceB) {
        lastBalanceA = currentA;
        break;
      }
    }

    const step = lastBalanceA / 1000;

    return Array.from({ length: 1000 }, (_, i) => {
      const x = (i + 1) * step;
      const balances = [x, initialBalanceB];
      const y = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        balances,
        initialInvariant,
        1
      );

      return { x, y };
    });
  }, [initialBalanceA, initialBalanceB, amplification]);

  const swapPreview = useMemo(() => {
    if (!swapAmountIn) return { amountOut: 0, fee: 0, feePercentage: 0 };

    // Calculate surge fee
    const newBalances = [...[currentBalanceA, currentBalanceB]];
    const currentBalances = [currentBalanceA, currentBalanceB];
    const tokenIndexIn = swapTokenIn === "Token A" ? 0 : 1;
    const tokenIndexOut = swapTokenIn === "Token A" ? 1 : 0;
    newBalances[tokenIndexIn] += swapAmountIn;
    newBalances[tokenIndexOut] =
      getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        newBalances,
        currentInvariant,
        tokenIndexOut
      );

    const surgeFee = getSurgeFeePercentage(
      maxSurgeFee,
      surgeThreshold,
      swapFee,
      newBalances,
      currentBalances
    );

    const fees = (swapAmountIn * surgeFee) / 100;

    if (swapTokenIn === "Token A") {
      // Swapping Token A for Token B
      const newBalanceA = currentBalanceA + swapAmountIn - fees;
      const newBalanceB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [newBalanceA, currentBalanceB],
        currentInvariant,
        1
      );
      return {
        amountOut: currentBalanceB - newBalanceB,
        fee: fees,
        feePercentage: surgeFee,
      };
    } else {
      // Swapping Token B for Token A
      const newBalanceB = currentBalanceB + swapAmountIn - fees;
      const newBalanceA = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [currentBalanceA, newBalanceB],
        currentInvariant,
        0
      );
      return {
        amountOut: currentBalanceA - newBalanceA,
        fee: fees,
        feePercentage: surgeFee,
      };
    }
  }, [
    swapAmountIn,
    swapTokenIn,
    currentBalanceA,
    currentBalanceB,
    currentInvariant,
    maxSurgeFee,
    surgeThreshold,
    swapFee,
    amplification,
  ]);

  const [lowerImbalanceThreshold, upperImbalanceThreshold] = useMemo(() => {
    let lowerBalanceAImbalance = 0;
    let upperBalanceAImbalance = 0;
    let lowerImbalanceThreshold = { x: 0, y: 0 };
    let upperImbalanceThreshold = { x: 0, y: 0 };
    for (let i = 1; i <= 10000; i++) {
      const balanceA = (i * (initialBalanceA + initialBalanceB)) / 2 / 100;
      const balanceB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [balanceA, initialBalanceB],
        currentInvariant,
        1
      );

      const imbalance = calculateImbalance([balanceA, balanceB]);
      if (imbalance < surgeThreshold && lowerBalanceAImbalance === 0) {
        lowerBalanceAImbalance = balanceA;
        lowerImbalanceThreshold = { x: balanceA, y: balanceB };
      }
      if (
        imbalance > surgeThreshold &&
        upperBalanceAImbalance === 0 &&
        lowerBalanceAImbalance !== 0
      ) {
        upperBalanceAImbalance = balanceA;
        upperImbalanceThreshold = { x: balanceA, y: balanceB };
        break;
      }
    }
    return [lowerImbalanceThreshold, upperImbalanceThreshold];
  }, [currentInvariant, surgeThreshold]);

  const previewPoint = useMemo(() => {
    if (!swapPreview.amountOut) return undefined;

    if (swapTokenIn === "Token A") {
      return {
        x: currentBalanceA + swapAmountIn,
        y: currentBalanceB - swapPreview.amountOut,
      };
    } else {
      return {
        x: currentBalanceA - swapPreview.amountOut,
        y: currentBalanceB + swapAmountIn,
      };
    }
  }, [
    swapPreview,
    swapAmountIn,
    swapTokenIn,
    currentBalanceA,
    currentBalanceB,
  ]);

  const handleUpdate = () => {
    setInitialBalanceA(inputBalanceA);
    setInitialBalanceB(inputBalanceB);
    setAmplification(inputAmplification);
    setSwapFee(inputSwapFee);
    setMaxSurgeFee(inputMaxSurgeFee);
    setSurgeThreshold(inputSurgeThreshold);
    setCurrentBalanceA(inputBalanceA);
    setCurrentBalanceB(inputBalanceB);
  };

  const handleSwap = () => {
    const amountIn = Number(swapAmountIn);

    // Calculate surge fee
    const newBalances = [...[currentBalanceA, currentBalanceB]];
    const currentBalances = [currentBalanceA, currentBalanceB];
    const tokenIndexIn = swapTokenIn === "Token A" ? 0 : 1;
    const tokenIndexOut = swapTokenIn === "Token A" ? 1 : 0;
    newBalances[tokenIndexIn] += swapAmountIn;
    newBalances[tokenIndexOut] =
      getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        newBalances,
        currentInvariant,
        tokenIndexOut
      );

    const surgeFee = getSurgeFeePercentage(
      maxSurgeFee,
      surgeThreshold,
      swapFee,
      newBalances,
      currentBalances
    );

    const fees = (amountIn * surgeFee) / 100;

    if (swapTokenIn === "Token A") {
      // Swapping Token A for Token B
      const newBalanceA = currentBalanceA + amountIn - fees;
      const newBalanceB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [newBalanceA, currentBalanceB],
        currentInvariant,
        1
      );
      setCurrentBalanceA(newBalanceA + fees);
      setCurrentBalanceB(newBalanceB);
      setTotalFeesTokenA((prevFees) => prevFees + fees);
    } else {
      // Swapping Token B for Token A
      const newBalanceB = currentBalanceB + amountIn - fees;
      const newBalanceA = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [currentBalanceA, newBalanceB],
        currentInvariant,
        0
      );
      setCurrentBalanceA(newBalanceA);
      setCurrentBalanceB(newBalanceB + fees);
      setTotalFeesTokenB((prevFees) => prevFees + fees);
    }
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
                label="Initial Balance A"
                type="number"
                fullWidth
                margin="normal"
                value={inputBalanceA}
                onChange={(e) => setInputBalanceA(Number(e.target.value))}
              />
              <TextField
                label="Initial Balance B"
                type="number"
                fullWidth
                margin="normal"
                value={inputBalanceB}
                onChange={(e) => setInputBalanceB(Number(e.target.value))}
              />
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
              <Typography style={{ marginTop: 8, marginBottom: 8 }}>
                Amount Out {swapTokenIn === "Token A" ? "B" : "A"}:{" "}
                {swapPreview.amountOut > 0
                  ? swapPreview.amountOut.toFixed(2)
                  : "0"}
              </Typography>
              <Typography style={{ marginBottom: 8 }}>
                Surge Fee (%): {swapPreview.feePercentage.toFixed(2)}
              </Typography>
              <Typography style={{ marginBottom: 8 }}>
                Fee: {swapPreview.fee > 0 ? swapPreview.fee.toFixed(2) : "0"}{" "}
                {swapTokenIn}
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
        </Grid>

        {/* Middle Column - Chart */}
        <Grid item xs={6}>
          <Paper style={{ padding: 16, textAlign: "center" }}>
            <div style={{ width: "100%", height: 600 }}>
              <StableSurgeChart
                curvePoints={curvePoints}
                curvePointsWithFees={curvePointsWithFees}
                currentPoint={{ x: currentBalanceA, y: currentBalanceB }}
                initialCurvePoints={initialCurvePoints}
                previewPoint={previewPoint}
                lowerImbalanceThreshold={lowerImbalanceThreshold}
                upperImbalanceThreshold={upperImbalanceThreshold}
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
                <Typography>Current Balance A:</Typography>
                <Typography>{currentBalanceA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Balance B:</Typography>
                <Typography>{currentBalanceB.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Invariant:</Typography>
                <Typography>{currentInvariant.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Current Imbalance (%):</Typography>
                <Typography>
                  {calculateImbalance([
                    currentBalanceA,
                    currentBalanceB,
                  ]).toFixed(2)}
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
                <Typography>Initial Balance A:</Typography>
                <Typography>{initialBalanceA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Balance B:</Typography>
                <Typography>{initialBalanceB.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Initial Invariant:</Typography>
                <Typography>
                  {stableInvariant(amplification, [
                    initialBalanceA,
                    initialBalanceB,
                  ]).toFixed(2)}
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
                <Typography>Token A:</Typography>
                <Typography>{totalFeesTokenA.toFixed(2)}</Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Token B:</Typography>
                <Typography>{totalFeesTokenB.toFixed(2)}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
}
