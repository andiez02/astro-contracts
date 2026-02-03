// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../core/NFT721.sol";
import "../core/NFT1155.sol";

contract CollectionFactory {
    event CollectionCreated(
        address indexed creator,
        address collection,
        string collectionType
    );

    function createERC721Collection(
        string memory name,
        string memory symbol,
        address royaltyReceiver,
        uint96 royaltyFee
    ) external returns (address) {
        NFT721 collection = new NFT721(
            name,
            symbol,
            royaltyReceiver,
            royaltyFee
        );
        collection.transferOwnership(msg.sender);
        emit CollectionCreated(msg.sender, address(collection), "ERC721");
        return address(collection);
    }

    function createERC1155Collection(
        string memory baseURI,
        address royaltyReceiver,
        uint96 royaltyFee
    ) external returns (address) {
        NFT1155 collection = new NFT1155(baseURI, royaltyReceiver, royaltyFee);
        collection.transferOwnership(msg.sender);
        emit CollectionCreated(msg.sender, address(collection), "ERC1155");
        return address(collection);
    }
}
