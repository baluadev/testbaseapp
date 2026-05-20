'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { SignInWithBaseButton } from '@base-org/account-ui/react'
import { createBaseAccountSDK } from '@base-org/account'
import { useEffect, useState } from 'react'

const sdk = createBaseAccountSDK({
  appName: 'Base Example App',
  appLogoUrl: 'https://base.org/logo.png',
})

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleSignIn = async () => {
    try {
      await sdk.getProvider().request({ method: 'wallet_connect' })
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  if (isReconnecting) return <div className="text-gray-500">Reconnecting...</div>

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <SignInWithBaseButton align="center" variant="solid" colorScheme="light" onClick={handleSignIn} />
        
        <div className="flex gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Connect {connector.name}
            </button>
          ))}
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
