export const COUNTER_ADDRESS = '0x192dCb3B8466C7db2fBA673F023b3Ac0375Eeecc' as const

export const counterAbi = [
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
