import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function WeightedStable() {
  return (
    <Container>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Create and Initialize</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Content will be added later */}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Swap Exact In</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Content will be added later */}
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Middle Column - Chart */}
        <Grid item xs={6}>
          <Paper style={{ padding: 16, textAlign: "center" }}>
            <div style={{ width: "100%", height: 600 }}>
              {/* Chart will be added later */}
            </div>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={3}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Current Pool State</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Content will be added later */}
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Real-Time Pool State</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Content will be added later */}
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Price Ratio</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Content will be added later */}
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Initial Values</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Content will be added later */}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
}
