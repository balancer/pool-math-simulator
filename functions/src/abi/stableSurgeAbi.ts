export const stableSurgeAbi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "vault",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "defaultMaxSurgeFeePercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "defaultSurgeThresholdPercentage",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InputLengthMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPercentage",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "bits",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "SenderIsNotVault",
    type: "error",
  },
  {
    inputs: [],
    name: "SenderNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultNotSet",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newMaxSurgeFeePercentage",
        type: "uint256",
      },
    ],
    name: "MaxSurgeFeePercentageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "StableSurgeHookRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newSurgeThresholdPercentage",
        type: "uint256",
      },
    ],
    name: "ThresholdSurgePercentageChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
    ],
    name: "getActionId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuthorizer",
    outputs: [
      {
        internalType: "contract IAuthorizer",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDefaultMaxSurgeFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDefaultSurgeThresholdPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHookFlags",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "enableHookAdjustedAmounts",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallBeforeInitialize",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterInitialize",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallComputeDynamicSwapFee",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallBeforeSwap",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterSwap",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallBeforeAddLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterAddLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallBeforeRemoveLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "shouldCallAfterRemoveLiquidity",
            type: "bool",
          },
        ],
        internalType: "struct HookFlags",
        name: "hookFlags",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "getMaxSurgeFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "staticSwapFeePercentage",
        type: "uint256",
      },
    ],
    name: "getSurgeFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "getSurgeThresholdPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVault",
    outputs: [
      {
        internalType: "contract IVault",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "enum AddLiquidityKind",
        name: "kind",
        type: "uint8",
      },
      {
        internalType: "uint256[]",
        name: "amountsInScaled18",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amountsInRaw",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balancesScaled18",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onAfterAddLiquidity",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        internalType: "uint256[]",
        name: "hookAdjustedAmountsInRaw",
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
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onAfterInitialize",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "enum RemoveLiquidityKind",
        name: "kind",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "amountsOutScaled18",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amountsOutRaw",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "balancesScaled18",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onAfterRemoveLiquidity",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        internalType: "uint256[]",
        name: "hookAdjustedAmountsOutRaw",
        type: "uint256[]",
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
            internalType: "contract IERC20",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountInScaled18",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOutScaled18",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenInBalanceScaled18",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenOutBalanceScaled18",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountCalculatedScaled18",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountCalculatedRaw",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "userData",
            type: "bytes",
          },
        ],
        internalType: "struct AfterSwapParams",
        name: "",
        type: "tuple",
      },
    ],
    name: "onAfterSwap",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "enum AddLiquidityKind",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onBeforeAddLiquidity",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onBeforeInitialize",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "enum RemoveLiquidityKind",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onBeforeRemoveLiquidity",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
        name: "",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "onBeforeSwap",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "staticSwapFeePercentage",
        type: "uint256",
      },
    ],
    name: "onComputeDynamicSwapFeePercentage",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address",
          },
          {
            internalType: "enum TokenType",
            name: "tokenType",
            type: "uint8",
          },
          {
            internalType: "contract IRateProvider",
            name: "rateProvider",
            type: "address",
          },
          {
            internalType: "bool",
            name: "paysYieldFees",
            type: "bool",
          },
        ],
        internalType: "struct TokenConfig[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "disableUnbalancedLiquidity",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableAddLiquidityCustom",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableRemoveLiquidityCustom",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "enableDonation",
            type: "bool",
          },
        ],
        internalType: "struct LiquidityManagement",
        name: "",
        type: "tuple",
      },
    ],
    name: "onRegister",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newMaxSurgeSurgeFeePercentage",
        type: "uint256",
      },
    ],
    name: "setMaxSurgeFeePercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newSurgeThresholdPercentage",
        type: "uint256",
      },
    ],
    name: "setSurgeThresholdPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
