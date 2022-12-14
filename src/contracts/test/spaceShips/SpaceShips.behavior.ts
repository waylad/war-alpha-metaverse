import { expect } from "chai";

export function shouldBehaveLikeSpaceShips(): void {
  it("should behave like space ships", async function () {
    // Mint token
    const mintReceipt = await this.spaceShips
      .connect(this.signers.admin)
      .mintCollectable(
        this.signers.admin.address,
        "https://waralpha.io/assets/ships/0000.json",
        "Test Token",
        2,
        false,
      );
    const mintTx = await mintReceipt.wait();
    expect(mintTx?.events?.[0].event).to.equal("Transfer");

    // Check balance
    const adminBalance = await this.spaceShips.connect(this.signers.admin).balanceOf(this.signers.admin.address);
    expect(adminBalance).to.equal(1);
    const adminTokens = await this.spaceShips.connect(this.signers.admin).getTokensOwnedByMe();
    expect(adminTokens[0]).to.equal(1);

    // Update Meta
    const updateReceipt = await this.spaceShips
      .connect(this.signers.admin)
      .updateTokenUri(1, "https://waralpha.io/assets/ships/1231.json");
    await updateReceipt.wait();
    const getMetaReceipt = await this.spaceShips.connect(this.signers.admin).tokenMeta(1);
    expect(getMetaReceipt[3]).to.equal("https://waralpha.io/assets/ships/1231.json");

    // Transfer token
    const transferReceipt = await this.spaceShips
      .connect(this.signers.admin)
      .transferFrom(this.signers.admin.address, this.signers.alice.address, 1);
    await transferReceipt.wait();

    // Set on Sale
    const setSaleReceipt = await this.spaceShips.connect(this.signers.alice).setTokenSale(1, true, 42);
    await setSaleReceipt.wait();

    // Check tokens on sale
    const getSaleReceipt = await this.spaceShips.connect(this.signers.alice).getAllOnSale();
    expect(getSaleReceipt[0][0]).to.equal(1);

    // Buy token
    const buyReceipt = await this.spaceShips.connect(this.signers.bob).purchaseToken(1, {
      value: 42,
    });
    await buyReceipt.wait();

    // Check balance
    const bobBalance = await this.spaceShips.connect(this.signers.bob).balanceOf(this.signers.bob.address);
    expect(bobBalance).to.equal(1);
    const bobTokens = await this.spaceShips.connect(this.signers.bob).getTokensOwnedByMe();
    expect(bobTokens[0]).to.equal(1);

    // Check tokens on sale
    const getSaleReceipt2 = await this.spaceShips.connect(this.signers.alice).getAllOnSale();
    expect(getSaleReceipt2[0][0]).to.equal(0);
  });
}
