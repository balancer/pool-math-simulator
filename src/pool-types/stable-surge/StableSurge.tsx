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

export default function StableSurge() {
  const [inputBalanceA, setInputBalanceA] = useState<number>(1000);
  const [inputBalanceB, setInputBalanceB] = useState<number>(1000);
  const [inputAmplification, setInputAmplification] = useState<number>(100);
  const [inputSwapFee, setInputSwapFee] = useState<number>(1);

  const [initialBalanceA, setInitialBalanceA] = useState<number>(1000);
  const [initialBalanceB, setInitialBalanceB] = useState<number>(1000);
  const [amplification, setAmplification] = useState<number>(100);
  const [swapFee, setSwapFee] = useState<number>(1);
  const [currentBalanceA, setCurrentBalanceA] = useState<number>(1000);
  const [currentBalanceB, setCurrentBalanceB] = useState<number>(1000);

  const [swapTokenIn, setSwapTokenIn] = useState("Token A");
  const [swapAmountIn, setSwapAmountIn] = useState<number>(100);
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

  const calculatedSwapAmountOut = useMemo(() => {
    if (!swapAmountIn) return 0;
    const fees = (swapAmountIn * swapFee) / 100;

    if (swapTokenIn === "Token A") {
      // Swapping Token A for Token B
      const newBalanceA = currentBalanceA + swapAmountIn - fees;
      const newBalanceB = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [newBalanceA, currentBalanceB],
        currentInvariant,
        1
      );
      return currentBalanceB - newBalanceB;
    } else {
      // Swapping Token B for Token A
      const newBalanceB = currentBalanceB + swapAmountIn - fees;
      const newBalanceA = getTokenBalanceGivenInvariantAndAllOtherBalances(
        amplification,
        [currentBalanceA, newBalanceB],
        currentInvariant,
        0
      );
      return currentBalanceA - newBalanceA;
    }
  }, [
    swapAmountIn,
    swapTokenIn,
    currentBalanceA,
    currentBalanceB,
    currentInvariant,
  ]);

  const handleUpdate = () => {
    setInitialBalanceA(inputBalanceA);
    setInitialBalanceB(inputBalanceB);
    setAmplification(inputAmplification);
    setSwapFee(inputSwapFee);
    setCurrentBalanceA(inputBalanceA);
    setCurrentBalanceB(inputBalanceB);
  };

  const handleSwap = () => {
    const amountIn = Number(swapAmountIn);
    const fees = (swapAmountIn * swapFee) / 100;

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
                {calculatedSwapAmountOut > 0
                  ? calculatedSwapAmountOut.toFixed(2)
                  : "0"}
              </Typography>
              <Typography style={{ marginBottom: 8 }}>
                Fee:{" "}
                {swapAmountIn
                  ? ((swapAmountIn * swapFee) / 100).toFixed(2)
                  : "0"}{" "}
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
                currentPoint={{ x: currentBalanceA, y: currentBalanceB }}
                initialCurvePoints={initialCurvePoints}
              />
            </div>
          </Paper>
        </Grid>

        {/* Right Column - Current Values */}
        <Grid item xs={3}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Current Values</Typography>
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
          </Paper>
          <Paper style={{ padding: 16, marginTop: 16 }}>
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
              <Typography>Amplification:</Typography>
              <Typography>{amplification.toFixed(2)}</Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Swap Fee (%):</Typography>
              <Typography>{swapFee.toFixed(2)}</Typography>
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
          </Paper>
          <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6">Collected Fees</Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Token A:</Typography>
              <Typography>{totalFeesTokenA.toFixed(2)}</Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Token B:</Typography>
              <Typography>{totalFeesTokenB.toFixed(2)}</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
