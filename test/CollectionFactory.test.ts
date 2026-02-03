import { expect } from "chai";
import { ethers } from "hardhat";
import {
  CollectionFactory,
  NFT721,
  NFT1155,
} from "../typechain-types";

describe("CollectionFactory", function () {
  let factory: CollectionFactory;
  let user: any;

  beforeEach(async function () {
    [, user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CollectionFactory");
    factory = (await Factory.deploy()) as CollectionFactory;
    await factory.waitForDeployment();
  });

  it("should create ERC721 collection and assign ownership", async function () {
    const tx = await factory
      .connect(user)
      .createERC721Collection(
        "Astro Collection",
        "AST",
        user.address,
        500
      );

    const receipt = await tx.wait();

    const event = receipt!.logs
      .map((log: any) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e: any) => e?.name === "CollectionCreated");

    expect(event).to.not.be.null;

    const collectionAddress = event!.args.collection;

    const nft721 = (await ethers.getContractAt(
      "NFT721",
      collectionAddress
    )) as NFT721;

    expect(await nft721.owner()).to.equal(user.address);
  });

  it("should create ERC1155 collection and assign ownership", async function () {
    const tx = await factory
      .connect(user)
      .createERC1155Collection(
        "ipfs://collection/",
        user.address,
        1000
      );

    const receipt = await tx.wait();

    const event = receipt!.logs
      .map((log: any) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e: any) => e?.name === "CollectionCreated");

    expect(event).to.not.be.null;

    const collectionAddress = event!.args.collection;

    const nft1155 = (await ethers.getContractAt(
      "NFT1155",
      collectionAddress
    )) as NFT1155;

    expect(await nft1155.owner()).to.equal(user.address);
  });
});
