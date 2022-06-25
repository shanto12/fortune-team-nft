// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC721/ERC721.sol";
import "./ERC721//ERC721Enumerable.sol";
import "./ERC721/ERC721URIStorage.sol";
import "./common/ERC2981.sol";
import "./access/Ownable.sol";
import "./libraries/Counters.sol";

contract GenesisTeamFortuneHunter is
    ERC721,
    ERC2981,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;
    string private constant _name = "Genesis Team Fortune Hunter";
    string private constant _symbol = "FORT";
    uint96 public constant royaltyFees = 1000;

    mapping(address => bool) public isMinter;
    Counters.Counter private _tokenIdCounter;

    constructor(address fortuneWallet)  ERC721(_name, _symbol) {
        isMinter[msg.sender] = isMinter[fortuneWallet] = true;
    }

    function onlyMinter() private view {
        require(isMinter[msg.sender], "not minter");
    }

    function setMinter(address minter, bool status) external {
        onlyOwner();
        isMinter[minter] = status;
    }

    function safeMint(address to, string calldata uri) external {
        onlyMinter();
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenRoyalty(tokenId, feesReceiver(), royaltyFees);
        _setTokenURI(tokenId, uri);
    }

    function burn(uint256 tokenId) external {
        onlyMinter();
        _burn(tokenId);
    }

    function setTokenURI(uint256 tokenId, string calldata uri) external {
        onlyMinter();
        _setTokenURI(tokenId, uri);
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
