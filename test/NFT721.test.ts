import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT721 } from "../typechain-types";

describe("NFT721", function () {
  let nft: NFT721;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT721");
    nft = (await NFT.deploy(
      "Astro NFT",
      "AST",
      owner.address,
      500
    )) as NFT721;

    await nft.waitForDeployment();
  });

  it("should mint NFT and assign ownership", async function () {
    await nft.mint(user.address, "ipfs://token/1");

    expect(await nft.ownerOf(0)).to.equal(user.address);
  });

  it("should set royalty correctly", async function () {
    const salePrice = ethers.parseEther("1");
    const [receiver, royaltyAmount] =
      await nft.royaltyInfo(0, salePrice);

    expect(receiver).to.equal(owner.address);
    expect(royaltyAmount).to.equal(
      (salePrice * 500n) / 10_000n
    );
  });
});
