import * as WeightedMath from '../weighted-pool/WeightedMath';

const timeFix = 12464900; // Using the same constant as the Contract. The full value is 12464935.015039.
const THIRTY_DAYS = 2592000; // 30 days in seconds

export function computeCenteredness(params: {
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}): { poolCenteredness: number; isPoolAboveCenter: boolean } {
  if (params.balanceA === 0)
    return { poolCenteredness: 0, isPoolAboveCenter: false };
  if (params.balanceB === 0)
    return { poolCenteredness: 0, isPoolAboveCenter: true };

  const numerator = params.balanceA * params.virtualBalanceB;
  const denominator = params.balanceB * params.virtualBalanceA;

  if (numerator < denominator) {
    return {
      poolCenteredness: numerator / denominator,
      isPoolAboveCenter: false,
    };
  }
  return { poolCenteredness: denominator / numerator, isPoolAboveCenter: true };
}

export function calculateLowerMargin(params: {
  margin: number;
  invariant: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}) {
  const marginPercentage = params.margin / 100;
  const b = params.virtualBalanceA + marginPercentage * params.virtualBalanceA;
  const c =
    marginPercentage *
    (Math.pow(params.virtualBalanceA, 2) -
      (params.invariant * params.virtualBalanceA) / params.virtualBalanceB);
  return params.virtualBalanceA + (-b + Math.sqrt(Math.pow(b, 2) - 4 * c)) / 2;
}

export function calculateUpperMargin(params: {
  margin: number;
  invariant: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}) {
  const marginPercentage = params.margin / 100;
  const b =
    (params.virtualBalanceA + marginPercentage * params.virtualBalanceA) /
    marginPercentage;
  const c =
    (Math.pow(params.virtualBalanceA, 2) -
      (params.virtualBalanceA * params.invariant) / params.virtualBalanceB) /
    marginPercentage;

  return params.virtualBalanceA + (-b + Math.sqrt(Math.pow(b, 2) - 4 * c)) / 2;
}

export function calculateOutGivenIn(params: {
  swapAmountIn: number;
  swapTokenIn: string;
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}) {
  if (!params.swapAmountIn) return 0;

  const balances = [
    params.balanceA + params.virtualBalanceA,
    params.balanceB + params.virtualBalanceB,
  ];

  if (params.swapTokenIn === 'Token A') {
    return WeightedMath.calculateOutGivenIn({
      balances: balances,
      weights: [0.5, 0.5],
      swapAmountIn: params.swapAmountIn,
      tokenInIndex: 0,
      tokenOutIndex: 1,
    });
  } else {
    return WeightedMath.calculateOutGivenIn({
      balances: balances,
      weights: [0.5, 0.5],
      swapAmountIn: params.swapAmountIn,
      tokenInIndex: 1,
      tokenOutIndex: 0,
    });
  }
}

export function calculateBalancesAfterSwapIn(params: {
  swapAmountIn: number;
  swapTokenIn: string;
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}) {
  const invariant = calculateInvariant({
    balanceA: params.balanceA,
    balanceB: params.balanceB,
    virtualBalanceA: params.virtualBalanceA,
    virtualBalanceB: params.virtualBalanceB,
  });

  const amountIn = Number(params.swapAmountIn);
  const amountOut = calculateOutGivenIn({
    balanceA: params.balanceA,
    balanceB: params.balanceB,
    virtualBalanceA: params.virtualBalanceA,
    virtualBalanceB: params.virtualBalanceB,
    swapAmountIn: amountIn,
    swapTokenIn: params.swapTokenIn,
  });

  let newBalanceA: number;
  let newBalanceB: number;
  if (params.swapTokenIn === 'Token A') {
    newBalanceA = params.balanceA + amountIn;
    newBalanceB = params.balanceB - amountOut;

    if (newBalanceB < 0) {
      newBalanceB = 0;
      newBalanceA = invariant / params.virtualBalanceB - params.virtualBalanceA;
    }
  } else {
    newBalanceA = params.balanceA - amountOut;
    newBalanceB = params.balanceB + amountIn;

    if (newBalanceA < 0) {
      newBalanceA = 0;
      newBalanceB = invariant / params.virtualBalanceA - params.virtualBalanceB;
    }
  }

  return { newBalanceA, newBalanceB };
}

