🕰️ Aesthetic TimeLock Journal DApp
A decentralized application (DApp) built on Ethereum that allows users to securely write and time-lock journal entries. The application uses Ethers.js for blockchain interaction and a Glassmorphism aesthetic for a modern, futuristic look.

🌟 Features
Wallet Integration: Connects seamlessly with MetaMask using the Ethers.js library for transaction signing and account management.

Time-Locked Entries: Users set a future timestamp; entries are non-readable until this time is reached and validated by the smart contract.

Client-Side Encryption: Entries are encrypted in the browser using a simple XOR algorithm and a user-defined key before being processed.

Off-Chain Data Security: Due to the blockchain's strict bytes32 constraint for efficient storage, the full encrypted content is stored securely in the browser's Local Storage.

On-Chain Proof (Hashing): A Keccak-256 hash of the encrypted content is stored on the smart contract, serving as an immutable, tamper-proof reference to the off-chain data.

Aesthetic UI/UX: Features a dark, glassmorphism design with custom emoji cursors and particle animations for an engaging, unique user experience.

🛠️ Technology Stack
Component,Technology,Role
Blockchain,Solidity (v0.8.0+),Smart Contract logic (TimeLockJournal.sol) defining entry storage and access rules.
Environment,Ganache / Truffle,Local blockchain development and contract deployment.
Front-End,"HTML5, CSS3, JavaScript","Structure, Glassmorphism styling, and application logic."
Web3 Library,Ethers.js (v5.7.2),Interface facilitating calls and transactions with the Ethereum smart contract.
Styling,Custom CSS Variables,"Enables maintainable theming, transitions, and custom cursor state handling."

🚀 Setup and Installation
Follow these steps to set up the DApp in a local environment using Ganache and MetaMask.

Prerequisites
Node.js and npm/yarn

Truffle Suite and Ganache installed (desktop application is easiest).

MetaMask browser extension installed.

Step 1: Deploy the Smart Contract
Start Ganache: Ensure your Ganache local blockchain is running.

Deploy the Contract:

Place the TimeLockJournal.sol file in your Truffle project's contracts directory.

In your Truffle project directory, run the migration: truffle migrate --reset

Crucially, copy the newly deployed contract address from the Truffle console output.

Step 2: Configure the Front-End
Open the app.js file and update the this.contractAddress in the constructor with the address copied from Truffle:

// app.js
this.contractAddress = 'YOUR_NEWLY_DEPLOYED_ADDRESS_HERE';

Ensure you have the three files saved in the same directory: index.html, app.js, and TimeLockJournal.sol (used for reference, not running).

Step 3: Run the ApplicationOpen index.html in a modern web browser (Chrome, Firefox, Edge) that has the MetaMask extension installed and enabled.In MetaMask, ensure the network is set to your Ganache instance (default usually points to http://127.0.0.1:8545).Click the "Connect Wallet" button on the DApp and approve the connection in MetaMask.🔑 Core Logic: Data FlowThis project uses a combination of on-chain and off-chain storage to handle long text entries while maintaining the immutability guarantee of the blockchain.1. Writing an Entry (saveEntry)The front-end performs several critical steps before and during the transaction:The user's original long entry is encrypted locally using the provided key (XOR).The entire resulting Encrypted Content string is hashed using ethers.utils.keccak256 to create a unique Content Hash ($\mathbf{bytes32}$).On-Chain (Contract): The DApp calls writeEntry(Content Hash, Unlock Time). Only the hash is stored on the immutable ledger.Off-Chain (Browser): The DApp calls localStorage.setItem(Content Hash, Encrypted Content). The full encrypted entry is stored locally, with the hash serving as its retrieval key.2. Reading an Entry (decryptEntry)On-Chain (Contract): The DApp calls readEntry(Entry ID) to retrieve the Content Hash (which is only possible if the unlock time has passed).Off-Chain (Browser): The DApp uses the retrieved Content Hash as a key to look up and retrieve the full Encrypted Content from Local Storage.The retrieved encrypted string is finally decrypted using the key provided by the user (XOR Decryption).

