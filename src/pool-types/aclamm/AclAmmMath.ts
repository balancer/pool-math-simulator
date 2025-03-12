import * as WeightedMath from "../weighted-pool/WeightedMath";

export function calculatePoolCenteredness(params: {
  balanceA: number;
  balanceB: number;
  virtualBalanceA: number;
  virtualBalanceB: number;
}) {
  if (params.balanceA === 0 || params.balanceB === 0) return 0;
  if (
    params.balanceA / params.balanceB >
    params.virtualBalanceA / params.virtualBalanceB
  ) {
    return (
      (params.balanceB * params.virtualBalanceA) /
      (params.balanceA * params.virtualBalanceB)
    );
  }
  return (
    (params.balanceA * params.virtualBalanceB) /
    (params.balanceB * params.virtualBalanceA)
  );
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

  if (params.swapTokenIn === "Token A") {
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

export function calculateInitialVirtualBalances(params: {
  priceRange: number;
  balanceA: number;
  balanceB: number;
}) {
  const priceRangeNum = Number(params.priceRange);
  let virtualBalancesLocal = { virtualBalanceA: 0, virtualBalanceB: 0 };
  if (priceRangeNum > 1) {
    const denominator = Math.sqrt(Math.sqrt(priceRangeNum)) - 1;
    virtualBalancesLocal = {
      virtualBalanceA: params.balanceA / denominator,
      virtualBalanceB: params.balanceB / denominator,
    };
  }
  return virtualBalancesLocal;
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
  if (params.swapTokenIn === "Token A") {
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
  return WeightedMath.calculateInvariant({
    balances: [
      params.balanceA + params.virtualBalanceA,
      params.balanceB + params.virtualBalanceB,
    ],
    weights: [0.5, 0.5],
  });
}
