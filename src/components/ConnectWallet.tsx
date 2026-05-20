'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isReconnecting) return <div className="text-gray-500">Reconnecting...</div>

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-3">
          {connectors.map((connector) => {
            // Style riêng cho nút Base Smart Wallet (Coinbase Wallet)
            const isBaseAccount = connector.id === 'coinbaseWalletSDK' || connector.name.includes('Base')
            
            return (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isConnecting}
                className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 ${
                  isBaseAccount 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                }`}
              >
                {isBaseAccount ? 'Sign in with Base' : `Connect ${connector.name}`}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
      <span className="font-mono text-sm text-gray-700">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <button 
        onClick={() => disconnect()}
        className="text-red-500 hover:text-red-700 font-semibold text-sm"
      >
        Disconnect
      </button>
    </div>
  )
}
