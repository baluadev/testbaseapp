'use client'

import { useReadContract, useAccount } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

export function CounterDisplay() {
  const { isConnected } = useAccount()
  const { data: count, isLoading, isError } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterAbi,
    functionName: 'number',
    chainId: baseSepolia.id,
  })

  if (!isConnected) return null

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-gray-500 font-semibold mb-2">Current Onchain Count</h2>
      
      {isLoading && count === undefined ? (
        <div className="text-3xl font-bold animate-pulse text-gray-300">...</div>
      ) : isError && count === undefined ? (
        <p className="text-red-500 font-medium">Failed to read contract</p>
      ) : (
        <p className="text-6xl font-black text-blue-600">{count?.toString()}</p>
      )}
    </div>
  )
}
