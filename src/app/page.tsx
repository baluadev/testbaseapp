import { ConnectWallet } from '@/components/ConnectWallet'
import { CounterDisplay } from '@/components/CounterDisplay'
import { BatchIncrement } from '@/components/BatchIncrement'
import { PayButton } from '@/components/PayButton'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gray-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Base Onchain Starter
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A starter template to build Next.js applications on Base. 
          Connect your Smart Wallet, interact with a smart contract, and try out Base Pay.
        </p>
      </div>

      <ConnectWallet />
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-start">
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <CounterDisplay />
          <BatchIncrement />
        </div>
        
        <div className="w-full md:w-1/2">
          <PayButton />
        </div>
      </div>
    </main>
  )
}
