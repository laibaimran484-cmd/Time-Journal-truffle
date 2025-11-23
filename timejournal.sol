// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLockJournal {
    struct JournalEntry {
        address author;
        bytes32 encryptedContent;
        uint256 unlockTime;
        bool isUnlocked;
        bool exists;
    }
    
    mapping(uint256 => JournalEntry) public entries;
    mapping(address => uint256[]) public userEntries;
    mapping(uint256 => mapping(address => bool)) public sharedEntries;
    
    uint256 private entryCounter;
    
    event EntryCreated(uint256 entryId, address author, uint256 unlockTime);
    event EntryUnlocked(uint256 entryId, address reader);
    event EntryShared(uint256 entryId, address recipient);
    
    function writeEntry(bytes32 _encryptedContent, uint256 _unlockTime) external {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        
        entryCounter++;
        entries[entryCounter] = JournalEntry({
            author: msg.sender,
            encryptedContent: _encryptedContent,
            unlockTime: _unlockTime,
            isUnlocked: false,
            exists: true
        });
        
        userEntries[msg.sender].push(entryCounter);
        emit EntryCreated(entryCounter, msg.sender, _unlockTime);
    }
    
    function getMyEntries() external view returns (uint256[] memory) {
        return userEntries[msg.sender];
    }
    
    function readEntry(uint256 _entryId) external view returns (bytes32) {
        require(entries[_entryId].exists, "Entry does not exist");
        require(
            entries[_entryId].author == msg.sender || 
            sharedEntries[_entryId][msg.sender],
            "Not authorized to read this entry"
        );
        require(
            block.timestamp >= entries[_entryId].unlockTime,
            "Entry is still locked"
        );
        
        return entries[_entryId].encryptedContent;
    }
    
    function shareEntry(uint256 _entryId, address _recipient) external {
        require(entries[_entryId].exists, "Entry does not exist");
        require(entries[_entryId].author == msg.sender, "Only author can share");
        
        sharedEntries[_entryId][_recipient] = true;
        emit EntryShared(_entryId, _recipient);
    }
    
    function getEntryDetails(uint256 _entryId) external view returns (
        address author,
        uint256 unlockTime,
        bool isUnlocked,
        bool canRead
    ) {
        require(entries[_entryId].exists, "Entry does not exist");
        
        JournalEntry memory entry = entries[_entryId];
        bool readable = (entry.author == msg.sender || sharedEntries[_entryId][msg.sender]) &&
                       block.timestamp >= entry.unlockTime;
        
        return (
            entry.author,
            entry.unlockTime,
            block.timestamp >= entry.unlockTime,
            readable
        );
    }
}