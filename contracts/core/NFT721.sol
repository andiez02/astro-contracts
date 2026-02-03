// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Royalty.sol";

contract NFT721 is ERC721URIStorage, Ownable, Royalty {
    uint256 public nextTokenId;

    constructor(
        string memory name,
        string memory symbol,
        address royaltyReceiver,
        uint96 royaltyFee
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
    }

    function mint(
        address to,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721URIStorage, Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
