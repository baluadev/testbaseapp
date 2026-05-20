'use client'

import { useEffect } from 'react'
import {
  useSendCalls,
  useWaitForCallsStatus,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useQueryClient } from '@tanstack/react-query'
import { encodeFunctionData } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { config } from '@/config/wagmi'
import { useWalletCapabilities } from '@/hooks/useWalletCapabilities'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

const counterQueryKey = readContractQueryOptions(config, {
  address: COUNTER_ADDRESS,
  abi: counterAbi,
  functionName: 'number',
  chainId: baseSepolia.id,
}).queryKey

export function BatchIncrement() {
  const { isConnected } = useAccount()
  const { supportsBatching } = useWalletCapabilities()

  if (!isConnected) return null

  return (
    <div className="mt-4">
      {supportsBatching ? <BatchFlow /> : <SequentialFlow />}
    </div>
  )
}

function BatchFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data, sendCalls, isPending } = useSendCalls()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForCallsStatus({
    id: data?.id as string | undefined,
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey })
    }
  }, [isSuccess, queryClient])

  if (chainId !== baseSepolia.id) {
    return (
      <button 
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
      >
        {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
      </button>
    )
  }

  const incrementData = encodeFunctionData({
    abi: counterAbi,
    functionName: 'increment',
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() =>
          sendCalls({
            calls: [
              { to: COUNTER_ADDRESS, data: incrementData },
              { to: COUNTER_ADDRESS, data: incrementData },
            ],
            chainId: baseSepolia.id,
          })
        }
        disabled={isPending || isConfirming}
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-md"
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Confirming...'
          : 'Increment x2 (Batch)'}
      </button>
      {isSuccess && <p className="text-green-600 font-semibold">Batch confirmed successfully!</p>}
    </div>
  )
}

function SequentialFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey })
    }
  }, [isSuccess, queryClient])

  if (chainId !== baseSepolia.id) {
    return (
      <button 
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
      >
        {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() =>
          writeContract({
            address: COUNTER_ADDRESS,
            abi: counterAbi,
            functionName: 'increment',
            chainId: baseSepolia.id,
          })
        }
        disabled={isPending || isConfirming}
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-md"
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Confirming...'
          : 'Increment (Standard)'}
      </button>
      {isSuccess && <p className="text-green-600 font-semibold">Transaction confirmed!</p>}
      {hash && (
        <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" className="text-sm text-blue-500 hover:underline">
          View on Basescan
        </a>
      )}
    </div>
  )
}
