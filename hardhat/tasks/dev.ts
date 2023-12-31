import fs from "fs";
import path from "path";
import { task } from "hardhat/config";

task("dev", "Compiles, deploys, and updates using the localhost network")
  .addParam("contract", "Contract name")
  .setAction(async ({ contract }, hre) => {
    // Compile the contract
    await hre.run("compile");
    // Deploy the contract
    const contractDeployed = await hre.ethers.deployContract(contract);
    await contractDeployed.waitForDeployment();
    const address = await contractDeployed.getAddress();

    // Write the ABI to the Next.js app
    const contractArtifact = await hre.artifacts.readArtifact(contract);
    const outputPath = path.join(__dirname, "..", "next", "contracts", `${contract}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(contractArtifact, null, 2));

    // Write the contract address to the Next.js app
    const contractAddressPath = path.join(__dirname, "..", "next", "contracts", `ContractAddress.json`);
    fs.writeFileSync(contractAddressPath, JSON.stringify({ address }));

    console.log(
      `Tasks completed for ${contract} on ${hre.network.name}. Deployed to ${address} and updated in the Next.js app.`
    );
  });
