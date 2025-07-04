import { useState, useMemo, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  Fade,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReClammChart } from './ReClammChart';
import {
  calculateLowerMargin,
  calculateOutGivenIn,
  computeCenteredness,
  calculateUpperMargin,
  calculateBalancesAfterSwapIn,
  recalculateVirtualBalances,
  calculateInvariant,
} from './ReClammMath';
import { MIN_SWAP, NETWORKS } from './constants';

import { formatTime } from '../../utils/Time';
import { toFixedDecimals } from '../../utils/ToFixedLib';
import Timer from '../../components/Timer';
import { useTimer } from '../../contexts/TimerContext';
import { ReClammPriceBar } from './ReClammPriceBar';

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

export default function ReClamm() {
  // Simulation variables
  const {
    isPlaying,
    simulationSeconds,
    setSimulationSeconds,
    simulationSecondsLastTick,
    setSimulationSecondsLastTick,
    setBlockNumber,
    speedMultiplier,
  } = useTimer();

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

  const [inputTargetPriceRatio, setInputTargetPriceRatio] =
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
  const [swapTokenIn, setSwapTokenIn] = useState('Token A');
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
  const [endTimeError, setEndTimeError] = useState<string>('');

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
    useState<string>('');

  const [network, setNetwork] = useState<string>('base-mainnet');
  const [address, setAddress] = useState<string>(
    '0x7dc81fb7e93cdde7754bff7f55428226bd9cef7b'
  );

  // Add new state for LP fee percentage
  const [lpFeePercent, setLpFeePercent] = useState<number>(1);

  // Add debug mode state
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const realTimeInvariant = useMemo(() => {
    return calculateInvariant({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
  }, [realTimeBalanceA, realTimeBalanceB, realTimeVirtualBalances]);

  const { poolCenteredness } = useMemo(() => {
    return computeCenteredness({
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
      swapAmountIn: (1 - lpFeePercent / 100) * swapAmountIn,
      swapTokenIn: swapTokenIn,
    });

    // Check if amount out exceeds available balance
    const relevantBalance =
      swapTokenIn === 'Token A'
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
    lpFeePercent,
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
      initializeInvariants(
        inputBalanceA,
        initialBalanceB,
        inputVirtualBalanceA,
        inputVirtualBalanceB
      );
    }, 1);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setSimulationSeconds(
          prev => prev + speedMultiplier / (1000 / tickMilliseconds)
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
    setBlockNumber(prev => prev + 1);

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
          prev => prev + (simulationSeconds - lastRangeCheckTime)
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
    setStartPriceRatio(Number(inputPriceRatio));
    setTargetPriceRatio(Number(inputPriceRatio));
    setMargin(Number(inputMargin));
    setMinPrice(Number(inputMinPrice));
    setMaxPrice(Number(inputMaxPrice));
    setTargetPrice(Number(inputTargetPrice));
    initializeInvariants(
      inputBalanceA,
      inputBalanceB,
      inputVirtualBalanceA,
      inputVirtualBalanceB
    );
    setSimulationSeconds(0);
    setBlockNumber(0);
  };

  const initializeInvariants = (
    balanceA: number,
    balanceB: number,
    virtualBalanceA: number,
    virtualBalanceB: number
  ) => {
    setInitialInvariant(
      (balanceA + virtualBalanceA) * (balanceB + virtualBalanceB)
    );
    setCurrentInvariant(
      (balanceA + virtualBalanceA) * (balanceB + virtualBalanceB)
    );
  };

  const handleUpdatePriceRatio = async () => {
    if (inputEndTime < simulationSeconds) {
      setEndTimeError('End time >= Simulation Time');
      return;
    }

    if (inputTargetPriceRatio < 1.1 || inputTargetPriceRatio > 1000) {
      setTargetPriceRatioError(
        'Target price ratio must be between 1.1 and 1000'
      );
      return;
    }

    setEndTimeError('');
    setTargetPriceRatioError('');
    setStartPriceRatio(priceRatio);
    setTargetPriceRatio(inputTargetPriceRatio);
    setStartTime(simulationSeconds);
    setEndTime(inputEndTime);
  };

  const handleSwap = () => {
    handleRealTimeSwap();
    handleCurrentSwap();
  };

  const handleRealTimeSwap = () => {
    const feeAmount = swapAmountIn * (lpFeePercent / 100);
    let newBalanceA = realTimeBalanceA;
    let newBalanceB = realTimeBalanceB;

    if (swapTokenIn === 'Token A') {
      newBalanceA += feeAmount;
    } else {
      newBalanceB += feeAmount;
    }

    const result = calculateBalancesAfterSwapIn({
      balanceA: newBalanceA,
      balanceB: newBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
      swapAmountIn: swapAmountIn,
      swapTokenIn: swapTokenIn,
    });

    setRealTimeBalanceA(result.newBalanceA);
    setRealTimeBalanceB(result.newBalanceB);

    const { newVirtualBalances: virtualBalancesAfterSwap } =
      recalculateVirtualBalances({
        balanceA: result.newBalanceA,
        balanceB: result.newBalanceB,
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
          secondsSinceLastInteraction: simulationSeconds - lastSwapTime,
        },
      });

    setRealTimeVirtualBalances(virtualBalancesAfterSwap);
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

    const feeAmount = swapAmountIn * (lpFeePercent / 100);
    let newBalanceA = currentBalanceA;
    let newBalanceB = currentBalanceB;

    if (swapTokenIn === 'Token A') {
      newBalanceA += feeAmount;
    } else {
      newBalanceB += feeAmount;
    }

    const result = calculateBalancesAfterSwapIn({
      balanceA: newBalanceA,
      balanceB: newBalanceB,
      virtualBalanceA: newVirtualBalances.virtualBalanceA,
      virtualBalanceB: newVirtualBalances.virtualBalanceB,
      swapAmountIn: swapAmountIn,
      swapTokenIn: swapTokenIn,
    });

    setCurrentBalanceA(result.newBalanceA);
    setCurrentBalanceB(result.newBalanceB);

    const { newVirtualBalances: virtualBalancesAfterSwap } =
      recalculateVirtualBalances({
        balanceA: result.newBalanceA,
        balanceB: result.newBalanceB,
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

    setCurrentVirtualBalances(virtualBalancesAfterSwap);

    setCurrentInvariant(
      calculateInvariant({
        balanceA: result.newBalanceA,
        balanceB: result.newBalanceB,
        virtualBalanceA: virtualBalancesAfterSwap.virtualBalanceA,
        virtualBalanceB: virtualBalancesAfterSwap.virtualBalanceB,
      })
    );
  };

  const handleLoadPool = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_FUNCTION_URL}/reclammData?network=${network}&address=${address}`
    );
    const data: {
      priceRange: { minPrice: number; maxPrice: number };
      virtualBalances: {
        currentVirtualBalanceA: number;
        currentVirtualBalanceB: number;
      };
      realBalances: number[];
      dailyPriceShiftExponent: number;
      centerednessMargin: number;
    } = await res.json();

    const balanceA = data.realBalances[0] / Math.pow(10, 18);
    const balanceB = data.realBalances[1] / Math.pow(10, 18);
    const virtualBalanceA =
      data.virtualBalances.currentVirtualBalanceA / Math.pow(10, 18);
    const virtualBalanceB =
      data.virtualBalances.currentVirtualBalanceB / Math.pow(10, 18);

    const maxPrice = data.priceRange.maxPrice / Math.pow(10, 18);
    const minPrice = data.priceRange.minPrice / Math.pow(10, 18);

    const priceRatio = maxPrice / minPrice;

    const margin = data.centerednessMargin / Math.pow(10, 16);
    const priceShift = data.dailyPriceShiftExponent / Math.pow(10, 16);

    const targetPrice =
      (balanceB + virtualBalanceB) / (balanceA + virtualBalanceA);

    setInputMaxPrice(maxPrice);
    setInputMinPrice(minPrice);
    setInputTargetPrice(targetPrice);
    setInputMargin(margin);
    setPriceShiftDailyRate(priceShift);

    setInputBalanceA(balanceA);
    setInitialBalanceA(balanceA);
    setInitialBalanceB(balanceB);
    setCurrentBalanceA(balanceA);
    setCurrentBalanceB(balanceB);
    setRealTimeBalanceA(balanceA);
    setRealTimeBalanceB(balanceB);

    setCurrentVirtualBalances({
      virtualBalanceA,
      virtualBalanceB,
    });
    setRealTimeVirtualBalances({
      virtualBalanceA,
      virtualBalanceB,
    });

    setPriceRatio(priceRatio);
    setStartPriceRatio(priceRatio);
    setTargetPriceRatio(priceRatio);
    setMargin(margin);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    initializeInvariants(balanceA, balanceB, virtualBalanceA, virtualBalanceB);
    setSimulationSeconds(0);
    setBlockNumber(0);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FormControlLabel
            control={
              <Switch
                checked={debugMode}
                onChange={e => setDebugMode(e.target.checked)}
                color='primary'
              />
            }
            label='Debug Mode'
          />
          {debugMode && (
            <Typography
              variant='body2'
              color='textSecondary'
              style={{ marginTop: 8 }}
            >
              Debug mode is enabled. Additional logging and detailed information
              will be displayed.
            </Typography>
          )}

          {/* Load Real Pool Section */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h6'>Load Real Pool</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                select
                label='Network'
                fullWidth
                margin='normal'
                value={network}
                onChange={e => setNetwork(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                {NETWORKS.sort((a, b) => a.name.localeCompare(b.name)).map(
                  n => (
                    <option key={n.network} value={n.network}>
                      {n.name}
                    </option>
                  )
                )}
              </TextField>
              <TextField
                label='Address'
                type='text'
                fullWidth
                margin='normal'
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <Button
                variant='contained'
                fullWidth
                onClick={handleLoadPool}
                style={{ marginTop: 16 }}
              >
                Load Pool
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h6'>Create and Initialize</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant='subtitle1'
                style={{
                  fontWeight: 'bold',
                }}
              >
                Create Parameters
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label='Minimum Price'
                    type='number'
                    fullWidth
                    margin='normal'
                    value={inputMinPrice}
                    onChange={e => setInputMinPrice(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label='Maximum Price'
                    type='number'
                    fullWidth
                    margin='normal'
                    value={inputMaxPrice}
                    onChange={e => setInputMaxPrice(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label='Target Price'
                    type='number'
                    fullWidth
                    margin='normal'
                    value={inputTargetPrice}
                    onChange={e => setInputTargetPrice(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label='Margin (%)'
                    type='number'
                    fullWidth
                    margin='normal'
                    value={inputMargin}
                    onChange={e => setInputMargin(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Price Shift Daily Rate (%)'
                    type='number'
                    fullWidth
                    margin='normal'
                    value={priceShiftDailyRate}
                    onChange={e =>
                      setPriceShiftDailyRate(Number(e.target.value))
                    }
                  />
                </Grid>
              </Grid>
              <Typography
                variant='subtitle1'
                style={{
                  marginTop: 8,
                  fontWeight: 'bold',
                }}
              >
                Initial Balances
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    label='Initial Balance A'
                    type='number'
                    fullWidth
                    margin='normal'
                    value={inputBalanceA}
                    onChange={e => setInputBalanceA(Number(e.target.value))}
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Ideal Proportion:</Typography>
                <Typography>
                  {toFixedDecimals(idealBalanceB / idealBalanceA)}
                </Typography>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Initial Balance B:</Typography>
                <Typography>{toFixedDecimals(inputBalanceB)}</Typography>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Virtual Balance A:</Typography>
                <Typography>{toFixedDecimals(inputVirtualBalanceA)}</Typography>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Virtual Balance B:</Typography>
                <Typography>{toFixedDecimals(inputVirtualBalanceB)}</Typography>
              </div>
              <Button
                variant='contained'
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
              <Typography variant='h6'>Swap Exact In</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                select
                label='Token In'
                fullWidth
                margin='normal'
                value={swapTokenIn}
                onChange={e => setSwapTokenIn(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value='Token A'>Token A</option>
                <option value='Token B'>Token B</option>
              </TextField>
              <TextField
                label='Amount In'
                type='number'
                fullWidth
                margin='normal'
                value={swapAmountIn}
                onChange={e => setSwapAmountIn(Number(e.target.value))}
              />
              <TextField
                label='LP Fee %'
                type='number'
                fullWidth
                margin='normal'
                value={lpFeePercent}
                onChange={e => setLpFeePercent(Number(e.target.value))}
              />
              <Typography
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  color: calculatedSwapAmountOut.exceedsBalance
                    ? 'red'
                    : 'inherit',
                }}
              >
                Amount Out {swapTokenIn === 'Token A' ? 'B' : 'A'}:{' '}
                {calculatedSwapAmountOut.amount > 0
                  ? toFixedDecimals(calculatedSwapAmountOut.amount)
                  : '0'}
                {calculatedSwapAmountOut.exceedsBalance && (
                  <div style={{ fontSize: '0.8em' }}>
                    Token {swapTokenIn === 'Token A' ? 'B' : 'A'} Amount in the
                    pool must be at least {MIN_SWAP}.
                  </div>
                )}
              </Typography>
              <Button
                variant='contained'
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
              <Typography variant='h6'>Update Price Ratio</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label='Target Price Ratio'
                type='number'
                fullWidth
                margin='normal'
                value={inputTargetPriceRatio}
                onChange={e => setInputTargetPriceRatio(Number(e.target.value))}
                error={!!targetPriceRatioError}
                helperText={targetPriceRatioError}
              />
              <Typography>
                Current Time: {simulationSeconds.toFixed(0)}
              </Typography>
              <TextField
                label='End Time (in seconds)'
                type='number'
                fullWidth
                margin='normal'
                value={inputEndTime}
                onChange={e => setInputEndTime(Number(e.target.value))}
                error={!!endTimeError}
                helperText={endTimeError}
              />
              <Button
                variant='contained'
                fullWidth
                onClick={handleUpdatePriceRatio}
                style={{ marginTop: 16 }}
              >
                Update Price Ratio
              </Button>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={debugMode ? 6 : 9}>
          <Timer />

          {/* ReClamm Price Bar */}
          <ReClammPriceBar
            realTimeBalanceA={realTimeBalanceA}
            realTimeBalanceB={realTimeBalanceB}
            realTimeVirtualBalances={realTimeVirtualBalances}
            realTimeInvariant={realTimeInvariant}
            margin={margin}
          />

          <Fade in={debugMode} timeout={300}>
            <Paper
              style={{
                padding: 16,
                textAlign: 'center',
                opacity: debugMode ? 1 : 0,
                transition: 'opacity 300ms ease-in-out',
                pointerEvents: debugMode ? 'auto' : 'none',
              }}
            >
              <div style={{ width: '100%', height: 600 }}>
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
          </Fade>
        </Grid>

        {/* Current Values Column */}
        <Fade in={debugMode} timeout={300}>
          <Grid item xs={3}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6'>Current Pool State</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Invariant:</Typography>
                  <Typography>{toFixedDecimals(currentInvariant)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Current Balance A:</Typography>
                  <Typography>{toFixedDecimals(currentBalanceA)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Current Balance B:</Typography>
                  <Typography>{toFixedDecimals(currentBalanceB)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Virtual Balance A:</Typography>
                  <Typography>
                    {toFixedDecimals(currentVirtualBalances.virtualBalanceA)}
                  </Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Virtual Balance B:</Typography>
                  <Typography>
                    {toFixedDecimals(currentVirtualBalances.virtualBalanceB)}
                  </Typography>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography>Rate Max/Min:</Typography>
                    <Typography>
                      {toFixedDecimals(
                        Math.pow(currentInvariant, 2) /
                          (Math.pow(currentVirtualBalances.virtualBalanceA, 2) *
                            Math.pow(currentVirtualBalances.virtualBalanceB, 2))
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'red' }}>
                      Min Price A:
                    </Typography>
                    <Typography style={{ color: 'red' }}>
                      {toFixedDecimals(
                        Math.pow(currentVirtualBalances.virtualBalanceB, 2) /
                          currentInvariant
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'blue' }}>
                      Lower Margin Price A:
                    </Typography>
                    <Typography style={{ color: 'blue' }}>
                      {toFixedDecimals(
                        currentInvariant / Math.pow(higherMargin, 2)
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'green' }}>
                      Current Price A:
                    </Typography>
                    <Typography style={{ color: 'green' }}>
                      {toFixedDecimals(
                        (currentBalanceB +
                          currentVirtualBalances.virtualBalanceB) /
                          (currentBalanceA +
                            currentVirtualBalances.virtualBalanceA)
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'blue' }}>
                      Upper Margin Price A:
                    </Typography>
                    <Typography style={{ color: 'blue' }}>
                      {toFixedDecimals(
                        currentInvariant / Math.pow(lowerMargin, 2)
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'red' }}>
                      Max Price A:
                    </Typography>
                    <Typography style={{ color: 'red' }}>
                      {toFixedDecimals(
                        currentInvariant /
                          Math.pow(currentVirtualBalances.virtualBalanceA, 2)
                      )}
                    </Typography>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6'>Real-Time Pool State</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Invariant:</Typography>
                  <Typography>{toFixedDecimals(realTimeInvariant)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Current Balance A:</Typography>
                  <Typography>{toFixedDecimals(realTimeBalanceA)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Current Balance B:</Typography>
                  <Typography>{toFixedDecimals(realTimeBalanceB)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Virtual Balance A:</Typography>
                  <Typography>
                    {toFixedDecimals(realTimeVirtualBalances.virtualBalanceA)}
                  </Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Virtual Balance B:</Typography>
                  <Typography>
                    {toFixedDecimals(realTimeVirtualBalances.virtualBalanceB)}
                  </Typography>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography>Rate Max/Min:</Typography>
                    <Typography>
                      {toFixedDecimals(
                        Math.pow(realTimeInvariant, 2) /
                          (Math.pow(
                            realTimeVirtualBalances.virtualBalanceA,
                            2
                          ) *
                            Math.pow(
                              realTimeVirtualBalances.virtualBalanceB,
                              2
                            ))
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'red' }}>
                      Min Price A:
                    </Typography>
                    <Typography style={{ color: 'red' }}>
                      {toFixedDecimals(
                        Math.pow(realTimeVirtualBalances.virtualBalanceB, 2) /
                          realTimeInvariant
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'blue' }}>
                      Lower Margin Price A:
                    </Typography>
                    <Typography style={{ color: 'blue' }}>
                      {toFixedDecimals(
                        realTimeInvariant / Math.pow(higherMargin, 2)
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'green' }}>
                      Current Price A:
                    </Typography>
                    <Typography style={{ color: 'green' }}>
                      {toFixedDecimals(
                        (realTimeBalanceB +
                          realTimeVirtualBalances.virtualBalanceB) /
                          (realTimeBalanceA +
                            realTimeVirtualBalances.virtualBalanceA)
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'blue' }}>
                      Upper Margin Price A:
                    </Typography>
                    <Typography style={{ color: 'blue' }}>
                      {toFixedDecimals(
                        realTimeInvariant / Math.pow(lowerMargin, 2)
                      )}
                    </Typography>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography style={{ color: 'red' }}>
                      Max Price A:
                    </Typography>
                    <Typography style={{ color: 'red' }}>
                      {toFixedDecimals(
                        realTimeInvariant /
                          Math.pow(realTimeVirtualBalances.virtualBalanceA, 2)
                      )}
                    </Typography>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6'>Price Ratio</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {simulationSeconds < endTime ? (
                  <>
                    <Typography style={{ color: 'green', fontWeight: 'bold' }}>
                      UPDATING RANGE
                    </Typography>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: 10,
                      }}
                    >
                      <Typography>Start Price Ratio:</Typography>
                      <Typography>
                        {toFixedDecimals(startPriceRatio)}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: 10,
                      }}
                    >
                      <Typography>Current Price Ratio:</Typography>
                      <Typography>{toFixedDecimals(priceRatio)}</Typography>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: 10,
                      }}
                    >
                      <Typography>Target Price Ratio:</Typography>
                      <Typography>
                        {toFixedDecimals(targetPriceRatio)}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: 10,
                      }}
                    >
                      <Typography>End Time (s):</Typography>
                      <Typography>{endTime}</Typography>
                    </div>
                  </>
                ) : (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography>Current Price Ratio:</Typography>
                    <Typography>{toFixedDecimals(priceRatio)}</Typography>
                  </div>
                )}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Pool Centeredness:</Typography>
                  <Typography>{toFixedDecimals(poolCenteredness)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Status:</Typography>
                  <Typography
                    style={{
                      color: poolCenteredness > margin / 100 ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {poolCenteredness > margin / 100
                      ? 'IN RANGE'
                      : 'OUT OF RANGE'}
                  </Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Out of Range time:</Typography>
                  <Typography>{formatTime(outOfRangeTime)}</Typography>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6'>Initial Values</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Initial Balance A:</Typography>
                  <Typography>{toFixedDecimals(initialBalanceA)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Initial Balance B:</Typography>
                  <Typography>{toFixedDecimals(initialBalanceB)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Min Price A:</Typography>
                  <Typography>{toFixedDecimals(minPrice)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Target Price A:</Typography>
                  <Typography>{toFixedDecimals(targetPrice)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Max Price A:</Typography>
                  <Typography>{toFixedDecimals(maxPrice)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Price Ratio:</Typography>
                  <Typography>{toFixedDecimals(priceRatio)}</Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Margin:</Typography>
                  <Typography>{toFixedDecimals(margin)}%</Typography>
                </div>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Fade>
      </Grid>
    </Container>
  );
}
