async function main() {
    const nft = await ethers.deployContract('NFT');
    await nft.waitForDeployment();
    console.log("NFT deployed to: ", nft.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });