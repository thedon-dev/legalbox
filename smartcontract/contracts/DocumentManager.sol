// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DocumentManager
 * @dev Smart contract for decentralized document management on BlockDAG
 * @notice Handles document ownership, permissions, and sharing functionality
 */
contract DocumentManager {
    
    // Document structure
    struct Document {
        string docHash;        // IPFS hash or document identifier
        string title;          // Document title
        string description;    // Document description
        address owner;         // Document owner address
        uint256 timestamp;     // Upload timestamp
    }
    
    // State variables
    mapping(uint256 => Document) public documents;
    mapping(uint256 => mapping(address => bool)) public documentPermissions;
    mapping(address => uint256[]) public userDocuments;
    mapping(address => uint256[]) public sharedDocuments;
    
    uint256 public documentCounter;
    address public owner;
    
    // Events
    event DocumentUploaded(uint256 indexed documentId, address indexed owner, string docHash, string title);
    event DocumentShared(uint256 indexed documentId, address indexed from, address indexed to);
    event PermissionRevoked(uint256 indexed documentId, address indexed from, address indexed to);
    event OwnershipTransferred(uint256 indexed documentId, address indexed from, address indexed to);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }
    
    modifier documentExists(uint256 _documentId) {
        require(_documentId > 0 && _documentId <= documentCounter, "Document does not exist");
        _;
    }
    
    modifier onlyDocumentOwner(uint256 _documentId) {
        require(documents[_documentId].owner == msg.sender, "Only document owner can perform this action");
        _;
    }
    
    modifier hasDocumentPermission(uint256 _documentId, address _user) {
        require(
            documents[_documentId].owner == _user || documentPermissions[_documentId][_user],
            "User does not have permission to access this document"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
        documentCounter = 0;
    }
    
    /**
     * @dev Upload a new document
     * @param _docHash IPFS hash or document identifier
     * @param _title Document title
     * @param _description Document description
     * @return documentId The ID of the created document
     */
    function uploadDocument(
        string memory _docHash,
        string memory _title,
        string memory _description
    ) external returns (uint256) {
        require(bytes(_docHash).length > 0, "Document hash cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        documentCounter++;
        uint256 documentId = documentCounter;
        
        documents[documentId] = Document({
            docHash: _docHash,
            title: _title,
            description: _description,
            owner: msg.sender,
            timestamp: block.timestamp
        });
        
        userDocuments[msg.sender].push(documentId);
        
        emit DocumentUploaded(documentId, msg.sender, _docHash, _title);
        
        return documentId;
    }
    
    /**
     * @dev Grant view permission to another address
     * @param _documentId ID of the document
     * @param _to Address to grant permission to
     */
    function grantPermission(uint256 _documentId, address _to) 
        external 
        documentExists(_documentId)
        onlyDocumentOwner(_documentId) 
    {
        require(_to != address(0), "Cannot grant permission to zero address");
        require(_to != msg.sender, "Cannot grant permission to yourself");
        require(!documentPermissions[_documentId][_to], "Permission already granted");
        
        documentPermissions[_documentId][_to] = true;
        sharedDocuments[_to].push(_documentId);
        
        emit DocumentShared(_documentId, msg.sender, _to);
    }
    
    /**
     * @dev Revoke view permission from an address
     * @param _documentId ID of the document
     * @param _from Address to revoke permission from
     */
    function revokePermission(uint256 _documentId, address _from) 
        external 
        documentExists(_documentId)
        onlyDocumentOwner(_documentId) 
    {
        require(_from != address(0), "Cannot revoke permission from zero address");
        require(documentPermissions[_documentId][_from], "Permission not granted");
        
        documentPermissions[_documentId][_from] = false;
        
        // Remove from shared documents array
        uint256[] storage shared = sharedDocuments[_from];
        for (uint256 i = 0; i < shared.length; i++) {
            if (shared[i] == _documentId) {
                shared[i] = shared[shared.length - 1];
                shared.pop();
                break;
            }
        }
        
        emit PermissionRevoked(_documentId, msg.sender, _from);
    }
    
    /**
     * @dev Transfer document ownership
     * @param _documentId ID of the document
     * @param _newOwner New owner address
     */
    function transferOwnership(uint256 _documentId, address _newOwner) 
        external 
        documentExists(_documentId)
        onlyDocumentOwner(_documentId) 
    {
        require(_newOwner != address(0), "New owner cannot be zero address");
        require(_newOwner != msg.sender, "New owner cannot be current owner");
        
        address oldOwner = documents[_documentId].owner;
        documents[_documentId].owner = _newOwner;
        
        // Update user documents arrays
        _removeFromUserDocuments(oldOwner, _documentId);
        userDocuments[_newOwner].push(_documentId);
        
        emit OwnershipTransferred(_documentId, oldOwner, _newOwner);
    }
    
    /**
     * @dev Get all documents owned by the caller
     * @return documentIds Array of document IDs owned by the caller
     */
    function getMyDocuments() external view returns (uint256[] memory) {
        return userDocuments[msg.sender];
    }
    
    /**
     * @dev Get all documents shared with the caller
     * @return documentIds Array of document IDs shared with the caller
     */
    function getSharedDocuments() external view returns (uint256[] memory) {
        return sharedDocuments[msg.sender];
    }
    
    /**
     * @dev Check if a user has permission to access a document
     * @param _documentId ID of the document
     * @param _user Address to check permission for
     * @return hasAccess True if user has permission, false otherwise
     */
    function hasPermission(uint256 _documentId, address _user) 
        external 
        view 
        documentExists(_documentId) 
        returns (bool) 
    {
        return documents[_documentId].owner == _user || documentPermissions[_documentId][_user];
    }
    
    /**
     * @dev Get document details
     * @param _documentId ID of the document
     * @return Document struct containing document details
     */
    function getDocument(uint256 _documentId) 
        external 
        view 
        documentExists(_documentId) 
        returns (Document memory) 
    {
        return documents[_documentId];
    }
    
    /**
     * @dev Get total number of documents
     * @return count Total number of documents
     */
    function getTotalDocuments() external view returns (uint256) {
        return documentCounter;
    }
    
    /**
     * @dev Get documents owned by a specific address
     * @param _owner Address to get documents for
     * @return documentIds Array of document IDs owned by the address
     */
    function getDocumentsByOwner(address _owner) external view returns (uint256[] memory) {
        return userDocuments[_owner];
    }
    
    /**
     * @dev Get documents shared with a specific address
     * @param _user Address to get shared documents for
     * @return documentIds Array of document IDs shared with the address
     */
    function getDocumentsSharedWith(address _user) external view returns (uint256[] memory) {
        return sharedDocuments[_user];
    }
    
    /**
     * @dev Internal function to remove document from user's document array
     * @param _user User address
     * @param _documentId Document ID to remove
     */
    function _removeFromUserDocuments(address _user, uint256 _documentId) internal {
        uint256[] storage userDocs = userDocuments[_user];
        for (uint256 i = 0; i < userDocs.length; i++) {
            if (userDocs[i] == _documentId) {
                userDocs[i] = userDocs[userDocs.length - 1];
                userDocs.pop();
                break;
            }
        }
    }
}
