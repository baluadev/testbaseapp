'use client'

import dynamic from 'next/dynamic'

const ConnectWallet = dynamic(() => import('@/components/ConnectWallet').then(m => m.ConnectWallet), { ssr: false })
const CoffeeForm = dynamic(() => import('@/components/CoffeeForm').then(m => m.CoffeeForm), { ssr: false })
const CoffeeList = dynamic(() => import('@/components/CoffeeList').then(m => m.CoffeeList), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 bg-gray-50">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          ☕️ Buy Me A Coffee Onchain
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Support your favorite creators directly on the Base network. <br/>
          Zero hassle, gasless transactions with Smart Wallet, and permanent onchain messages.
        </p>
        <ConnectWallet />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-start">
        {/* Form bên trái */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <CoffeeForm />
        </div>
        
        {/* Danh sách bên phải */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <CoffeeList />
        </div>
      </div>
    </main>
  )
}
