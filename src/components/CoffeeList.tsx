'use client'

import { useReadContract, useWatchContractEvent } from 'wagmi'
import { formatEther } from 'viem'
import { BUY_ME_A_COFFEE_ADDRESS, buyMeACoffeeAbi } from '@/config/buyMeACoffee'
import { baseSepolia } from 'wagmi/chains'
import { useQueryClient } from '@tanstack/react-query'

export function CoffeeList() {
  const queryClient = useQueryClient()

  // Lắng nghe sự kiện NewMemo để tự động cập nhật danh sách
  useWatchContractEvent({
    address: BUY_ME_A_COFFEE_ADDRESS,
    abi: buyMeACoffeeAbi,
    eventName: 'NewMemo',
    chainId: baseSepolia.id,
    onLogs(logs) {
      console.log('New memo event:', logs)
      // Tự động invalidate cache để gọi lại useReadContract
      queryClient.invalidateQueries()
    },
  })

  const { data: memos, isLoading, isError } = useReadContract({
    address: BUY_ME_A_COFFEE_ADDRESS,
    abi: buyMeACoffeeAbi,
    functionName: 'getMemos',
    chainId: baseSepolia.id,
  })

  if (isLoading) return <div className="animate-pulse text-gray-500 mt-8">Loading memos...</div>
  if (isError) return <div className="text-red-500 mt-8">Could not load memos. Are you on the correct network?</div>
  if (!memos || memos.length === 0) return <div className="text-gray-500 mt-8 italic">No one has bought a coffee yet. Be the first!</div>

  // Memos được nối vào cuối mảng trong contract, ta nên đảo ngược để xem mới nhất trước
  const sortedMemos = [...memos].reverse()

  return (
    <div className="w-full max-w-2xl mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Coffees ({memos.length})</h3>
      <div className="flex flex-col gap-4">
        {sortedMemos.map((memo, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-gray-900">{memo.name}</span>
                <span className="text-gray-500 text-sm ml-2">bought a coffee</span>
              </div>
              <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                {formatEther(memo.amount)} ETH
              </span>
            </div>
            
            <p className="text-gray-700 mt-1 italic">&quot;{memo.message}&quot;</p>
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
              <span className="font-mono">{memo.from.slice(0, 6)}...{memo.from.slice(-4)}</span>
              <span>{new Date(Number(memo.timestamp) * 1000).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
