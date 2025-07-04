// All functions are adapted from the solidity ones to be found on:
// https://github.com/balancer-labs/balancer-core-v2/blob/master/contracts/pools/stable/StableMath.sol

// TODO: implement all up and down rounding variations

/**********************************************************************************************
    // invariant                                                                                 //
    // D = invariant to compute                                                                  //
    // A = amplifier                n * D^2 + A * n^n * S * (n^n * P / D^(n−1))                  //
    // S = sum of balances         ____________________________________________                  //
    // P = product of balances    (n+1) * D + ( A * n^n − 1)* (n^n * P / D^(n−1))                //
    // n = number of tokens                                                                      //
    **********************************************************************************************/
export function stableInvariant(
  amp: number, // amp
  balances: number[] // balances
): number {
  let sum = 0;
  const totalCoins = balances.length;
  for (let i = 0; i < totalCoins; i++) {
    sum = sum + balances[i];
  }
  if (sum === 0) {
    return 0;
  }
  let prevInv = 0;
  let inv = sum;

  // amp is passed as an ethers bignumber while maths uses bignumber.js
  const ampTimesNpowN = amp * totalCoins ** totalCoins; // A*n^n

  for (let i = 0; i < 255; i++) {
    let P_D = totalCoins * balances[0];
    for (let j = 1; j < totalCoins; j++) {
      //P_D is rounded up
      P_D = (P_D * balances[j] * totalCoins) / inv;
    }
    prevInv = inv;
    //inv is rounded up
    inv =
      (totalCoins * inv * inv + ampTimesNpowN * sum * P_D) /
      ((totalCoins + 1) * inv + (ampTimesNpowN - 1) * P_D);
    // Equality with the precision of 1
    if (Math.abs(inv - prevInv) < 1) {
      break;
    }
  }
  //Result is rounded up
  return inv;
}

// // // This function has to be zero if the invariant D was calculated correctly
// // // It was only used for double checking that the invariant was correct
// // export function _invariantValueFunction(
// //     amp: BigNumber, // amp
// //     balances: BigNumber[], // balances
// //     D: BigNumber
// // ): BigNumber {
// //     let invariantValueFunction;
// //     let prod = ONE;
// //     let sum = ZERO;
// //     for (let i = 0; i < balances.length; i++) {
// //         prod = prod.times(balances[i]);
// //         sum = sum.plus(balances[i]);
// //     }
// //     let n = bnum(balances.length);

// //     // NOT! working based on Daniel's equation: https://www.notion.so/Analytical-for-2-tokens-1cd46debef6648dd81f2d75bae941fea
// //     // invariantValueFunction = amp.times(sum)
// //     //     .plus((ONE.div(n.pow(n)).minus(amp)).times(D))
// //     //     .minus((ONE.div(n.pow(n.times(2)).times(prod))).times(D.pow(n.plus(ONE))));
// //     invariantValueFunction = D.pow(n.plus(ONE))
// //         .div(n.pow(n).times(prod))
// //         .plus(D.times(amp.times(n.pow(n)).minus(ONE)))
// //         .minus(amp.times(n.pow(n)).times(sum));

// //     return invariantValueFunction;
// // }

// // Adapted from StableMath.sol, _outGivenIn()
// // * Added swap fee at very first line
// /**********************************************************************************************
//     // outGivenIn token x for y - polynomial equation to solve                                   //
//     // ay = amount out to calculate                                                              //
//     // by = balance token out                                                                    //
//     // y = by - ay                                                                               //
//     // D = invariant                               D                     D^(n+1)                 //
//     // A = amplifier               y^2 + ( S - ----------  - 1) * y -  ------------- = 0         //
//     // n = number of tokens                    (A * n^n)               A * n^2n * P              //
//     // S = sum of final balances but y                                                           //
//     // P = product of final balances but y                                                       //
//     **********************************************************************************************/
// export function _exactTokenInForTokenOut(
//     amount: OldBigNumber,
//     poolPairData: StablePoolPairData
// ): OldBigNumber {
//     // The formula below returns some dust (due to rounding errors) but when
//     // we input zero the output should be zero
//     if (amount.isZero()) return amount;
//     const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } =
//         poolPairData;
//     const balances = [...allBalances];
//     let tokenAmountIn = amount;
//     tokenAmountIn = tokenAmountIn
//         .times(EONE.sub(swapFee).toString())
//         .div(EONE.toString());

//     //Invariant is rounded up
//     const inv = _invariant(amp, balances);
//     let p = inv;
//     let sum = ZERO;
//     const totalCoins = bnum(balances.length);
//     let n_pow_n = ONE;
//     let x = ZERO;
//     for (let i = 0; i < balances.length; i++) {
//         n_pow_n = n_pow_n.times(totalCoins);

//         if (i == tokenIndexIn) {
//             x = balances[i].plus(tokenAmountIn);
//         } else if (i != tokenIndexOut) {
//             x = balances[i];
//         } else {
//             continue;
//         }
//         sum = sum.plus(x);
//         //Round up p
//         p = p.times(inv).div(x);
//     }

//     //Calculate out balance
//     const y = _solveAnalyticalBalance(sum, inv, amp, n_pow_n, p);

//     //Result is rounded down
//     // return balances[tokenIndexOut] > y ? balances[tokenIndexOut].minus(y) : 0;
//     return balances[tokenIndexOut].minus(y);
// }

