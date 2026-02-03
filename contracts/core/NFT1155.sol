// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Royalty.sol";

contract NFT1155 is ERC1155, Ownable, Royalty {
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public maxSupply;

    constructor(
        string memory baseURI,
        address royaltyReceiver,
        uint96 royaltyFee
    ) ERC1155(baseURI) Ownable(msg.sender) {
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
    }

    function createEdition(uint256 tokenId, uint256 supply) external onlyOwner {
        require(maxSupply[tokenId] == 0, "Edition exists");
        maxSupply[tokenId] = supply;
    }

    function mintEdition(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        require(
            totalSupply[tokenId] + amount <= maxSupply[tokenId],
            "Exceeds supply"
        );
        totalSupply[tokenId] += amount;
        _mint(to, tokenId, amount, "");
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
