'use client'

import { useState } from 'react'
import { pay, getPaymentStatus } from '@base-org/account'
import { BasePayButton } from '@base-org/account-ui/react'
import { useAccount } from 'wagmi'

export function PayButton() {
  const { isConnected } = useAccount()
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentId, setPaymentId] = useState('')

  const handlePayment = async () => {
    try {
      const { id } = await pay({
        amount: '0.01', 
        to: '0x192dCb3B8466C7db2fBA673F023b3Ac0375Eeecc', // Dummy address
        testnet: true
      })
      setPaymentId(id)
      setPaymentStatus('Payment initiated! Click "Check Status" to see the result.')
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStatus('Payment failed or cancelled.')
    }
  }

  const handleCheckStatus = async () => {
    if (!paymentId) return
    try {
      const { status } = await getPaymentStatus({ id: paymentId })
      setPaymentStatus(`Payment status: ${status}`)
    } catch (error) {
      console.error('Status check failed:', error)
      setPaymentStatus('Status check failed')
    }
  }

  if (!isConnected) return null

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
      <h2 className="text-xl font-bold">Try Base Pay (Simulation)</h2>
      <BasePayButton colorScheme="light" onClick={handlePayment} />
      
      {paymentId && (
        <button
          onClick={handleCheckStatus}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Check Payment Status
        </button>
      )}
      
      {paymentStatus && (
        <div className="text-sm font-medium text-gray-700 mt-2 bg-gray-50 px-3 py-2 rounded">
          {paymentStatus}
        </div>
      )}
    </div>
  )
}
