export const vaultExtensionAbi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "mainVault",
        type: "address",
      },
      {
        internalType: "contract IVaultAdmin",
        name: "vaultAdmin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [],
    name: "AfterAddLiquidityHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "AfterInitializeHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "AfterRemoveLiquidityHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "AfterSwapHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountGivenZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAmountIn",
        type: "uint256",
      },
    ],
    name: "AmountInAboveMax",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
    ],
    name: "AmountOutBelowMin",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceNotSettled",
    type: "error",
  },
  {
    inputs: [],
    name: "BalanceOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "BeforeAddLiquidityHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "BeforeInitializeHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "BeforeRemoveLiquidityHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "BeforeSwapHookFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAmountIn",
        type: "uint256",
      },
    ],
    name: "BptAmountInAboveMax",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
    ],
    name: "BptAmountOutBelowMin",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "BufferAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "BufferNotInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "BufferSharesInvalidOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "BufferSharesInvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
    ],
    name: "BufferTotalSupplyTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotReceiveEth",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotSwapSameToken",
    type: "error",
  },
  {
    inputs: [],
    name: "CodecOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "DoesNotSupportAddLiquidityCustom",
    type: "error",
  },
  {
    inputs: [],
    name: "DoesNotSupportDonation",
    type: "error",
  },
  {
    inputs: [],
    name: "DoesNotSupportRemoveLiquidityCustom",
    type: "error",
  },
  {
    inputs: [],
    name: "DoesNotSupportUnbalancedLiquidity",
    type: "error",
  },
  {
    inputs: [],
    name: "DynamicSwapFeeHookFailed",
    type: "error",
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
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
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
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorSelectorNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "FeePrecisionTooHigh",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAmountIn",
        type: "uint256",
      },
    ],
    name: "HookAdjustedAmountInAboveMax",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
    ],
    name: "HookAdjustedAmountOutBelowMin",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "HookAdjustedSwapLimit",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "poolHooksContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "poolFactory",
        type: "address",
      },
    ],
    name: "HookRegistrationFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "InputLengthMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddLiquidityKind",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRemoveLiquidityKind",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenConfiguration",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenDecimals",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenType",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "InvalidUnderlyingToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "issuedShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minIssuedShares",
        type: "uint256",
      },
    ],
    name: "IssuedSharesBelowMin",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxTokens",
    type: "error",
  },
  {
    inputs: [],
    name: "MinTokens",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughBufferShares",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expectedUnderlyingAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actualUnderlyingAmount",
        type: "uint256",
      },
    ],
    name: "NotEnoughUnderlying",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expectedWrappedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actualWrappedAmount",
        type: "uint256",
      },
    ],
    name: "NotEnoughWrapped",
    type: "error",
  },
  {
    inputs: [],
    name: "NotStaticCall",
    type: "error",
  },
  {
    inputs: [],
    name: "NotVaultDelegateCall",
    type: "error",
  },
  {
    inputs: [],
    name: "OutOfBounds",
    type: "error",
  },
  {
    inputs: [],
    name: "PauseBufferPeriodDurationTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "PercentageAboveMax",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolInRecoveryMode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolNotInRecoveryMode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolNotInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolNotPaused",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolNotRegistered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolPauseWindowExpired",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolPaused",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
    ],
    name: "PoolTotalSupplyTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "ProtocolFeesExceedTotalCollected",
    type: "error",
  },
  {
    inputs: [],
    name: "QueriesDisabled",
    type: "error",
  },
  {
    inputs: [],
    name: "QueriesDisabledPermanently",
    type: "error",
  },
  {
    inputs: [],
    name: "QuoteResultSpoofed",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "result",
        type: "bytes",
      },
    ],
    name: "Result",
    type: "error",
  },
  {
    inputs: [],
    name: "RouterNotTrusted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "SafeCastOverflowedUintToInt",
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
    name: "SwapFeePercentageTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "SwapFeePercentageTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "SwapLimit",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "TokenAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "TokenNotRegistered",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "expectedToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "actualToken",
        type: "address",
      },
    ],
    name: "TokensMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "TokensNotSorted",
    type: "error",
  },
  {
    inputs: [],
    name: "TradeAmountTooSmall",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultBuffersArePaused",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultIsNotUnlocked",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultNotPaused",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultPauseWindowDurationTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultPauseWindowExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "VaultPaused",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "WrapAmountTooSmall",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongProtocolFeeControllerDeployment",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "underlyingToken",
        type: "address",
      },
    ],
    name: "WrongUnderlyingToken",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongVaultAdminDeployment",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongVaultExtensionDeployment",
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
        name: "aggregateSwapFeePercentage",
        type: "uint256",
      },
    ],
    name: "AggregateSwapFeePercentageChanged",
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
        name: "aggregateYieldFeePercentage",
        type: "uint256",
      },
    ],
    name: "AggregateYieldFeePercentageChanged",
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
    inputs: [
      {
        indexed: true,
        internalType: "contract IAuthorizer",
        name: "newAuthorizer",
        type: "address",
      },
    ],
    name: "AuthorizerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "burnedShares",
        type: "uint256",
      },
    ],
    name: "BufferSharesBurned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
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
        name: "issuedShares",
        type: "uint256",
      },
    ],
    name: "BufferSharesMinted",
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
        name: "liquidityProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum AddLiquidityKind",
        name: "kind",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsAddedRaw",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "swapFeeAmountsRaw",
        type: "uint256[]",
      },
    ],
    name: "LiquidityAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountWrapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "LiquidityAddedToBuffer",
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
        name: "liquidityProvider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum RemoveLiquidityKind",
        name: "kind",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsRemovedRaw",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "swapFeeAmountsRaw",
        type: "uint256[]",
      },
    ],
    name: "LiquidityRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountWrapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "LiquidityRemovedFromBuffer",
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
    ],
    name: "PoolInitialized",
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
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
    ],
    name: "PoolPausedStateChanged",
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
        internalType: "bool",
        name: "recoveryMode",
        type: "bool",
      },
    ],
    name: "PoolRecoveryModeStateChanged",
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
        indexed: false,
        internalType: "struct TokenConfig[]",
        name: "tokenConfig",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "pauseWindowEndTime",
        type: "uint32",
      },
      {
        components: [
          {
            internalType: "address",
            name: "pauseManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFeeManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "poolCreator",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct PoolRoleAccounts",
        name: "roleAccounts",
        type: "tuple",
      },
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
          {
            internalType: "address",
            name: "hooksContract",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct HooksConfig",
        name: "hooksConfig",
        type: "tuple",
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
        indexed: false,
        internalType: "struct LiquidityManagement",
        name: "liquidityManagement",
        type: "tuple",
      },
    ],
    name: "PoolRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IProtocolFeeController",
        name: "newProtocolFeeController",
        type: "address",
      },
    ],
    name: "ProtocolFeeControllerChanged",
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
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeeAmount",
        type: "uint256",
      },
    ],
    name: "Swap",
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
        name: "swapFeePercentage",
        type: "uint256",
      },
    ],
    name: "SwapFeePercentageChanged",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "burnedShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawnUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "Unwrap",
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
        internalType: "bytes32",
        name: "eventKey",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "eventData",
        type: "bytes",
      },
    ],
    name: "VaultAuxiliary",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
    ],
    name: "VaultBuffersPausedStateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
    ],
    name: "VaultPausedStateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "VaultQueriesDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "VaultQueriesEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "depositedUnderlying",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintedShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "bufferBalances",
        type: "bytes32",
      },
    ],
    name: "Wrap",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
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
        name: "token",
        type: "address",
      },
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
        internalType: "address",
        name: "pool",
        type: "address",
      },
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
        name: "swapParams",
        type: "tuple",
      },
    ],
    name: "computeDynamicSwapFeePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "dynamicSwapFeePercentage",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "eventKey",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "eventData",
        type: "bytes",
      },
    ],
    name: "emitAuxiliaryEvent",
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
    ],
    name: "getAddLiquidityCalledFlag",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "getAggregateSwapFeeAmount",
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
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "getAggregateYieldFeeAmount",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "getBptRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
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
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "getERC4626BufferAsset",
    outputs: [
      {
        internalType: "address",
        name: "asset",
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
        name: "pool",
        type: "address",
      },
    ],
    name: "getHooksConfig",
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
          {
            internalType: "address",
            name: "hooksContract",
            type: "address",
          },
        ],
        internalType: "struct HooksConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNonzeroDeltaCount",
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
    name: "getPoolConfig",
    outputs: [
      {
        components: [
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
            name: "liquidityManagement",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "staticSwapFeePercentage",
            type: "uint256",
          },
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
          {
            internalType: "uint40",
            name: "tokenDecimalDiffs",
            type: "uint40",
          },
          {
            internalType: "uint32",
            name: "pauseWindowEndTime",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "isPoolRegistered",
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
        internalType: "struct PoolConfig",
        name: "",
        type: "tuple",
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
    name: "getPoolData",
    outputs: [
      {
        components: [
          {
            internalType: "PoolConfigBits",
            name: "poolConfigBits",
            type: "bytes32",
          },
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
            name: "balancesLiveScaled18",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "tokenRates",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "decimalScalingFactors",
            type: "uint256[]",
          },
        ],
        internalType: "struct PoolData",
        name: "",
        type: "tuple",
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
    name: "getPoolPausedState",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "address",
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
        name: "pool",
        type: "address",
      },
    ],
    name: "getPoolRoleAccounts",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pauseManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFeeManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "poolCreator",
            type: "address",
          },
        ],
        internalType: "struct PoolRoleAccounts",
        name: "",
        type: "tuple",
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
    name: "getPoolTokenInfo",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "getPoolTokenRates",
    outputs: [
      {
        internalType: "uint256[]",
        name: "decimalScalingFactors",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "tokenRates",
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
        name: "pool",
        type: "address",
      },
    ],
    name: "getPoolTokens",
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
    name: "getProtocolFeeController",
    outputs: [
      {
        internalType: "contract IProtocolFeeController",
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
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "getReservesOf",
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
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenDelta",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultAdmin",
    outputs: [
      {
        internalType: "address",
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
        name: "pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "exactAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC4626",
        name: "wrappedToken",
        type: "address",
      },
    ],
    name: "isERC4626BufferInitialized",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "isPoolInRecoveryMode",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "isPoolInitialized",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "isPoolPaused",
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
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "isPoolRegistered",
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
    name: "isQueryDisabled",
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
    name: "isQueryDisabledPermanently",
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
    name: "isUnlocked",
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
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "quote",
    outputs: [
      {
        internalType: "bytes",
        name: "result",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "quoteAndRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reentrancyGuardEntered",
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
    inputs: [
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
        name: "tokenConfig",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "pauseWindowEndTime",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "protocolFeeExempt",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "address",
            name: "pauseManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFeeManager",
            type: "address",
          },
          {
            internalType: "address",
            name: "poolCreator",
            type: "address",
          },
        ],
        internalType: "struct PoolRoleAccounts",
        name: "roleAccounts",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "poolHooksContract",
        type: "address",
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
        name: "liquidityManagement",
        type: "tuple",
      },
    ],
    name: "registerPool",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minAmountsOut",
        type: "uint256[]",
      },
    ],
    name: "removeLiquidityRecovery",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsOutRaw",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
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
    inputs: [],
    name: "vault",
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
    stateMutability: "payable",
    type: "receive",
  },
];