export function calculateInvariant(params: {
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}) {
  return (
    (params.balanceA + params.virtualBalanceA) *
    (params.balanceB + params.virtualBalanceB)
  );
}

export const recalculateVirtualBalances = (params: {
  balanceA: number;
  balanceB: number;
  oldVirtualBalanceA: number;
  oldVirtualBalanceB: number;
  poolParams: {
    margin: number;
    priceShiftDailyRate: number;
  };
  updateQ0Params: {
    startTime: number;
    endTime: number;
    startPriceRatio: number;
    targetPriceRatio: number;
  };
  simulationParams: {
    simulationSeconds: number;
    simulationSecondsPerBlock: number;
    secondsSinceLastInteraction: number;
  };
  forceOutOfRange?: boolean;
}): {
  newVirtualBalances: {
    virtualBalanceA: number;
    virtualBalanceB: number;
  };
  newPriceRatio: number;
} => {
  const fixedSecondsSinceLastInteraction =
    params.simulationParams.secondsSinceLastInteraction -
    (params.simulationParams.secondsSinceLastInteraction %
      params.simulationParams.simulationSecondsPerBlock);
  const lastTimestamp =
    params.simulationParams.simulationSeconds -
    fixedSecondsSinceLastInteraction;

  let newVirtualBalanceA = params.oldVirtualBalanceA;
  let newVirtualBalanceB = params.oldVirtualBalanceB;
  let newPriceRatio = computePriceRatioFromState(
    params.simulationParams.simulationSeconds,
    params.updateQ0Params
  );

  if (
    params.simulationParams.simulationSeconds >
      params.updateQ0Params.startTime &&
    lastTimestamp < params.updateQ0Params.endTime
  ) {
    [newVirtualBalanceA, newVirtualBalanceB] =
      computeVirtualBalancesUpdatingPriceRatio({
        currentPriceRatio: newPriceRatio,
        balanceA: params.balanceA,
        balanceB: params.balanceB,
        lastVirtualBalanceA: params.oldVirtualBalanceA,
        lastVirtualBalanceB: params.oldVirtualBalanceB,
      });
  }

  const { poolCenteredness, isPoolAboveCenter } = computeCenteredness({
    balanceA: params.balanceA,
    balanceB: params.balanceB,
    virtualBalanceA: newVirtualBalanceA,
    virtualBalanceB: newVirtualBalanceB,
  });

  if (
    poolCenteredness <= params.poolParams.margin / 100 ||
    params.forceOutOfRange
  ) {
    [newVirtualBalanceA, newVirtualBalanceB] =
      computeVirtualBalancesUpdatingPriceRange({
        balanceA: params.balanceA,
        balanceB: params.balanceB,
        currentVirtualBalanceA: newVirtualBalanceA,
        currentVirtualBalanceB: newVirtualBalanceB,
        isPoolAboveCenter,
        priceShiftDailyRate: params.poolParams.priceShiftDailyRate,
        timeInterval: fixedSecondsSinceLastInteraction,
      });
  }

  return {
    newVirtualBalances: {
      virtualBalanceA: newVirtualBalanceA,
      virtualBalanceB: newVirtualBalanceB,
    },
    newPriceRatio: newPriceRatio,
  };
};

function computeVirtualBalancesUpdatingPriceRatio(params: {
  currentPriceRatio: number;
  balanceA: number;
  balanceB: number;
  lastVirtualBalanceA: number;
  lastVirtualBalanceB: number;
}): [number, number] {
  const { poolCenteredness, isPoolAboveCenter } = computeCenteredness({
    balanceA: params.balanceA,
    balanceB: params.balanceB,
    virtualBalanceA: params.lastVirtualBalanceA,
    virtualBalanceB: params.lastVirtualBalanceB,
  });

  const [
    balanceTokenUndervalued,
    lastVirtualBalanceUndervalued,
    lastVirtualBalanceOvervalued,
  ] = isPoolAboveCenter
    ? [params.balanceA, params.lastVirtualBalanceA, params.lastVirtualBalanceB]
    : [params.balanceB, params.lastVirtualBalanceB, params.lastVirtualBalanceA];

  const sqrtPriceRatio = Math.sqrt(params.currentPriceRatio);

  const virtualBalanceUndervalued =
    (balanceTokenUndervalued *
      (1 +
        poolCenteredness +
        Math.sqrt(
          poolCenteredness * (poolCenteredness + 4 * sqrtPriceRatio - 2) + 1
        ))) /
    (2 * (sqrtPriceRatio - 1));

  const virtualBalanceOvervalued =
    (virtualBalanceUndervalued * lastVirtualBalanceOvervalued) /
    lastVirtualBalanceUndervalued;

  return isPoolAboveCenter
    ? [virtualBalanceUndervalued, virtualBalanceOvervalued]
    : [virtualBalanceOvervalued, virtualBalanceUndervalued];
}

