import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT1155 } from "../typechain-types";

describe("NFT1155", function () {
  let nft: NFT1155;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT1155");
    nft = (await NFT.deploy(
      "ipfs://metadata/",
      owner.address,
      1000
    )) as NFT1155;

    await nft.waitForDeployment();
  });

  it("should create edition and mint tokens", async function () {
    await nft.createEdition(1, 100);
    await nft.mintEdition(user.address, 1, 10);

    expect(await nft.balanceOf(user.address, 1)).to.equal(10);
    expect(await nft.totalSupply(1)).to.equal(10);
  });

  it("should not allow mint beyond max supply", async function () {
    await nft.createEdition(2, 5);

    await nft.mintEdition(user.address, 2, 5);

    await expect(
      nft.mintEdition(user.address, 2, 1)
    ).to.be.revertedWith("Exceeds supply");
  });

  it("should set royalty correctly", async function () {
    const salePrice = ethers.parseEther("2");
    const [receiver, royaltyAmount] =
      await nft.royaltyInfo(0, salePrice);

    expect(receiver).to.equal(owner.address);
    expect(royaltyAmount).to.equal(
      (salePrice * 1000n) / 10_000n
    );
  });
});
