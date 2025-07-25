export const stablePoolAbi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amplificationParameter",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "version",
            type: "string",
          },
        ],
        internalType: "struct StablePool.NewPoolParams",
        name: "params",
        type: "tuple",
      },
      {
        internalType: "contract IVault",
        name: "vault",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmpUpdateAlreadyStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "AmpUpdateDurationTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "AmpUpdateNotStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "AmpUpdateRateTooFast",
    type: "error",
  },
  {
    inputs: [],
    name: "AmplificationFactorTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "AmplificationFactorTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "ERC2612ExpiredSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC2612InvalidSigner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256",
      },
    ],
    name: "InvalidAccountNonce",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidShortString",
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
    name: "StableComputeBalanceDidNotConverge",
    type: "error",
  },
  {
    inputs: [],
    name: "StableInvariantDidNotConverge",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroDivision",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "startValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "AmpUpdateStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "currentValue",
        type: "uint256",
      },
    ],
    name: "AmpUpdateStopped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
    name: "PERMIT_TYPEHASH",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
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
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "emitApproval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "emitTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
    name: "getAggregateFeePercentages",
    outputs: [
      {
        internalType: "uint256",
        name: "aggregateSwapFeePercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "aggregateYieldFeePercentage",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAmplificationParameter",
    outputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isUpdating",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "precision",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAmplificationState",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "startValue",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "endValue",
            type: "uint64",
          },
          {
            internalType: "uint32",
            name: "startTime",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "endTime",
            type: "uint32",
          },
        ],
        internalType: "struct AmplificationState",
        name: "amplificationState",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "precision",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
  {
    inputs: [],
    name: "getMaximumInvariantRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaximumSwapFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinimumInvariantRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinimumSwapFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getRate",
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
    name: "getStablePoolDynamicData",
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
            name: "bptRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amplificationParameter",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startValue",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endValue",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "startTime",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "endTime",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isAmpUpdating",
            type: "bool",
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
        internalType: "struct StablePoolDynamicData",
        name: "data",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStablePoolImmutableData",
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
            name: "amplificationParameterPrecision",
            type: "uint256",
          },
        ],
        internalType: "struct StablePoolImmutableData",
        name: "data",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStaticSwapFeePercentage",
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
    name: "getTokenInfo",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {
        components: [
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
        internalType: "struct TokenInfo[]",
        name: "tokenInfo",
        type: "tuple[]",
      },
      {
        internalType: "uint256[]",
        name: "balancesRaw",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "lastBalancesLiveScaled18",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokens",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
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
    inputs: [],
    name: "incrementNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
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
        name: "request",
        type: "tuple",
      },
    ],
    name: "onSwap",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rawEndValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "startAmplificationParameterUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stopAmplificationParameterUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
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
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
