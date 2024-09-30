'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import nftJson from "./utils/nft.json";
import { Alchemy, Network } from "alchemy-sdk";

declare global {
  interface Window {
    ethereum?: import('ethers').Eip1193Provider
  }
}

const { API_KEY } = process.env;

const settings = {
  apiKey: API_KEY,
  network: Network.SCROLL_SEPOLIA, // Replace with your desired network
};

const alchemy = new Alchemy(settings);

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  async function mintNFT() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0x526552E31135A4eC411acf1DaACA84Df5CcBFd41"; // TO DO: get contract address from deployment
      const mintContract = new ethers.Contract(contractAddress, nftJson.abi, signer);

      const tx = await mintContract.mintNFT();
      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);
      setTxHash(tx.hash);
      console.log("Minted! ", tx.hash);
      
    } catch (error) {
      console.error("Error minting:", error);
      alert("Failed to mint. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[#fef1dd]">
      <div className="w-full flex justify-end mb-8">
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">Endless Scroll</h1>

      <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Mint</h2>
        <Image
          src="https://i.imgur.com/wsI5KTi.png"
          width={400}
          height={400}
          alt="NFT"
          style={{ border: '3px solid black', borderRadius: '10px', marginBottom: '24px' }}
        />
        {
          isLoading ? <p>Loading...</p> : txHash ? (
            <p>
              Minted! Tx Hash:{' '}
              <a
                href={`https://sepolia.scrollscan.dev/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
              </a>
            </p>
          ) : (
            <button
              className="w-full bg-black text-white py-3 px-4 rounded font-semibold hover:bg-gray-800 transition-colors"
              onClick={mintNFT}
            >
              Mint
            </button>
          )
        }
      </div>

      <div className="mt-16">
      </div>
    </main>
  )
}
