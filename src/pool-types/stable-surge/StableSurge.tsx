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

  const [initialBalanceA, setInitialBalanceA] = useState<number>(1000);
  const [initialBalanceB, setInitialBalanceB] = useState<number>(1000);
  const [amplification, setAmplification] = useState<number>(100);
  const [currentBalanceA, setCurrentBalanceA] = useState<number>(1000);
  const [currentBalanceB, setCurrentBalanceB] = useState<number>(1000);

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

  const handleUpdate = () => {
    setInitialBalanceA(inputBalanceA);
    setInitialBalanceB(inputBalanceB);
    setAmplification(inputAmplification);
    setCurrentBalanceA(inputBalanceA);
    setCurrentBalanceB(inputBalanceB);
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
        </Grid>

        {/* Middle Column - Chart */}
        <Grid item xs={6}>
          <Paper style={{ padding: 16, textAlign: "center" }}>
            <div style={{ width: "100%", height: 600 }}>
              <StableSurgeChart curvePoints={curvePoints} />
            </div>
          </Paper>
        </Grid>

        {/* Right Column - Current Values */}
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
              <Typography>Amplification:</Typography>
              <Typography>{amplification.toFixed(2)}</Typography>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Current Invariant:</Typography>
              <Typography>{currentInvariant.toFixed(2)}</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
