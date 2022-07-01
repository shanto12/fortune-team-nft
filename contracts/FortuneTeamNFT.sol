// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC721/ERC721.sol";
import "./ERC721//ERC721Enumerable.sol";
import "./ERC721/ERC721URIStorage.sol";
import "./common/ERC2981.sol";
import "./common/EIP712.sol";
import "./access/Ownable.sol";

contract GenesisTeamFortuneHunter is
    ERC721,
    ERC2981,
    EIP712,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    string private constant _name = "Genesis Team Fortune Hunter";
    string private constant _symbol = "FORT";
    string public constant version = "1.0.1";
    uint96 public royaltyFees = 1000;

    mapping(uint256 => bool) public usedTokenId;
    mapping(address => uint256) public nonces;
    mapping(address => bool) public isMinter;

    constructor(address fortuneWallet)  ERC721(_name, _symbol) EIP712(_name, version){
        isMinter[msg.sender] = isMinter[fortuneWallet] = true;
    }

    function onlyMinter() private view {
        require(isMinter[msg.sender], "not minter");
    }

    function setMinter(address minter, bool status) external {
        onlyOwner();
        isMinter[minter] = status;
    }

 bytes32 private constant MINT_STRUCT_HASH =
        keccak256(
            "SafeMintWithSig(address to,uint256 tokenId,string uri,uint256 nonce)"
        );
    
    function safeMintWithSig(
        address signatory,
        address to,
        uint256 tokenId,
        string calldata uri,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        bytes32 hash = keccak256(
            abi.encode(
                MINT_STRUCT_HASH,
                to,
                tokenId,
                keccak256(bytes(uri)),
                ++nonces[signatory]
            )
        );
        address signer = ECDSA.recover(_hashTypedDataV4(hash), v, r, s);
        _setTokenIdState(tokenId);        
        require(isMinter[signer] && signer==signatory, "unauthorized signer");
        _safeMint(to, tokenId);
        _setTokenRoyalty(tokenId, feesReceiver(), royaltyFees);
        _setTokenURI(tokenId, uri);
    }

    function safeMint(address to, uint256 tokenId, string calldata uri) external {
        onlyMinter();
        _setTokenIdState(tokenId);
        _safeMint(to, tokenId);
        _setTokenRoyalty(tokenId, feesReceiver(), royaltyFees);
        _setTokenURI(tokenId, uri);
    }

    function _setTokenIdState(uint256 tokenId)private{
        require(!usedTokenId[tokenId], "tokenId in use");
        usedTokenId[tokenId]=true;
    }

    function burn(uint256 tokenId) external {
        onlyMinter();
        _burn(tokenId);
    }

    function setTokenURI(uint256 tokenId, string calldata uri) external {
        onlyMinter();
        _setTokenURI(tokenId, uri);
    }

    function setRoyaltyFees(uint96 fees) external{
        onlyOwner();
        royaltyFees = fees;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981, ERC721Enumerable)
        returns (bool)
    {
        return
            ERC2981.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId);
    }
}