// // Adapted from StableMath.sol, _inGivenOut()
// // * Added swap fee at very last line
// /**********************************************************************************************
//     // inGivenOut token x for y - polynomial equation to solve                                   //
//     // ax = amount in to calculate                                                               //
//     // bx = balance token in                                                                     //
//     // x = bx + ax                                                                               //
//     // D = invariant                               D                     D^(n+1)                 //
//     // A = amplifier               x^2 + ( S - ----------  - 1) * x -  ------------- = 0         //
//     // n = number of tokens                    (A * n^n)               A * n^2n * P              //
//     // S = sum of final balances but x                                                           //
//     // P = product of final balances but x                                                       //
//     **********************************************************************************************/
// export function _tokenInForExactTokenOut(
//     amount: OldBigNumber,
//     poolPairData: StablePoolPairData
// ): OldBigNumber {
//     // The formula below returns some dust (due to rounding errors) but when
//     // we input zero the output should be zero
//     if (amount.isZero()) return amount;
//     const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } =
//         poolPairData;
//     const balances = [...allBalances];
//     const tokenAmountOut = amount;
//     //Invariant is rounded up
//     const inv = _invariant(amp, balances);
//     let p = inv;
//     let sum = ZERO;
//     const totalCoins = bnum(balances.length);
//     let n_pow_n = ONE;
//     let x = ZERO;
//     for (let i = 0; i < balances.length; i++) {
//         n_pow_n = n_pow_n.times(totalCoins);

//         if (i == tokenIndexOut) {
//             x = balances[i].minus(tokenAmountOut);
//         } else if (i != tokenIndexIn) {
//             x = balances[i];
//         } else {
//             continue;
//         }
//         sum = sum.plus(x);
//         //Round up p
//         p = p.times(inv).div(x);
//     }

//     //Calculate in balance
//     const y = _solveAnalyticalBalance(sum, inv, amp, n_pow_n, p);

//     //Result is rounded up
//     return y
//         .minus(balances[tokenIndexIn])
//         .multipliedBy(EONE.toString())
//         .div(EONE.sub(swapFee).toString());
// }

// /*
// Flow of calculations:
// amountBPTOut -> newInvariant -> (amountInProportional, amountInAfterFee) ->
// amountInPercentageExcess -> amountIn
// */
// export function _tokenInForExactBPTOut(
//     amount: OldBigNumber,
//     poolPairData: StablePoolPairData
// ): OldBigNumber {
//     // The formula below returns some dust (due to rounding errors) but when
//     // we input zero the output should be zero
//     if (amount.isZero()) return amount;
//     const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } =
//         poolPairData;
//     const balances = [...allBalances];
//     const bptAmountOut = amount;

//     /**********************************************************************************************
//     // TODO description                            //
//     **********************************************************************************************/

//     // Get current invariant
//     const currentInvariant = _invariant(amp, balances);
//     // Calculate new invariant
//     const newInvariant = allBalances[tokenIndexOut]
//         .plus(bptAmountOut)
//         .div(allBalances[tokenIndexOut])
//         .times(currentInvariant);

//     // First calculate the sum of all token balances which will be used to calculate
//     // the current weight of token
//     let sumBalances = ZERO;
//     for (let i = 0; i < balances.length; i++) {
//         sumBalances = sumBalances.plus(balances[i]);
//     }

//     // get amountInAfterFee
//     const newBalanceTokenIndex =
//         _getTokenBalanceGivenInvariantAndAllOtherBalances(
//             amp,
//             balances,
//             newInvariant,
//             tokenIndexIn
//         );
//     const amountInAfterFee = newBalanceTokenIndex.minus(balances[tokenIndexIn]);

//     // Get tokenBalancePercentageExcess
//     const currentWeight = balances[tokenIndexIn].div(sumBalances);
//     const tokenBalancePercentageExcess = ONE.minus(currentWeight);

//     // return amountIn
//     return amountInAfterFee.div(
//         ONE.minus(
//             tokenBalancePercentageExcess
//                 .times(swapFee.toString())
//                 .div(EONE.toString())
//         )
//     );
// }

//This function calculates the balance of a given token (tokenIndex)
// given all the other balances and the invariant
export function getTokenBalanceGivenInvariantAndAllOtherBalances(
  amp: number,
  balances: number[],
  inv: number,
  tokenIndex: number
): number {
  let p = inv;
  let sum = 0;
  const totalCoins = balances.length;
  let nPowN = 1;
  let x = 0;
  for (let i = 0; i < totalCoins; i++) {
    nPowN = nPowN * totalCoins;
    if (i !== tokenIndex) {
      x = balances[i];
    } else {
      continue;
    }
    sum = sum + x;
    //Round up p
    p = (p * inv) / x;
  }

  // Calculate token balance
  return _solveAnalyticalBalance(sum, inv, amp, nPowN, p);
}

//This function calcuates the analytical solution to find the balance required
export function _solveAnalyticalBalance(
  sum: number,
  inv: number,
  amp: number,
  n_pow_n: number,
  p: number
): number {
  //Round up p
  p = (p * inv) / (amp * n_pow_n * n_pow_n);
  //Round down b
  const b = sum + inv / (amp * n_pow_n);
  //Round up c
  // let c = inv >= b
  //     ? inv.minus(b).plus(Math.sqrtUp(inv.minus(b).times(inv.minus(b)).plus(p.times(4))))
  //     : Math.sqrtUp(b.minus(inv).times(b.minus(inv)).plus(p.times(4))).minus(b.minus(inv));
  let c;
  c = inv - b + Math.sqrt(Math.pow(inv - b, 2) + 4 * p);
  //Round up y
  return c / 2;
}
