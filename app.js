class AestheticTimeLockJournal {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.currentAccount = null;
        
        // Updated Contract Address for Assignment 3
        this.contractAddress = '0xc2e4A69eB24F36a6206A3C331172A298C6ef2996'; 
        
        // ABI matches the TimeLockJournal.sol provided
        this.contractABI = [
            {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        }
      ],
      "name": "EntryCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "EntryShared",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "entryId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "reader",
          "type": "address"
        }
      ],
      "name": "EntryUnlocked",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "entries",
      "outputs": [
        {
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "encryptedContent",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isUnlocked",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sharedEntries",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userEntries",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_encryptedContent",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_unlockTime",
          "type": "uint256"
        }
      ],
      "name": "writeEntry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyEntries",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_entryId",
          "type": "uint256"
        }
      ],
      "name": "readEntry",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_entryId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address"
        }
      ],
      "name": "shareEntry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_entryId",
          "type": "uint256"
        }
      ],
      "name": "getEntryDetails",
      "outputs": [
        {
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isUnlocked",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "canRead",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
        ];
        
        this.init();
    }

    async init() {
        this.initParticles();
        this.setupCustomCursor();
        this.setupEventListeners();
        // Check if wallet is already connected on page load
        this.checkConnection();
    }

    // --- CURSOR LOGIC ---
    setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        document.body.classList.add('default-cursor'); // Initial state

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = (e.clientX + 10) + 'px';
            cursor.style.top = (e.clientY + 10) + 'px';
        });

        // Event delegation for dynamically added elements (like entry cards)
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('button, .connect-btn, .save-btn, .action-btn, .close')) {
                this.setCursor('👆', 'pointer');
            } else if (e.target.closest('input, textarea')) {
                this.setCursor('📝', 'text');
            } else if (e.target.closest('.entry-card')) {
                this.setCursor('👀', 'entry'); // Use the custom entry cursor
            } else {
                this.setCursor('🌙', 'default');
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest('button, input, textarea, .entry-card, .close')) {
                 this.setCursor('🌙', 'default');
            }
        });
    }

    setCursor(emoji, type) {
        const cursor = document.querySelector('.custom-cursor');
        if(cursor) cursor.textContent = emoji;
        // Remove all current cursor classes before adding the new one
        document.body.className = document.body.className.replace(/\b\w+-cursor\b/g, '');
        document.body.classList.add(`${type}-cursor`);
    }

    // --- WALLET LOGIC ---
    async connectWallet() {
        try {
            this.setCursor('⏳', 'loading');
            
            if (typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask!');
                return;
            }

            // Using Ethers.js providers
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            this.signer = this.provider.getSigner();
            this.currentAccount = await this.signer.getAddress();
            this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
            
            this.updateWalletInfo();
            await this.loadEntries(); // Load entries from blockchain
            
            this.setCursor('✨', 'success');
            setTimeout(() => this.setCursor('🌙', 'default'), 1000);

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    this.connectWallet(); // Re-connect/re-initialize on account change
                } else {
                    window.location.reload(); // Disconnected
                }
            });
            
        } catch (error) {
            console.error(error);
            this.setCursor('🌙', 'default');
            alert('Connection failed. Make sure MetaMask is unlocked.');
        }
    }

    async checkConnection() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // If accounts exist, establish connection silently
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                this.signer = this.provider.getSigner();
                this.currentAccount = accounts[0];
                this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
                
                this.updateWalletInfo();
                await this.loadEntries();
            }
        }
    }

    updateWalletInfo() {
        document.getElementById('connectWallet').classList.add('hidden');
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('walletAddress').textContent = `${this.currentAccount.substring(0,6)}...${this.currentAccount.substring(38)}`;
        document.getElementById('saveEntry').disabled = false;
    }

    // --- JOURNAL LOGIC (READ/WRITE) ---
    
    // 1. Write to Blockchain (CRITICAL FIX APPLIED HERE)
    async saveEntry() {
        const content = document.getElementById('journalEntry').value;
        const unlockTimeInput = document.getElementById('unlockTime').value;
        const key = document.getElementById('encryptionKey').value;

        if(!content || !unlockTimeInput || !this.contract) {
            alert("Please fill in all fields and connect wallet.");
            return;
        }

        // 1. Encrypt the full content
        const encryptedContent = this.xorEncrypt(content, key || "default");
        
        // 2. Hash the full encrypted content to fit into the contract's bytes32 field (on-chain proof)
        const contentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(encryptedContent));
        
        const unlockTimestamp = Math.floor(new Date(unlockTimeInput).getTime() / 1000);

        if(unlockTimestamp <= Math.floor(Date.now() / 1000)) {
             alert("Unlock time must be in the future!");
             return;
        }
        
        try {
            this.setCursor('⏳', 'loading');
            
            // Send the transaction with the HASH
            const tx = await this.contract.writeEntry(contentHash, unlockTimestamp);
            await tx.wait();
            
            // 3. Save the full encrypted content to local storage using the HASH as the key
            localStorage.setItem(contentHash, encryptedContent);
            
            // Clear inputs
            document.getElementById('journalEntry').value = '';
            document.getElementById('unlockTime').value = '';
            document.getElementById('encryptionKey').value = '';
            
            alert("Entry saved to blockchain! Your secret content is secured in local storage.");
            this.loadEntries(); // Refresh list
            this.setCursor('✨', 'success');
        } catch (err) {
            console.error(err);
            alert("Transaction failed: " + (err.data ? err.data.message : err.message));
            this.setCursor('🌙', 'default');
        }
    }

    // 2. Load from Blockchain
    async loadEntries() {
        const list = document.getElementById('entriesList');
        if (!this.contract) {
            list.innerHTML = '<div class="empty-state" style="text-align:center;">Connect your wallet to see entries.</div>';
            return;
        }
        list.innerHTML = '<div style="text-align:center">Loading from blockchain...</div>';
        
        try {
            const myEntryIds = await this.contract.getMyEntries();
            
            if(myEntryIds.length === 0) {
                list.innerHTML = '<div class="empty-state" style="text-align:center;"><h3>No Entries Found</h3></div>';
                document.getElementById('totalEntries').innerText = 0;
                document.getElementById('unlockedEntries').innerText = 0;
                return;
            }

            list.innerHTML = ''; // Clear loading
            let unlockedCount = 0;

            // Use Promise.all for faster loading of details
            const entryPromises = myEntryIds.map(id => this.contract.getEntryDetails(id));
            const allDetails = await Promise.all(entryPromises);

            for(let i = 0; i < myEntryIds.length; i++) {
                const id = myEntryIds[i].toNumber(); // Convert BigNumber to number
                const details = allDetails[i];
                
                // details: [author, unlockTime, isUnlocked, canRead]
                const unlockTimestamp = details[1].toNumber();
                const unlockDate = new Date(unlockTimestamp * 1000).toLocaleString();
                const isLocked = Date.now() < (unlockTimestamp * 1000);
                
                if(!isLocked) unlockedCount++;

                const card = document.createElement('div');
                card.className = 'entry-card';
                card.innerHTML = `
                    <div class="entry-header">
                        <span class="entry-id">Entry ID: ${id}</span>
                        <span class="entry-status ${isLocked ? 'locked' : 'unlocked'}">
                            ${isLocked ? '🔒 Locked until ' + unlockDate : '🔓 Unlocked'}
                        </span>
                    </div>
                    <div class="entry-actions">
                        ${!isLocked ? 
                            `<button onclick="window.journal.openReadModal(${id})" class="action-btn">📖 Read</button>` : 
                            `<button disabled class="action-btn" style="opacity:0.5; padding: 0.5rem 1rem;">Wait...</button>`
                        }
                    </div>
                `;
                list.appendChild(card);
            }

            // Update stats
            document.getElementById('totalEntries').innerText = myEntryIds.length;
            document.getElementById('unlockedEntries').innerText = unlockedCount;

        } catch (err) {
            console.error("Error loading entries:", err);
            list.innerHTML = '<div style="text-align:center; color: #FF6B6B;">Error loading entries. Check console.</div>';
        }
    }

    // 3. Read Entry Modal
    openReadModal(id) {
        const modal = document.getElementById('readModal');
        modal.classList.remove('hidden');
        document.getElementById('currentReadId').value = id;
        
        // Reset modal state
        document.getElementById('entryContentDisplay').classList.add('hidden');
        document.getElementById('entryContentDisplay').textContent = '';
        document.getElementById('decryptionSection').classList.remove('hidden');
        document.getElementById('decryptKeyInput').value = '';
    }

    // 4. Decrypt Entry (CRITICAL FIX APPLIED HERE)
    async decryptEntry() {
        const id = document.getElementById('currentReadId').value;
        const key = document.getElementById('decryptKeyInput').value;
        
        if (!this.contract) {
             alert("Wallet not connected.");
             return;
        }

        try {
            // 1. Get the content HASH from the blockchain
            const contentHash = await this.contract.readEntry(id); 
            
            // 2. Use the hash (key) to retrieve the full encrypted string from local storage
            const encryptedContent = localStorage.getItem(contentHash);
            
            if (!encryptedContent) {
                // This means the user cleared their browser cache or local storage
                alert("Error: Encrypted content not found in local storage. Cannot decrypt.");
                throw new Error("Local content missing.");
            }
            
            // 3. Decrypt the full string using the provided key
            const decrypted = this.xorDecrypt(encryptedContent, key || "default");
            
            const display = document.getElementById('entryContentDisplay');
            display.textContent = decrypted; // The full content is now displayed
            display.classList.remove('hidden');
            
            // Hide decryption form
            document.getElementById('decryptionSection').classList.add('hidden');
            
        } catch (err) {
            console.error("Decryption/Read Error:", err);
            alert("Decryption failed. Check your key or try again.");
            document.getElementById('entryContentDisplay').textContent = `[DECRYPTION FAILED] ${err.message}`;
            document.getElementById('entryContentDisplay').classList.remove('hidden');
            document.getElementById('decryptionSection').classList.add('hidden');
        }
    }

    // Utilities
    // NOTE: This XOR is for demonstration only and is not secure for real-world use.
    xorEncrypt(text, key) {
        let result = "";
        for(let i=0; i<text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }
    
    xorDecrypt(text, key) {
        return this.xorEncrypt(text, key); // XOR is reversible
    }

    setupEventListeners() {
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        document.getElementById('saveEntry').addEventListener('click', () => this.saveEntry());
        document.getElementById('decryptEntryBtn').addEventListener('click', () => this.decryptEntry());
        
        document.querySelectorAll('.close').forEach(el => {
            el.addEventListener('click', () => {
                document.getElementById('readModal').classList.add('hidden');
            });
        });
    }

    initParticles() {
        /* Standard particles configuration */
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": { "number": { "value": 50 }, "color": { "value": "#ffffff" }, "opacity": { "value": 0.3, "random": true }, "size": { "value": 3, "random": true }, "move": { "enable": true, "speed": 2 } }
            });
        }
    }
}

// Instantiate the class once the script loads
window.journal = new AestheticTimeLockJournal();