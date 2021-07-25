import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter } from "../typechain/Greeter";

let greeter: Greeter;

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    greeter = (await Greeter.deploy("Hello, world!")) as Greeter;
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
