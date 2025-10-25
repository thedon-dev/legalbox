const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Checking Account Balances on BlockDAG Testnet");
  console.log("=" * 50);

  const [deployer, user1, user2, user3] = await ethers.getSigners();

  console.log("👥 Account Balances:");
  console.log("-" * 30);

  for (let i = 0; i < 4; i++) {
    const signer = [deployer, user1, user2, user3][i];
    const balance = await signer.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    const accountName = ["Deployer", "User1", "User2", "User3"][i];

    console.log(`${accountName.padEnd(10)}: ${balanceInEth.padStart(20)} BDAG`);

    if (balance.lt(ethers.utils.parseEther("0.01"))) {
      console.log(
        `⚠️  ${accountName} has low balance! Get testnet tokens from faucet.`
      );
    }
  }

  console.log("\n💡 Tips:");
  console.log(
    "  • Get testnet tokens: https://testnet.blockdag.network/faucet"
  );
  console.log("  • Minimum recommended balance: 0.1 BDAG");
  console.log("  • Gas price: 1 gwei");
  console.log("  • Estimated deployment cost: ~0.008 BDAG");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error checking balance:", error);
    process.exit(1);
  });
