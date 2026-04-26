# 🎓 Decentralized Student Grant Pool (Web3 DApp)

> A transparent, blockchain-based academic funding platform built on Ethereum's Sepolia testnet.

## 🚀 Overview
The "Student Grant Pool" is a decentralized application (DApp) designed to facilitate transparent, blockchain-based academic funding. The platform allows users to contribute a fixed amount of ETH (0.01 ETH) into a collective grant pool. A verifiable smart contract then pseudo-randomly selects a student contributor to receive the total accumulated funds, eliminating the need for a centralized financial intermediary.

## 🛠️ Technology Stack
* **Smart Contract:** Solidity (v0.8.24)
* **Development Environment:** Hardhat, Node.js
* **Frontend Interface:** Next.js, React, TypeScript, Web3.js
* **Styling:** CSS Modules (Glassmorphism / Cyberpunk UI theme)
* **Wallet Integration:** MetaMask (Injected Web3 Provider)
* **Network:** Ethereum Sepolia Testnet (via RPC)

## ⚙️ System Architecture & Workflow
1. **Initialization:** The `GrantPool.sol` contract is deployed, setting the deployer as the Admin.
2. **Contribution Phase:** Users connect their MetaMask wallets and call the `enter()` function, sending exactly 0.01 ETH to the contract.
3. **State Management:** The React frontend uses the Context API to continuously poll the smart contract via Web3.js, updating the UI with the current pool balance and participant array.
4. **Distribution:** The Admin triggers the `pickWinner()` function. The contract calculates a pseudo-random index, transfers the entire balance to the selected address, and resets the state for the next funding round.

## 🌍 Deployment Details
* **Network:** Sepolia Testnet
* **Contract Address:** `0x2762D6b29132029Ea20D646BABAF20fBE9522CD5`

*(Insert UI and Terminal Deployment Screenshots Here)*

## 🧠 Technical Challenges & Solutions
During development, several architectural challenges were resolved:
* **EVM Network Transitions:** Migrated from a local Hardhat node to the public Sepolia testnet, requiring proper configuration of environment variables for secure RPC URL and Private Key injection.
* **Frontend State Synchronization:** Addressed race conditions in the UI by implementing `useEffect` and `useCallback` hooks to ensure the Web3 provider only fetched contract data after the `window.ethereum` object was successfully injected by MetaMask.
* **Type Safety:** Implemented strict TypeScript interfaces for the React Context to ensure stable prop drilling between the Web3 provider and the UI components.