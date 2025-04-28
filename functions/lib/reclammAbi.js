"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reclammAbi = void 0;
exports.reclammAbi = [
    {
        inputs: [],
        name: "BalanceRatioExceedsTolerance",
        type: "error",
    },
    {
        inputs: [],
        name: "DailyPriceShiftExponentTooHigh",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "fourthRootPriceRatioDelta",
                type: "uint256",
            },
        ],
        name: "FourthRootPriceRatioDeltaBelowMin",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidCenterednessMargin",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidInitialPrice",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidStartTime",
        type: "error",
    },
    {
        inputs: [],
        name: "NotImplemented",
        type: "error",
    },
    {
        inputs: [],
        name: "PoolCenterednessTooLow",
        type: "error",
    },
    {
        inputs: [],
        name: "PoolNotInitialized",
        type: "error",
    },
    {
        inputs: [],
        name: "PoolOutsideTargetRange",
        type: "error",
    },
    {
        inputs: [],
        name: "PriceRatioUpdateDurationTooShort",
        type: "error",
    },
    {
        inputs: [],
        name: "ReClammPoolBptRateUnsupported",
        type: "error",
    },
    {
        inputs: [],
        name: "TokenBalanceTooLow",
        type: "error",
    },
    {
        inputs: [],
        name: "VaultIsNotLocked",
        type: "error",
    },
    {
        inputs: [],
        name: "WrongInitializationPrices",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "centerednessMargin",
                type: "uint256",
            },
        ],
        name: "CenterednessMarginUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "dailyPriceShiftExponent",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "dailyPriceShiftBase",
                type: "uint256",
            },
        ],
        name: "DailyPriceShiftExponentUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint32",
                name: "lastTimestamp",
                type: "uint32",
            },
        ],
        name: "LastTimestampUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "startFourthRootPriceRatio",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "endFourthRootPriceRatio",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "priceRatioUpdateStartTime",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "priceRatioUpdateEndTime",
                type: "uint256",
            },
        ],
        name: "PriceRatioStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "virtualBalanceA",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "virtualBalanceB",
                type: "uint256",
            },
        ],
        name: "VirtualBalancesUpdated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "balancesLiveScaled18",
                type: "uint256[]",
            },
            {
                internalType: "uint256",
                name: "tokenInIndex",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "invariantRatio",
                type: "uint256",
            },
        ],
        name: "computeBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "newBalance",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "computeCurrentFourthRootPriceRatio",
        outputs: [
            {
                internalType: "uint256",
                name: "currentFourthRootPriceRatio",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "computeCurrentPoolCenteredness",
        outputs: [
            {
                internalType: "uint256",
                name: "poolCenteredness",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "computeCurrentPriceRange",
        outputs: [
            {
                internalType: "uint256",
                name: "minPrice",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "maxPrice",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "computeCurrentVirtualBalances",
        outputs: [
            {
                internalType: "uint256",
                name: "currentVirtualBalanceA",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "currentVirtualBalanceB",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "changed",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "computeInitialBalanceRatio",
        outputs: [
            {
                internalType: "uint256",
                name: "balanceRatio",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IERC20",
                name: "referenceToken",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "referenceAmountIn",
                type: "uint256",
            },
        ],
        name: "computeInitialBalances",
        outputs: [
            {
                internalType: "uint256[]",
                name: "initialBalances",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "balancesLiveScaled18",
                type: "uint256[]",
            },
            {
                internalType: "enum Rounding",
                name: "rounding",
                type: "uint8",
            },
        ],
        name: "computeInvariant",
        outputs: [
            {
                internalType: "uint256",
                name: "invariant",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCenterednessMargin",
        outputs: [
            {
                internalType: "uint256",
                name: "centerednessMargin",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDailyPriceShiftBase",
        outputs: [
            {
                internalType: "uint256",
                name: "dailyPriceShiftBase",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDailyPriceShiftExponent",
        outputs: [
            {
                internalType: "uint256",
                name: "dailyPriceShiftExponent",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLastTimestamp",
        outputs: [
            {
                internalType: "uint32",
                name: "lastTimestamp",
                type: "uint32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLastVirtualBalances",
        outputs: [
            {
                internalType: "uint256",
                name: "lastVirtualBalanceA",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "lastVirtualBalanceB",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMaximumInvariantRatio",
        outputs: [
            {
                internalType: "uint256",
                name: "maximumInvariantRatio",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMaximumSwapFeePercentage",
        outputs: [
            {
                internalType: "uint256",
                name: "maximumSwapFeePercentage",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMinimumInvariantRatio",
        outputs: [
            {
                internalType: "uint256",
                name: "minimumInvariantRatio",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMinimumSwapFeePercentage",
        outputs: [
            {
                internalType: "uint256",
                name: "minimumSwapFeePercentage",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPriceRatioState",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint96",
                        name: "startFourthRootPriceRatio",
                        type: "uint96",
                    },
                    {
                        internalType: "uint96",
                        name: "endFourthRootPriceRatio",
                        type: "uint96",
                    },
                    {
                        internalType: "uint32",
                        name: "priceRatioUpdateStartTime",
                        type: "uint32",
                    },
                    {
                        internalType: "uint32",
                        name: "priceRatioUpdateEndTime",
                        type: "uint32",
                    },
                ],
                internalType: "struct PriceRatioState",
                name: "priceRatioState",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getReClammPoolDynamicData",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256[]",
                        name: "balancesLiveScaled18",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256[]",
                        name: "tokenRates",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256",
                        name: "staticSwapFeePercentage",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "totalSupply",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "lastTimestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[]",
                        name: "lastVirtualBalances",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256",
                        name: "dailyPriceShiftBase",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "centerednessMargin",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "currentFourthRootPriceRatio",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "startFourthRootPriceRatio",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "endFourthRootPriceRatio",
                        type: "uint256",
                    },
                    {
                        internalType: "uint32",
                        name: "priceRatioUpdateStartTime",
                        type: "uint32",
                    },
                    {
                        internalType: "uint32",
                        name: "priceRatioUpdateEndTime",
                        type: "uint32",
                    },
                    {
                        internalType: "bool",
                        name: "isPoolInitialized",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "isPoolPaused",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "isPoolInRecoveryMode",
                        type: "bool",
                    },
                ],
                internalType: "struct ReClammPoolDynamicData",
                name: "data",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getReClammPoolImmutableData",
        outputs: [
            {
                components: [
                    {
                        internalType: "contract IERC20[]",
                        name: "tokens",
                        type: "address[]",
                    },
                    {
                        internalType: "uint256[]",
                        name: "decimalScalingFactors",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256",
                        name: "initialMinPrice",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "initialMaxPrice",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "initialTargetPrice",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "initialDailyPriceShiftExponent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "initialCenterednessMargin",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "minCenterednessMargin",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxCenterednessMargin",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "minTokenBalanceScaled18",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "minPoolCenteredness",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxDailyPriceShiftExponent",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "minPriceRatioUpdateDuration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "minFourthRootPriceRatioDelta",
                        type: "uint256",
                    },
                ],
                internalType: "struct ReClammPoolImmutableData",
                name: "data",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "isPoolWithinTargetRange",
        outputs: [
            {
                internalType: "bool",
                name: "isWithinTargetRange",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "isPoolWithinTargetRangeUsingCurrentVirtualBalances",
        outputs: [
            {
                internalType: "bool",
                name: "isWithinTargetRange",
                type: "bool",
            },
            {
                internalType: "bool",
                name: "virtualBalancesChanged",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "enum SwapKind",
                        name: "kind",
                        type: "uint8",
                    },
                    {
                        internalType: "uint256",
                        name: "amountGivenScaled18",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[]",
                        name: "balancesScaled18",
                        type: "uint256[]",
                    },
                    {
                        internalType: "uint256",
                        name: "indexIn",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "indexOut",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "router",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "userData",
                        type: "bytes",
                    },
                ],
                internalType: "struct PoolSwapParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "onSwap",
        outputs: [
            {
                internalType: "uint256",
                name: "amountCalculatedScaled18",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "newCenterednessMargin",
                type: "uint256",
            },
        ],
        name: "setCenterednessMargin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "newDailyPriceShiftExponent",
                type: "uint256",
            },
        ],
        name: "setDailyPriceShiftExponent",
        outputs: [
            {
                internalType: "uint256",
                name: "actualNewDailyPriceShiftExponent",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "endFourthRootPriceRatio",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "priceRatioUpdateStartTime",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "priceRatioUpdateEndTime",
                type: "uint256",
            },
        ],
        name: "setPriceRatioState",
        outputs: [
            {
                internalType: "uint256",
                name: "actualPriceRatioUpdateStartTime",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentLiveBalances",
        outputs: [
            {
                internalType: "uint256[]",
                name: "balancesLiveScaled18",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
//# sourceMappingURL=reclammAbi.js.map