function computeVirtualBalancesUpdatingPriceRange(params: {
  balanceA: number;
  balanceB: number;
  currentVirtualBalanceA: number;
  currentVirtualBalanceB: number;
  isPoolAboveCenter: boolean;
  priceShiftDailyRate: number;
  timeInterval: number;
}): [number, number] {
  const dailyPriceShiftBase = 1 - params.priceShiftDailyRate / timeFix;

  const priceRatio = computePriceRatioFromBalances({
    balanceA: params.balanceA,
    balanceB: params.balanceB,
    virtualBalanceA: params.currentVirtualBalanceA,
    virtualBalanceB: params.currentVirtualBalanceB,
  });

  const [balanceUndervalued, balanceOvervalued] = params.isPoolAboveCenter
    ? [params.balanceA, params.balanceB]
    : [params.balanceB, params.balanceA];
  let [virtualBalanceUndervalued, virtualBalanceOvervalued] =
    params.isPoolAboveCenter
      ? [params.currentVirtualBalanceA, params.currentVirtualBalanceB]
      : [params.currentVirtualBalanceB, params.currentVirtualBalanceA];

  const duration = Math.min(params.timeInterval, THIRTY_DAYS);
  virtualBalanceOvervalued =
    virtualBalanceOvervalued * Math.pow(dailyPriceShiftBase, duration);
  virtualBalanceOvervalued = Math.max(
    virtualBalanceOvervalued,
    balanceOvervalued / (Math.sqrt(Math.sqrt(priceRatio)) - 1)
  );

  virtualBalanceUndervalued =
    (balanceUndervalued * (virtualBalanceOvervalued + balanceOvervalued)) /
    ((Math.sqrt(priceRatio) - 1) * virtualBalanceOvervalued -
      balanceOvervalued);

  return params.isPoolAboveCenter
    ? [virtualBalanceUndervalued, virtualBalanceOvervalued]
    : [virtualBalanceOvervalued, virtualBalanceUndervalued];
}

function computePriceRatioFromState(
  currentTime: number,
  updateQ0Params: {
    startTime: number;
    endTime: number;
    startPriceRatio: number;
    targetPriceRatio: number;
  }
) {
  if (currentTime >= updateQ0Params.endTime) {
    return updateQ0Params.targetPriceRatio;
  } else if (currentTime <= updateQ0Params.startTime) {
    return updateQ0Params.startPriceRatio;
  }

  const exponent =
    (currentTime - updateQ0Params.startTime) /
    (updateQ0Params.endTime - updateQ0Params.startTime);
  const currentPriceRatio =
    updateQ0Params.startPriceRatio *
    Math.pow(
      updateQ0Params.targetPriceRatio / updateQ0Params.startPriceRatio,
      exponent
    );
  return Math.max(
    Math.min(updateQ0Params.startPriceRatio, updateQ0Params.targetPriceRatio),
    currentPriceRatio
  );
}

export function computePriceRatioFromBalances(params: {
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}): number {
  const [minPrice, maxPrice] = computePriceRangeFromBalances(params);
  return maxPrice / minPrice;
}

function computePriceRangeFromBalances(params: {
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}): [number, number] {
  const currentInvariant = calculateInvariant(params);
  const minPrice =
    (params.virtualBalanceB * params.virtualBalanceB) / currentInvariant;
  const maxPrice =
    currentInvariant / (params.virtualBalanceA * params.virtualBalanceA);

  return [minPrice, maxPrice];
}
