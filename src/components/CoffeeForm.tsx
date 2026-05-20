'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { BUY_ME_A_COFFEE_ADDRESS, buyMeACoffeeAbi } from '@/config/buyMeACoffee'
import { baseSepolia } from 'wagmi/chains'

export function CoffeeForm() {
  const { isConnected } = useAccount()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [amountEth, setAmountEth] = useState('0.001')

  const { data: hash, isPending, isError, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !message || !amountEth || !isConnected) return

    console.log('Đang gửi giao dịch:', { name, message, amountEth, BUY_ME_A_COFFEE_ADDRESS })
    
    writeContract({
      address: BUY_ME_A_COFFEE_ADDRESS,
      abi: buyMeACoffeeAbi,
      functionName: 'buyCoffee',
      args: [name, message],
      value: parseEther(amountEth),
      chainId: baseSepolia.id,
    }, {
      onError: (err) => {
        console.error('Lỗi khi gọi writeContract:', err)
      },
      onSuccess: (data) => {
        console.log('Giao dịch đã được ký, hash:', data)
      }
    })
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>☕️</span> Buy Me A Coffee
      </h2>
      {!isConnected && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
          Hãy bấm "Sign in with Base" ở phía trên để có thể gửi cà phê nhé!
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Your name"
            required
            disabled={isPending || isConfirming}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Enjoy your coffee!"
            rows={3}
            required
            disabled={isPending || isConfirming}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
          <input
            type="number"
            step="0.0001"
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
            disabled={isPending || isConfirming}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || isConfirming || !name || !message || !isConnected}
          className="mt-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Check Wallet...' : isConfirming ? 'Processing onchain...' : 'Send Coffee'}
        </button>
      </form>
      
      {isError && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 overflow-hidden break-words">
          <strong>Lỗi giao dịch:</strong> <br/>
          {error?.message?.split('\n')[0] || 'Unknown error occurred. Please check console.'}
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
          🎉 Thank you for the coffee! <br/>
          <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noreferrer" className="underline font-medium">
            View on Basescan
          </a>
        </div>
      )}
    </div>
  )
}
