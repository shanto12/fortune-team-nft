// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FORTUNEExpeditionTeam2022 is ERC721, ERC721URIStorage, Pausable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public owner;
    constructor() ERC721("FORTUNE! Expedition Team 2022", "FORT") {
        owner=msg.sender;
    }

    function pause() public {
        onlyOwner();
        _pause();
    }

    function unpause() public {
        onlyOwner();
        _unpause();
    }

    function safeMint(address to, string memory uri) public {
        onlyOwner();
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        onlyTokenOwner(tokenId);
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
    function onlyTokenOwner(uint256 _id) internal view {
        require(
            ownerOf(_id) == msg.sender,
            "You are not the owner of this NFT."
        );
    }
    function onlyOwner() internal view {
        require(
            msg.sender == owner,
            "You are not the owner to call this function"
        );
    }
    function getMintedCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    function changeOwner(address _owner) external {
        onlyOwner();
        owner = _owner;
    }
    function setURI(uint256 _id, string memory _uri) external {
        onlyOwner();
        _setTokenURI(_id, _uri);
//        emit URI(_uri, _id);
    }
}
