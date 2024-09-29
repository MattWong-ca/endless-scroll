// import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-[#fef1dd]">
      <div className="w-full flex justify-end mb-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Connect Wallet
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center">Endless Scroll Mint</h1>

      <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Mint</h2>
        <div className="w-full h-48 bg-gray-200 mb-6"></div>
        <button className="w-full bg-black text-white py-3 px-4 rounded font-semibold hover:bg-gray-800 transition-colors">
          Mint
        </button>
      </div>

      <div className="mt-16">
        {/* You can add additional content or footer here if needed */}
      </div>
    </main>
  )
}
