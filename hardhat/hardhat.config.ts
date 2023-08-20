import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import path from "path";
import { task } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
};

export default config;

task("compileAndUpdate", "Compiles the contracts and updates the Next.js app")
  .addParam("contract", "Contract name")
  .setAction(async ({ contract }, hre) => {
    await hre.run("compile");

    const contractArtifact = await hre.artifacts.readArtifact(contract);
    const outputPath = path.join(__dirname, "..", "next", "contracts", `${contract}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(contractArtifact, null, 2));

    console.log(`ABI for ${contract} updated in the Next.js app.`);
  });

task("deployAndUpdate", "Deploys the contract and updates the Next.js app")
  .addParam("contract", "Contract name")
  .setAction(async ({ contract }, hre) => {
    const contractDeployed = await hre.ethers.deployContract(contract);
    await contractDeployed.waitForDeployment();
    const address = await contractDeployed.getAddress();

    const contractAddressPath = path.join(__dirname, "..", "next", "contracts", `ContractAddress.json`);
    fs.writeFileSync(contractAddressPath, JSON.stringify({ address }));

    console.log(`${contract} deployed to ${address} and updated in the Next.js app.`);
  });

task("dev", "Compiles, deploys, and updates using the localhost network")
  .addParam("contract", "Contract name")
  .setAction(async ({ contract }, hre) => {
    hre.network.name = "localhost";
    await hre.run("compileAndUpdate", { contract: contract });
    await hre.run("deployAndUpdate", { contract: contract });
    console.log(`Tasks completed for ${contract} on localhost.`);
  });
